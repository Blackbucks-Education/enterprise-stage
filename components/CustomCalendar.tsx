"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

// Static data for events with multiple events on the same date
const eventData = {
  "2024-10": {
    "2024-10-01": [
      { title: "Project Kickoff" },
      { title: "Team Retrospective" },
    ],
    "2024-10-15": [
      { title: "Client Meeting" },
      { title: "Internal Review" },
    ],
    "2024-10-22": [{ title: "Sprint Planning" }],
  },
  "2024-11": {
    "2024-11-05": [{ title: "Product Demo" }],
    "2024-11-12": [{ title: "Team Building" }],
    "2024-11-20": [{ title: "Quarterly Review" }],
  },
  "2024-12": {
    "2024-12-01": [{ title: "Annual Planning" }],
    "2024-12-15": [{ title: "Holiday Party" }],
    "2024-12-31": [{ title: "Year-End Review" }],
  },
};

export default function CustomCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date("2024-10-01"));
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<{ date: string; title: string }[]>([]);

  // Get month and year
  const monthYear = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Number of days in the current month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Day of the week the month starts on
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // Update events when the month changes
  useEffect(() => {
    // Fix the month key creation for event lookup
    const monthKey = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;

    const eventsForMonth = eventData[monthKey] || {};
    const eventsList = Object.keys(eventsForMonth).map((date) => {
      return eventsForMonth[date].map((event) => ({
        date,
        title: event.title,
      }));
    });
    setEvents(eventsList.flat());
  }, [currentDate]);

  // Move to previous month
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setSelectedDate(null);
  };

  // Move to next month
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setSelectedDate(null);
  };

  // Format a date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle clicking on a specific date
  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(clickedDate);
  };

  // Check if a specific date is selected
  const isDateSelected = (day: number) => {
    return (
      selectedDate?.getDate() === day &&
      selectedDate?.getMonth() === currentDate.getMonth() &&
      selectedDate?.getFullYear() === currentDate.getFullYear()
    );
  };

  return (
    <div className="space-y-4">
      {/* Events Card */}
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="flex justify-between items-center text-lg font-semibold">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Upcoming Events
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCalendar(!showCalendar)}
              className="bg-white hover:bg-white/80"
            >
              {showCalendar ? "Hide calendar" : "Show calendar"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="space-y-2">
            {events.map((event, index) => (
              <Card key={index} className=" bg-white rounded-lg">
                <CardHeader>
                  <CardDescription className="text-sm border-b text-gray-500 mb-1">
                    {formatDate(event.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-medium bg-[#0EA5E9]/10 text-[#0369A1] border-l-4 border-l-[#0EA5E9] p-2 rounded-lg">
                    {event.title}
                  </div>
                </CardContent>
              </Card>
            ))}
            {events.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No events this month
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calendar Card */}
      {showCalendar && (
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="p-4 mt-5">
              <div className="flex justify-between items-center mb-4">
                <Button variant="ghost" className="bg-white hover:bg-white/80" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium">{monthYear}</span>
                <Button variant="ghost" className="bg-white hover:bg-white/80" size="icon" onClick={nextMonth}> 
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-xs font-medium text-gray-500 mb-1"
                  >
                    {day}
                  </div>
                ))}
                {/* @ts-ignore */}
                {[...Array(firstDayOfMonth).keys()].map((i) => (
                  <div key={`empty-${i}`} className="h-8"></div>
                ))}
                     {/* @ts-ignore */}
                {[...Array(daysInMonth).keys()].map((i) => (
                  <button
                    key={i}
                    onClick={() => handleDateClick(i + 1)}
                    className={`h-8 w-8 flex items-center justify-center text-sm rounded-full transition-colors
                      ${
                        isDateSelected(i + 1)
                          ? "bg-blue-600 text-white"
                          : "hover:bg-blue-100"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
