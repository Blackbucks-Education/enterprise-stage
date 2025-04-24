import { format } from "date-fns"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"


interface Event {
  date: string
  events: string[]
}

interface UpcomingEventsProps {
  upcomingEvents: Event[]
}

export default function UpComingEvents({ upcomingEvents }: UpcomingEventsProps) {
  return (
    <Card className="w-full mt-5 ">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {upcomingEvents.length > 0 ? (
          <div className="flex flex-col gap-4">
            {upcomingEvents.map(({ date, events }, index) => (
              <Card key={index} className="overflow-hidden transition-shadow hover:shadow-md">
                <CardHeader className="bg-primary/10 p-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    {format(new Date(date), "MMMM dd, yyyy")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {events.map((event, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ClockIcon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{event}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No events scheduled for this month</p>
       
          </div>
        )}
      </CardContent>
    </Card>
  )
}