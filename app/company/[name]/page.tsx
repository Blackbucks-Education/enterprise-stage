
import React from 'react'
import CompanyPage from '../../../components/CompanyPage'

export default function Page({ params,searchParams }: { params: { name: string }, searchParams?: { tab?: string } }) {

  console.log(params.name)

 
  return (
   <div style={{fontFamily: 'Roboto'}}>
   <CompanyPage company={params.name} tab={searchParams.tab || 'overview'} />
   </div>
  )
}
