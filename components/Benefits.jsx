'use client'

import { Heart, Home, DollarSign, Gift, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"



export default function Benefits({ company }) {
  const benefits= [
    { icon: Heart, title: "Health Care & Insurance", items: company.health_care_insurance },
    { icon: Home, title: "Family & Parenting", items: company.family_parenting },
    { icon: DollarSign, title: "Financial & Retirement", items: company.financial_retirement },
    { icon: Gift, title: "Perks & Benefits", items: company.perks_benefits },
    { icon: Calendar, title: "Vacation & Time Off", items: company.vacation_time_off },
  ]

  return (
    <div className="container mx-auto px-4 mt-5 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Benefits at {company.company_name}
      </h1>
      <p className="text-gray-600 ">Explore the comprehensive benefits package offered to employees.</p>
      <div className="grid grid-cols-1 mt-8 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit) => (
          <Card key={benefit.title} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="flex items-center space-x-2 text-lg font-semibold">
                <benefit.icon className="h-5 w-5 text-purple-500" />
                <span>{benefit.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="space-y-2">
                {benefit.items.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Badge 
                      variant="destructive" 
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                    >
                      {item
                        .split("_")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}