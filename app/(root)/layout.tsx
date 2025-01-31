"use client"; // Mark this as a Client Component to use hooks and interactivity

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client"; // Import Supabase client
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isStudent, setIsStudent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch the current user's role
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          // No user found, redirect to sign-in page
          router.push("/sign-in");
          return;
        }

        // Fetch the user's profile or role from the `users` table
        const { data: userData, error: userError } = await supabase
          .from("users") // Use the correct table name
          .select("usertype")
          .eq("userid", user.id)
          .single();

        if (userError) throw userError;

        // Check if the user is a student
        if (userData?.usertype === "student") {
          setIsStudent(true);
        }else if (userData?.usertype === "admin") {
          router.push("/admin/dashboard");
        }else {
          // User is not a student, redirect to sign-in page
          router.push("/sign-in");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        router.push("/sign-in"); // Redirect to sign-in page on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [router]);

  // Show a loading state while checking the user's role
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <div className="mx-auto max-w-7xl">
        <Header />
        <div className="mt-10 pb-10">{children}</div>
      </div>
      <Footer />
    </main>
  );
};

export default Layout;