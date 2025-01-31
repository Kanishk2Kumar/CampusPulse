"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const SignUp = (props: React.ComponentPropsWithoutRef<"div">) => {
  const { className, ...rest } = props;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [skills, setSkills] = useState<string>("");
  const [hobbies, setHobbies] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    if (!gender || !department || !skills || !hobbies) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      const user = data?.user;
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          display_name: username,
        },
      });

      // Insert user data with 'userid' instead of 'userId'
      const { error: insertError } = await supabase.from("users").insert([
        {
          userid: user?.id, // Fixed key from userId to userid
          name: username,
          email: user?.email,
          phonenumber: phoneNumber,
          gender,
          usertype: "student",
          department,
          skills,
          hobbies,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setSuccessMessage("Sign up successful! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-blue-500">Sign Up</CardTitle>
            <CardDescription>Enter your details to Sign Up</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="User_Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    type="text"
                    placeholder="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Input
                    id="skills"
                    type="text"
                    placeholder="Skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hobbies">Hobbies</Label>
                  <Input
                    id="hobbies"
                    type="text"
                    placeholder="Hobbies"
                    value={hobbies}
                    onChange={(e) => setHobbies(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </div>
              {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
              {successMessage && (
                <p className="mt-4 text-blue-500 text-sm">{successMessage}</p>
              )}
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <a href="/sign-in" className="underline underline-offset-4">
                  Sign In
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
