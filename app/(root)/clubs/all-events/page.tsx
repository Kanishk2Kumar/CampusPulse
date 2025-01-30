"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AllEvents: React.FC = () => {
  const [search, setSearch] = useState("");

  // Static data for club events
  const staticEvents = [
    {
      id: 1,
      title: "Tech Talk: AI in 2024",
      description:
        "Join us for an insightful session on the future of AI and its impact on industries.",
      imageLink: "/images/tech-talk.jpg",
      clubName: "Tech Club",
      startDate: "2023-11-10",
      endDate: "2023-11-10",
    },
    {
      id: 2,
      title: "Music Festival",
      description:
        "A night of live performances by talented artists from our college.",
      imageLink: "/images/music-festival.jpg",
      clubName: "Music Club",
      startDate: "2023-11-15",
      endDate: "2023-11-16",
    },
    {
      id: 3,
      title: "Art Exhibition",
      description:
        "Explore stunning artworks created by students and professional artists.",
      imageLink: "/images/art-exhibition.jpg",
      clubName: "Art Club",
      startDate: "2023-11-20",
      endDate: "2023-11-22",
    },
    {
      id: 4,
      title: "Sports Day",
      description:
        "A day full of fun sports activities and competitions for everyone.",
      imageLink: "/images/sports-day.jpg",
      clubName: "Sports Club",
      startDate: "2023-11-25",
      endDate: "2023-11-25",
    },
  ];

  // Filter events based on search input
  const filteredEvents = staticEvents.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <p className="text-gray-700 text-sm">
                <strong>Start Date:</strong>{" "}
                {new Date(event.startDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>End Date:</strong>{" "}
                {new Date(event.endDate).toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center mt-4">
                {/* RSVP Button */}
                <Link href={`/events/${event.id}/rsvp`} passHref>
                  <Button size="sm" className="bg-green-500 hover:bg-green-700">
                    RSVP
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