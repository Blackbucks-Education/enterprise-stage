import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

interface DashboardSmallCardProps {
  title?: string;
  children?: React.ReactNode;
}

export const DashboardSmallCard = ({
  title,
  children,
}: DashboardSmallCardProps) => {
  return (
    <Card className=" bg-white w-[9.375rem]   h-[6rem]">
      <CardHeader >
        <CardDescription className="text-[0.84rem] truncate leading-[1.1rem] font-[500]">
          {title}
        </CardDescription>
        <CardTitle className="text-lg ">{children}</CardTitle>
      </CardHeader>
    </Card>
  );
};
