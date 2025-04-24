const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const multer = require('multer');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const dbConfig = require('../db_config');
dotenv.config();



const pool = new Pool(dbConfig);


const s3 = new AWS.S3({
  accessKeyId: 'AKIAU6GDXHLIP2SRNB5L',
  secretAccessKey: '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'
});

// Multer storage setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadToS3 = async (file) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now().toString()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype
    // Remove ACL to address bucket restriction
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location; // Return the URL of the uploaded file
  } catch (err) {
    console.error('Error uploading file to S3:', err.message);
    throw err;
  }
};



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
       ci.nirf_description, library, library_description, hostel, hostel_description, sports_complex, sports_complex_description, labs, labs_description, cafeteria, gym, medical_facilities, wifi, bus
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

router.post('/updateCollege', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
  { name: 'gallery_images', maxCount: 10 }
]), async (req, res) => {
  const { college_id, type, location, description } = req.body;
  let logoUrl = null;
  let bannerUrl = null;
  let imagesUrls = [];

  try {
    // Upload logo to S3 if provided
    if (req.files['logo']) {
      const logoFile = req.files['logo'][0];
      logoUrl = await uploadToS3(logoFile);
      console.log('Uploaded logo:', logoUrl);
    }

    // Upload banner to S3 if provided
    if (req.files['banner']) {
      const bannerFile = req.files['banner'][0];
      bannerUrl = await uploadToS3(bannerFile);
      console.log('Uploaded banner:', bannerUrl);
    }

    // Upload gallery images to S3 and collect URLs
    if (req.files['gallery_images']) {
      const galleryFiles = req.files['gallery_images'];
      console.log('Received gallery files:', galleryFiles);
      const uploadPromises = galleryFiles.map(file => uploadToS3(file));
      imagesUrls = await Promise.all(uploadPromises);
      console.log('Uploaded gallery images:', imagesUrls);
    }

    // Update college details in the database
    const updateCollegeQuery = `
      UPDATE pages.college_pages
      SET type = $1, location = $2, description = $3, logo = COALESCE($4, logo), college_banner = COALESCE($5, college_banner)
      WHERE college_id = $6
    `;
    const updateResult = await pool.query(updateCollegeQuery, [type, location, description, logoUrl, bannerUrl, college_id]);

    // Check if college was updated successfully
    if (updateResult.rowCount === 0) {
      return res.status(404).json({ message: 'College not found' });
    }

    // Check the count of existing gallery images
    const countOldImagesQuery = `
      SELECT COUNT(*) FROM pages.college_gallery WHERE college_id = $1
    `;
    const countResult = await pool.query(countOldImagesQuery, [college_id]);
    const existingImageCount = parseInt(countResult.rows[0].count, 10);

    // Only delete old images if more than 10 exist
    if (existingImageCount > 10) {
      const deleteOldImagesQuery = `
        DELETE FROM pages.college_gallery WHERE college_id = $1
      `;
      await pool.query(deleteOldImagesQuery, [college_id]);
    }

    // Insert new gallery images
    const insertGalleryQuery = `
      INSERT INTO pages.college_gallery (college_id, images)
      VALUES ($1, $2)
    `;
    for (const imageUrl of imagesUrls) {
      await pool.query(insertGalleryQuery, [college_id, imageUrl]);
    }

    res.json({ message: 'College details updated successfully' });
  } catch (error) {
    console.error('Error updating college details:', error.message);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
});

// Update Infrastructure Route
router.post('/updateInfrastructure', async (req, res) => {
  const {
      college_id,
      nirf_description,
      library,
      library_description,
      hostel,
      hostel_description,
      sports_complex,
      sports_complex_description,
      labs,
      labs_description,
      cafeteria,
      gym,
      medical_facilities,
      wifi,
      bus
  } = req.body;

  try {
      // Update the infrastructure details in the database
      const query = `
          UPDATE pages.college_infra
          SET
              nirf_description = $1,
              library = $2,
              library_description = $3,
              hostel = $4,
              hostel_description = $5,
              sports_complex = $6,
              sports_complex_description = $7,
              labs = $8,
              labs_description = $9,
              cafeteria = $10,
              gym = $11,
              medical_facilities = $12,
              wifi = $13,
              bus = $14
          WHERE college_id = $15
          RETURNING *;
      `;
      const values = [
          nirf_description,
          library,
          library_description,
          hostel,
          hostel_description,
          sports_complex,
          sports_complex_description,
          labs,
          labs_description,
          cafeteria,
          gym,
          medical_facilities,
          wifi,
          bus,
          college_id
      ];

      const result = await pool.query(query, values);
      const updatedCollege = result.rows[0];

      res.json({ message: 'Infrastructure updated successfully', data: updatedCollege });
  } catch (error) {
      console.error('Error updating infrastructure:', error);
      res.status(500).json({ message: 'Error updating infrastructure' });
  }
});


router.post('/updateCourse', async (req, res) => {
  const { id, name, duration, description,seats_offered, median_salary, median_salary_description } = req.body;

  try {
      const updateQuery = `
          UPDATE pages.college_course 
          SET name = $1, duration = $2, description = $3,seats_offered=$4, median_salary = $5, median_salary_description = $6
          WHERE id = $7
      `;
      const values = [name, duration, description,seats_offered, median_salary, median_salary_description, id];

      const result = await pool.query(updateQuery, values);

      if (result.rowCount === 0) {
          return res.status(404).json({ message: 'Course not found' });
      }

      res.status(200).json({ message: 'Course updated successfully' });
  } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/deleteCourse/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const deleteQuery = `
          DELETE FROM pages.college_course
          WHERE id = $1
      `;

      const result = await pool.query(deleteQuery, [id]);

      if (result.rowCount === 0) {
          return res.status(404).json({ message: 'Course not found' });
      }

      res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.post('/addCourse', async (req, res) => {
  const { college_id, name, duration, description, seats_offered, median_salary, median_salary_description } = req.body;

  try {
      const insertQuery = `
          INSERT INTO pages.college_course (college_id, name, duration, description, seats_offered, median_salary, median_salary_description)
          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
      `;
      const values = [college_id, name, duration, description, seats_offered, median_salary, median_salary_description];

      const result = await pool.query(insertQuery, values);

      if (result.rowCount === 0) {
          return res.status(500).json({ message: 'Failed to add course' });
      }

      res.status(201).json({ message: 'Course added successfully', course: result.rows[0] });
  } catch (error) {
      console.error('Error adding course:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.get('/fetchCollegeTypes', async (req, res) => {
  try {
      const result = await pool.query('SELECT id, college_type FROM pages.college_type');
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching college types:', error);
      res.status(500).json({ message: 'Error fetching college types' });
  }
});


module.exports = router;
