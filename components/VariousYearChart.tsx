"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import { PieChartIcon } from "lucide-react";

interface ChartDataItem {
  browser: string;
  students: number;
  fill: string;
}

interface VariousYearChartProps {
  chartData: ChartDataItem[];
  chartConfig: ChartConfig;
}

export default function VariousYearChart({
  chartData,
  chartConfig,
}: VariousYearChartProps) {
  const totalStudents =
    chartData?.reduce((acc, data) => acc + data.students, 0) || 0;

  return (
    <Card className=" bg-white w-full md:w-[48%] pb-36 h-[25rem]"> 
      <CardHeader className="border-b">
        <CardDescription className="  text-base font-semibold ">
          Students by Year
        </CardDescription>
        <CardTitle>
          <p className="text-lg font-semibold text-gray-900">{totalStudents}
          <span className="text-sm font-medium text-gray-700">
            {" "}
            Total Students
          </span>
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 ">
        {chartData && chartData.length > 0 ? (
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="w-full lg:w-1/2 aspect-square max-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer config={chartConfig}>
                  <PieChart>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          //@ts-ignore
                          valueFormatter={(value) =>
                            `${value} students (${(
                              (value / totalStudents) *
                              100
                            ).toFixed(1)}%)`
                          }
                        />
                      }
                    />
                    <Pie
                      data={chartData}
                      dataKey="students"
                      nameKey="browser"
                      innerRadius="50%"
                      outerRadius="80%"
                      paddingAngle={2}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col items-start gap-3">
              {chartData.map((data) => (
                <div
                  key={data.browser}
                  className="w-full rounded-lg bg-gray-100 p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: data.fill }}
                    />
                    <p className="text-sm font-medium text-gray-700">
                      {data.browser}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {data.students}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <PieChartIcon className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">
              No year data available
            </h3>
            <p className="text-sm text-gray-500 mt-2 max-w-[250px]">
              There's currently no data to display for various years. Check back
              later for updates.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
