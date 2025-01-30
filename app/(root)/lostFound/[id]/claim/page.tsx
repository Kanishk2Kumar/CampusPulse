"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

const RequestDetails: React.FC = () => {
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const { data, error } = await supabase
          .from("lostFound")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        setRequest(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading request details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Request not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <Card className="max-w-2xl w-full border rounded-lg shadow-lg p-6">
        <div className="w-full h-[300px] overflow-hidden rounded-lg">
          <Image
            src={request.imageUrl || "/images/default-item.jpg"}
            alt={request.title}
            width={600}
            height={300}
            className="object-cover w-full h-full"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-500">
            {request.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 text-lg">{request.description}</p>
          <p className="text-gray-700 text-sm mt-4">
            <strong>Location Found:</strong> {request.foundAt}
          </p>
          <p className="text-gray-700 text-sm mt-2">
            <strong>Posted By:</strong> {request.username}
          </p>
          <p className="text-gray-700 text-sm mt-2">
            <strong>Posted On:</strong> {new Date(request.created_at).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestDetails;
