"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/utils/supabase/client";

const Register = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        setError("You must be logged in to register.");
        return;
      }
      setUser(user);
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user) {
      setError("You must be logged in to register.");
      setLoading(false);
      return;
    }

    try {
      const { data: eventData, error: fetchError } = await supabase
        .from("eventManagement")
        .select("registeredUser")
        .eq("id", id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const currentUsers = eventData?.registeredUser || [];

      if (currentUsers.includes(user.id)) {
        setError("You are already registered for this event.");
        setLoading(false);
        return;
      }

      const updatedUsers = [...currentUsers, user.id];

      const { error: updateError } = await supabase
        .from("eventManagement")
        .update({ registeredUser: updatedUsers })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      const { error: insertError } = await supabase
        .from("eventRegistrations")
        .insert([
          {
            eventId: id,
            userId: user.id,
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      {success && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in">
          Registration successful!
        </div>
      )}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Register for Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input id="email" type="email" value={user?.email || ""} readOnly className="w-full" />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2"
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-600">
          <p>You are registering as <strong>{user?.email || "User"}</strong>.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
