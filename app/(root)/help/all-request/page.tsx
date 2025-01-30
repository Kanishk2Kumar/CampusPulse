"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AllRequests: React.FC = () => {
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all requests from the `helpSection` table
  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("helpSection")
        .select("*")
        .order("created_at", { ascending: false }); // Sort by most recent

      if (error) console.error("Error fetching help requests:", error);
      else setRequests(data || []);

      setLoading(false);
    };

    fetchRequests();
  }, []);

  // Filter requests based on search query
  const filteredRequests = requests.filter((request) =>
    request.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 lg:pl-24 lg:pr-24">
      {/* Search Bar */}
      <div className="relative mb-8 lg:pl-48 lg:mr-48">
        <label className="relative block">
          <span className="sr-only">Search help requests</span>
          <Input
            type="text"
            placeholder="Search help requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 pr-12 border rounded-full"
          />
        </label>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredRequests.map((request) => (
            <Card
              key={request.id}
              className="rounded-lg border border-gray-500 shadow-lg hover:scale-105 transition-transform"
            >
              {/* Display Image */}
              <div className="w-full h-[200px] overflow-hidden rounded-t-lg">
                <Image
                  src={request.imageLink || "/images/default-item.jpg"}
                  alt={request.title}
                  width={400}
                  height={200}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>

              {/* Card Content */}
              <CardContent className="p-4">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-lg font-bold text-blue-500">
                    {request.title}
                  </CardTitle>
                </CardHeader>

                {/* Description */}
                <p className="text-gray-700 text-sm line-clamp-2">
                  {request.description}
                </p>

                {/* GitHub Link */}
                {request.githubLink && (
                  <a
                    href={request.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm mt-2 block"
                  >
                    GitHub Link
                  </a>
                )}

                {/* Skills Required */}
                {request.skills && request.skills.length > 0 && (
                  <div className="mt-2">
                    <p className="text-gray-700 font-medium text-sm">
                      Skills Required:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {request.skills.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Posted Date */}
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm font-semibold">
                    Posted: {new Date(request.created_at).toLocaleDateString()}
                  </div>

                  {/* View Details Button */}
                  <Link href={`/helpSection/${request.id}`} passHref>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-700">
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllRequests;