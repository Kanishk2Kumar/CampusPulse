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
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      // Fetch only items with status "pending"
      const { data, error } = await supabase
        .from("lostFound")
        .select("*")
        .eq("status", "pending"); // Filter by status

      if (error) console.error("Error fetching lost and found items:", error);
      else setItems(data || []);
      setLoading(false);
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter((item) =>
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
        </label>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="rounded-lg border border-gray-500 shadow-lg hover:scale-105 transition-transform"
            >
              <div className="w-full h-[200px] overflow-hidden rounded-t-lg">
                <Image
                  src={item.imageUrl || "/images/default-item.jpg"}
                  alt={item.title}
                  width={400}
                  height={200}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
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
                  <strong>Location Found:</strong> {item.foundAt}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm font-semibold">
                    Found: {new Date(item.created_at).toLocaleDateString()}
                  </div>
                  <Link href={`/lostFound/${item.id}/claim`} passHref>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-700">
                      Claim
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