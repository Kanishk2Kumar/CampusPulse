"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/context/UserContext"; // Assuming you have a UserContext

const AuthenticateClub = () => {
  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    description: "", // Added description to the formData state
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userid, setuserid] = useState<string>("");

  const router = useRouter();
  const { userDetails } = useAuth(); // Fetch user details from the context

  useEffect(() => {
    if (userDetails) {
      setUserName(userDetails.userName || ""); // Set userName from the session
      setuserid(userDetails.userid || ""); // Set userid from the session
    }
  }, [userDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Validate inputs
      if (!formData.name || !formData.department || !formData.description || !logoFile) {
        throw new Error("All fields are required.");
      }

      // Step 1: Upload logo to Supabase Storage inside the `clubLogos` folder
      const fileName = `${userName}_${logoFile.name}`.replace(/[^a-zA-Z0-9]/g, "_");
      const filePath = `clubLogos/${fileName}`; // Specify the folder path
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images") // Bucket name
        .upload(filePath, logoFile);

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      const logolink = urlData.publicUrl;

      // Step 2: Insert club's details into the database
      const { data, error: insertError } = await supabase
        .from("clubs") // Replace with your table name
        .insert([
          {
            userid,
            name: formData.name,
            department: formData.department,
            description: formData.description, // Added description here
            logolink,
            status: "pending", // Default status
          },
        ]);

      if (insertError) throw insertError;

      setSuccessMessage("Your club details have been submitted successfully!");
      router.push("/"); // Redirect to home page after success
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-cover bg-center min-h-96">
      <div className="absolute inset-0"></div>
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-2xl w-full bg-opacity-90 rounded-lg p-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              Club Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Club Name Input */}
              <div>
                <Label htmlFor="name">Club Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your club name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Department Input */}
              <div>
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  name="department"
                  type="text"
                  placeholder="Enter your department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Description Input */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Club description"
                  value={formData.description} // Corrected value to formData.description
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Club Logo Input */}
              <div>
                <Label htmlFor="logolink">Club Logo *</Label>
                <Input
                  id="logolink"
                  name="logolink"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
              </div>

              {/* Error and Success Messages */}
              {errorMessage && (
                <p className="text-red-500 text-center">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-blue-500 text-center">{successMessage}</p>
              )}

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthenticateClub;