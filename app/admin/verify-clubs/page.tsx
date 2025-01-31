"use client";
import React, { useEffect, useState } from "react";
import { supabase, supabaseAdminRole } from "@/utils/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";

type Club = {
  id: string;
  userid: string;
  name: string;
  department: string;
  description: string;
  logolink: string;
  status: string;
};

const VerifyClubs: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const { data, error } = await supabase
          .from("clubs") // Replace with your table name
          .select("*");

        if (error) throw error;

        setClubs(data as Club[]);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const handleVerifyClub = async (clubId: string) => {
    try {
      const { error } = await supabaseAdminRole
        .from("clubs")
        .update({ status: "verified" })
        .eq("id", clubId);

      if (error) throw error;

      setClubs((prevClubs) =>
        prevClubs.map((club) =>
          club.id === clubId ? { ...club, status: "verified" } : club
        )
      );
    } catch (error) {
      console.error("Error verifying club:", error);
    }
  };

  const handleDeleteClub = async (clubId: string) => {
    try {
      const { error: dbError } = await supabaseAdminRole
        .from("clubs")
        .delete()
        .eq("id", clubId);

      if (dbError) throw dbError;

      setClubs((prevClubs) => prevClubs.filter((club) => club.id !== clubId));
    } catch (error) {
      console.error("Error deleting club:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Verify Clubs</CardTitle>
          <CardDescription>A list of all clubs awaiting verification.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clubs.map((club, index) => (
                <TableRow key={club.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{club.name}</TableCell>
                  <TableCell>{club.department}</TableCell>
                  <TableCell>{club.description || "N/A"}</TableCell>
                  <TableCell>
                    {club.logolink && (
                      <Image
                        src={club.logolink}
                        alt="Club Logo"
                        width={100}
                        height={60}
                        className="rounded-lg"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {club.status === "verified" ? (
                      <span className="text-green-500">Verified</span>
                    ) : (
                      <span className="text-yellow-500">Pending</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {club.status !== "verified" && (
                      <Button
                        variant="default"
                        className="bg-green-500 text-white mr-2"
                        onClick={() => handleVerifyClub(club.id)}
                      >
                        Verify
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteClub(club.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyClubs;
