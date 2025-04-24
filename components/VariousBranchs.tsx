
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { FolderOpen } from "lucide-react";

export default function VariousBranches({ branchData }) {
  return (
    <Card className="md:w-[49%]  bg-white h-[25rem] w-full">
      <CardHeader className="border-b">
        <CardDescription className="font-semibold text-lg">
        Students by Branch
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-5  ">
        {branchData && branchData.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-7 gap-y-7 w-full">
            {branchData.map((data) => (
              <div
                key={data.branch}
                className="flex w-full flex-col justify-center gap-y-2"
              >
                <p className="text-sm font-semibold">
                  {data.branch !== "CSE - Artificial Intelligence and Machine Learning" ? data.branch : "CSE-AIML"} |
                  <span className="text-sm font-normal text-[#2D3748] opacity-80">
                    {" "}
                    {parseInt(data.value)}
                  </span>
                </p>
                <Progress value={data.percentage} className="w-[100%]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No branch data available</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">
              There's currently no data to display for various branches. Check back later for updates.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}