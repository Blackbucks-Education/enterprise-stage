'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { Card, CardContent, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import { CalendarIcon, UsersIcon, EyeIcon, Loader2Icon, FileIcon, VideoIcon, TrophyIcon } from "lucide-react"
import { Skeleton } from "./ui/skeleton"

interface Hackathon {
  id: number;
  title: string;
  name: string;
  host_organization_image: string;
  file: string;
  video: string;
  mcq: string;
  subjective: string;
  participation: string;
}

interface HackathonResponse {
  hackathons: Hackathon[];
  nextPage: number | null;
  totalPages: number;
}

function HackathonSkeleton() {
  return (
    <Card className="w-full bg-card mb-4">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  )
}

export default function Questions({ companyId }) {
  const { ref, inView } = useInView()

  const fetchHackathons = async ({ pageParam = 0 }): Promise<HackathonResponse> => {
    const response = await fetch(`/api/mockpapers/${companyId}?page=${pageParam}&limit=3`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['hackathons', companyId],
    queryFn: fetchHackathons,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  if (status === 'pending') {
    return (
      <div className="space-y-4 p-4">
        <h1 className="text-2xl font-bold mb-4">Mock Papers</h1>
        {[...Array(3)].map((_, index) => (
          <HackathonSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (status === 'error') {
    return <p className="text-red-500">Something went wrong. Please try again later.</p>
  }

  return (
    <div className="space-y-4 p-4">

      {data.pages.map((page, i) => (
        <div key={i}>
          {page.hackathons.map((hackathon) => (
            <Card key={hackathon.id} className="w-full bg-card mb-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer hover:border hover:border-secondary-500" style={{ boxShadow: '0px 0px 10px rgba(0, 0, 6, 0.125)' }}>
              <CardContent className="px-4 py-2">
                <div className="flex items-center justify-between mb-2 mt-3 gap-2">
                  <div className="flex items-center space-x-6">
                    <img
                      src={hackathon.host_organization_image}
                      alt={`${hackathon.name} logo`}
                      className="w-16 h-16 object-cover rounded-full border-2 border-primary"
                    />
                    <div>
                      <h2 className="text-base font-bold">{hackathon.title}</h2>
                      <p className="text-muted-foreground text-sm"> {hackathon.name} Mock Paper</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                  {hackathon.file !== '0' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <FileIcon className="w-3 h-3" /> {hackathon.file} Files 
                    </Badge>
                  )}
                  {hackathon.video !== '0' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <VideoIcon className="w-3 h-3" /> {hackathon.video} Videos 
                    </Badge>
                  )}
                  {hackathon.mcq !== '0' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {hackathon.mcq} MCQs 
                    </Badge>
                  )}
                  {hackathon.subjective !== '0' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {hackathon.subjective} Subjective 
                    </Badge>
                  )}

                  <CardFooter className="bg-muted/50 py-3 px-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <UsersIcon className="w-4 h-4 mr-2" />
                      {hackathon.participation} Participants
                    </div>
                  </CardFooter>
                </div>
              </div>

                    
                  </div>
                  {/* <div className="flex items-center space-x-4">
                  <img src="https://res.cloudinary.com/diynkxbpc/image/upload/v1726429179/svgviewer-output_2_tpiu81.svg" alt="trophy" className="w-20 h-20 border border-t-[#D3FB52] border-t-4 rounded-xl  p-3" />
                  <img src="https://res.cloudinary.com/diynkxbpc/image/upload/v1726429016/svgviewer-output_1_dwgrwe.svg" alt="certificate" className="w-20 h-20 border border-t-[#D3FB52] border-t-4 rounded-xl  p-3" />  
                  </div> */}

                 
                </div>
                
              </CardContent>
              
            </Card>
          ))}
        </div>
      ))}
      <div ref={ref} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && (
          <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
        )}
      </div>
      {!hasNextPage && !isFetchingNextPage && (
        <p className="text-center text-muted-foreground">No more mock papers to load</p>
      )}
    </div>
  )
}