
import { getCachedData, setCachedData } from "./cache";
import { readPool } from "./pool";
import { unstable_cache } from 'next/cache';


export async function getNoOfCandidates(collegeId) {
  if (!collegeId) return null;
  // const cacheKey = `noOfCandidates_${collegeId}`;
  // const cachedData = await getCachedData(cacheKey);
  // if (cachedData) {
  //   console.log(`Cache hit for key ${cacheKey}`);
  //   return cachedData;
  // }

  const result = await readPool.query(`
    SELECT COUNT(*) AS total_enrolled_candidates
    FROM "user" u
    INNER JOIN college c ON u.college_id = c.id
    WHERE c.id = $1
  `, [collegeId]);

  const data = result?.rows[0]?.total_enrolled_candidates || 0;

  // await setCachedData(cacheKey, data);
  // console.log(`Cache set for key ${cacheKey}`);
  return data;
}

export async function getVariousYears(collegeId) {
  if (!collegeId) return null;
  // const cacheKey = `variousYears_${collegeId}`;
  // const cachedData = await getCachedData(cacheKey);
  // if (cachedData) {
  //   console.log(`Cache hit for key ${cacheKey}`);
  //   return cachedData;
  // }
  const result = await readPool.query(`
    SELECT
      COUNT(*) AS total_enrolled_candidates,
      CASE
        WHEN EXTRACT(YEAR FROM ed.end_date AT TIME ZONE 'UTC' + INTERVAL '5 hours 30 minutes') IS NULL THEN 'Not Provided'
        ELSE EXTRACT(YEAR FROM ed.end_date AT TIME ZONE 'UTC' + INTERVAL '5 hours 30 minutes')::TEXT
      END AS YOP
    FROM
      "user" u
    INNER JOIN
      college c ON u.college_id = c.id
    LEFT JOIN
      resume.education_details ed ON u.id = ed.user_id
    WHERE
      c.id = $1
      AND (ed.stage = 'Degree' OR ed.stage IS NULL)
    GROUP BY
      YOP
    ORDER BY
      YOP;
  `, [collegeId]);

  const data = result?.rows || [{ total_enrolled_candidates: 0, YOP: 'Not Provided' }];

  // await setCachedData(cacheKey, data);
  // console.log(`Cache set for key ${cacheKey}`);
  return data;
}

export async function getVariousBranches(collegeId) {
  if (!collegeId) return null;
  // const cacheKey = `variousBranches_${collegeId}`;
  // const cachedData = await getCachedData(cacheKey);
  // if (cachedData) {
  //   console.log(`Cache hit for key ${cacheKey}`);
  //   console.log(cachedData,"var");
  //   return cachedData;
  // }
  const result = await readPool.query(`
    SELECT
      COUNT(*) AS total_enrolled_candidates,
      BTechBranch
    FROM (
      SELECT
        u.id,
        COALESCE(MAX(CASE WHEN ed.stage = 'Degree' THEN ed.branch END), 'Not Provided') AS BTechBranch
      FROM
        "user" u
      INNER JOIN
        college c ON u.college_id = c.id
      LEFT JOIN
        resume.education_details ed ON u.id = ed.user_id
      WHERE
        c.id = $1
      GROUP BY
        u.id
    ) subquery
    GROUP BY
      BTechBranch
  `, [collegeId]);

  const data = result?.rows || [{ total_enrolled_candidates: 0, BTechBranch: 'Not Provided' }];

  // await setCachedData(cacheKey, data);
  // console.log(`Cache set for key ${cacheKey}`);
  return data;
}

export async function getEnrollments(collegeId) {
  if (!collegeId) return null;
  // const cacheKey = `enrollments_${collegeId}`;
  // const cachedData = await getCachedData(cacheKey);
  // if (cachedData) {
  //   console.log(`Cache hit for key ${cacheKey}`);
  //   return cachedData;
  // }

  const totallyEnrolled = await readPool.query(`
    SELECT COUNT(*)
    FROM report.trainings
    WHERE CAST(college_id AS INTEGER) = $1;
  `, [collegeId]);

  const totallyCompleted = await readPool.query(`
    SELECT COUNT(*) FILTER (WHERE end_date < CURRENT_TIMESTAMP) AS completed_trainings
    FROM report.trainings
    WHERE CAST(college_id AS INTEGER) = $1;
  `, [collegeId]);

  const totallyStarted = await readPool.query(`
    SELECT COUNT(regno)
    FROM report.trainings t
    INNER JOIN report.phase p ON t.id = p.training_id
    INNER JOIN report.phase_batch pb ON p.id = pb.phase_id
    INNER JOIN report.batch_data bd ON pb.batch_id = bd.batch_id
    WHERE CAST(t.college_id AS INTEGER) = $1;
  `, [collegeId]);

  const data = {
    totallyEnrolled: totallyEnrolled?.rows[0]?.count || 0,
    totallyCompleted: totallyCompleted?.rows[0]?.completed_trainings || 0,
    totallyStarted: totallyStarted?.rows[0]?.count || 0,
  };

  // await setCachedData(cacheKey, data);
  // console.log(`Cache set for key ${cacheKey}`);
  return data;
}

export async function getAssessments(collegeId) {
  if (!collegeId) return null;
  // const cacheKey = `assessments_${collegeId}`;
  // const cachedData = await getCachedData(cacheKey);
  // if (cachedData) {
  //   console.log(`Cache hit for key ${cacheKey}`);
  //   return cachedData;
  // }

  const result = await readPool.query(`
   select tt.name, count(user_id) from user_hackathon_participation uhp
   INNER JOIN "user" u on uhp.user_id = u.id
   INNER JOIN college c on u.college_id = c.id
   INNER JOIN hackathon h on uhp.hackathon_id = h.id
   INNER JOIN test_type tt on h.test_type_id = tt.id
   where c.id = $1
   group by tt.name
  `, [collegeId]);

  const data = result?.rows || [{ name: 'No Data', count: 0 }];

  // await setCachedData(cacheKey, data);
  // console.log(`Cache set for key ${cacheKey}`);
  return data;
}

export async function getAssessmentsPar(collegeId) {
  if (!collegeId) return null;
  // const cacheKey = `assessmentsPar_${collegeId}`;
  // const cachedData = await getCachedData(cacheKey);
  // if (cachedData) {
  //   console.log(`Cache hit for key ${cacheKey}`);
  //   return cachedData;
  // }

  const result = await readPool.query(`
    SELECT
      COUNT(CASE WHEN uhp.start_time >= CURRENT_DATE - INTERVAL '7 days' THEN uhp.user_id END) AS last_7_days_count,
      COUNT(CASE WHEN uhp.start_time >= CURRENT_DATE - INTERVAL '30 days' THEN uhp.user_id END) AS last_30_days_count,
      COUNT(CASE WHEN uhp.start_time >= CURRENT_DATE - INTERVAL '2 months' THEN uhp.user_id END) AS last_2_months_count
    FROM
      user_hackathon_participation uhp
    INNER JOIN
      "user" u ON uhp.user_id = u.id
    INNER JOIN
      college c ON u.college_id = c.id
    INNER JOIN
      hackathon h ON uhp.hackathon_id = h.id
    INNER JOIN
      test_type tt ON h.test_type_id = tt.id
    WHERE
      c.id = $1
      AND uhp.start_time IS NOT NULL
  `, [collegeId]);

  const data = result?.rows || [{
    last_7_days_count: 0,
    last_30_days_count: 0,
    last_2_months_count: 0
  }];

  // await setCachedData(cacheKey, data);
  // console.log(`Cache set for key ${cacheKey}`);
  return data;
}
export async function getTapTap(collegeId) {
  if (!collegeId) return null;
  // const cacheKey = `tapTap_${collegeId}`;
  // const cachedData = await getCachedData(cacheKey);
  // if (cachedData) {
  //   console.log(`Cache hit for key ${cacheKey}`);
  //   return cachedData;
  // }

  const { rows: lessonplan } =
    await readPool.query(`select lp.lesson_plan_type, count(*) from lesson_plan lp
    group by lp.lesson_plan_type
  `);

  const { rows: problems } =
    await readPool.query(`select type,count(*) from problem
    group by type
  `);

  const { rows: courses } =
    await readPool.query(`select COUNT(*) from course.course
  `);

  const data = {
    lessonplan: lessonplan || [{ lesson_plan_type: 'No Data', count: 0 }],
    problems: problems || [{ type: 'No Data', count: 0 }],
    courses: courses[0]?.count || 0,
  };

  // await setCachedData(cacheKey, data);
  // console.log(`Cache set for key ${cacheKey}`);
  return data;
}



async function fetchBatchCount(trainingId: number): Promise<number> {
  try {
    const response = await readPool.query(` SELECT COUNT(*) as count
      FROM report.batch_data bd
        INNER JOIN report.phase_batch pb on bd.batch_id = pb.batch_id
        INNER JOIN report.phase p on pb.phase_id = p.id
        INNER JOIN report.trainings t on p.training_id = t.id
      WHERE t.id = $1`, [trainingId]);
   

    const {rows:data}=response
    
    console.log('Batch count data:', data);
    return data[0].count;
  } catch (error) {
    console.error(`Error fetching batch count for training ${trainingId}:`, error);
    return 2123;
  }
}

export const getOngoingTrainings = async (collegeId: number) => {
  if (!collegeId) return null;

  try {
    const { rows } = await readPool.query(`
      SELECT *
      FROM report.trainings
      WHERE college_id = $1
      ORDER BY title;
    `, [collegeId]);

    const trainingsWithBatchCounts = await Promise.all(
      rows.map(async (training) => {
        const batchCount = await fetchBatchCount(training.id);
        return { ...training, batchCount };
      })
    );

    return trainingsWithBatchCounts;
  } catch (error) {
    console.error('Error fetching ongoing trainings:', error);
    throw error;
  }
};


export const getJobPosts = unstable_cache(
  async (collegeId: number) => {
    if (!collegeId) return null;

    try {
      const { rows } = await readPool.query(`
       SELECT COUNT(*) AS total_job_posts FROM job_post
      `);
      console.log(rows, "jobs post")


      return rows
    } catch (error) {
      console.error('Error fetching job posts:', error);
      throw error;
    }
  }, ['jobPosts'],
  { revalidate: 3600, tags: ['jobPosts'] }
);


export const fetchStudentsRecruitmentCount=unstable_cache(
  async (collegeId: number) => {
    if (!collegeId) return null;

    try {
      const query = `
    SELECT COUNT(jprs.student_id) AS recruitment_count
    FROM job_post_recruitment_status jprs
    INNER JOIN "user" u ON jprs.student_id = u.id
    INNER JOIN college c ON u.college_id = c.id
    WHERE c.id = $1`;
  const result = await readPool.query(query, [collegeId]);

  console.log(result.rows[0], "students recruitment")
      


      return result.rows[0];
    } catch (error) {
      console.error('Error fetching students recruitment:', error);
      throw error;
    }
  }, ['studentsRecruitment'],
  { revalidate: 3600, tags: ['studentsRecruitment'] }
);


export  const jobPostsbycompany=unstable_cache(
  async () => {


    try {
      const query = `
    SELECT c.name as company_title, COUNT(*) AS post_count
    FROM job_post jp
    INNER JOIN company c on jp.company_id = c.id
    GROUP BY company_title`;
  const result = await readPool.query(query);

  console.log(result.rows, "job post by company")
      


      return result.rows;
    } catch (error) {
      console.error('Error fetching job post by company:', error);
      throw error;
    }
  }, ['jobPostsByCompany'],
  { revalidate: 3600, tags: ['jobPostsByCompany'] }
);


export const jobPostsbyDrive=unstable_cache(
  async () => {


    try {
      const query = `
    SELECT
      c.name as company_title,
      SUM(CASE WHEN drive_type = 'BB Exclusive' THEN 1 ELSE 0 END) AS BBExclusive,
      SUM(CASE WHEN drive_type = 'Open Drive' THEN 1 ELSE 0 END) AS OpenDrives
    FROM
      job_post jp
      INNER JOIN company c on jp.company_id = c.id
    GROUP BY
      company_title`;
  const result = await readPool.query(query);

  console.log(result.rows, "job post by drive")
      


      return result.rows;
    } catch (error) {
      console.error('Error fetching job post by drive:', error);
      throw error;
    }
    
  },
  ['jobPostsByDrive'],  
  { revalidate: 3600, tags: ['jobPostsByDrive'] }
);