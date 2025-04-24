"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";

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

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "image",
    header: "Avatar",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-center">
        <img
          src={
            row.getValue("image") ? row.getValue("image") : "img/sidebar logo.png"
          }
          className="h-7 w-7 rounded-full object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return <div className="text-center">First Name</div>;
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("first_name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "total_score",
    header: "Total Score",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("total_score")}</div>
    ),
  },
  {
    accessorKey: "aptitude",
    header: "Aptitude",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("aptitude")}</div>
    ),
  },
  {
    accessorKey: "english",
    header: "English",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("english")}</div>
    ),
  },
  {
    accessorKey: "coding",
    header: "Coding",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("coding")}</div>
    ),
  },
  {
    accessorKey: "employability_band",
    header: "Employability Band",
    cell: ({ row }) => {
      const band = row.getValue("employability_band") as string
      let badgeColor = "";

      switch (band) {
        case "A++":
          badgeColor = "bg-[#EFF8FF] border-[#B2DDFF]  text-[#175CD3]";
          break;
        case "A+":
          badgeColor = "bg-[#EEF4FF] border-[#C7D7FE] text-[#3538CD]";
          break;
        case "A":
          badgeColor = "bg-[#F5F1FF] border-[#CAB7FE] text-[#8C63FF]";
          break;
        case "B":
          badgeColor = "bg-[#F9F5FF] text-[#6941C6] border-[#E9D7FE]";
          break;
        case "C":
          badgeColor = "bg-[#FFFAF5] border-[#FFE6CE] text-[#F08455]";
          break;
        case "F":
          badgeColor = "bg-[#FFF5F5] text-[#ED6666] border-[#FFDBDB]";
          break;
        default:
          badgeColor = "bg-gray-300 text-black";
      }

      return (
        <div className="text-center">
          <span className={`px-3 py-1 rounded-full border-[1px] text-xs ${badgeColor}`}>
            {band}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "possible_employability_band",
    header: "Possible Employability Band",
    cell: ({ row }) => {
      const possibleBand = row.getValue("possible_employability_band") as string;
      let badgeColor = "";

      switch (possibleBand) {
        case "A++":
          badgeColor = "bg-[#EFF8FF] border-[#B2DDFF]  text-[#175CD3]";
          break;
        case "A+":
          badgeColor = "bg-[#EEF4FF] border-[#C7D7FE] text-[#3538CD]";
          break;
        case "A":
          badgeColor = "bg-[#F5F1FF] border-[#CAB7FE] text-[#8C63FF]";
          break;
        case "B":
          badgeColor = "bg-[#F9F5FF] text-[#6941C6] border-[#E9D7FE]";
          break;
        case "C":
          badgeColor = "bg-[#FFFAF5] border-[#FFE6CE] text-[#F08455]";
          break;
        case "F":
          badgeColor = "bg-[#FFF5F5] text-[#ED6666] border-[#FFDBDB]";
          break;
        default:
          badgeColor = "bg-gray-300 text-black";
      }

      return (
        <div className="text-center">
          <span className={`px-3 border-[1px] py-1 rounded-full text-xs  ${badgeColor}`}>
            {possibleBand}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "aptitude_improvement_suggestions",
    header: "Aptitude Improvement Suggestions",
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("aptitude_improvement_suggestions")}
      </div>
    ),
  },
  {
    accessorKey: "english_improvement_suggestions",
    header: "English Improvement Suggestions",
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("english_improvement_suggestions")}
      </div>
    ),
  },
  {
    accessorKey: "technical_improvement_suggestions",
    header: "Technical Improvement Suggestions",
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("technical_improvement_suggestions")}
      </div>
    ),
  },
];
