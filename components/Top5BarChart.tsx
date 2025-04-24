"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { ScrollArea } from "./ui/scroll-area"
import { ArrowRight } from "lucide-react"

interface CompanyData {
  company_title: string
  post_count: number
}

interface JobPostsChartProps {
  data: CompanyData[]
  topAll: CompanyData[]
}

export default function JobPostsChart({ data, topAll }: JobPostsChartProps) {
  const maxPosts = Math.max(...data.map(item => item.post_count))

  return (
    <Card className="w-full max-w-md bg-white">
      <CardHeader className="flex flex-row items-center border-b justify-between space-y-0 pb-2">
        <CardTitle className="text-gray-500 font-[500] text-[15px]  ">Job Posts by Companies</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-sm text-muted-foreground hover:underline flex items-center">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>All Job Posts by Companies</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead className="text-right">Posts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topAll.map((item) => (
                    <TableRow key={item.company_title}>
                      <TableCell className="font-medium">{item.company_title}</TableCell>
                      <TableCell className="text-right">{item.post_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-3">
          {data.map((item) => (
            <div key={item.company_title} className="flex items-center">
              <div className="w-full max-w-[180px]">
                <div className="text-sm font-medium truncate">{item.company_title}</div>
                <div className="h-2 w-full bg-muted mt-1 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.company_title === 'Blackbucks Group' ? 'bg-[#CCFF00]' : 'bg-[#A5A6F6]'}`}
                    style={{ width: `${(item.post_count / maxPosts) * 100}%` }}
                  />
                </div>
              </div>
              <div className="ml-auto text-sm tabular-nums">{item.post_count}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}