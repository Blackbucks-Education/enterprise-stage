import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Company {
  company_name: string;
  company_website: string | null;
  industry_type: string | null;
  headquarters: string | null;
  company_founded_year: number | null;
  about_company: string | null;
  interview: string | null;
  pattern: string | null;
  companymockpapers: string | null;
  companyquestions: string | null;
  specialties: string | null;
}

export default function Interview({ company }: { company: Company }) {
  return (
    <Card className="mt-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Interview Experience at {company.company_name}
        </CardTitle> 
      </CardHeader>
      <CardContent dangerouslySetInnerHTML={{__html: company.interview}}></CardContent>
    </Card>
  );
}
