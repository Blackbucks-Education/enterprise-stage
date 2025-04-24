"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";

export function Drives({
  jobsCount = 100,
  config,
  data,
}: {
  jobsCount: any;
  config: ChartConfig;
  data: any;
}) {


  
  return (
    <Card className="flex w-[400px] flex-col bg-white">
      <CardHeader className="border-b">
        <CardDescription>Open Drives vs BB Exclusive</CardDescription>
        <CardTitle className="text-lg font-semibold text-opacity-70">
          {jobsCount} <span className="text-base font-normal text-muted-foreground">Total Job posts</span>
        </CardTitle>
      </CardHeader>
      <CardContent >
        {/* <ChartContainer config={config} className="  mt-5 max-h-[250px]">
         
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="visitors"
              nameKey="browsers"
              innerRadius="50%"
              outerRadius="80%"
              paddingAngle={2}
            />
           
            
          </PieChart>

          
        </ChartContainer> */}


<div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="w-full lg:w-1/2 aspect-square max-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer config={config}>
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={data}
                      dataKey="visitors"
                      nameKey="browsers"
                      innerRadius="50%"
                      outerRadius="80%"
                      paddingAngle={2}
                    />
                  </PieChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col items-start gap-3">
              {data.map((value) => (
                <div
                  key={value.browsers}
                  className="w-full rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: value.fill }}
                    />
                    <p className="text-sm font-medium text-gray-700">
                      {value.browsers}
                    </p>
                  </div>
                 
                </div>
              ))}
            </div>
          </div>
      </CardContent>
    </Card>
  );
}
