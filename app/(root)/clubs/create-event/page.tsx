"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/context/UserContext"; // Assuming you have a UserContext

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    clubName: "",
    startDate: "",
    endDate: "",
    imageLink: "", // Added imageLink to form data
  });

  const [imageFile, setImageFile] = useState<File | null>(null); // State for image file
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>(""); // userId from the session

  const router = useRouter();
  const { userDetails } = useAuth(); // Fetch user details from the context

  useEffect(() => {
    if (userDetails) {
      setUserId(userDetails.userId || ""); // Set userId from the session
    }
  }, [userDetails]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Validate inputs
      if (
        !formData.title ||
        !formData.description ||
        !formData.clubName ||
        !formData.startDate ||
        !formData.endDate
      ) {
        throw new Error("All fields are required.");
      }

      let imageLink = "";

      // Step 1: Upload image to Supabase Storage if a file is selected
      if (imageFile) {
        const fileName = `${userId}_${imageFile.name}`.replace(/[^a-zA-Z0-9]/g, "_"); // Use userId for the file name
        const filePath = `event-images/${fileName}`; // Specify the folder path
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("images") // Bucket name
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // Get the public URL of the uploaded file
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);

        imageLink = urlData.publicUrl;
      }

      // Step 2: Insert event details into the database
      const { data, error: insertError } = await supabase
        .from("eventManagement") // Replace with your table name
        .insert([
          {
            userid: userId, // Use userId from the session
            title: formData.title,
            description: formData.description,
            clubName: formData.clubName,
            startDate: new Date(formData.startDate).toISOString(), // Convert to ISO string
            EndDate: new Date(formData.endDate).toISOString(), // Convert to ISO string
            registeredUser: [], // Initially empty, will be filled after registrations
            imageLink: imageLink, // Include the imageLink
          },
        ]);

      if (insertError) throw insertError;

      setSuccessMessage("Your event has been created successfully!");
      router.push("/clubs/all-events"); // Redirect to events page after success
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-cover bg-center min-h-96 pt-20">
      <div className="absolute inset-0"></div>
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-2xl w-full bg-opacity-90 rounded-lg p-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              Create an Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter the event title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the event..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="clubName">Club Name *</Label>
                <Input
                  id="clubName"
                  name="clubName"
                  type="text"
                  placeholder="Enter the club name"
                  value={formData.clubName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="imageLink">Event Image (Optional)</Label>
                <Input
                  id="imageLink"
                  name="imageLink"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>

              {errorMessage && (
                <p className="text-red-500 text-center">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-blue-500 text-center">{successMessage}</p>
              )}

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Create Event"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateEvent;