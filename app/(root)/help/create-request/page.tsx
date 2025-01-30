"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/context/UserContext"; // Import the useAuth hook

const CreateRequest = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubLink: "",
    skills: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const router = useRouter();
  const { user, session, userDetails } = useAuth(); // Use the useAuth hook to get user details

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const filePath = `helpSection/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (error) throw error;

    return `https://rtivegdhhpktfuvurfvj.supabase.co/storage/v1/object/public/images/${filePath}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  
    try {
      // Validate required fields
      if (!formData.title || !formData.description) {
        throw new Error("Title and description are required.");
      }
  
      // Upload image if provided
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
  
      // Convert skills string to an array
      const skillsArray = formData.skills
        ? formData.skills.split(",").map((skill) => skill.trim())
        : [];
  
      // Insert data into the `helpSection` table
      const { error: insertError } = await supabase.from("helpSection").insert([
        {
          userid: user?.id, // Use the user ID from the session
          title: formData.title,
          description: formData.description,
          imageLink: imageUrl, // Add the image URL if uploaded
          githubLink: formData.githubLink,
          skills: skillsArray, // Send skills as an array
        },
      ]);
  
      if (insertError) throw insertError;
  
      // Show success message and redirect
      setSuccessMessage("Your post has been created successfully!");
      router.push("/help/all-request");
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
              Create a Help Request
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
                  placeholder="Enter a title"
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
                  placeholder="Describe your request..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="githubLink">GitHub Link (Optional)</Label>
                <Input
                  id="githubLink"
                  name="githubLink"
                  type="text"
                  placeholder="Enter GitHub link"
                  value={formData.githubLink}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="skills">Skills (Optional)</Label>
                <Input
                  id="skills"
                  name="skills"
                  type="text"
                  placeholder="Enter required skills (e.g., React, Node.js)"
                  value={formData.skills}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="imageLink">Image (Optional)</Label>
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
                  {loading ? "Submitting..." : "Create Post"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateRequest;