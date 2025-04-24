const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const dbConfig = require('../db_config');
const dbConfig_write = require('../read_replica_config');
const xlsx = require('node-xlsx').default;
const pool = new Pool(dbConfig);
const pool1 = new Pool(dbConfig_write);



// Fetch all events with details
router.get('/events', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 20; // Default to 20 items per page if not provided
    const offset = (page - 1) * limit;

    try {
        const result = await pool.query(`
        SELECT
        e.id,
        e.event_title,
        e.program_title,
        e.banner_image,
        f.name AS faculty_name,
        COUNT(s.id) AS student_count,
        TO_CHAR(start_date, 'DD-MM-YY HH24:MI') AS start_date,
        TO_CHAR(end_date, 'DD-MM-YY HH24:MI') AS end_date
        FROM
        report.events e
        JOIN
        report.faculties f ON e.faculty_id = f.id
        LEFT JOIN
        report.student_responses s ON e.id = s.event_id
        GROUP BY
        e.id, e.event_title, e.program_title, e.banner_image, f.name
        ORDER BY e.created_at DESC
        LIMIT $1 OFFSET $2
        `, [limit, offset]);
        
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


router.get('/event/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Fetching event details for ID: ${id}`);
    try {
        const result = await pool.query(
            "SELECT report.events.id, event_title, event_type, banner_image, f.name as faculty_name, f.id as faculty_id, num_hours, program_title, feedback_url, TO_CHAR(start_date, 'DD-MM-YY HH24:MI') AS start_date, TO_CHAR(end_date, 'DD-MM-YY HH24:MI') AS end_date FROM report.events INNER JOIN report.faculties f on f.id = events.faculty_id WHERE report.events.id = $1",
            [id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ success: false, error: 'Event Not Found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


// Fetch faculties
router.get('/faculties', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name FROM report.faculties');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});



// Fetch event report
router.get('/eventReport/:id', async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query; // Default to page 1, 20 results per page
    const offset = (page - 1) * limit;

    try {
        const result = await pool.query(`
            SELECT f.registration_number, f.feedback, f.interactive, f.learn_today, f.comments
            FROM report.student_responses f
            WHERE f.event_id = $1
            ORDER BY f.registration_number
            LIMIT $2 OFFSET $3
        `, [id, limit, offset]);

        const studentCountResult = await pool.query(`
            SELECT COUNT(*) AS count
            FROM report.student_responses f
            WHERE f.event_id = $1
        `, [id]);

        const studentCount = studentCountResult.rows[0].count;
        res.json({ student_count: studentCount, students: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});



router.get('/downloadCsv/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT f.registration_number, f.feedback, f.interactive, f.learn_today, f.comments
            FROM report.student_responses f
            WHERE f.event_id = $1
        `, [id]);
        const csvData = [];
        csvData.push(['Registration Number', 'Feedback', 'Interactive', 'Learned', 'Comments']);
        result.rows.forEach(row => {
            csvData.push([row.registration_number, row.feedback, row.interactive, row.learn_today, row.comments]);
        });
        const csvContent = csvData.map(e => e.join(",")).join("\n");

        res.setHeader('Content-disposition', 'attachment; filename=event_report.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csvContent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Fetch feedback data for an event
router.get('/feedbackData/:id', async (req, res) => {
    const { id } = req.params;

    const feedbackCategories = ['Extremely Satisfied', 'Very Satisfied', 'Satisfied', 'Slightly Satisfied', 'Needs Improvement'];
    const weights = [5, 4, 3, 2, 1]; // Assign weights to each category

    try {
        // Initialize feedbackData with all categories set to zero
        const feedbackData = {};
        feedbackCategories.forEach(category => {
            feedbackData[category] = 0;
        });

        const result = await pool.query(`
            SELECT 
                feedback,
                ROUND(AVG(CASE interactive WHEN 'Yes' THEN 1 ELSE 0 END) * 100, 2) AS avg_interactiveness_percentage,
                COUNT(*) as count 
            FROM 
                report.student_responses 
            WHERE 
                event_id = $1 
            GROUP BY 
                feedback
        `, [id]);

        let totalStudentsCount = 0;
        let totalWeightedScore = 0;
        let averageInteractivePercentage = 0;

        if (result.rows.length > 0) {
            averageInteractivePercentage = parseFloat(result.rows[0].avg_interactiveness_percentage);
        }

        result.rows.forEach(row => {
            const feedback = row.feedback;
            const count = parseInt(row.count);

            if (feedbackCategories.includes(feedback)) {
                feedbackData[feedback] = count;
                totalStudentsCount += count;
                totalWeightedScore += count * weights[feedbackCategories.indexOf(feedback)];
            }
        });

        const averageRating = totalStudentsCount > 0 ? (totalWeightedScore / totalStudentsCount) : 0;
        const averageRatingOutOf5 = (averageRating / Math.max(...weights)) * 5;

        const response = {
            feedbackData,
            averageRating: averageRatingOutOf5.toFixed(2),
            averageInteractivePercentage: averageInteractivePercentage.toFixed(2),
            totalStudentsCount,
        };

        res.json(response);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
