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
import { Input } from "@/components/ui/input";
import Image from "next/image";

type Alert = {
  id: number;
  userid: string;
  name: string;
  message: string;
  title: string;
  created_at: string;
};

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ userid: string; name: string } | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchAlerts();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (user) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("name")
          .eq("userid", user.id)
          .single();
        if (userError) throw userError;
        setCurrentUser({
          userid: user.id,
          name: userData?.name || "Unknown",
        });
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      setError("Failed to fetch current user.");
    }
  };

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      setAlerts(data as Alert[]);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      setError("Failed to fetch alerts.");
    } finally {
      setLoading(false);
    }
  };

  const addAlert = async () => {
    if (!title.trim() || !message.trim()) {
      setError("Title and message cannot be empty.");
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("alerts")
        .insert([
          {
            title,
            message,
            userid: currentUser?.userid || "admin",
            name: currentUser?.name || "Admin",
            created_at: new Date().toISOString(),
          },
        ]);
      if (error) throw error;
      setTitle("");
      setMessage("");
      fetchAlerts();
    } catch (error) {
      console.error("Error adding alert:", error);
      setError("Failed to add alert.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (id: number) => {
    try {
      const { error } = await supabase
        .from("alerts")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    } catch (error) {
      console.error("Error deleting alert:", error);
      setError("Failed to delete alert.");
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
          <CardDescription>A list of all alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <Input
              type="text"
              placeholder="Enter alert title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Enter alert message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={addAlert} disabled={loading}>Add Alert</Button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <Table>
            <TableCaption>A list of all alerts.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>{alert.id}</TableCell>
                  <TableCell>{alert.userid}</TableCell>
                  <TableCell>{alert.name}</TableCell>
                  <TableCell>{alert.title}</TableCell>
                  <TableCell>{alert.message}</TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleDeleteAlert(alert.id)}>Delete</Button>
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

export default Alerts;
