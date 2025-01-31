"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

type Flat = {
  id: number;
  title: string | null;
  description: string | null;
  location: string | null;
  ownerNumber: string | null;
  images: string | null;
  mapLink: string | null;
  rent: number | null;
  userid: string | null;
};

const FindFlatmates: React.FC = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [flats, setFlats] = useState<Flat[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("flats")
          .select("*");

        if (error) throw error;

        setFlats(data as Flat[]);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter flats based on search input
  const filteredFlats = flats.filter((flat) =>
    flat.location?.toLowerCase().includes(search.toLowerCase())
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
                src={flat.images || "/images/default-flat.jpg"} // Fallback image
                alt={flat.location || "Flat image"}
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
                <strong>Description:</strong> {flat.description}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Rent:</strong> {flat.rent}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Contact:</strong> {flat.ownerNumber}
              </p>
              <div className="flex justify-between items-center mt-4">
                {/* Contact Now Button */}
                <Link href={`tel:${flat.ownerNumber}`} passHref>
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