const { Pool } = require('pg');
const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();
const cacheManager = require('../utlis/cacheManager.js'); // Ensure the correct path to cacheManager
const dbConfig = require('../read_replica_config.js');
const pool = new Pool(dbConfig);
const isAuthenticated = require('../jwtAuth.js');

// Route to get language data
router.get('/language_data', isAuthenticated, async (req, res) => {
    try {
        const college_id = req.user.college || null;

        if (!college_id) {
            return res.status(400).json({ error: 'College code is not set in the session.' });
        }

        // SQL query to get language data
        const query = `
            SELECT
                ts.language,
                COUNT(DISTINCT ts.user_id) AS distinct_users
            FROM
                test_submission ts
            INNER JOIN report.profiling_report_overall pro ON ts.user_id = pro.user_id
            INNER JOIN "user" u ON pro.user_id = u.id
            INNER JOIN college c ON u.college_id = c.id
            WHERE
                c.id = $1 AND ts.language IS NOT NULL
            GROUP BY
                ts.language
            ORDER BY distinct_users DESC;
        `;

        // Execute the query
        const { rows } = await pool.query(query, [college_id]);

        // Log the length of the result rows for debugging
        console.log(rows.length);

        // Return the data as JSON
        res.json(rows);
    } catch (error) {
        console.error('Error querying database for language data:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});


// Route to get accuracy scores
router.get('/accuracy_scores', isAuthenticated, async (req, res) => {
    try {
        const college_id = req.user.college || null;

        if (!college_id) {
            return res.status(400).json({ error: 'College code is not set in the session.' });
        }

        const query = `
            SELECT
                ts.language,
                ROUND(
                    (SUM(CASE WHEN ts.status = 'pass' THEN 1 ELSE 0 END) * 1.0 /
                    COUNT(*)) * 100, 2) AS accuracy_percentage
            FROM
                test_submission ts
            INNER JOIN report.profiling_report_overall pro ON ts.user_id = pro.user_id
            INNER JOIN "user" u ON pro.user_id = u.id
            INNER JOIN college c ON u.college_id = c.id
            WHERE
                c.id = $1 AND ts.language IS NOT NULL
            GROUP BY
                ts.language
            ORDER BY
                accuracy_percentage DESC;
        `;

        // Execute the query
        const { rows } = await pool.query(query, [college_id]);

        // Return the data as JSON
        res.json(rows);
    } catch (error) {
        console.error('Error querying database for accuracy scores:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});


module.exports = router;
