import React from 'react'
import CompanyPage from '../../components/CompanyPage'


import type { Metadata } from 'next'

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent
): Promise<Metadata> {
  // read route params
  

  return {
    title:searchParams.company as string,
  }
}
export default function Page({searchParams}) {

  console.log(searchParams)

 
  return (
   <div style={{fontFamily: 'Roboto'}}>
   <CompanyPage company={searchParams.company} tab={searchParams.tab || 'overview'} />
   </div>
  )
}
