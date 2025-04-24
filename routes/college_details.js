const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const multer = require('multer');
const AWS = require('aws-sdk');
const dbConfig = require('../db_config');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const pool = new Pool(dbConfig);

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


router.get('/fetchCollegeName/:id',async (req,rez)=>{
  const {id} = req.params;

  const query = `SELECT `
})

module.exports = router;
