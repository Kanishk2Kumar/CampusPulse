"use client";
import React, { useEffect, useState } from "react";
import { supabase, supabaseAdminRole } from "@/utils/supabase/client";
import {
  Table,
  TableBody,
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

type LostFoundItem = {
  id: number;
  userid: string;
  created_at: string;
  title: string;
  description: string;
  foundAt: string;
  status: string;
};

const LostFoundManagement: React.FC = () => {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLostFoundItems = async () => {
      try {
        const { data, error } = await supabase.from("lostFound").select("*");

        if (error) throw error;

        // Sort items by status: pending first, then resolved
        const sortedItems = data.sort((a, b) => {
          if (a.status === "pending") return -1;
          if (b.status === "pending") return 1;
          return 0;
        });

        setItems(sortedItems as LostFoundItem[]);
      } catch (error) {
        console.error("Error fetching lost & found items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLostFoundItems();
  }, []);

  const handleUpdateStatus = async (id: number, currentStatus: string) => {
    try {
      let newStatus = "";
      if (currentStatus === "pending") {
        newStatus = "resolved";
      }

      const { error } = await supabaseAdminRole
        .from("lostFound")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating lost & found item status:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Lost & Found</CardTitle>
          <CardDescription>A list of all lost and found items.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Found At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.userid}</TableCell>
                  <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.foundAt}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {item.status === "pending" && (
                        <Button
                          className="bg-blue-500 hover:bg-blue-600"
                          variant="default"
                          onClick={() => handleUpdateStatus(item.id, item.status)}
                        >
                          Mark as Resolved
                        </Button>
                      )}
                    </div>
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

export default LostFoundManagement;