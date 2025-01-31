"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/UserContext";
import { supabase } from "@/utils/supabase/client";

const Profile = () => {
  const { user, userDetails, session } = useAuth();
  const router = useRouter();
  const [helpedCount, setHelpedCount] = useState(0);

  useEffect(() => {
    if (!session) {
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    }
  }, [session, router]);

  useEffect(() => {
    const fetchHelpedCount = async () => {
      if (!userDetails?.name) return;
      const { data, error } = await supabase
        .from("users")
        .select("helped")
        .eq("name", userDetails.name)
        .single();

      if (error) {
        console.error("Error fetching helped count:", error);
      } else {
        setHelpedCount(data?.helped || 0);
      }
    };
    fetchHelpedCount();
  }, [userDetails?.name]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p className="text-4xl font-bebas-neue">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <Card className="px-48">
        <CardHeader>
          <Avatar className="w-24 h-24 mx-auto">
            <AvatarImage src="/path-to-user-avatar.jpg" alt="User Avatar" />
            <AvatarFallback className="text-4xl">
              {user.user_metadata?.username?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-center mt-4 text-blue-500">
            {userDetails?.name || "User"}
          </CardTitle>
          <CardDescription className="text-center text-sm text-gray-500">
            {userDetails?.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Phone Number:</h3>
            <p className="text-gray-700">{userDetails?.phonenumber}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Gender:</h3>
            <p className="text-gray-700">{userDetails?.gender}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Department:</h3>
            <p className="text-gray-700">{userDetails?.department}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Skills:</h3>
            <p className="text-gray-700">{userDetails?.skills}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Hobbies:</h3>
            <p className="text-gray-700">{userDetails?.hobbies || "None"}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Users Helped:</h3>
            <p className="text-gray-700">{helpedCount}</p>
          </div>
          <div className="space-y-2">
            <Button onClick={handleSignOut} className="w-full">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
