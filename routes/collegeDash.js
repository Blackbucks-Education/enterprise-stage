const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const dbConfig = require('../db_config');

// Database connection pool
const pool = new Pool(dbConfig);




router.get('/dashboardcolleges', async (req, res) => {
  try {
    const selectQuery = `SELECT
    cp.college_id,
    rc.name,
    cp.logo,
    cp.location,
    cp.type,
    round(pr.batchaverage) as emp_score,
    COALESCE(COUNT(u.id), 0) AS total_students
FROM
    pages.college_pages AS cp
    INNER JOIN report.college AS rc ON cp.college_id = rc.id
    LEFT JOIN "user" AS u ON cp.college_id = u.college_id
    LEFT JOIN report.profiling_rankings pr on rc.id = pr.college_id
GROUP BY
    cp.college_id, rc.name, cp.logo, cp.location, cp.type, emp_score;`;

    const result = await pool.query(selectQuery);

    if (result.rows.length === 0) {
      return res.status(404).send('College Details not found');
    }

    res.json(result.rows); // Return all rows as an array
  } catch (error) {
    console.error('Error retrieving College details:', error.message);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});




module.exports = router;