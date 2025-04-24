"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { columns } from './columns';
import { DataTable } from './data-table';

interface Student {
  image?: string;
  first_name: string;
  email: string;
  total_score: number;
  aptitude: number;
  english: number;
  coding: number;
  employability_band: string;
  possible_employability_band: string;
  aptitude_improvement_suggestions: string;
  english_improvement_suggestions: string;
  technical_improvement_suggestions: string;
}

const defaultTop100Data: Student[] = [
  {
    image: "https://lh3.googleusercontent.com/a/ACg8ocKzW2l8cXfs_31pQyjrXVcp8eotMzZ25daQQ_KYbL_uX1Yuuw=s96-c",
    first_name: "Madhu",
    email: "212g1a3945@gmail.com",
    total_score: 80,
    aptitude: 82,
    english: 53,
    coding: 93,
    employability_band: "A++",
    possible_employability_band: "A++",
    aptitude_improvement_suggestions: "Practise Easy level",
    english_improvement_suggestions: "Practise Medium level Grammar+LSRW.",
    technical_improvement_suggestions: "Learn Python. Practise Easy and Medium level questions."
  },
  {
    image: "https://lh3.googleusercontent.com/a/ACg8ocKhyRLhMr-N7gHKYTynvYojDeV18z34vjyuPMF2NMqQ=s96-c",
    first_name: "Nani",
    email: "212g1a0418@gmail.com",
    total_score: 79,
    aptitude: 80,
    english: 35,
    coding: 100,
    employability_band: "A",
    possible_employability_band: "A++",
    aptitude_improvement_suggestions: "Practise Easy level",
    english_improvement_suggestions: "Practise Difficult level Grammar+LSRW.",
    technical_improvement_suggestions: "Learn Python. Practise Easy and Medium level questions."
  },
  {
    image: "https://blackbucks-media.s3.ap-south-1.amazonaws.com/P Akhila photo pdf-1723791670031.jpg",
    first_name: "PALLAVALA AKHILA",
    email: "pallaakhila2004@gmail.com",
    total_score: 78,
    aptitude: 70,
    english: 45,
    coding: 100,
    employability_band: "B",
    possible_employability_band: "A++",
    aptitude_improvement_suggestions: "Practise Easy and Medium level",
    english_improvement_suggestions: "Practise Difficult level Grammar+LSRW.",
    technical_improvement_suggestions: "Learn Python. Practise Easy and Medium level questions."
  },
  {
    image: "https://lh3.googleusercontent.com/a/ACg8ocKkCFKu8JQStiu0yJq2Wm5AV3SyQ032vnZa8j3iO-wQ73SRoA=s96-c",
    first_name: "Avula",
    email: "avuladeepti77@gmail.com",
    total_score: 77,
    aptitude: 77,
    english: 50,
    coding: 91,
    employability_band: "A+",
    possible_employability_band: "A++",
    aptitude_improvement_suggestions: "Practise Easy and Medium level",
    english_improvement_suggestions: "Practise Medium level Grammar+LSRW.",
    technical_improvement_suggestions: "Learn Python. Practise Easy and Medium level questions."
  },
  {
    image: "https://lh3.googleusercontent.com/a/ACg8ocKoe2cs2vJMVudvIHW7VkRrA5Gy6phhTCxN7VN0FlmpzsWYtg=s96-c",
    first_name: "Bhavya Sree",
    email: "bhavyasree258025@gmail.com",
    total_score: 77,
    aptitude: 77,
    english: 51,
    coding: 91,
    employability_band: "A+",
    possible_employability_band: "A++",
    aptitude_improvement_suggestions: "Practise Easy and Medium level",
    english_improvement_suggestions: "Practise Medium level Grammar+LSRW.",
    technical_improvement_suggestions: "Learn Python. Practise Easy and Medium level questions."
  },
  {
    image: null,
    first_name: "Mandi Umar Farooq",
    email: "212g1a0441@alits.ac.in",
    total_score: 72,
    aptitude: 73,
    english: 40,
    coding: 86,
    employability_band: "B",
    possible_employability_band: "A++",
    aptitude_improvement_suggestions: "Practise Easy and Medium level",
    english_improvement_suggestions: "Practise Difficult level Grammar+LSRW.",
    technical_improvement_suggestions: "Learn Java+SQL. Practise Medium and Difficult level questions"
  },
  {
    image: "https://lh3.googleusercontent.com/a/ACg8ocIANcTKRi_L5hFL124hBvkAmLpsLd3dpZFwMzf3tEDN=s96-c",
    first_name: "Thallam Yaswanth Ram",
    email: "yaswanthramthallam@gmail.com",
    total_score: 68,
    aptitude: 67,
    english: 35,
    coding: 86,
    employability_band: "B",
    possible_employability_band: "A++",
    aptitude_improvement_suggestions: "Practise Easy and Medium level",
    english_improvement_suggestions: "Practise Difficult level Grammar+LSRW.",
    technical_improvement_suggestions: "Learn Java+SQL. Practise Medium and Difficult level questions"
  },
  {
    image: "https://lh3.googleusercontent.com/a/ACg8ocLSBX3NNCX58dbZxAC5JojL_Yp85ArJ09FcEvYkTyxlXFBQSw=s96-c",
    first_name: "Dawood",
    email: "darlingarsh143@gmail.com",
    total_score: 67,
    aptitude: 50,
    english: 53,
    coding: 86,
    employability_band: "B",
    possible_employability_band: "A++",
    aptitude_improvement_suggestions: "Practise Medium+Difficult level",
    english_improvement_suggestions: "Practise Medium level Grammar+LSRW.",
    technical_improvement_suggestions: "Learn Java+SQL. Practise Medium and Difficult level questions"
  },
  {
    image: "https://lh3.googleusercontent.com/a/ACg8ocKNbFwILVx344dBfe0kpGvheXPbS5MV7HAkGqCo7_1i=s96-c",
    first_name: "Bhavya Sree",
    email: "212g1a0241@gmail.com",
    total_score: 67,
    aptitude: 83,
    english: 50,
    coding: 63,
    employability_band: "A",
    possible_employability_band: "A++",
    aptitude_improvement_suggestions: "Practise Easy level",
    english_improvement_suggestions: "Practise Medium level Grammar+LSRW.",
    technical_improvement_suggestions: "Learn DSA+SQL. Practise Difficulty level questions"
  },
  {
    image: "https://lh3.googleusercontent.com/a/ACg8ocKsboOhP4xFekYNjV6BrE-6s4bgl20u1C0zm5g2eUBh=s96-c",
    first_name: "Vanagani Kavya",
    email: "212g1a0561@gmail.com",
    total_score: 66,
    aptitude: 37,
    english: 40,
    coding: 100,
    employability_band: "C",
    possible_employability_band: "A+",
    aptitude_improvement_suggestions: "Practise Difficult level",
    english_improvement_suggestions: "Practise Difficult level Grammar+LSRW.",
    technical_improvement_suggestions: "Learn Python. Practise Easy and Medium level questions."
  }
];

const Top100Table: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(defaultTop100Data); // Initialize with default data
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(students.length / rowsPerPage);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get<Student[]>('api/emp_student_results/top100');
        if (response.data.length > 0) {
          setStudents(response.data);
        } else {
          setStudents(defaultTop100Data);
          document.getElementById("data-table-container").style.opacity = "0.5";
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        setStudents(defaultTop100Data); // Set default data on error
        document.getElementById("data-table-container").style.opacity = "0.5";
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="container mx-auto py-10" id='data-table-container'>
      <DataTable columns={columns} data={students} />
    </div>
  );
};

export default Top100Table;
