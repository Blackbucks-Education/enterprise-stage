const { Pool } = require("pg");
const express = require("express");
const router = express.Router();
const cacheManager = require("../utlis/cacheManager.js"); // Ensure this path is correct
const dbConfig = require("../read_replica_config.js");
const pool = new Pool(dbConfig);
const isAuthenticated = require("../jwtAuth.js");

router.get("/:companyId", isAuthenticated, async (req, res) => {
  try {
    const { companyId } = req.params;
    const { page = 0, limit = 10 } = req.query;
    const offset = page * limit;

    const companyResult = await pool.query(
      "SELECT id FROM company WHERE id = $1",
      [companyId]
    );

    if (companyResult.rows.length === 0) {
        return res.status(404).json({ error: 'Company not found' });
      }
  
      const hackathonResult = await pool.query(
        `SELECT
            h.title,
            c.name,
            h.host_organization_image,
            COUNT(CASE WHEN b.problem_type = 'file' THEN 1 END) AS file,
            COUNT(CASE WHEN b.problem_type = 'video' THEN 1 END) AS video,
            COUNT(CASE WHEN b.problem_type = 'mcq' THEN 1 END) AS mcq,
            COUNT(CASE WHEN b.problem_type = 'subjective' THEN 1 END) AS subjective,
            COUNT(uhp.user_id) AS participation
        FROM
            hackathon h
        INNER JOIN
            company c ON h.company_id = c.id
        INNER JOIN
            round r ON h.id = r.hackathon_id
        INNER JOIN
            round_block_order rbo ON r.id = rbo.round_id
        INNER JOIN
            block b ON rbo.block_id = b.id
        INNER JOIN
            user_hackathon_participation uhp ON h.id = uhp.hackathon_id
        WHERE
            h.company_id = $1
        GROUP BY
            h.title, c.name, h.host_organization_image
        LIMIT $2 OFFSET $3`,
        [companyId, limit, offset]
    );

    console.log(hackathonResult.rows,"ool");
    
      const totalCountResult = await pool.query(
        'SELECT COUNT(*) FROM hackathon WHERE company_id = $1',
        [companyId]
      );

      const totalCount = parseInt(totalCountResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      hackathons: hackathonResult.rows,
      nextPage: page < totalPages - 1 ? parseInt(page) + 1 : null,
      totalPages,
    });


  } catch (error) {
    console.error("Error executing emp_band_data query:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});





module.exports = router;
