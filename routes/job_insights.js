const express = require('express');
const { Pool } = require('pg');
const cacheManager = require('../utlis/cacheManager'); // Ensure this module exists and handles caching
const isAuthenticated = require('../jwtAuth.js');
const dbConfig = require('../read_replica_config'); // Assuming this file exists and contains your PostgreSQL database configuration
const pool = new Pool(dbConfig);

const router = express.Router();

// Route to fetch job post data
router.get('/job_post_data', isAuthenticated, async (req, res) => {
    const college_id = req.user.college || null;
  
    if (!college_id) {
      return res.status(400).json({ error: 'College code is not set in the session.' });
    }
  
    try {
      const query1 = `
        SELECT COUNT(*) AS total_job_applications
        FROM job_post_recruitment_status jprs
        INNER JOIN job_post jp ON jprs.job_post_id = jp.id
        INNER JOIN "user" u ON jprs.student_id = u.id
        INNER JOIN college c ON u.college_id = c.id
        WHERE c.id = $1
      `;
      const { rows: [jobApplications] } = await pool.query(query1, [college_id]);
  
      const query2 = `
        SELECT TO_CHAR(jp.application_start_date, 'Month YYYY') AS month_year,
               COUNT(*) AS post_count
        FROM job_post jp
        INNER JOIN job_post_recruitment_status jprs ON jp.id = jprs.job_post_id
        INNER JOIN "user" u ON jprs.student_id = u.id
        INNER JOIN college c ON u.college_id = c.id
        WHERE jp.drive_type = 'Open Drive'
          AND jp.status = 'published'
          AND c.id = $1
        GROUP BY month_year
      `;
      const { rows: monthlyJobPostCount } = await pool.query(query2, [college_id]);
  
      const query3 = `
        SELECT COUNT(*) AS total_published_job_posts
        FROM job_post jp
        INNER JOIN job_post_recruitment_status jprs ON jp.id = jprs.job_post_id
        INNER JOIN "user" u ON jprs.student_id = u.id
        INNER JOIN college c ON u.college_id = c.id
        WHERE jp.drive_type = 'Open Drive'
          AND jp.status = 'published'
          AND c.id = $1
      `;
      const { rows: [publishedJobPosts] } = await pool.query(query3, [college_id]);
  
      const data = {
        total_job_applications: jobApplications.total_job_applications,
        monthly_job_post_count: monthlyJobPostCount,
        total_published_job_posts: publishedJobPosts.total_published_job_posts
      };
  
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching job post data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Route to fetch count of job applications
router.get('/applied_count', isAuthenticated, async (req, res) => {
    const college_id = req.user.college || null;
  
    if (!college_id) {
      return res.status(400).json({ error: 'College code is not set in the session.' });
    }
  
    try {
      const sql = `
        SELECT COUNT(jprs.student_id) AS applied_count
        FROM job_post
        INNER JOIN job_post_recruitment_status jprs ON job_post.id = jprs.job_post_id
        INNER JOIN "user" u ON jprs.student_id = u.id
        INNER JOIN college c ON u.college_id = c.id
        WHERE c.id = $1
      `;
      const { rows: [result] } = await pool.query(sql, [college_id]);
  
      res.status(200).json({ applied_count: result.applied_count });
    } catch (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Route to fetch job post to application ratio
router.get('/job_post_ratio', isAuthenticated, async (req, res) => {
    const college_id = req.user.college || null;
  
    if (!college_id) {
      return res.status(400).json({ error: 'College ID is not set in the session.' });
    }
  
    try {
      const query = `
        SELECT COUNT(jprs.student_id)::float / NULLIF(COUNT(DISTINCT jp.id), 0) AS ratio
        FROM job_post jp
        INNER JOIN job_post_recruitment_status jprs ON jp.id = jprs.job_post_id
        INNER JOIN "user" u ON jprs.student_id = u.id
        INNER JOIN college c ON u.college_id = c.id
        WHERE c.id = $1
      `;
      const { rows: [result] } = await pool.query(query, [college_id]);
  
      res.status(200).json({ ratio: result.ratio || 0 });
    } catch (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

module.exports = router;
