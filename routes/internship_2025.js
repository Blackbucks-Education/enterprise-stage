const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const dbConfig = require('../new_config.js');
const pool = new Pool(dbConfig);
const isAuthenticated = require('../jwtAuth.js');
const { Readable } = require('stream'); // Import Readable
const { stringify } = require('csv-stringify'); // Ensure this is properly imported

// Route for main_cards
router.get('/main_cards', isAuthenticated, async (req, res) => {
  try {
    const collegeId = req.user.college || null;

    if (!collegeId) {
      return res.status(400).json({ error: 'College code is not set in the session.' });
    }

    const sqlCollegeStats = `
      SELECT 
          COUNT(DISTINCT iris.interested_stream) AS unique_interested_streams_count,
          COUNT(DISTINCT ir.id) AS unique_user_id_count,
          COUNT(CASE WHEN iris.payment = true THEN 1 END) AS payment_true_count
      FROM
          report.internship_registartions_interested_stream_2025 iris
      JOIN
          report.internship_registrations_2025 ir
      ON
          iris.user_id = ir.id
      JOIN
          college c
      ON
          ir.college_id = c.id
      WHERE
          ir.college_id = $1;
    `;

    const result = await pool.query(sqlCollegeStats, [collegeId]);
    
    const stats = result.rows[0];

    const responseData = {
      college_id: collegeId,
      unique_interested_streams_count: parseInt(stats.unique_interested_streams_count),
      unique_user_id_count: parseInt(stats.unique_user_id_count),
      payment_true_count: parseInt(stats.payment_true_count)
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

router.get('/college_name', isAuthenticated, async (req, res) => {
  try {
    const collegeId = req.user.college || null;

    if (!collegeId) {
      return res.status(400).json({ error: 'College code is not set in the session.' });
    }

     const sqlCollegeStats = `select name from college where id=$1`;
    const result = await pool.query(sqlCollegeStats, [collegeId]);
    
    const college = result.rows[0];

    const responseData = {
      college_id: collegeId,
     college_name:college.name
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});



// Route for year_wise_count
router.get('/year_wise_count', isAuthenticated, async (req, res) => {
  try {
    const collegeId = req.user.college || null;

    if (!collegeId) {
      return res.status(400).json({ error: 'College code is not set in the session.' });
    }

    const sqlYearWiseCount = `
      SELECT
          CONCAT(yop - 1, '-', yop) AS year_range,
          COUNT(*) AS count_per_year
      FROM
          report.internship_registrations_2025
      WHERE
          college_id = $1
      GROUP BY
          yop
      ORDER BY
          yop;
    `;

    const result = await pool.query(sqlYearWiseCount, [collegeId]);
    
    const responseData = {
      college_id: collegeId,
      year_wise_count: result.rows.map(row => ({
        year_range: row.year_range,
        count_per_year: parseInt(row.count_per_year)
      }))
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Route for degree_branch_wise_count
router.get('/degree_branch_wise_count', isAuthenticated, async (req, res) => {
  try {
    const collegeId = req.user.college || null;

    if (!collegeId) {
      return res.status(400).json({ error: 'College code is not set in the session.' });
    }

    const sqlDegreeBranchWiseCount = `
      SELECT
          branch AS degree_branch_name,
          COUNT(*) AS count
      FROM
          report.internship_registrations_2025
      WHERE
          college_id = $1
      GROUP BY
          degree_branch_name
      ORDER BY
          count DESC;
    `;

    const result = await pool.query(sqlDegreeBranchWiseCount, [collegeId]);
    
    const responseData = {
      college_id: collegeId,
      degree_branch_wise_count: result.rows.map(row => ({
        degree_branch_name: row.degree_branch_name,
        count: parseInt(row.count)
      }))
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

router.get('/student_details', isAuthenticated, async (req, res) => {
  try {
      const collegeId = req.user.college || null;

      if (!collegeId) {
          return res.status(400).json({ error: 'College code is not set in the session.' });
      }

      const sqlStudentDetails = `
         WITH userhackathonreport AS (
    SELECT
        uhp.user_id,
        uhp.hackathon_id,
        date_trunc('month', uhp.update_at) AS month,
        h.test_type_id,
        jsonb_array_elements(uhp.report -> 'questionReports') AS questionReports
    FROM
        user_hackathon_participation uhp
    JOIN
        hackathon h ON uhp.hackathon_id = h.id
),
questionreport AS (
    SELECT
        uhr.user_id,
        uhr.hackathon_id,
        uhr.test_type_id,
        uhr.month,
        (uhr.questionReports -> 'report' -> 'roundId')::numeric AS roundId,
        (uhr.questionReports -> 'report' -> 'id')::numeric AS problemId,
        round((uhr.questionReports -> 'report' -> 'totalScore')::numeric, 2) AS obtainedScore,
        uhr.questionReports -> 'report' ->> 'language' AS language,
        uhr.questionReports -> 'report' ->> 'status' AS status
    FROM
        userhackathonreport uhr
    WHERE
        uhr.test_type_id IN (6, 36)
),
testcasereport AS (
    SELECT
        qr.user_id,
        qr.language,
        count(*) FILTER (WHERE qr.status = 'pass') AS testCasePassedCount,
        count(*) FILTER (WHERE qr.status <> 'unAttempted') AS testCaseAttemptedCount
    FROM
        questionreport qr
    WHERE
        qr.language IS NOT NULL
    GROUP BY
        qr.user_id, qr.language
),
testcasesummary AS (
    SELECT
        tcr.user_id,
        tcr.language,
        sum(tcr.testCaseAttemptedCount) AS attemptedCount,
        sum(tcr.testCasePassedCount) AS passedCount
    FROM
        testcasereport tcr
    GROUP BY
        tcr.user_id, tcr.language
),
coding_scores AS (
    SELECT
        tcs.user_id,
        round((sum(tcs.passedCount) / NULLIF(sum(tcs.attemptedCount), 0)) * sum(tcs.passedCount), 2) AS codingScore,
        round((sum(tcs.passedCount) / NULLIF(sum(tcs.attemptedCount), 0)) * 100, 2) AS codingAccuracy
    FROM
        testcasesummary tcs
    GROUP BY
        tcs.user_id
),
education_summary AS (
    SELECT
        ed.user_id,
        MAX(CASE WHEN ed.stage = 'Tenth' THEN ed.percentage END) AS tenth_cgpa,
        MAX(CASE WHEN ed.stage = 'Twelfth' THEN ed.percentage END) AS twelfth_cgpa,
        MAX(CASE WHEN ed.stage = 'Degree' THEN ed.percentage END) AS BTech_cgpa,
        MAX(CASE WHEN ed.stage = 'Degree' THEN ed.degree END) AS BTechDegree,
        MAX(CASE WHEN ed.stage = 'Degree' THEN ed.branch END) AS BTechBranch,
        MAX(CASE WHEN ed.stage = 'Degree' THEN EXTRACT(YEAR FROM ed.end_date AT TIME ZONE 'UTC' + INTERVAL '5 hours 30 minutes') END) AS YOP
    FROM
        resume.education_details ed
    GROUP BY
        ed.user_id
)
SELECT DISTINCT
    ir.name,
    ir.email,
    COALESCE(round(ps1.total_score, 2), 0) AS total_score,
    COALESCE(round(ps1.aptitude, 2), 0) AS aptitude,
    COALESCE(round(ps1.english, 2), 0) AS english,
    COALESCE(round(ps1.coding, 2), 0) AS coding,
    COALESCE(ps1.employability_band, 'Not Available') AS employability_band,
    COALESCE(ps1.possible_employability_band, 'Not Available') AS possible_employability_band
FROM
    report.internship_registrations_2025 ir
LEFT JOIN
    college c ON ir.college_id = c.id
LEFT JOIN
    report.internship_registartions_interested_stream_2025 ists ON ir.id = ists.user_id
LEFT JOIN
    "user" u ON ir.email = u.email
LEFT JOIN
    report.profiling_report_overall ps1 ON u.id = ps1.user_id
WHERE
    c.id = $1
    AND ists.payment = true
ORDER BY
    total_score DESC;`;

      const result = await pool.query(sqlStudentDetails, [collegeId]);

      const responseData = {
          college_id: collegeId,
          students: result.rows.map(row => ({
              name: row.name,
              email: row.email,
              total_score: row.total_score,
              aptitude: row.aptitude,
              coding: row.coding,
              english: row.english,
              employability_band: row.employability_band,
              possible_employability_band: row.possible_employability_band
          }))
      };

      res.json(responseData);
  } catch (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Route for internship registrations based on college_id
router.get('/internships_by_college', isAuthenticated, async (req, res) => {
  try {
    // Get college_id from the authenticated user's session
    const collegeId = req.user.college || null;

    if (!collegeId) {
      return res.status(400).json({ error: 'College code is not set in the session.' });
    }

    // Updated SQL query to include internship_id
    const sqlInternshipsByCollege = `
     SELECT
          iris.interested_stream,
          iris.internship_id,
          COUNT(*) AS paid_count
      FROM
          report.internship_registartions_interested_stream_2025 iris
      INNER JOIN
          report.internship_registrations_2025 ir
      ON
          iris.user_id = ir.id
      WHERE
          ir.college_id = $1
          AND iris.payment = true
      GROUP BY
          iris.interested_stream, iris.internship_id
      ORDER BY 
          paid_count DESC;
    `;

    // Execute query with the college_id
    const { rows } = await pool.query(sqlInternshipsByCollege, [collegeId]);

    // Format the response data
    const responseData = {
      college_id: collegeId,
      internships: rows.map(row => ({
        interested_stream: row.interested_stream,
        internship_id: row.internship_id,
        paid_count: row.paid_count,
      }))
    };

    // Send response
    res.json(responseData);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


router.get("/download_student_details", isAuthenticated, async (req, res) => {
  try {
    const collegeId = req.user.college || null

    if (!collegeId) {
      return res.status(400).json({ error: "College code is not set in the session." })
    }

    const sqlStudentDetails = `
  
   WITH userhackathonreport AS (
    SELECT
        uhp.user_id,
        uhp.hackathon_id,
        date_trunc('month', uhp.update_at) AS month,
        h.test_type_id,
        jsonb_array_elements(uhp.report -> 'questionReports') AS questionReports
    FROM
        user_hackathon_participation uhp
    JOIN
        hackathon h ON uhp.hackathon_id = h.id
),
questionreport AS (
    SELECT
        uhr.user_id,
        uhr.hackathon_id,
        uhr.test_type_id,
        uhr.month,
        (uhr.questionReports -> 'report' -> 'roundId')::numeric AS roundId,
        (uhr.questionReports -> 'report' -> 'id')::numeric AS problemId,
        round((uhr.questionReports -> 'report' -> 'totalScore')::numeric, 2) AS obtainedScore,
        uhr.questionReports -> 'report' ->> 'language' AS language,
        uhr.questionReports -> 'report' ->> 'status' AS status
    FROM
        userhackathonreport uhr
    WHERE
        uhr.test_type_id IN (6, 36)
),
testcasereport AS (
    SELECT
        qr.user_id,
        qr.language,
        count(*) FILTER (WHERE qr.status = 'pass') AS testCasePassedCount,
        count(*) FILTER (WHERE qr.status <> 'unAttempted') AS testCaseAttemptedCount
    FROM
        questionreport qr
    WHERE
        qr.language IS NOT NULL
    GROUP BY
        qr.user_id, qr.language
),
testcasesummary AS (
    SELECT
        tcr.user_id,
        tcr.language,
        sum(tcr.testCaseAttemptedCount) AS attemptedCount,
        sum(tcr.testCasePassedCount) AS passedCount
    FROM
        testcasereport tcr
    GROUP BY
        tcr.user_id, tcr.language
),
coding_scores AS (
    SELECT
        tcs.user_id,
        round((sum(tcs.passedCount) / NULLIF(sum(tcs.attemptedCount), 0)) * sum(tcs.passedCount), 2) AS codingScore,
        round((sum(tcs.passedCount) / NULLIF(sum(tcs.attemptedCount), 0)) * 100, 2) AS codingAccuracy
    FROM
        testcasesummary tcs
    GROUP BY
        tcs.user_id
),
education_summary AS (
    SELECT
        ed.user_id,
        MAX(CASE WHEN ed.stage = 'Tenth' THEN ed.percentage END) AS tenth_cgpa,
        MAX(CASE WHEN ed.stage = 'Twelfth' THEN ed.percentage END) AS twelfth_cgpa,
        MAX(CASE WHEN ed.stage = 'Degree' THEN ed.percentage END) AS BTech_cgpa,
        MAX(CASE WHEN ed.stage = 'Degree' THEN ed.degree END) AS BTechDegree,
        MAX(CASE WHEN ed.stage = 'Degree' THEN ed.branch END) AS BTechBranch,
        MAX(CASE WHEN ed.stage = 'Degree' THEN EXTRACT(YEAR FROM ed.end_date AT TIME ZONE 'UTC' + INTERVAL '5 hours 30 minutes') END) AS YOP
    FROM
        resume.education_details ed
    GROUP BY
        ed.user_id
)
SELECT DISTINCT
    ir.name,
    ir.email,
    COALESCE(round(ps1.total_score, 2), 0) AS total_score,
    COALESCE(round(ps1.aptitude, 2), 0) AS aptitude,
    COALESCE(round(ps1.english, 2), 0) AS english,
    COALESCE(round(ps1.coding, 2), 0) AS coding,
    COALESCE(ps1.employability_band, 'Not Available') AS employability_band,
    COALESCE(ps1.possible_employability_band, 'Not Available') AS possible_employability_band
FROM
    report.internship_registrations_2025 ir
LEFT JOIN
    college c ON ir.college_id = c.id
LEFT JOIN
    report.internship_registartions_interested_stream_2025 ists ON ir.id = ists.user_id
LEFT JOIN
    "user" u ON ir.email = u.email
LEFT JOIN
    report.profiling_report_overall ps1 ON u.id = ps1.user_id
WHERE
    c.id = $1
    AND ists.payment = true
ORDER BY
    total_score DESC;
`;

    const result = await pool.query(sqlStudentDetails, [collegeId])

    // Prepare the data for CSV
    const csvData = result.rows.map((row) => ({
      Name: row.name,
      Email: row.email,
      "Total Score": row.total_score,
      Aptitude: row.aptitude,
      Coding: row.coding,
      English: row.english,
      "Employability Band": row.employability_band,
      "Possible Employability Band": row.possible_employability_band,
    }))

    // Set headers for file download
    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", "attachment; filename=student_details.csv")

    // Create a readable stream from the array
    const readableStream = Readable.from(csvData)

    // Pipe the readable stream through csv-stringify and then to the response
    readableStream.pipe(stringify({ header: true })).pipe(res)
  } catch (error) {
    console.error("Error generating CSV:", error)
    res.status(500).json({ error: "Internal Server Error", message: error.message })
  }
})

router.get('/streamwise_students_data', isAuthenticated, async (req, res) => {
    try {
      // Get college_id from the authenticated user's session
      const collegeId = req.user.college || null;
  
      if (!collegeId) {
        return res.status(400).json({ error: 'College code is not set in the session.' });
      }
  
      // SQL query to fetch internship information based on college_id and group by internship_id
      const sqlInternshipsByCollege = `
        SELECT
            r.name,
            r.email,
            r.phone,
            c.name AS college_name,
            r.roll_number,
            r.degree,
            r.branch,
            i.interested_stream,
            i.internship_id
        FROM
            report.internship_registrations_2025 r
        JOIN
            report.internship_registartions_interested_stream_2025 i
        ON
            r.id = i.user_id
        JOIN
            college c
        ON
            r.college_id = c.id
        WHERE
            i.payment = true AND r.college_id = $1
        ORDER BY
            i.internship_id;
      `;
  
      // Execute query with the college_id
      const { rows } = await pool.query(sqlInternshipsByCollege, [collegeId]);
  
      // Organize data by internship_id
      const responseData = rows.reduce((acc, row) => {
        if (!acc[row.internship_id]) {
          acc[row.internship_id] = {
            internship_id: row.internship_id,
            interested_stream: row.interested_stream,
            participants: []
          };
        }
        acc[row.internship_id].participants.push({
          name: row.name,
          email: row.email,
          phone: row.phone,
          college_name: row.college_name,
          roll_number: row.roll_number,
          degree: row.degree,
          branch: row.branch
        });
        return acc;
      }, {});
  
      // Convert object to array for a cleaner response
      res.json(Object.values(responseData));
    } catch (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  });




  
  



module.exports = router;

