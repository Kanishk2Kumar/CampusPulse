"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import { AlertBar } from "./Alert";

const Header = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null); // Store the user object
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]); // Store alerts from the database

  // Fetch the user session
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    };

    fetchSession();
  }, []);

  // Fetch alerts from the database
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from("alerts") // Replace with your table name
          .select("*");

        if (error) throw error;

        setAlerts(data || []); // Set the alerts state
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    fetchAlerts();
  }, []);

  // Get the first letter of the user's username or email
  const getInitial = () => {
    if (user?.user_metadata?.username) {
      return user.user_metadata.username.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U"; // Default to "U" if no user data is available
  };

  return (
    <div>
      <header className="my-10 flex justify-between gap-5">
        <Link href="/">
          <Image src="/icons/logo.png" alt="logo" width={60} height={60} />
        </Link>
        <ul className="flex flex-row items-center gap-4">
          <li className="relative group">
            <button className="text-base cursor-pointer capitalize text-gray-400">
              Help Section
            </button>
            <ul className="absolute hidden group-hover:block min-w-52 z-[100] border border-gray-500 p-2 rounded shadow-lg">
              <li className="hover:underline">
                <Link href="/help/create-request">Create Request</Link>
              </li>
              <li className="hover:underline mt-2">
                <Link href="/help/all-request">Open Requests</Link>
              </li>
            </ul>
          </li>
          <li className="relative group">
            <button className="text-base cursor-pointer capitalize text-gray-400">
              Find TeamMates
            </button>
            <ul className="absolute hidden group-hover:block min-w-48 z-[100] border border-gray-500 p-4 rounded shadow-lg">
              <li className="hover:underline">
                <Link href="/teamates/hackathon-groups">Hackathon Groups</Link>
              </li>
              <li className="hover:underline mt-2">
                <Link href="/teamates/search-flatmates">Search Flatmates</Link>
              </li>
              <li className="hover:underline mt-2">
                <Link href="/teamates/find-flats">Find Flats</Link>
              </li>
            </ul>
          </li>
          <li className="relative group">
            <button className="text-base cursor-pointer capitalize text-gray-400">
              Lost & Found
            </button>
            <ul className="absolute hidden group-hover:block min-w-48 z-[100] border border-gray-500 p-4 rounded shadow-lg">
              <li className="hover:underline">
                <Link href="/lostFound/create-request">Create Request</Link>
              </li>
              <li className="hover:underline mt-2">
                <Link href="/lostFound/all-request">All Requests</Link>
              </li>
            </ul>
          </li>
          <li className="relative group">
            <button className="text-base cursor-pointer capitalize text-gray-400">
              Club Management
            </button>
            <ul className="absolute hidden group-hover:block min-w-48 z-[100] border border-gray-500 p-4 rounded shadow-lg">
              <li className="hover:underline">
                <Link href="/clubs/create-event">Create Event</Link>
              </li>
              <li className="hover:underline mt-2">
                <Link href="/clubs/all-events">All Events</Link>
              </li>
            </ul>
          </li>
          <li>
            <ModeToggle />
          </li>
          <li>
            {isSignedIn ? (
              <Link href="/profile">
                <Avatar className="cursor-pointer">
                  <AvatarImage src="/path-to-user-avatar.jpg" alt="User Avatar" />
                  <AvatarFallback>{getInitial()}</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Link href="/sign-in">
                <Button>Sign In</Button>
              </Link>
            )}
          </li>
        </ul>
      </header>
      {/* Display all alerts */}
      {alerts.map((alert) => (
        <AlertBar key={alert.id} title={alert.title} message={alert.message} />
      ))}
    </div>
  );
};

export default Header;