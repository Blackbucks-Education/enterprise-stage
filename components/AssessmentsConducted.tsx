"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { PencilLine, FolderOpen, Video, UserCheck, Target, Briefcase, BookOpen, Award, Code } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

const getIcon = (name: string) => {
  const icons = {
    'Daily Test': PencilLine,
    'Assignments': FolderOpen,
    'Live Trainings': Video,
    'Profiling Test': UserCheck,
    'Grand Test': Target,
    'Employability Test': Briefcase,
    'Projects': Code,
    'Placement Preparation': BookOpen,
    'Learn & Practice': BookOpen,
    'Hackathon': Award,
  }
  const IconComponent = icons[name] || PencilLine
  return <IconComponent className="w-5 h-5" />
}

type Assessment = {
  name: string
  count: string
}

export default function Component({ assessments }: { assessments: Assessment[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const totalAssessments = assessments.reduce((sum, item) => sum + parseInt(item.count), 0)
  const visibleAssessments = assessments.slice(0, 3)

  return (
    <Card className="bg-white w-full md:w-[48%] h-[22rem] flex flex-col">
      <CardHeader className="border-b ">
        <CardDescription className="font-semibold">Assessments conducted</CardDescription>
        <CardTitle className="text-lg text-opacity-70 font-semibold flex flex-col">
          {totalAssessments.toLocaleString()}
          <span className="text-sm text-gray-500">Total Assessments</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="border-b  p-0">
      
          <div className="p-4">
            <motion.div 
              className="flex items-center flex-wrap gap-4"
              layout
            >
              <AnimatePresence>
                {visibleAssessments.map((item, index) => (
                  <Card
                    key={item.name}
                    className="bg-gray-50 w-[10rem] h-[7.5rem] p-3 rounded-xl flex flex-col items-start justify-center text-center"
                   
                  >
                    {getIcon(item.name)}
                    <p className="text-lg font-semibold text-gray-800 mt-2">{parseInt(item.count).toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.name}</p>
                  </Card>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
       
      </CardContent>
      <CardContent className="pt-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="">
              View more details
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Assessment Details</DialogTitle>
              <DialogDescription>
                A comprehensive list of all assessments conducted.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-grow pr-4">
              <AnimatePresence>
                {assessments.map((item, index) => (
                  <motion.div
                    key={item.name}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex items-center gap-2">
                      {getIcon(item.name)}
                      <span>{item.name}</span>
                    </div>
                    <span className="font-semibold">{parseInt(item.count).toLocaleString()}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}