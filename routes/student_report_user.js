const { Pool } = require('pg');
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const NodeCache = require('node-cache');
const dbConfig = require('../read_replica_config.js');

const pool = new Pool(dbConfig);
const cache = new NodeCache();
const isAuthenticated = require('../jwtAuth.js');
// Configure AWS SDK using environment variables or AWS shared credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const CACHE_TABLE = 'CacheTable';
const CACHE_EXPIRY_SECONDS = 3600; // Cache expiry time in seconds (1 Hour)

// Utility function to get cached data from DynamoDB
const getCachedData = async (key) => {
  const params = {
    TableName: CACHE_TABLE,
    Key: { cacheKey: key },
  };
  try {
    const result = await dynamoDb.get(params).promise();
    return result.Item ? JSON.parse(result.Item.data) : null; // Parse cached JSON data if present
  } catch (error) {
    console.error(`Error getting cached data for key ${key}:`, error);
    throw error;
  }
};

// Utility function to set cached data in DynamoDB
const setCachedData = async (key, data) => {
  const params = {
    TableName: CACHE_TABLE,
    Item: {
      cacheKey: key,
      data: JSON.stringify(data), // Store data as JSON string in DynamoDB
      ttl: Math.floor(Date.now() / 1000) + CACHE_EXPIRY_SECONDS, // TTL in seconds
    },
  };
  try {
    await dynamoDb.put(params).promise();
  } catch (error) {
    console.error(`Error setting cached data for key ${key}:`, error);
    throw error;
  }
};

// Route to fetch user information with DynamoDB caching
router.get('/user', async (req, res) => {
  try {
    const { email } = req.query;

    // Check if the email parameter is provided
    if (!email) {
      return res.status(400).json({ error: "Email parameter is missing in the URL query." });
    }

    // Query to fetch user ID based on email
    const userIdQuery = `SELECT id FROM public.user WHERE email = $1`;
    const userIdResult = await pool.query(userIdQuery, [email]);

    if (userIdResult.rowCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const userId = userIdResult.rows[0].id;

    // Query to fetch user information
    const userInfoQuery = `
      SELECT 
        u.first_name || ' ' || u.last_name AS full_name,
        u.image,
        u.email,
        u.phone,
        c.name AS college_name,
        d.name AS department_name,
        u.roll_number
      FROM public.user u
      LEFT JOIN public.college c ON u.college_id = c.id
      LEFT JOIN public.department d ON u.department_id = d.id
      WHERE u.id = $1
    `;
    const userInfoResult = await pool.query(userInfoQuery, [userId]);

    if (userInfoResult.rowCount === 0) {
      return res.status(404).json({ error: "User information not available." });
    }

    // Preparing user data to be sent
    const userData = {
      full_name: userInfoResult.rows[0].full_name,
      email: userInfoResult.rows[0].email,
      phone: userInfoResult.rows[0].phone,
      college_name: userInfoResult.rows[0].college_name,
      department_name: userInfoResult.rows[0].department_name,
      roll_number: userInfoResult.rows[0].roll_number,
      image: userInfoResult.rows[0].image
    };

    // Send the response without caching
    res.json(userData);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});



// Route to fetch internship data with DynamoDB caching
router.get('/data', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email parameter is missing in the URL query." });
    }

    const query = `
      WITH user_report AS (
        SELECT
          us.user_id,
          us.question_subdomain,
          SUM(us.obtained_score) AS total_obtained_score,
          SUM(us.question_score) AS total_question_score
        FROM
          test_submission_with_score us
        JOIN
          "user" ut ON us.user_id = ut.id
        WHERE
          ut.email = $1
        GROUP BY
          us.user_id, us.question_subdomain
      ),
      subdomains_with_minimum_eighty_percent_accuracy AS (
        SELECT
          user_id,
          array_agg(question_subdomain) AS subDomains
        FROM
          user_report
        WHERE
          ROUND((total_obtained_score / NULLIF(total_question_score, 0) * 100), 2) > 80
        GROUP BY
          user_id
      ),
      company_subdomains AS (
        SELECT
          c.name AS company_name,
          c.logo,
          array_agg(sd.name) AS company_subDomains
        FROM
          company_sub_domain csd
        JOIN
          company c ON csd.company_id = c.id
        JOIN
          question_sub_domain sd ON csd.sub_domain_id = sd.id
        GROUP BY
          c.name, c.logo
      ),
      user_company_eligibility AS (
        SELECT
          sa.user_id,
          cs.company_name,
          cs.logo,
          cs.company_subDomains,
          sa.subDomains AS user_subDomains,
          ARRAY(
            SELECT UNNEST(cs.company_subDomains)
            INTERSECT
            SELECT UNNEST(sa.subDomains)
          ) AS matched_subDomains,
          ARRAY_LENGTH(ARRAY(
            SELECT UNNEST(cs.company_subDomains)
            INTERSECT
            SELECT UNNEST(sa.subDomains)
          ), 1) AS matched_count,
          ARRAY_LENGTH(cs.company_subDomains, 1) AS total_company_subDomains
        FROM
          subdomains_with_minimum_eighty_percent_accuracy sa
        CROSS JOIN
          company_subdomains cs
      )
      SELECT
        user_id,
        company_name,
        logo,
        ROUND((matched_count::numeric / total_company_subDomains) * 100, 2) AS subDomainsAccuracy
      FROM
        user_company_eligibility;
    `;

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(404).send('Internship not found');
    }

    const internships = result.rows;

    res.status(200).json(internships);
  } catch (error) {
    console.error('Error fetching internship details:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Route to fetch student comment data with DynamoDB caching
router.get('/student_comment_data/:emailId', async (req, res) => {
  const emailId = req.params.emailId;

  try {
    const query = `
      WITH RankedScores AS (
        SELECT
          ps1.user_id,
          ps1.total_score,
          u.college_id,
          u.email,
          DENSE_RANK() OVER (PARTITION BY u.college_id ORDER BY ps1.total_score DESC) AS college_rank
        FROM
          report.profiling_scores1 ps1
        INNER JOIN
          "user" u
        ON
          ps1.user_id = u.id
      )
      SELECT
        user_id,
        total_score,
        college_id,
        college_rank
      FROM
        RankedScores
      WHERE
        email = $1;
    `;

    const result = await pool.query(query, [emailId]);

    if (result.rows.length === 0) {
      return res.status(404).send('Internship not found');
    }

    const studentComments = result.rows;

    res.status(200).json(studentComments);
  } catch (error) {
    console.error('Error fetching student comment details:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;

