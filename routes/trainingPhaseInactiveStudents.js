const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const dbConfig = require('../db_config');
const dbConfig_write = require('../read_replica_config');
const pool = new Pool(dbConfig);
const pool1 = new Pool(dbConfig_write);
const xlsx = require('node-xlsx').default;
const isAuthenticated = require('../jwtAuth.js');

router.get('/assessments/:phaseId',isAuthenticated, async (req, res) => {
    const phaseId = req.params.phaseId;
        

    try {
        const overviewQuery = `
            SELECT
            bd.name,
            bd.regno,
            bd.email,
            COUNT(uhp.user_id) AS response_count
        FROM
            report.trainings t
            INNER JOIN report.phase p ON t.id = p.training_id
            INNER JOIN report.phase_assessment pa on p.id = pa.phase_id
            INNER JOIN report.phase_batch pb ON p.id = pb.phase_id
            INNER JOIN report.batch_data bd ON pb.batch_id = bd.batch_id
            LEFT JOIN "user" u on bd.email = u.email
            LEFT JOIN user_hackathon_participation uhp on u.id = uhp.user_id and pa.assessment_id = uhp.hackathon_id
        WHERE
            p.id = $1
        GROUP BY
            bd.name,
            bd.regno,
            bd.email
        HAVING COUNT(uhp.user_id) = 0;`;

        const { rows } = await pool1.query(overviewQuery, [phaseId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching trainings:', error.message);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});

router.get('/events/:phaseId',isAuthenticated, async (req, res) => {
    const phaseId = req.params.phaseId;


    try {
        const overviewQuery = `
            SELECT
                bd.name,
                bd.regno,
                bd.email,
                COUNT(sr.registration_number) AS response_count
            FROM
                report.trainings t
                INNER JOIN report.phase p ON t.id = p.training_id
                INNER JOIN report.phase_live_sessions pls ON p.id = pls.phase_id
                INNER JOIN report.phase_batch pb ON p.id = pb.phase_id
                INNER JOIN report.batch_data bd ON pb.batch_id = bd.batch_id
                LEFT JOIN report.student_responses sr ON bd.regno = sr.registration_number
                                                    AND pls.event_id = sr.event_id
                INNER JOIN college c on bd.college_id = c.id
            WHERE
                p.id = $1
            GROUP BY
                bd.name,
                bd.regno,
                bd.email
            HAVING COUNT(sr.registration_number) = 0;`;

        const { rows } = await pool1.query(overviewQuery, [phaseId]);
        
        if (rows.length === 0) {
            return res.status(200).json({ message: 'No data is available' }); // Return a message
        }
        
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching trainings:', error.message);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});

module.exports = router;