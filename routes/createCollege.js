const { Pool } = require('pg');
const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();
const dbConfig = require('../db_config')
const multer = require('multer');

// Database connection pool
const pool = new Pool(dbConfig);

const s3 = new AWS.S3({
  accessKeyId: 'AKIAU6GDXHLIP2SRNB5L',
  secretAccessKey: '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'
});

// Multer storage setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadToS3 = (file) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: Date.now().toString() + '-' + file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype
  };
  return s3.upload(params).promise();
};

router.post('/createcollegeform', upload.fields([{ name: 'gallery', maxCount: 5 }, { name: 'icon', maxCount: 1 },  { name: 'banner', maxCount: 1 }]), async (req, res) => {
  const {
    college_id, location, type, description, courseName, courseDuration, courseDescription,
    seatsOffered, medianSalary, medianSalaryDescription, nirfDescription, library, libraryDescription,
    hostel, hostelDescription, sportsComplex, sportsComplexDescription, labs, labsDescription,
    cafeteria, gym, medicalFacilities, wifi, bus
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const iconFile = req.files['icon'] ? req.files['icon'][0] : null;
    let iconImageUrl = null;

    if (iconFile) {
      const iconUploadResult = await uploadToS3(iconFile);
      iconImageUrl = iconUploadResult.Location;
    }

    const BannerFile = req.files['banner'] ? req.files['banner'][0] : null;
    let BannerUrl = null;

    if (BannerFile) {
      const BannerUploadResult = await uploadToS3(BannerFile);
      BannerUrl = BannerUploadResult.Location;
    }

    // Log the received college_id
    console.log("Received college_id:", college_id);

    // Insert college record with provided college_id
    await client.query(
      'INSERT INTO pages.college_pages (college_id, location, type, description, logo, college_banner) VALUES ($1, $2, $3, $4, $5, $6)',
      [college_id, location, type, description, iconImageUrl, BannerUrl]
    );

    // Check if the college_id is present in colleges table
    const collegeCheckResult = await client.query(
      'SELECT college_id FROM pages.college_pages WHERE college_id = $1',
      [college_id]
    );

    // Log the result of the check
    console.log("College check result:", collegeCheckResult.rows);

    if (collegeCheckResult.rowCount === 0) {
      throw new Error('Provided college_id does not exist in college_pages table after insert.');
    }

    // Handle gallery images
    if (req.files['gallery']) {
      const galleryFiles = req.files['gallery'];
      console.log("Received gallery files:", galleryFiles);
      
      const galleryUploadPromises = galleryFiles.map(file => uploadToS3(file));
      
      const galleryUrls = await Promise.all(galleryUploadPromises).then(results => results.map(result => result.Location));

      console.log("Gallery URLs:", galleryUrls);

      for (const url of galleryUrls) {
        await client.query('INSERT INTO pages.college_gallery (college_id, images) VALUES ($1, $2)', [college_id, url]);
      }
    }

    // Handle course details
    for (let i = 0; i < courseName.length; i++) {
      await client.query(
        'INSERT INTO pages.college_course (college_id, name, duration, description, seats_offered, median_salary, median_salary_description) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [college_id, courseName[i], courseDuration[i], courseDescription[i], seatsOffered[i], medianSalary[i] === 'yes', medianSalaryDescription[i]]
      );
    }

    // Handle infrastructure details
    await client.query(
      'INSERT INTO pages.college_infra (college_id, nirf_description, library, library_description, hostel, hostel_description, sports_complex, sports_complex_description, labs, labs_description, cafeteria, gym, medical_facilities, wifi, bus) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
      [college_id, nirfDescription, library === 'yes', libraryDescription, hostel === 'yes', hostelDescription, sportsComplex === 'yes', sportsComplexDescription, labs === 'yes', labsDescription, cafeteria === 'yes', gym === 'yes', medicalFacilities === 'yes', wifi === 'yes', bus === 'yes']
    );

    await client.query('COMMIT');
    res.status(200).json({ message: 'College details saved successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saving college details', error);
    res.status(500).json({ error: 'Error saving college details', message: error.message });
  } finally {
    client.release();
  }
});



router.get('/colleges', async (req, res) => {
  try {
    const selectQuery = `SELECT DISTINCT report.college.name, report.college.id
FROM report.college
LEFT JOIN pages.college_pages ON report.college.id = pages.college_pages.college_id
WHERE report.college.name IS NOT NULL
  AND report.college.name <> ''
  AND pages.college_pages.college_id IS NULL;`;

    const result = await pool.query(selectQuery);

    if (result.rows.length === 0) {
      return res.status(404).send('Colleges not found');
    }

    res.json(result.rows); // Return all rows as an array
  } catch (error) {
    console.error('Error retrieving Colleges:', error.message);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});



module.exports = router;
