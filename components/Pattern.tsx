"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";

interface PatternItem {
  name: string;
  content: string;
}

interface Company {
  company_name: string;
  company_website: string | null;
  industry_type: string | null;
  headquarters: string | null;
  company_founded_year: number | null;
  about_company: string | null;
  interview: string | null;
  pattern: PatternItem[] | null;
  companymockpapers: string | null;
  companyquestions: string | null;
  specialties: string | null;
}

export default function Pattern({ company }: { company: Company }) {
  const [activeTab, setActiveTab] = useState(company.pattern?.[0]?.name || "");

  if (!company.pattern || company.pattern.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No pattern information available.
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl p-4">
      <Card className="mb-4">
        <CardContent className="p-6 ">
          <h3 className="text-xl font-semibold mb-2">
            {company.company_name} Interview Syllabus
          </h3>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: company.companymockpapers }}
          />
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">
        {company.company_name} Interview Pattern
      </h2>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Carousel className="w-full  mb-4">
          <CarouselContent>
            {company.pattern.map((item, index) => (
              <CarouselItem
                key={item.name}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              >
                <Button
                  variant={activeTab === item.name ? "default" : "outline"}
                  onClick={() => setActiveTab(item.name)}
                  className="w-full"
                >
                  {item.name}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-2" />
          <CarouselNext />
        </Carousel>
        {company.pattern.map((item) => (
          <TabsContent key={item.name} value={item.name}>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
