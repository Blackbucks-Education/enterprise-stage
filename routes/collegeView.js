const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const multer = require('multer');
const AWS = require('aws-sdk');
const dbConfig = require('../db_config');
const dbConfig_read = require('../read_replica_config');
const dotenv = require('dotenv');
const path = require('path');
const isAuthenticated = require('../jwtAuth.js');


dotenv.config();

const pool = new Pool(dbConfig);
const pool1 = new Pool(dbConfig_read);


router.get('/fetchCollegeData/:id', async (req, res) => {
  const { id } = req.params; // Extract the college ID from the URL parameter

  try {
    const selectQuery = `
      select ru.name as Name,
       ct.college_type as type,
       cp.location,
       cp.logo,
       cp.college_banner,
       cp.description,
       cg.images,
       ci.bus,
       ci.cafeteria,
       ci.gym,
       ci.hostel,
       ci.hostel_description,
       ci.nirf_description, library, library_description, hostel, hostel_description, sports_complex, sports_complex_description, labs, labs_description, cafeteria, gym, medical_facilities, wifi, bus, nirf_rank
from report.college as ru
    inner join pages.college_pages as cp on ru.id = cp.college_id
inner join pages.college_gallery as cg on cp.college_id = cg.college_id
   inner join pages.college_type as ct on cp.type = ct.id
inner join pages.college_infra as ci on cp.college_id = ci.college_id
where cp.college_id = $1;
    `;

    const result = await pool.query(selectQuery, [id]); // Pass the ID as a parameter to the query

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'College not found' });
    }

    res.json(result.rows); // Return the result as JSON
  } catch (error) {
    console.error('Error retrieving college data from database:', error.message);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
});

router.get('/overview/:college_id', async (req, res) => {
  const { college_id } = req.params; // Extract the college_id from the request parameters

  try {
    const selectQuery = `
      SELECT
        ROUND(AVG(pr.batchaverage)) AS emp_score,  -- Calculate the rounded average employability score
        COALESCE(COUNT(u.id), 0) AS total_students -- Count the total number of students
      FROM
        pages.college_pages AS cp
        INNER JOIN report.college AS rc ON cp.college_id = rc.id
        LEFT JOIN "user" AS u ON cp.college_id = u.college_id
        LEFT JOIN report.profiling_rankings pr ON rc.id = pr.college_id
      WHERE
        cp.college_id = $1; -- Filter by specific college_id
    `;

    const result = await pool.query(selectQuery, [college_id]); // Pass college_id as a parameter to prevent SQL injection

    if (result.rows.length === 0) {
      return res.status(404).send('College details not found for the given ID');
    }

    res.json(result.rows[0]); // Return the first row as an object, since there is only one result
  } catch (error) {
    console.error('Error retrieving college details:', error.message);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});


router.get('/fetchCourses/:id', async (req, res) => {
  const { id } = req.params; // Extract the college ID from the URL parameter

  try {
    const selectQuery = `
      select  
      cc.id,
      cc.description,
       cc.name,
       cc.duration,
       cc.seats_offered,
       cc.median_salary,
       cc.median_salary_description
from pages.college_course as cc
inner join pages.college_gallery cg on cc.college_id = cg.college_id where  cc.college_id = $1;
 `;

    const result = await pool.query(selectQuery, [id]); // Pass the ID as a parameter to the query

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Courses not found' });
    }

    res.json(result.rows); // Return the result as JSON
  } catch (error) {
    console.error('Error retrieving courses of college database:', error.message);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
});

router.get('/alumni/:id', async (req, res) => {
  const { id } = req.params; // Extract the college ID from the URL parameter

  try {
    // Query to fetch alumni details
    const alumniDetailsQuery = `
      WITH education_summary AS (
          SELECT
              ed.user_id,
              MAX(CASE WHEN ed.stage = 'Tenth' THEN ed.percentage END) AS tenth_cgpa,
              MAX(CASE WHEN ed.stage = 'Twelfth' THEN ed.percentage END) AS twelfth_cgpa,
              MAX(CASE WHEN ed.stage = 'Degree' THEN ed.percentage END) AS BTech_cgpa,
              MAX(CASE WHEN ed.stage = 'Degree' THEN ed.degree END) AS BTechDegree,
              MAX(CASE WHEN ed.stage = 'Degree' THEN ed.branch END) AS BTechBranch,
              MAX(CASE WHEN ed.stage = 'Degree' THEN EXTRACT(YEAR FROM ed.end_date AT TIME ZONE 'UTC' + INTERVAL '5 hours 30 minutes') END) AS YOP,
              MAX(CASE WHEN ed.stage = 'Degree' THEN ed.end_date END) AS graduation_date
          FROM
              resume.education_details ed
          GROUP BY
              ed.user_id
      )
      SELECT DISTINCT
          u.image,
          CONCAT(u.first_name, ' ', u.last_name) AS name,
          es.BTechDegree,
          es.BTechBranch,
          es.YOP
      FROM
          "user" u
      INNER JOIN
          report.profiling_report_overall ps1 ON u.id = ps1.user_id
      LEFT JOIN
          resume.user_details userdetails ON u.id = userdetails."user"
      LEFT JOIN
          education_summary es ON u.id = es.user_id
      LEFT JOIN
          college c ON u.college_id = c.id
      WHERE
          c.id = $1
          AND (es.YOP < EXTRACT(YEAR FROM CURRENT_DATE)
               OR (es.YOP = EXTRACT(YEAR FROM CURRENT_DATE) AND es.graduation_date <= CURRENT_DATE))
      ORDER BY
          es.YOP ASC;
    `;

    const alumniCountQuery = `
      SELECT COUNT(DISTINCT u.id) AS alumni_count
      FROM "user" u
      INNER JOIN resume.education_details ed ON u.id = ed.user_id
      LEFT JOIN college c ON u.college_id = c.id
      WHERE c.id = $1
        AND (EXTRACT(YEAR FROM ed.end_date AT TIME ZONE 'UTC' + INTERVAL '5 hours 30 minutes') < EXTRACT(YEAR FROM CURRENT_DATE)
             OR (EXTRACT(YEAR FROM ed.end_date AT TIME ZONE 'UTC' + INTERVAL '5 hours 30 minutes') = EXTRACT(YEAR FROM CURRENT_DATE) 
             AND ed.end_date <= CURRENT_DATE));
    `;

    // Execute both queries
    const [alumniDetailsResult, alumniCountResult] = await Promise.all([
      pool1.query(alumniDetailsQuery, [id]),
      pool1.query(alumniCountQuery, [id])
    ]);

    const alumniDetails = alumniDetailsResult.rows;
    const alumniCount = alumniCountResult.rows[0].alumni_count;

    if (alumniDetails.length === 0) {
      return res.status(404).json({ message: 'No alumni found' });
    }

    res.json({ alumniDetails, alumniCount }); // Return both alumni details and count
  } catch (error) {
    console.error('Error retrieving alumni of college database:', error.message);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
});



router.get('/top100/:id', async (req, res) => {
  const { id } = req.params; // Extract the college ID from the URL parameter

  try {
    const query = `
          SELECT 
              u.image,
              u.first_name,
              u.email,
              ROUND(aptitude) AS aptitude, 
              ROUND(english) AS english, 
              ROUND(coding) AS coding, 
              ROUND(total_score) AS total_score, 
              comment, 
              employability_band, 
              possible_employability_band, 
              aptitude_improvement_suggestions, 
              english_improvement_suggestions, 
              technical_improvement_suggestions
          FROM 
              report.profiling_report_overall pro
          INNER JOIN 
              "user" u ON pro.user_id = u.id
          INNER JOIN 
              college c ON u.college_id = c.id
          WHERE 
              c.id = $1
          ORDER BY 
              total_score DESC
          LIMIT 100
      `;

    const result = await pool1.query(query, [id]); // Pass the ID as a parameter to the query

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Courses not found' });
    }

    res.json(result.rows); // Return the result as JSON
  } catch (error) {
    console.error('Error retrieving courses of college database:', error.message);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
});

router.get('/top10/:id', async (req, res) => {
  const { id } = req.params; // Extract the college ID from the URL parameter

  try {
    const query = `
          SELECT 
              u.image,
              u.first_name,
              u.email,
              ROUND(aptitude) AS aptitude, 
              ROUND(english) AS english, 
              ROUND(coding) AS coding, 
              ROUND(total_score) AS total_score, 
              comment, 
              employability_band, 
              possible_employability_band, 
              aptitude_improvement_suggestions, 
              english_improvement_suggestions, 
              technical_improvement_suggestions
          FROM 
              report.profiling_report_overall pro
          INNER JOIN 
              "user" u ON pro.user_id = u.id
          INNER JOIN 
              college c ON u.college_id = c.id
          WHERE 
              c.id = $1
          ORDER BY 
              total_score DESC
          LIMIT 10
      `;

    const result = await pool1.query(query, [id]); // Pass the ID as a parameter to the query

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Top students not found' });
    }

    res.json(result.rows); // Return the result as JSON
  } catch (error) {
    console.error('Error retrieving top students from college database:', error.message);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
});


router.post('/filteredStudents/:id', async (req, res) => {
  const { id } = req.params; // College ID
  const { branch, year } = req.body; // Extract branch and year from the request body

  try {
    let query = `
        WITH education_summary AS (
            SELECT
                ed.user_id,
                MAX(CASE WHEN ed.stage = 'Tenth' THEN ed.percentage END) AS tenth_cgpa,
                MAX(CASE WHEN ed.stage = 'Twelfth' THEN ed.percentage END) AS twelfth_cgpa,
                MAX(CASE WHEN ed.stage = 'Degree' THEN ed.percentage END) AS BTech_cgpa,
                MAX(CASE WHEN ed.stage = 'Degree' THEN ed.degree END) AS BTechDegree,
                MAX(CASE WHEN ed.stage = 'Degree' THEN ed.branch END) AS BTechBranch,
                MAX(CASE WHEN ed.stage = 'Degree' THEN EXTRACT(YEAR FROM ed.end_date AT TIME ZONE 'UTC' + INTERVAL '5 hours 30 minutes') END)  AS YOP
            FROM
                resume.education_details ed
            GROUP BY
                ed.user_id
        )
        SELECT DISTINCT
            u.id,
            CONCAT(u.first_name, ' ', u.last_name) AS Name,
            u.email,
            u.roll_number,
            es.BTechBranch AS branch,
            es.YOP AS year, 
           round(ps1.total_score) as score
        FROM
            "user" u
        INNER JOIN
            report.profiling_report_overall ps1 ON u.id = ps1.user_id
        LEFT JOIN
            education_summary es ON u.id = es.user_id
        LEFT JOIN
            college c ON u.college_id = c.id
        WHERE
            c.id = $1
    `;

    // Add filtering conditions
    if (branch) {
      query += ` AND es.BTechBranch = '${branch}'`;
    }
    if (year) {
      query += ` AND es.YOP = ${year}`;
    }

    const result = await pool1.query(query, [id]);

    res.json(result.rows); // Return the filtered result as JSON
  } catch (error) {
    console.error('Error retrieving filtered students:', error.message);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
});


router.get('/branches/:id', async (req, res) => {
  const { id } = req.params; // College ID

  try {
    const query = `
      SELECT DISTINCT ed.branch
      FROM resume.education_details ed
      INNER JOIN "user" u ON ed.user_id = u.id
      WHERE u.college_id = $1
    `;

    const result = await pool1.query(query, [id]);

    res.json(result.rows.map(row => row.branch)); // Return only the branch names
  } catch (error) {
    console.error('Error fetching branches:', error.message);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
});

router.get('/years/:id', async (req, res) => {
  const { id } = req.params; // College ID

  try {
    const query = `
       SELECT DISTINCT
    EXTRACT(YEAR FROM ed.end_date AT TIME ZONE 'UTC' + INTERVAL '5 hours 30 minutes') AS YOP
FROM resume.education_details ed
INNER JOIN "user" u ON ed.user_id = u.id
WHERE u.college_id = $1
AND ed.stage = 'Degree'
ORDER BY YOP DESC;
    `;

    const result = await pool1.query(query, [id]);

    res.json(result.rows.map(row => row.yop)); // Return only the years
  } catch (error) {
    console.error('Error fetching years:', error.message);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
});

router.get('/bbrank/:id', async (req, res) => {
  const { id } = req.params; // College ID

  try {
    // SQL query to fetch college ranking details by college_id
    const query = `
      SELECT c.college_id, pr.rank, pr.college_code, pr.college_name
      FROM report.profiling_rankings AS pr
      INNER JOIN pages.college_pages AS c ON c.college_id = pr.college_id
      WHERE c.college_id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Details not found' });
    }

    res.json(result.rows); // Return the fetched rows
  } catch (error) {
    console.error('Error fetching rank:', error.message);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
});





module.exports = router;
