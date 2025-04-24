'use client'

import React, { useState, Suspense } from "react"
import Link from "next/link"
import { ExternalLink, Calendar, Building, FileText, HelpCircle, BookOpen, MapPin, Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Skeleton } from "./ui/skeleton"
import { ErrorBoundary } from "react-error-boundary"



interface Company {
  company_name: string
  company_website: string | null

  industry_type: string | null
  headquarters: string | null
  company_founded_year: number | null
  about_company: string | null
  interview: string | null
  pattern: string | null
  companymockpapers: string | null
  companyquestions: string | null
  specialties: string | null
}

interface Module {
  name: string
  content: string
}

const InfoBadge: React.FC<{ icon: React.ReactNode; value: React.ReactNode }> = ({ icon, value }) => (
  <Badge variant="secondary" className="flex items-center space-x-1 px-2 py-1">
    {icon}
    <span>{value || 'N/A'}</span>
  </Badge>
)

const TabContent: React.FC<{ title: string; content: string | null | Module[] }> = ({ title, content }) => (
  <Card className="mt-4">
    <CardHeader>
      <CardTitle className="text-xl font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {Array.isArray(content) ? (
        <Accordion type="single" collapsible className="w-full">
          {content.map((module, index) => (
            <AccordionItem key={index} value={`module-${index}`}>
              <AccordionTrigger>{module.name}</AccordionTrigger>
              <AccordionContent>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: module.content }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : content ? (
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <p className="text-muted-foreground">No information available.</p>
      )}
    </CardContent>
  </Card>
)

const LoadingFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
  </div>
)

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="text-center p-4 bg-red-100 text-red-800 rounded-md">
    <h2 className="text-lg font-semibold">Oops! Something went wrong.</h2>
    <p className="text-sm">{error.message}</p>
  </div>
)

export default function CompanyOverview({ company }: { company: Company }) {
  const [activeTab, setActiveTab] = useState<string>("about")

  const parsePattern = (pattern: any): Module[] => {
    if (!pattern) return []
    try {

      

     console.log(pattern,"pattern");

    return pattern;

   
    } catch {

      console.log("pattern is not valid json");
      return [{ name: "Pattern", content: pattern }]
    }
  }

  const tabs = [
    { id: "about", label: "About", icon: <Building className="h-4 w-4 text-purple-500" />, content: company.about_company },
    { id: "interview", label: "Interview", icon: <Briefcase className="h-4 w-4 text-purple-500" />, content: company.interview },
    { id: "pattern", label: "Pattern", icon: <FileText className="h-4 w-4 text-purple-500" />, content: parsePattern(company.pattern) },
    { id: "questions", label: "Questions", icon: <HelpCircle className="h-4 w-4 text-purple-500" />, content: null },
  ]

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingFallback />}>
        <div className="  space-y-6 mt-3">
         
        <Card className="w-full  ">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h2 className="text-xl text-gray-500" dangerouslySetInnerHTML={{__html: company.about_company}}></h2>
        </div>
        <div>
          <h3 className=" font-semibold">Industry Type</h3>
          <p  className="text-sm text-gray-400">{company.industry_type || 'Industry not specified'}</p>
        </div>
        <div>
          <p className=" font-semibold">Founded Year</p>
          <p className="text-sm text-gray-400">{company.company_founded_year ? `${company.company_founded_year}` : null}</p>
        </div>
        <div>
          <h3 className=" font-semibold">Specialties</h3>
          <p className="text-sm text-gray-400">{company.specialties || 'No specialties listed'}</p>
        </div>
      
      </CardContent>
    </Card>
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}