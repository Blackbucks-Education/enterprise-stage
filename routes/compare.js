const { Pool } = require('pg');
const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();
const dbConfig = require('../read_replica_config.js');
const pool = new Pool(dbConfig);
const cacheManager = require('../utlis/cacheManager');
const isAuthenticated = require('../jwtAuth.js');

router.get('/hackathon/:id', isAuthenticated, async (req, res) => {
  try {
    const hackathon_id = req.params.id;

    const sql = `SELECT title FROM hackathon WHERE id = $1`;
    const { rows } = await pool.query(sql, [hackathon_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Hackathon not found.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});



router.get('/hackathons',isAuthenticated, async (req, res) => {
  try {
    // Check if the college code is set in the session
    const college_id = req.user.college || null;

    if (!college_id) {
      return res.status(400).json({ error: 'College code is not set in the session.' });
    }


    // SQL query to fetch the required data
    const sql = `
    SELECT  h.id,h.title
FROM user_hackathon_participation uhp
INNER JOIN hackathon h ON uhp.hackathon_id = h.id
INNER JOIN report.assessments_scores rs on h.id = rs.hackathon_id
INNER JOIN "user" u ON uhp.user_id = u.id and rs.user_id = u.id
INNER JOIN college c ON u.college_id = c.id
WHERE c.id = $1 AND test_type_id IN (6, 54)
GROUP BY h.id, h.title




    `;

    // Execute the query with parameter binding
    const { rows } = await pool.query(sql, [college_id]);

    
    // Send the response
    res.json(rows);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


router.get('/participant_count', isAuthenticated, async (req, res) => {
  try {
    const college_id = req.user.college || null;
    const hackathon_ids = req.query.hackathon_id ? req.query.hackathon_id.split(',').map(id => parseInt(id, 10)) : [];
    console.log('Received college_id:', college_id, 'Received hackathon_ids:', hackathon_ids);

    if (!college_id || hackathon_ids.length === 0) {
      return res.status(400).json({ error: 'College ID or Hackathon IDs are not provided.' });
    }

    const sql = `
      SELECT h.id, h.title, COUNT(uhp.user_id) AS participant_count, AVG(rs.total_score) AS average_marks
FROM user_hackathon_participation uhp
INNER JOIN hackathon h ON uhp.hackathon_id = h.id
INNER JOIN report.assessments_scores rs ON h.id = rs.hackathon_id
INNER JOIN "user" u ON uhp.user_id = u.id AND rs.user_id = u.id
INNER JOIN college c ON u.college_id = c.id
WHERE c.id = $1 AND h.id = ANY($2::int[])
GROUP BY h.id, h.title;

    `;
    const { rows } = await pool.query(sql, [college_id, hackathon_ids]);
    console.log('Query result:', rows);

    res.json(rows);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


  

router.get('/average_scores', isAuthenticated, async (req, res) => {
  try {
      const college_id = req.user.college || req.query.college_id || null;
      const hackathon_ids = req.query.hackathon_id ? req.query.hackathon_id.split(',') : [];

      if (!college_id) {
          return res.status(400).json({ error: 'College code is not set in the session.' });
      }

      if (hackathon_ids.length === 0) {
          return res.status(400).json({ error: 'Hackathon IDs are not provided.' });
      }

      // SQL query to fetch the required data with rounding to 2 decimal places
      const sql = `
          SELECT
              assessments_scores.hackathon_id,
              h.title,
              ROUND(AVG(assessments_scores.total_score), 2) AS average_marks,
              ROUND(AVG(assessments_scores.aptitude), 2) AS average_aptitude,
              ROUND(AVG(assessments_scores.english), 2) AS average_english,
              ROUND(AVG(assessments_scores.coding), 2) AS average_coding,
              ROUND(MAX(assessments_scores.total_score), 2) AS max_total_score,
              ROUND(MIN(assessments_scores.total_score), 2) AS min_total_score,
              ROUND(MAX(assessments_scores.aptitude), 2) AS max_aptitude,
              ROUND(MIN(assessments_scores.aptitude), 2) AS min_aptitude,
              ROUND(MAX(assessments_scores.english), 2) AS max_english,
              ROUND(MIN(assessments_scores.english), 2) AS min_english,
              ROUND(MAX(assessments_scores.coding), 2) AS max_coding,
              ROUND(MIN(assessments_scores.coding), 2) AS min_coding
          FROM
              report.assessments_scores
          INNER JOIN
              hackathon h ON assessments_scores.hackathon_id = h.id
          INNER JOIN
              "user" u ON assessments_scores.user_id = u.id
          INNER JOIN
              college c ON u.college_id = c.id
          WHERE
              c.id = $1 AND assessments_scores.hackathon_id = ANY($2::int[])
          GROUP BY
              assessments_scores.hackathon_id, h.title;`;

      // Execute the query with parameter binding
      const { rows } = await pool.query(sql, [college_id, hackathon_ids]);

      // Send the response
      res.json(rows);
  } catch (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});




router.get('/assessment_scores', isAuthenticated, async (req, res) => {
  try {
    const college_id = req.user.college || null;

    if (!college_id) {
      return res.status(400).json({ error: 'College code is not set in the session.' });
    }

    const filterType = req.query.filter;
    const validFilters = {
      aptitude: 'aptitude',
      employability: 'total_score',
      coding: 'coding',
      english: 'english'
    };

    if (!filterType || !validFilters[filterType]) {
      return res.status(400).json({ error: 'Invalid filter type.' });
    }

    const minScore = parseInt(req.query.min, 10);
    const maxScore = parseInt(req.query.max, 10);

    if (isNaN(minScore) || isNaN(maxScore)) {
      return res.status(400).json({ error: 'Invalid range parameters. Both min and max are required.' });
    }

    const ranges = req.query.ranges ? req.query.ranges.split(',') : ['0-10', '11-20', '21-30', '30+'];
    const rangeConditions = ranges.map(range => {
      const [start, end] = range.split('-').map(Number);
      if (isNaN(start) || (end && isNaN(end))) {
        return null; // Skip invalid ranges
      }
      return end !== undefined ? 
        `WHEN ${validFilters[filterType]} BETWEEN ${start} AND ${end} THEN '${range}'` :
        `WHEN ${validFilters[filterType]} >= ${start} THEN '${range}'`;
    }).filter(Boolean).join(' ');

    if (!rangeConditions.length) {
      return res.status(400).json({ error: 'Invalid ranges provided.' });
    }

    const hackathonIds = req.query.hackathon_id.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));

    if (hackathonIds.length === 0) {
      return res.status(400).json({ error: 'Invalid hackathon IDs provided.' });
    }

    const countSql = 
      `SELECT 
          assessments_scores.hackathon_id,
          CASE
              ${rangeConditions}
              ELSE 'Other'
          END AS score_range,
          COUNT(*) AS count
      FROM 
          report.assessments_scores
      INNER JOIN 
          hackathon h ON assessments_scores.hackathon_id = h.id
      INNER JOIN 
          "user" u ON assessments_scores.user_id = u.id
      INNER JOIN 
          college c ON u.college_id = c.id
      WHERE 
          c.id = $1 
          AND assessments_scores.hackathon_id = ANY($2::int[])
          AND ${validFilters[filterType]} BETWEEN $3 AND $4
      GROUP BY assessments_scores.hackathon_id, score_range`;

    const params = [college_id, hackathonIds, minScore, maxScore];

    const { rows } = await pool.query(countSql, params);

    const data = rows.reduce((acc, row) => {
      const key = `${row.hackathon_id}_${row.score_range}`;
      if (!acc[row.score_range]) {
        acc[row.score_range] = {};
      }
      acc[row.score_range][row.hackathon_id] = parseInt(row.count, 10);
      return acc;
    }, ranges.reduce((acc, range) => ({ ...acc, [range]: {} }), {}));

    res.json(data);

  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});







router.get('/employability_band_counts', isAuthenticated, async (req, res) => {
  try {
    const college_id = req.user.college || null;
    const hackathon_id = parseInt(req.query.hackathon_id, 10);

    if (!college_id) {
      return res.status(400).json({ error: 'College code is not set in the session.' });
    }

    if (!hackathon_id) {
      return res.status(400).json({ error: 'Hackathon ID is required.' });
    }

    const sql = `
      SELECT
        report.assessments_emp_bands.hackathon_id,
        COUNT(CASE WHEN assessments_emp_bands.employability_band = 'A++' THEN 1 END) AS count_A_plus_plus,
        COUNT(CASE WHEN assessments_emp_bands.employability_band = 'A+' THEN 1 END) AS count_A_plus,
        COUNT(CASE WHEN assessments_emp_bands.employability_band = 'A' THEN 1 END) AS count_A,
        COUNT(CASE WHEN assessments_emp_bands.employability_band = 'B' THEN 1 END) AS count_B,
        COUNT(CASE WHEN assessments_emp_bands.employability_band = 'C' THEN 1 END) AS count_C,
        COUNT(CASE WHEN assessments_emp_bands.employability_band = 'F' THEN 1 END) AS count_F
      FROM
        report.assessments_emp_bands
      INNER JOIN
        hackathon h ON assessments_emp_bands.hackathon_id = h.id
      INNER JOIN
        "user" u ON assessments_emp_bands.user_id = u.id
      INNER JOIN
        college c ON u.college_id = c.id
      WHERE
        c.id = $1
        AND assessments_emp_bands.hackathon_id = $2
      GROUP BY
        assessments_emp_bands.hackathon_id;
    `;

    const { rows } = await pool.query(sql, [college_id, hackathon_id]);

    res.json(rows);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

  
router.get('/average_scores', isAuthenticated, async (req, res) => {
    try {
      // Check if the college code and hackathon ID are set in the session or query parameters
      const college_id = req.user.college || req.query.college_id || null;
      const hackathon_id = req.query.hackathon_id || null;
  
      if (!college_id) {
        return res.status(400).json({ error: 'College code is not set in the session.' });
      }
  
      if (!hackathon_id) {
        return res.status(400).json({ error: 'Hackathon ID is not provided.' });
      }
  
      // SQL query to fetch the required data
      const sql = `
        SELECT
    assessments_scores.hackathon_id,
    h.title,
    AVG(assessments_scores.total_score) AS average_marks,
    AVG(assessments_scores.aptitude) AS average_aptitude,
    AVG(assessments_scores.english) AS average_english,
    AVG(assessments_scores.coding) AS average_coding
FROM
    report.assessments_scores
INNER JOIN
    hackathon h ON assessments_scores.hackathon_id = h.id
INNER JOIN
    "user" u ON assessments_scores.user_id = u.id
INNER JOIN
    college c ON u.college_id = c.id
WHERE
    c.id = $1 AND assessments_scores.hackathon_id = $2
GROUP BY
    assessments_scores.hackathon_id, h.title;`;
  
      // Execute the query with parameter binding
      const { rows } = await pool.query(sql, [college_id, hackathon_id]);
  
      // Send the response
      res.json(rows[0]);
    } catch (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  });


  router.get('/assessment_scores', isAuthenticated, async (req, res) => {
    try {
        const college_id = req.user.college || null;

        if (!college_id) {
            return res.status(400).json({ error: 'College code is not set in the session.' });
        }

        const filterType = req.query.filter;

        const validFilters = {
            aptitude: 'aptitude',
            employability: 'total_score',
            coding: 'coding',
            english: 'english'
        };

        if (!filterType || !validFilters[filterType]) {
            return res.status(400).json({ error: 'Invalid filter type.' });
        }

        const minScore = parseInt(req.query.min, 10);
        const maxScore = parseInt(req.query.max, 10);

        if (isNaN(minScore) || isNaN(maxScore)) {
            return res.status(400).json({ error: 'Invalid range parameters. Both min and max are required.' });
        }

        const effectiveMinScore = minScore === 0 ? 0 : minScore + 1;

        const countSql = `
            SELECT COUNT(*) as count
            FROM 
                report.assessments_scores
            INNER JOIN 
                hackathon h ON assessments_scores.hackathon_id = h.id
            INNER JOIN 
                "user" u ON assessments_scores.user_id = u.id
            INNER JOIN 
                college c ON u.college_id = c.id
            WHERE 
                c.id = $1 AND assessments_scores.hackathon_id = $2
                AND ${validFilters[filterType]} BETWEEN $3 AND $4;
        `;

        const params = [college_id, req.query.hackathon_id, effectiveMinScore, maxScore];

        const { rows } = await pool.query(countSql, params);
        const count = rows[0].count;

        res.json({ count });

    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});








router.get('/employability_band_counts', isAuthenticated, async (req, res) => {
    try {
      // Check if the college code and hackathon ID are provided in the query parameters
      const college_id = req.user.college || null;
      const hackathon_id = parseInt(req.query.hackathon_id, 10);
  
      if (!college_id) {
        return res.status(400).json({ error: 'College code is not set in the session.' });
      }
  
      if (!hackathon_id) {
        return res.status(400).json({ error: 'Hackathon ID is required.' });
      }
  
      // SQL query to fetch the required data
      const sql = `
      SELECT
          assessments_emp_bands.hackathon_id,
          COUNT(CASE WHEN assessments_emp_bands.current_employability_band = 'A++' THEN 1 END) AS count_A_plus_plus,
          COUNT(CASE WHEN assessments_emp_bands.current_employability_band = 'A+' THEN 1 END) AS count_A_plus,
          COUNT(CASE WHEN assessments_emp_bands.current_employability_band = 'A' THEN 1 END) AS count_A,
          COUNT(CASE WHEN assessments_emp_bands.current_employability_band = 'B' THEN 1 END) AS count_B,
          COUNT(CASE WHEN assessments_emp_bands.current_employability_band = 'C' THEN 1 END) AS count_C,
          COUNT(CASE WHEN assessments_emp_bands.current_employability_band = 'F' THEN 1 END) AS count_F,
          COUNT(CASE WHEN assessments_emp_bands.possible_employability_band = 'A++' THEN 1 END) AS count_A_plus_plus_possible,
          COUNT(CASE WHEN assessments_emp_bands.possible_employability_band = 'A+' THEN 1 END) AS count_A_plus_possible,
          COUNT(CASE WHEN assessments_emp_bands.possible_employability_band = 'A' THEN 1 END) AS count_A_possible,
          COUNT(CASE WHEN assessments_emp_bands.possible_employability_band = 'B' THEN 1 END) AS count_B_possible,
          COUNT(CASE WHEN assessments_emp_bands.possible_employability_band = 'C' THEN 1 END) AS count_C_possible,
          COUNT(CASE WHEN assessments_emp_bands.possible_employability_band = 'F' THEN 1 END) AS count_F_possible
      FROM
          report.assessments_emp_bands
      INNER JOIN
          hackathon h ON assessments_emp_bands.hackathon_id = h.id
      INNER JOIN
          "user" u ON assessments_emp_bands.user_id = u.id
      INNER JOIN
          college c ON u.college_id = c.id
      WHERE
          c.id = $1
          AND assessments_emp_bands.hackathon_id = $2
      GROUP BY
          assessments_emp_bands.hackathon_id;
      `;
  
      // Execute the query with parameter binding
      const { rows } = await pool.query(sql, [college_id, hackathon_id]);
  
      // Send the response
      res.json(rows);
    } catch (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  });


  router.get('/language_distribution', isAuthenticated, async (req, res) => {
    try {
        // Check if the college ID and hackathon ID are set in the session or query parameters
        const college_id = req.user.college || req.query.college_id || null;
        const hackathon_id = req.query.hackathon_id || null;

        if (!college_id) {
            return res.status(400).json({ error: 'College ID is not set in the session or query parameters.' });
        }

        if (!hackathon_id) {
            return res.status(400).json({ error: 'Hackathon ID is not provided.' });
        }

        // SQL query to fetch the required data
        const sql = `
            SELECT
                ts.language,
                COUNT(DISTINCT ts.user_id) AS distinct_users
            FROM
                test_submission ts
            INNER JOIN
                report.profiling_report_overall pro ON ts.user_id = pro.user_id
            INNER JOIN
                "user" u ON pro.user_id = u.id
            INNER JOIN
                college c ON u.college_id = c.id
            INNER JOIN
                report.assessments_scores report_scores ON u.id = report_scores.user_id
            WHERE
                c.id = $1
                AND ts.language IS NOT NULL
                AND report_scores.hackathon_id = $2
            GROUP BY
                ts.language
            ORDER BY
                distinct_users DESC;
        `;

        // Execute the query with parameter binding
        const { rows } = await pool.query(sql, [college_id, hackathon_id]);

        // Send the response
        res.json(rows);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

router.get('/accuracy_scores', isAuthenticated, async (req, res) => {
  try {
      // Check if the college ID and hackathon ID are set in the session or query parameters
      const college_id = req.user.college || req.query.college_id || null;
      const hackathon_id = req.query.hackathon_id || null;

      if (!college_id) {
          return res.status(400).json({ error: 'College ID is not set in the session or query parameters.' });
      }

      if (!hackathon_id) {
          return res.status(400).json({ error: 'Hackathon ID is not provided.' });
      }

      // SQL query to fetch the accuracy scores
      const query = `
          SELECT
              ts.language,
              ROUND(
                  (SUM(CASE WHEN ts.status = 'pass' THEN 1 ELSE 0 END) * 1.0 / 
                  COUNT(*)) * 100, 2) AS accuracy_percentage
          FROM
              test_submission ts
          INNER JOIN
              report.profiling_report_overall pro ON ts.user_id = pro.user_id
          INNER JOIN
              "user" u ON pro.user_id = u.id
          INNER JOIN
              college c ON u.college_id = c.id
          INNER JOIN
              report.assessments_scores report_scores ON u.id = report_scores.user_id
          WHERE
              c.id = $1 AND ts.language IS NOT NULL AND report_scores.hackathon_id = $2
          GROUP BY
              ts.language
          ORDER BY
              accuracy_percentage DESC;
      `;

      // Execute the query with parameter binding for both college_id and hackathon_id
      const { rows } = await pool.query(query, [college_id, hackathon_id]);

      // Send the response with the fetched data
      res.json(rows);
  } catch (error) {
      console.error('Error querying database for accuracy scores:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

router.get('/sub_domain_stats', isAuthenticated, async (req, res) => {
  try {
    const college_id = req.user.college || req.query.college_id || null;
    const hackathon_id = req.query.hackathon_id || null;

    if (!college_id) {
      return res.status(400).json({ error: 'College ID is not set in the session or query parameters.' });
    }

    if (!hackathon_id) {
      return res.status(400).json({ error: 'Hackathon ID is not provided.' });
    }

    // Fetch the sub-domain stats data and assessment names
    const { sub_domain_stats, weak_areas, improvement_areas, strong_areas, assessment1Name, assessment2Name } = await fetchSubDomainStats(college_id, hackathon_id);

    const response = {
      sub_domain_stats,
      weak_areas,
      improvement_areas,
      strong_areas,
      assessment1Name,
      assessment2Name
    };

    console.log('Serving fresh data from database: /sub_domain_stats');
    res.json(response);
  } catch (error) {
    console.error('Error querying database for sub domain stats:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


// Updated fetchSubDomainStats function to include assessment names
async function fetchSubDomainStats(college_id, hackathon_id) {
  const sql = `
    SELECT
        sda.sub_domain,
        ROUND(AVG(sda.accuracy), 2) AS average_accuracy,
        h.title AS assessment_name
    FROM
        report.profiling_sub_domain_accuracy sda
    INNER JOIN
        "user" u ON sda.user_id = u.id
    INNER JOIN
        college c ON u.college_id = c.id
    INNER JOIN
        report.assessments_scores rs ON u.id = rs.user_id
        INNER JOIN
        public.hackathon h ON rs.hackathon_id=h.id
    WHERE
        c.id = $1 AND rs.hackathon_id = $2
    GROUP BY
        sda.sub_domain, h.title
    ORDER BY
        average_accuracy DESC
  `;

  const result = await pool.query(sql, [college_id, hackathon_id]);

  const sub_domain_stats = [];
  const weak_areas = [];
  const improvement_areas = [];
  const strong_areas = [];
  let assessment1Name = '';
  let assessment2Name = '';

  result.rows.forEach((row, index) => {
    const sub_domain = row.sub_domain;
    const average_accuracy = parseFloat(row.average_accuracy);

    if (index === 0) {
      assessment1Name = row.assessment_name; // Assuming first result is Assessment 1
    } else if (index === 1) {
      assessment2Name = row.assessment_name; // Assuming second result is Assessment 2
    }

    if (average_accuracy < 40) {
      weak_areas.push(sub_domain);
    } else if (average_accuracy >= 40 && average_accuracy <= 70) {
      improvement_areas.push(sub_domain);
    } else {
      strong_areas.push(sub_domain);
    }

    sub_domain_stats.push(row);
  });

  return {
    sub_domain_stats,
    weak_areas,
    improvement_areas,
    strong_areas,
    assessment1Name,
    assessment2Name
  };
}









module.exports = router;


