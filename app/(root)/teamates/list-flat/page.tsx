"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/context/UserContext";

const CreateFlat = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    ownerNumber: "",
    rent: "",
    mapLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const router = useRouter();
  const { userDetails } = useAuth();

  useEffect(() => {
    if (userDetails) {
      setUserId(userDetails.userId || "");
    }
  }, [userDetails]);

  console.log(userDetails);
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
    const filePath = `flats/${Date.now()}.${fileExt}`;

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
      if (!formData.title || !formData.description || !formData.location || !formData.ownerNumber || !formData.rent) {
        throw new Error("Title, description, location, owner number, and rent are required.");
      }

      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { error: insertError } = await supabase.from("flats").insert([
        {
          userid: userDetails.userid,
          tittle: formData.title,
          description: formData.description,
          location: formData.location,
          ownerNumber: formData.ownerNumber,
          rent: parseInt(formData.rent),
          mapLink: formData.mapLink,
          images: imageUrl,
        },
      ]);

      if (insertError) throw insertError;

      setSuccessMessage("Your flat has been listed successfully!");
      router.push("/teamates/find-flatmates");
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
            <CardTitle className="text-center text-3xl">List a Flat</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" type="text" placeholder="Enter a title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" name="description" placeholder="Describe the flat..." value={formData.description} onChange={handleInputChange} rows={4} required />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input id="location" name="location" type="text" placeholder="Enter location" value={formData.location} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="ownerNumber">Owner Number *</Label>
                <Input id="ownerNumber" name="ownerNumber" type="text" placeholder="Enter owner's contact number" value={formData.ownerNumber} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="rent">Rent *</Label>
                <Input id="rent" name="rent" type="number" placeholder="Enter rent amount" value={formData.rent} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="mapLink">Map Link</Label>
                <Input id="mapLink" name="mapLink" type="text" placeholder="Enter map link" value={formData.mapLink} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="imageLink">Image (Optional)</Label>
                <Input id="imageLink" name="imageLink" type="file" onChange={handleFileChange} accept="image/*" />
              </div>
              {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
              {successMessage && <p className="text-blue-500 text-center">{successMessage}</p>}
              <div className="flex justify-center">
                <Button type="submit" className="bg-blue-500 text-white px-6 py-3" disabled={loading}>
                  {loading ? "Submitting..." : "List Flat"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateFlat;