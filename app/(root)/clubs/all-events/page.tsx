"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client"; // Import Supabase client

const AllEvents: React.FC = () => {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState<any[]>([]); // State to store fetched events
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("eventManagement") // Replace with your table name
          .select("*")
          .order("startDate", { ascending: true }); // Sort by start date

        if (error) {
          throw error;
        }

        setEvents(data || []); // Set fetched data
      } catch (error: any) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search input
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 lg:pl-24 lg:pr-24">
      {/* Search Bar */}
      <div className="relative mb-8 lg:pl-48 lg:mr-48">
        <label className="relative block">
          <span className="sr-only">Search events</span>
          <Input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 pr-12 border rounded-full"
          />
          <span className="absolute inset-y-0 right-4 flex items-center">
            <Image
              src="/icons/Search.svg"
              alt="Search"
              width={20}
              height={20}
              className="text-gray-400"
            />
          </span>
        </label>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <Card
            key={event.id}
            className="rounded-lg border border-gray-500 shadow-lg hover:scale-105 transition-transform"
          >
            {/* Event Image */}
            <div className="w-full h-[200px] overflow-hidden rounded-t-lg">
              <Image
                src={event.imageLink || "/images/default-event.jpg"} // Fallback image
                alt={event.title}
                width={400}
                height={200}
                className="object-cover w-full h-full"
                unoptimized // Add this if using external URLs
              />
            </div>

            {/* Event Details */}
            <CardContent className="p-4">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-lg font-bold text-blue-500">
                  {event.title}
                </CardTitle>
              </CardHeader>
              <p className="text-gray-700 text-sm line-clamp-2">
                {event.description}
              </p>
              <p className="text-gray-700 text-sm mt-2">
                <strong>Club:</strong> {event.clubName}
              </p>
              <p className="text-gray-700 text-sm mt-2">
                <strong>Date:</strong> {event.startDate} to {event.EndDate}
              </p>
              <div className="flex justify-between items-center mt-4">
                {/* View Event Button */}
                <Link href={`/clubs/${event.id}/register`} passHref>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-700">
                    Register
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllEvents;