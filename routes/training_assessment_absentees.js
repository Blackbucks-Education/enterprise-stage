const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const xlsx = require('node-xlsx').default;
const AWS = require('aws-sdk');
const dbConfig = require('../db_config');
const dbConfigWrite = require('../read_replica_config');
const cacheManager = require('../utlis/cacheManager');
const isAuthenticated = require('../jwtAuth.js');


router.get('/overview/:phaseId', isAuthenticated, async (req, res) => {
  const phaseId = req.params.phaseId;

  try {
    const overviewQuery = `
      WITH TotalStudents AS (
        SELECT
          pa.assessment_id,
          COUNT(DISTINCT bd.regno) AS total_students
        FROM
          report.phase p
          INNER JOIN report.phase_batch pb ON p.id = pb.phase_id
          INNER JOIN report.batch_data bd ON pb.batch_id = bd.batch_id
          INNER JOIN report.phase_assessment pa ON p.id = pa.phase_id
        WHERE
          pb.phase_id = $1
        GROUP BY
          pa.assessment_id
      ),
      AssessmentAttendance AS (
        SELECT
          pa.assessment_id,
          COUNT(DISTINCT uhp.user_id) AS present_students,
          ROUND(AVG(uhp.current_score * 100.0 / hw.score), 2) AS average_100_equivalent_score
        FROM
          user_hackathon_participation uhp
          INNER JOIN report.phase_assessment pa ON uhp.hackathon_id = pa.assessment_id
          INNER JOIN report.phase p ON pa.phase_id = p.id
          INNER JOIN "user" u ON uhp.user_id = u.id
          INNER JOIN report.phase_batch pb ON p.id = pb.phase_id
          INNER JOIN report.batch_data bd ON u.email = bd.email AND pb.batch_id = bd.batch_id
          INNER JOIN hackathon_with_score hw ON uhp.hackathon_id = hw.id
        WHERE
             p.id = $2 -- College filter applied here
        GROUP BY
          pa.assessment_id
      )
      SELECT
        h.id,
        h.title,
        ts.total_students,
        COALESCE(aa.present_students, 0) AS present_students,
        ts.total_students - COALESCE(aa.present_students, 0) AS absent_students,
        ROUND(COALESCE(aa.present_students, 0) * 100.0 / ts.total_students, 2) AS attendance_rate,
        aa.average_100_equivalent_score
      FROM
        TotalStudents ts
        LEFT JOIN AssessmentAttendance aa ON ts.assessment_id = aa.assessment_id
      INNER JOIN report.phase_assessment pa ON ts.assessment_id = pa.assessment_id
        INNER JOIN hackathon h ON ts.assessment_id = h.id and pa.assessment_id = h.id
      WHERE
        pa.phase_id = $3;`;

    const pool = new Pool(dbConfigWrite);
    const { rows } = await pool.query(overviewQuery, [phaseId, phaseId, phaseId]);

    // Directly return the data without caching
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching overview:', error.message);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});



router.get('/download-absentees/:assessmentId', isAuthenticated, async (req, res) => {
  const assessmentId = req.params.assessmentId;

  try {
    const absenteesQuery = `
      WITH TotalStudents AS (
        SELECT
          pa.assessment_id,
          bd.regno,
          bd.name,
          bd.phone,
          bd.email
        FROM
          report.phase p
          INNER JOIN report.phase_batch pb ON p.id = pb.phase_id
          INNER JOIN report.batch_data bd ON pb.batch_id = bd.batch_id
          INNER JOIN report.phase_assessment pa ON p.id = pa.phase_id
      ),
      AssessmentsAttendance AS (
        SELECT
          uhp.hackathon_id AS assessment_id,
          bd.email
        FROM
          user_hackathon_participation uhp
          INNER JOIN report.phase_assessment pa ON uhp.hackathon_id = pa.assessment_id
          INNER JOIN "user" u ON uhp.user_id = u.id
          INNER JOIN report.phase p ON pa.phase_id = p.id
          INNER JOIN report.phase_batch pb ON p.id = pb.phase_id
          INNER JOIN report.batch_data bd ON u.email = bd.email AND pb.batch_id = bd.batch_id
      ),
      AbsentStudents AS (
        SELECT
          ts.email,
          ts.assessment_id,
          ts.regno,
          ts.name,
          ts.phone
        FROM
          TotalStudents ts
          LEFT JOIN AssessmentsAttendance aa ON ts.assessment_id = aa.assessment_id AND ts.email = aa.email
        WHERE
          aa.email IS NULL
      )
      SELECT
        asb.name,
        asb.phone,
        asb.email,
        asb.regno
      FROM
        AbsentStudents asb
      WHERE
        asb.assessment_id = $1
      ORDER BY
        asb.name;`;

    const pool = new Pool(dbConfigWrite);
    const { rows } = await pool.query(absenteesQuery, [assessmentId]);

    const data = [
      ['Name', 'Phone', 'Email', 'Absent Student ID'],
      ...rows.map(row => [row.name, row.phone, row.email, row.regno])
    ];

    const buffer = xlsx.build([{ name: 'Absentees', data }]);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="absentees_event_${assessmentId}.xlsx"`
    );
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.status(200).send(buffer);
  } catch (error) {
    console.error('Error fetching absentees:', error.message);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});


module.exports = router;