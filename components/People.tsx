import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

import { UserPlus, Users } from "lucide-react"

interface Person {
  name: string
  title: string
  followers: string
}

interface CompanyProps {
  company_name: string
}

interface PeopleProps {
  company: CompanyProps
}

export default function ProfessionalNetwork({ company }: PeopleProps) {
  const alumniGroups = [
    { title: "Software Engineering", year: 2023, count: 4000 },
    { title: "Tata Consultancy Services", year: 2023, count: 3000 },
  ]

  const peopleYouMayKnow: Person[] = [
    { name: "Alex Johnson", title: "Software Engineer", followers: "5K" },
    { name: "Anika Sharma", title: "Product Manager", followers: "4K" },
    { name: "Aarav Patel", title: "Software Engineer", followers: "3K" },
  ]

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card className="bg-white ">
        <CardHeader >
          <CardTitle className="text-2xl font-bold">Your Professional Network</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Alumni Networks</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {alumniGroups.map((group, index) => (
              <AlumniGroup key={index} {...group} />
            ))}
          </div>
          <br className="my-6" />
          <h2 className="text-xl font-semibold mb-4">People You May Know</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {peopleYouMayKnow.map((person, index) => (
              <PersonCard key={index} person={person} companyName={company.company_name} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AlumniGroup({ title, year, count }: { title: string; year: number; count: number }) {
  return (
    <Card className="bg-white shadow">
      <CardContent className="p-4">
        <Users className="w-8 h-8 text-purple-500 mb-2" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">Class of {year}</p>
        <p className="text-sm font-medium text-purple-500 mt-2">{count.toLocaleString()} alumni</p>
      </CardContent>
    </Card>
  )
}

function PersonCard({ person, companyName }: { person: Person; companyName: string }) {
  return (
    <Card className="bg-white ">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold">{person.name}</h3>
            <p className="text-sm text-gray-600">
              {person.title} at {companyName}
            </p>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            {person.followers} followers
          </Badge>
        </div>
        
      </CardContent>
    </Card>
  )
}