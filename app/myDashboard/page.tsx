import {
  ArrowRight,
  Badge,
  Book,
  BookOpen,
  Briefcase,
  CalendarIcon,
  ClipboardMinus,
  FileText,
  LaptopMinimal,
  LayoutDashboard,
  List,
  MapPin,
  Plus,
  School,
  Star,
  Trophy,
  University,
  User,
  User2,
  Users,
  Users2,
  UserSearch,
  View,
  Waypoints,
} from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa6";
import EmployabilityChart from "../../components/EmployabilityChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { Calendar } from "../../components/calendar";
import CustomCalendar from "../../components/CustomCalendar";
import { Placements } from "../../components/Placements";
import Top100Table from "../../components/Top100Table";
import NumberTicker from "../../components/ui/number-ticker";
import VariousYearChart from "../../components/VariousYearChart";
import VariousBranchs from "../../components/VariousBranchs";
import { CompanyMarquee } from "../../components/CompanyMarquee";
import AssessmentsConducted from "../../components/AssessmentsConducted";
import { AssessmentsPar } from "../../components/AssessmentsPar";
import { Button, buttonVariants } from "../../components/ui/button";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { pool, readPool } from "../pool";
import Loading from "./loading";
import {
  convertToBranchData,
  generateChartDataAssessments,
  getTop3DataWithConfig,
} from "../utils";
import {
  fetchStudentsRecruitmentCount,
  getAssessments,
  getAssessmentsPar,
  getEnrollments,
  getJobPosts,
  getNoOfCandidates,
  getOngoingTrainings,
  getTapTap,
  getVariousBranches,
  getVariousYears,
  jobPostsbycompany,
  jobPostsbyDrive,
} from "../queries";
import UpComingEvents from "../../components/UpComingEvents";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import Top5BarChart from "../../components/Top5BarChart";
import { Drives } from "../../components/Drives";
import { Progress } from "../../components/ui/progress";
import { DashboardSmallCard } from "./_components/DashboardSmallCard";

function RadialProgress({ value }: { value: number }) {
  return (
    <div className="relative w-12 h-12">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-200 stroke-current"
          strokeWidth="10"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
        ></circle>
        <circle
          className="text-[#1DBF73] stroke-current"
          strokeWidth="10"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          strokeDasharray={`${value * 2.51}, 251.2`}
          transform="rotate(-90 50 50)"
        ></circle>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
        {value}%
      </span>
    </div>
  );
}

function getAcronym(phrase) {
  // Split the phrase into words
  const words = phrase.split(" ");

  // Filter out common small words like 'and', 'of', 'the', etc.
  const excludedWords = ["and", "or", "of", "the", "in", "to", "a", "an"];

  // Extract the first letter of each significant word
  const acronym = words
    .filter((word) => !excludedWords.includes(word.toLowerCase()))
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return acronym;
}

export default async function page() {
  const { value } = cookies().get("userAdminToken");
  let decoded;
  if (value) {
    // Decode the JWT token
    decoded = jwtDecode(value);
    console.log("decoded:", decoded);
  }

  const events = {
    "2024-07-04": ["Independence Day Celebration"],
    "2024-07-10": ["Client Meeting", "Project Deadline"],
    "2024-07-15": ["Team Lunch", "Workshop on New Tech"],
    "2024-07-22": ["Quarterly Review", "Product Launch Prep"],
    "2024-07-30": ["Training Session", "Networking Event"],

    "2024-08-05": ["Marketing Strategy Meeting", "Team Brainstorming Session"],
    "2024-08-10": ["Team Building Event"],
    "2024-08-12": ["Annual Report Review"],
    "2024-08-20": ["Company Picnic", "Product Demo"],
    "2024-08-25": ["Client Feedback Session", "Sales Team Meeting"],

    "2024-09-02": ["Labor Day Weekend"],
    "2024-09-08": ["Product Review", "Staff Meeting"],
    "2024-09-15": ["Conference Call with Partners", "Training Workshop"],
    "2024-09-21": ["Community Outreach Event"],
    "2024-09-30": ["Monthly Performance Review", "Team Outing"],

    "2024-10-01": ["Project Kickoff", "Team Retrospective"],
    "2024-10-08": [
      "Zoom Call with Design Team",
      "Orientation Session with New Hires",
    ],
    "2024-10-10": ["Annual Company Meeting", "Client Presentation"],
    "2024-10-15": ["Sales Strategy Review", "Product Brainstorming"],
    "2024-10-22": ["Employee Wellness Day", "Quarterly Financial Review"],
  };

  const currentDate = new Date();

  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const upcomingEvents = days
    .filter((day) => events[format(day, "yyyy-MM-dd")])
    .map((day) => ({
      date: format(day, "yyyy-MM-dd"),
      events: events[format(day, "yyyy-MM-dd")],
    }));

  const noOfCandidates = await getNoOfCandidates(decoded.college);
  const variousYears = await getVariousYears(decoded.college);

  // Additional data processing and logging
  console.log("Server-side log - various Years:", variousYears.rows);

  let maxEnrolled = 0;
  let secondMaxEnrolled = 0;
  let maxEnrolledItem = null;
  let enrolled;

  variousYears?.rows?.forEach((item) => {
    if (item == null || item.yop == null || item.yop === "Not Provided") {
      return; // Skip if item or yop is null or yop is "Not Provided"
    }

    if (enrolled > maxEnrolled) {
      secondMaxEnrolled = maxEnrolled; // Update second max before max
      maxEnrolled = enrolled;
      maxEnrolledItem = item;
    } else if (enrolled > secondMaxEnrolled) {
      secondMaxEnrolled = enrolled;
    }
  });

  let finalLargestEnrolled;

  if (
    maxEnrolledItem &&
    maxEnrolledItem.yop &&
    maxEnrolledItem.yop !== "Not Provided"
  ) {
    finalLargestEnrolled = maxEnrolledItem.yop;
  } else {
    finalLargestEnrolled = "Not Provided";
  }

  const variousBranches = await getVariousBranches(decoded.college);

  // Fallback if variousBranches or rows are undefined
  const dataBranches =
    variousBranches && Array.isArray(variousBranches) ? variousBranches : [];

  // Convert branch data using the mapping function
  const branchData = convertToBranchData(dataBranches);

  // Filter out invalid or 'Not Provided' branches and convert the candidate count to an integer
  const filteredSortedData = dataBranches
    .filter((item) => item.btechbranch && item.btechbranch !== "Not Provided")
    .map((item) => ({
      ...item,
      total_enrolled_candidates:
        parseInt(item.total_enrolled_candidates, 10) || 0, // Handle non-numeric values
    }))
    .sort((a, b) => b.total_enrolled_candidates - a.total_enrolled_candidates);

  // Ensure that there are at least 2 branches to slice
  const top2Branches =
    filteredSortedData.length >= 2
      ? filteredSortedData.slice(0, 2)
      : filteredSortedData;

  const collegeName = await readPool.query(
    "SELECT name FROM college WHERE id = $1",
    [decoded.college]
  );
  console.log(collegeName.rows[0].name, "college name");

  const { chartData, chartConfig } = getTop3DataWithConfig(variousYears);

  console.log(chartConfig, chartData, "chart config");

  const { totallyEnrolled, totallyCompleted, totallyStarted } =
    await getEnrollments(decoded.college);

  const enrolls = [
    {
      title: "Total Trainings",
      value: totallyEnrolled || 0,
      url: "",
    },
    {
      title: "Total Completed",
      value: totallyCompleted || 0,
      url: "https://res.cloudinary.com/diynkxbpc/image/upload/v1722510622/Layer_1_gkjknh.png",
    },
    {
      title: "Students Enrolled",
      value: totallyStarted || 0,
      url: "https://res.cloudinary.com/diynkxbpc/image/upload/v1722510648/Vector_7_fz7odw.png",
    },
  ];

  const assessments = await getAssessments(decoded.college);

  const { top3 } = generateChartDataAssessments(assessments);
   

  const assessmentsPar = await getAssessmentsPar(decoded.college);

  const { rows: hackathons } = await readPool.query(`
    SELECT
   COUNT(CASE WHEN h.test_type_id = 40 THEN 1 END) AS company_mocks,
   COUNT(CASE WHEN h.test_type_id = 36 THEN 1 END) AS skill_mocks,
   COUNT(CASE WHEN h.test_type_id = 6 THEN 1 END) AS employability_tests
FROM
   hackathon h;

`);

  const { lessonplan, problems, courses } = await getTapTap(decoded.college);
  const features = [
    {
      title: "Company Mock Papers",
      value: hackathons[0].company_mocks,
      url: "https://res.cloudinary.com/diynkxbpc/image/upload/v1729574062/Frame_1_ax3xhg.svg",
    },
    {
      title: "Employability Tests",
      value: hackathons[0].employability_tests,
      url: "https://res.cloudinary.com/diynkxbpc/image/upload/v1729574141/Frame_2_gfi5tv.svg",
    },
    {
      title: "Skill Mocks",
      value: hackathons[0].skill_mocks,
      url: "https://res.cloudinary.com/diynkxbpc/image/upload/v1729576190/Vector_9_qqi81f.png",
    },
    {
      title: "Lesson Plans",
      value: lessonplan[0].count,
      url: "https://res.cloudinary.com/diynkxbpc/image/upload/v1729574203/Vector_6_fgvffv.svg",
    },
    {
      title: "Courses",
      value: courses[0].count,
      url: "https://res.cloudinary.com/diynkxbpc/image/upload/v1729574238/Frame_kd9yki.png",
    },
    {
      title: "Coding Problems",
      value: problems[0].count,
      url: "https://res.cloudinary.com/diynkxbpc/image/upload/v1729574270/Frame_4_vjuxsc.svg",
    },
    {
      title: "Available Resume",
      value: 4,
      url: "https://res.cloudinary.com/diynkxbpc/image/upload/v1729574395/Frame_1_gudea2.png",
    },
  ];

  const onGoingTrainings = await getOngoingTrainings(decoded.college);

  console.log(onGoingTrainings, "onGoingTrainings");

  const sqlTotalParticipants = `
   SELECT rank 
      FROM report.profiling_rankings 
      WHERE college_id = $1
`;

  const resultTotalParticipants = await readPool.query(sqlTotalParticipants, [
    decoded.college,
  ]);
  let collegeRank: any = "Not available";
  if (resultTotalParticipants.rows.length == 0) {
    collegeRank = "Not available";
  } else {
    collegeRank = resultTotalParticipants.rows[0].rank || 0;
  }

  const sqlZeroScores = `
  WITH reports AS (
    SELECT round(avg(total_score), 2) AS average_employability_score
    FROM report.profiling_scores1
    INNER JOIN "user" u ON profiling_scores1.user_id = u.id
    INNER JOIN college c ON u.college_id = c.id
    WHERE c.id = $1
  ),
  rs AS (
    SELECT COUNT(*) AS zero_scorers
    FROM report.profiling_scores1
    INNER JOIN "user" u ON profiling_scores1.user_id = u.id
    INNER JOIN college c ON u.college_id = c.id
    WHERE c.id = $1 AND total_score = 0
  )
  SELECT
    reports.average_employability_score,
    rs.zero_scorers
  FROM reports, rs;
`;
  const resultZeroScores = await readPool.query(sqlZeroScores, [
    decoded.college,
  ]);
  let zeroScorers = 0;
  let avgEmpScore = 0;
  if (resultZeroScores.rows.length > 0) {
    zeroScorers = parseInt(resultZeroScores.rows[0].zero_scorers, 10);
    avgEmpScore = parseFloat(
      resultZeroScores.rows[0].average_employability_score
    );
  }

  const jobPosts = await getJobPosts(decoded.college);
  const studentsRecruitment = await fetchStudentsRecruitmentCount(
    decoded.college
  );
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).split('/').join('-');
};


  const jobPostsByCompany = await jobPostsbycompany();

  const top5Companies = jobPostsByCompany
    .sort((a, b) => parseInt(b.post_count) - parseInt(a.post_count)) // Sort by post_count as a number
    .slice(0, 5) // Take the top 5
    .map((company) => ({
      ...company,
      post_count: parseInt(company.post_count), // Convert post_count to an integer
    }));

  console.log(top5Companies, "top5Companies");
  const topAllCompanies = jobPostsByCompany
    .sort((a, b) => parseInt(b.post_count) - parseInt(a.post_count)) // Sort by post_count as a number
    .map((company) => ({
      ...company,
      post_count: parseInt(company.post_count), // Convert post_count to an integer
    }));

  const top5CompaniesConfig = {
    post_count: {
      label: "Post Count",
      color: "#a855f7",
    },
  } satisfies ChartConfig;

  const jobPostsbyDrives = await jobPostsbyDrive();
  console.log(jobPostsbyDrives, "jobPostsbyDrive");

  let totalBbexclusive = 0;
  let totalOpendrives = 0;

  jobPostsbyDrives.forEach((company) => {
    totalBbexclusive += parseInt(company.bbexclusive);
    totalOpendrives += parseInt(company.opendrives);
  });

  const drivesresult = [
    {
      id: 1,
      visitors: totalBbexclusive,
      browsers: "bbexclusive",
      fill: "#88EB4C",
    },
    {
      id: 2,
      visitors: totalOpendrives,
      browsers: "opendrives",
      fill: "#a855f7",
    },
  ];

  const drivesConfig = {
    visitors: {
      label: "Jobs",
    },
    bbexclusive: {
      label: "Total BB Exclusive",
      color: "#88EB4C",
    },
    opendrives: {
      label: "Total Open Drives",
      color: "#a855f7",
    },
  } satisfies ChartConfig;
  return (
    <Suspense fallback={<Loading />}>
      <div className="bg-[#D7D6D6]  min-h-screen md:p-8 p-5  ">
        <div className=" bg-white p-8 rounded-xl ">
          <div className="mt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center w-full space-y-4 sm:space-y-0">
            <div className="w-full sm:w-auto mb-4 sm:mb-0">
              <p className="text-base md:text-lg lg:text-xl flex items-center font-semibold truncate">
                <University className="mr-2 flex-shrink-0" />
                <span className="truncate">{collegeName.rows[0].name}</span>
              </p>
            </div>

            <div className="w-full sm:w-auto flex flex-wrap gap-2 sm:gap-3 items-center justify-start sm:justify-end">
              <Link
                className={buttonVariants({ variant: "dashboardmain", size: "sm" })}
                href="https://admin.hackathon.blackbucks.me/metLeaderboard/"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 mr-1.5"
                >
                  <path
                    d="M4.01262 10.556L5.42708 11.9705L8.60961 8.78797M5.42708 5.60544V3.62519C5.42708 2.83303 5.42708 2.43694 5.58124 2.13437C5.71685 1.86822 5.93323 1.65183 6.19938 1.51623C6.50195 1.36206 6.89804 1.36206 7.69021 1.36206H13.0652C13.8573 1.36206 14.2534 1.36206 14.556 1.51623C14.8221 1.65183 15.0385 1.86822 15.1741 2.13437C15.3283 2.43694 15.3283 2.83303 15.3283 3.62519V9.00014C15.3283 9.7923 15.3283 10.1884 15.1741 10.491C15.0385 10.7571 14.8221 10.9735 14.556 11.1091C14.2534 11.2633 13.8573 11.2633 13.0652 11.2633H11.0849M3.44683 15.5066H8.82178C9.61394 15.5066 10.0101 15.5066 10.3126 15.3525C10.5787 15.2169 10.7952 15.0005 10.9307 14.7344C11.0849 14.4318 11.0849 14.0357 11.0849 13.2435V7.86857C11.0849 7.0764 11.0849 6.68031 10.9307 6.37774C10.7952 6.11159 10.5787 5.89521 10.3126 5.7596C10.0101 5.60544 9.61394 5.60544 8.82178 5.60544H3.44683C2.65467 5.60544 2.25858 5.60544 1.95601 5.7596C1.68986 5.89521 1.47347 6.11159 1.33787 6.37774C1.1837 6.68031 1.1837 7.0764 1.1837 7.86857V13.2435C1.1837 14.0357 1.1837 14.4318 1.33787 14.7344C1.47347 15.0005 1.68986 15.2169 1.95601 15.3525C2.25858 15.5066 2.65466 15.5066 3.44683 15.5066Z"
                    stroke="#495F00"
                    strokeWidth="1.41446"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="hidden sm:inline">Shortlist Students</span>
                <span className="sm:hidden">Shortlist</span>
              </Link>

              <Link
                href="/tpCalendar"
                className={buttonVariants({ variant: "dashboardsecondary", size: "sm" })}
              >
                <svg
                  width="15"
                  height="17"
                  viewBox="0 0 15 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 mr-1.5"
                >
                  <path
                    d="M13.4701 7.0198H0.740021M9.934 1.36197V4.19089M4.27617 1.36197V4.19089M4.13472 15.5066H10.0754C11.2637 15.5066 11.8578 15.5066 12.3117 15.2753C12.7109 15.0719 13.0355 14.7473 13.2389 14.3481C13.4701 13.8942 13.4701 13.3001 13.4701 12.1119V6.17113C13.4701 4.98287 13.4701 4.38874 13.2389 3.93489C13.0355 3.53567 12.7109 3.21109 12.3117 3.00768C11.8578 2.77643 11.2637 2.77643 10.0754 2.77643H4.13472C2.94646 2.77643 2.35233 2.77643 1.89848 3.00768C1.49926 3.21109 1.17468 3.53567 0.971271 3.93489C0.740021 4.38874 0.740021 4.98287 0.740021 6.17113V12.1119C0.740021 13.3001 0.740021 13.8942 0.971271 14.3481C1.17468 14.7473 1.49926 15.0719 1.89848 15.2753C2.35233 15.5066 2.94646 15.5066 4.13472 15.5066Z"
                    stroke="#6050F7"
                    strokeWidth="1.41446"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="hidden sm:inline">T&P Calendar</span>
                <span className="sm:hidden">Calendar</span>
              </Link>

              <Link
                href="https://admin.hackathon.blackbucks.me/createJobPost/"
                className={buttonVariants({ variant: "dashboardsecondary", size: "sm" })}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 mr-1.5"
                >
                  <path
                    d="M8.60798 6.60536V12.2632M5.77907 9.43428H11.4369M5.63762 15.7993H11.5783C12.7666 15.7993 13.3607 15.7993 13.8146 15.5681C14.2138 15.3647 14.5384 15.0401 14.7418 14.6409C14.973 14.187 14.973 13.5929 14.973 12.4046V6.46391C14.973 5.27566 14.973 4.68153 14.7418 4.22768C14.5384 3.82845 14.2138 3.50388 13.8146 3.30046C13.3607 3.06921 12.7666 3.06921 11.5783 3.06921H5.63762C4.44936 3.06921 3.85523 3.06921 3.40138 3.30046C3.00216 3.50388 2.67758 3.82845 2.47417 4.22768C2.24292 4.68153 2.24292 5.27566 2.24292 6.46391V12.4046C2.24292 13.5929 2.24292 14.187 2.47417 14.6409C2.67758 15.0401 3.00216 15.3647 3.40138 15.5681C3.85523 15.7993 4.44936 15.7993 5.63762 15.7993Z"
                    stroke="#6050F7"
                    strokeWidth="1.41446"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="hidden sm:inline">Create job post</span>
                <span className="sm:hidden">Job Post</span>
              </Link>
            </div>
          </div>
          <div className="flex flex-col  md:flex-row gap-x-3">
            <div className="min-h-screen   w-full md:w-[75%]  mt-10 flex flex-col bg-white rounded-xl">
           

              <section className="flex flex-col md:flex-row gap-3  ">
                <Card className="w-full md:w-[42%]">
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg text-opacity-70 font-semibold"> Employability Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="flex mt-5 justify-start md:justify-start flex-wrap      gap-3 gap-y-4  items-center ">
                    

                    <DashboardSmallCard 
                      title="College Rank" 
                      children={
                        <>
                          <span className="text-[#7166e0] text-2xl">
                            {collegeRank}
                          </span>
                          <span>/648</span>
                        </>
                      } 
                    />



                  
                  <DashboardSmallCard 
                    title="Avg. Employability Score" 
                    children={
                      <>
                        <span className="text-[#7166e0] text-2xl">
                          {avgEmpScore}
                        </span>
                        <span>/100</span>
                      </>
                    }
                  />



                  </CardContent>
                </Card>




                <Card className="w-full md:w-[58%]">
                  <CardHeader className="flex   border-b flex-row items-center justify-between">
                    <CardTitle className="text-lg text-opacity-70 font-semibold">Trainings Insights</CardTitle>
                   
                    <Link
                        href={"/createTraining"}
                        className="h-6 px-3 inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  bg-[#ECEAFF] text-[#6050F7] hover:bg-[#ECEAFF]/80"
                      >
                        <span className=" flex items-center gap-x-2 ">
                          <Plus className="w-3 h-3" />
                          Create Training
                        </span>
                       
                      </Link>
                   
                  </CardHeader>
                  <CardContent className="mt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {enrolls.map((data, index) => (
                        <DashboardSmallCard 
                          key={index}
                          title={data?.title || ""} 
                          children={data.value > 0 ? <NumberTicker value={data.value} /> : 0} 
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              <div className="flex mt-5 justify-center md:justify-start flex-wrap    gap-3 gap-y-4  items-center w-[]">
                <Card className="  w-full  h-full    ">
                  <CardHeader className=" border-b flex flex-row items-center justify-between">
                    <CardTitle className="text-lg text-opacity-70 font-semibold">Jobs Insights</CardTitle>
                    <Link
                      href={"https://admin.hackathon.blackbucks.me/login/"}
                      className={buttonVariants({
                        variant: "dashboardsecondary",
                      })}
                    >
                      <span className="text-sm flex items-center gap-x-2 ">
                        <Plus className="w-4 h-4" />
                        Create Job Post
                      </span>
                    </Link>
                  </CardHeader>
                  <CardContent className=" flex mt-5 flex-col">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full mb-5 ">
                      <Drives
                        jobsCount={jobPosts[0].total_job_posts}
                        config={drivesConfig}
                        data={drivesresult}
                      />
                      <Top5BarChart
                        topAll={topAllCompanies}
                        data={top5Companies}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="   mt-5 w-full ">
                <CardHeader className=" border-b flex flex-row w-full justify-between items-center">
                  <CardTitle className="text-lg text-opacity-70 font-semibold">Employability</CardTitle>
                
                    <Link
                      href={"/employabilityReport"}
                      className={buttonVariants({ variant: "dashboardmain" })}
                    >
                      <span className="text-sm flex items-center gap-x-2 ">
                        <ClipboardMinus className="w-4 h-4" />
                        View Employability Report
                      </span>
                    
                    </Link>
                  
                </CardHeader>

                <CardContent className="">
                  <EmployabilityChart />
                </CardContent>
              </Card>
              <Card className="w-full mt-5">
                <CardHeader className="flex  border-b flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg text-opacity-70 font-semibold">
                    Training Status
                  </CardTitle>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white"
                    asChild
                  >
                    <Link href="/trainingsDashboard">View All</Link>
                  </Button>
                </CardHeader>
                <CardContent className="mt-3">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {onGoingTrainings.map((training) => (
                      <Card
                        key={training.id}
                        className="bg-white overflow-hidden relative"
                      >
                        
                        <CardContent className="p-2">
                          <div className="p-2 pt-8">
                            <h3 className="text-lg font-semibold mb-2">
                              {training.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                              {formatDate(training.start_date)} to{" "}
                              {formatDate(training.end_date)}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                              <Users className="mr-2 h-4 w-4" />
                              <span>{training.batchCount} Students</span>
                            </div>
                          </div>
                          <div className=" ">
                            <Button
                              variant="secondary"
                              size="sm"
                              asChild
                              className="bg-white"
                            >
                              <Link href={`/trainingReport?id=${training.id}`}>
                                <FileText className="mr-2 h-4 w-4" />
                                View Report
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

             
            </div>

            <div className="min-h-screen w-full mt-10  md:w-[25%]">
              <CustomCalendar />
            </div>
          </div>
          <Card className="mt-5 pb-10">
                <CardHeader className="border-b font-bold">
                  <CardTitle className="text-lg text-opacity-70 font-semibold">Students Overview</CardTitle>
                </CardHeader>
                <CardContent className="flex mt-5 mb-5 flex-wrap  min-h-[350px]   gap-3 gap-y-4  items-start w-full">
                  <VariousYearChart
                    chartData={chartData}
                    chartConfig={chartConfig} 
                    /> 
                    <VariousBranchs branchData={branchData} />
                     
                    
                
                </CardContent>
              
              </Card>
              <div className="hidden">
                <CompanyMarquee />
              </div>

              <div className="hidden flex-col mt-5 ">
                <Placements />
              </div>

              <Card className=" mt-5  ">
                <CardHeader className="flex border-b flex-row items-center justify-between">
                  <CardTitle className="text-lg text-opacity-70 font-semibold">Assessments</CardTitle>
               
                    
                 
                </CardHeader>
                <CardContent className="flex mt-5  min-h-[400px]  flex-wrap  gap-3 gap-y-4  items-start w-full">
                  <AssessmentsConducted
                   assessments={top3}
                  />
                  <AssessmentsPar
                    totalTests={assessmentsPar[0].last_2_months_count}
                  />
                </CardContent>
              </Card>

              <Card className=" mt-5">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg text-opacity-70 font-semibold"> About TapTap</CardTitle>
                </CardHeader>

                <CardContent className="flex mt-5  flex-wrap justify-center md:justify-start  gap-3 gap-y-4  items-start w-full">                  {features.map((data, index) => (
                    <Card
                      className=" w-[9.5rem] h-[7.7rem] bg-white "
                      key={index}
                    >
                      <CardHeader>
                        <CardDescription className="w-4 h-4 bg-opacity-85 rounded-xl"> 
                        
                            <img  src={data.url} alt="" />
                        
                          </CardDescription>
                        <CardTitle className="text-xl   items-center gap-x-2 ">
                         
                          {data.value > 0 ? (
                            <NumberTicker value={data.value} />
                          ) : (
                            0
                          )}
                          <hr  className="w-0"/>
                           <p className="text-sm font-normal text-gray-500 mb-4">
                          {data?.title || ""}
                        </p>
                        </CardTitle>
                      </CardHeader>
                     
                    </Card>
                  ))}
                </CardContent>
              </Card>
              <div className="flex flex-col mt-5 ">
                <Card className="bg-secondary">
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg text-opacity-70 font-semibold">TOP 100 - Employability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Top100Table />
                  </CardContent>
                </Card>
              </div>
        </div>
      </div>
    </Suspense>
  );
}

