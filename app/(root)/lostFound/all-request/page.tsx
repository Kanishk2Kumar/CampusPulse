"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LostAndFound: React.FC = () => {
  const [search, setSearch] = useState("");

  // Static data for lost and found items
  const staticItems = [
    {
      id: 1,
      title: "Lost Wallet",
      description: "A black leather wallet found near the library.",
      imageLink: "/images/wallet.jpg",
      locationFound: "Library Entrance",
      foundDate: "2023-10-15",
    },
    {
      id: 2,
      title: "Water Bottle",
      description: "A blue Hydro Flask found in the cafeteria.",
      imageLink: "/images/bottle.jpg",
      locationFound: "Cafeteria",
      foundDate: "2023-10-14",
    },
    {
      id: 3,
      title: "Keys",
      description: "A set of keys with a keychain found in the parking lot.",
      imageLink: "/images/keys.jpg",
      locationFound: "Parking Lot",
      foundDate: "2023-10-13",
    },
    {
      id: 4,
      title: "Notebook",
      description: "A spiral-bound notebook found in Lecture Hall 3.",
      imageLink: "/images/notebook.jpg",
      locationFound: "Lecture Hall 3",
      foundDate: "2023-10-12",
    },
  ];

  // Filter items based on search input
  const filteredItems = staticItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 lg:pl-24 lg:pr-24">
      {/* Search Bar */}
      <div className="relative mb-8 lg:pl-48 lg:mr-48">
        <label className="relative block">
          <span className="sr-only">Search lost and found items</span>
          <Input
            type="text"
            placeholder="Search lost and found items..."
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

      {/* Lost and Found Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="rounded-lg border border-gray-500 shadow-lg hover:scale-105 transition-transform"
          >
            {/* Item Image */}
            <div className="w-full h-[200px] overflow-hidden rounded-t-lg">
              <Image
                src={item.imageLink || "/images/default-item.jpg"} // Fallback image
                alt={item.title}
                width={400}
                height={200}
                className="object-cover w-full h-full"
                unoptimized // Add this if using external URLs
              />
            </div>

            {/* Item Details */}
            <CardContent className="p-4">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-lg font-bold text-blue-500">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <p className="text-gray-700 text-sm line-clamp-2">
                {item.description}
              </p>
              <p className="text-gray-700 text-sm mt-2">
                <strong>Location Found:</strong> {item.locationFound}
              </p>
              <div className="flex justify-between items-center mt-4">
                {/* Found Date */}
                <div className="text-sm font-semibold">
                  Found: {new Date(item.foundDate).toLocaleDateString()}
                </div>

                {/* Claim Button */}
                <Link href={`/lost-and-found/${item.id}/claim`} passHref>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-700">
                    Claim
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

export default LostAndFound;