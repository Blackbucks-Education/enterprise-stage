'use client'

import React, { useState } from 'react'

import { Calendar, MapPin, Briefcase, DollarSign, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Button } from './ui/button'

// JobCard Component
const JobCard = ({ company, title, location, ctc, skills, date, logoUrl, drive_type }) => {
  return (
    <Card className="mb-4">
      <CardContent className="flex items-center p-6">
        <img
          src={logoUrl || '/placeholder.svg?height=50&width=50'}
          alt={`${company} logo`}
          className="w-12 h-12 rounded mr-4"
        />
        <div className="flex-grow">
          <h3 className="text-lg font-semibold">{company}</h3>
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location}</span>
          </div>
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>{ctc}</span>
          </div>
          <p className="mt-2 text-sm font-medium">Required Skills: {skills}</p>
        </div>
        <div className="text-right">
          <Badge variant="secondary" className="mb-2">{drive_type}</Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            <div>
              <p>{date}</p>
              <p>Last date for Application</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// SearchSection Component
const SearchSection = ({ onSearch }) => {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')

  const handleSearch = () => {
    onSearch({ title, location })
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Search Jobs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="search-title" className="block text-sm font-medium mb-1">Job Title</label>
          <Input
            id="search-title"
            placeholder="Search job title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="search-location" className="block text-sm font-medium mb-1">Location</label>
          <Input
            id="search-location"
            placeholder="Select the place"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <Button onClick={handleSearch} className="w-full">Search</Button>
      </CardContent>
    </Card>
  )
}

// Jobs Component
const Jobs = ({ company, jobs }) => {
  const [filteredJobs, setFilteredJobs] = useState(jobs)

  const handleSearch = ({ title, location }) => {
    const filtered = jobs.filter(job => 
      job.job_post_title.toLowerCase().includes(title.toLowerCase()) &&
      (job.employment_type + ' ' + job.office_mode).toLowerCase().includes(location.toLowerCase())
    )
    setFilteredJobs(filtered)
  }

  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <SearchSection onSearch={handleSearch} />
        </div>
        <div className="w-full md:w-3/4">
          <h2 className="text-2xl font-bold mb-6">
            Popular Careers with <span className="text-primary">{company.company_name}</span> Job Seekers
          </h2>
          {filteredJobs.length === 0 ? (
            <Card className="w-full max-w-md ">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 bg-primary/10 rounded-full p-3 w-12 h-12 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl font-semibold">No Jobs Found</CardTitle>
            </CardHeader>
            
          </Card>
          ) : (
            filteredJobs.map((job) => (
              <JobCard
                key={job.job_post_id}
                company={job.company_title}
                title={job.job_post_title}
                location={`${job.employment_type} | ${job.office_mode}`}
                ctc={job.salary_range_or_not_disclosed}
                skills="Technical Skills" // Replace with actual skills if available
                date={job.create_at}
                logoUrl={job.job_post_logo_url}
                drive_type={job.drive_type}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Jobs