"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const FindFlatmates: React.FC = () => {
  const [search, setSearch] = useState("");

  // Static data for available flats near the user's college
  const flats = [
    {
      id: 1,
      imageLink: "/images/flat1.jpg",
      location: "Bibwewadi, Pune",
      address: "Flat No. 101, Sunshine Apartments, Bibwewadi, Pune - 411037",
      rent: "₹8,000/month",
      deposit: "₹20,000",
      contact: "+91 98765 43210",
    },
    {
      id: 2,
      imageLink: "/images/flat2.jpg",
      location: "Katraj, Pune",
      address: "A-202, Green Residency, Near Katraj Bus Stand, Pune - 411046",
      rent: "₹10,000/month",
      deposit: "₹30,000",
      contact: "+91 98765 43211",
    },
    {
      id: 3,
      imageLink: "/images/flat3.jpg",
      location: "Swargate, Pune",
      address: "B-15, Skyline Towers, Near Swargate Metro Station, Pune - 411042",
      rent: "₹12,500/month",
      deposit: "₹35,000",
      contact: "+91 98765 43212",
    },
    {
      id: 4,
      imageLink: "/images/flat4.jpg",
      location: "Market Yard, Pune",
      address: "C-305, Orchid Residency, Market Yard, Pune - 411037",
      rent: "₹15,000/month",
      deposit: "₹40,000",
      contact: "+91 98765 43213",
    },
  ];

  // Filter flats based on search input
  const filteredFlats = flats.filter((flat) =>
    flat.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 lg:pl-24 lg:pr-24">
      {/* Search Bar */}
      <div className="relative mb-8 lg:pl-48 lg:mr-48">
        <label className="relative block">
          <span className="sr-only">Search flats</span>
          <Input
            type="text"
            placeholder="Search flats by location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 pr-12 border rounded-full"
          />
        </label>
      </div>

      {/* Flats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredFlats.map((flat) => (
          <Card
            key={flat.id}
            className="rounded-lg border border-gray-500 shadow-lg hover:scale-105 transition-transform"
          >
            {/* Flat Image */}
            <div className="w-full h-[200px] overflow-hidden rounded-t-lg">
              <Image
                src={flat.imageLink || "/images/default-flat.jpg"} // Fallback image
                alt={flat.location}
                width={400}
                height={200}
                className="object-cover w-full h-full"
                unoptimized // Add this if using external URLs
              />
            </div>

            {/* Flat Details */}
            <CardContent className="p-4">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-lg font-bold text-blue-500">
                  {flat.location}
                </CardTitle>
              </CardHeader>
              <p className="text-gray-700 text-sm">
                <strong>Address:</strong> {flat.address}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Rent:</strong> {flat.rent}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Deposit:</strong> {flat.deposit}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Contact:</strong> {flat.contact}
              </p>
              <div className="flex justify-between items-center mt-4">
                {/* Contact Now Button */}
                <Link href={`tel:${flat.contact}`} passHref>
                  <Button size="sm" className="bg-green-500 hover:bg-green-700">
                    Contact Now
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

export default FindFlatmates;
