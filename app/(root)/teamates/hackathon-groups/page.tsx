"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type User = {
  userid: string;
  email: string;
  name: string;
  skills: string;
};

const skillOrder = [
  "C++",
  "Java",
  "Python",
  "Frontend",
  "Backend",
  "Machine Learning",
  "App Development",
  "Cloud",
  "DevOps",
];

const HackathonGroups = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSkill, setSelectedSkill] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("userid, email, name, skills")
          .neq("usertype", "admin");

        if (error) throw error;

        setUsers(data as User[]);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSortChange = (skill: string) => {
    setSelectedSkill(skill);
    if (!skill) {
      return;
    }
    
    const sortedUsers = [...users].sort((a, b) => {
      const isASkill = a.skills.toLowerCase().includes(skill.toLowerCase());
      const isBSkill = b.skills.toLowerCase().includes(skill.toLowerCase());
      return Number(isBSkill) - Number(isASkill);
    });
    
    setUsers(sortedUsers);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Hackathon Groups</CardTitle>
          <CardDescription>
            A list of users registered for the hackathon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleSortChange}>
            <SelectTrigger className="mb-4">
              <SelectValue placeholder="Sort by Skills" />
            </SelectTrigger>
            <SelectContent>
              {skillOrder.map((skill) => (
                <SelectItem key={skill} value={skill}>
                  {skill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.userid}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.skills}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => window.location.href = `mailto:${user.email}`}
                    >
                      Contact Them
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

export default HackathonGroups;
