"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/utils/supabase/client";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/UserContext"; // Assuming you have a UserContext

const ChatPage: React.FC = () => {
  const { id } = useParams(); // Get the help request ID from the URL
  const router = useRouter();
  const [messages, setMessages] = useState<
    { sender: string; message: string; created_at: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [helpSectionDetails, setHelpSectionDetails] = useState<any | null>(null);
  const [isRoomOwner, setIsRoomOwner] = useState(false); // Check if the user is the room owner
  const [resolverName, setResolverName] = useState(""); // Name of the user who solved the issue
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userDetails } = useAuth(); // Fetch user details from the context

  // Fetch existing messages from the chatroom table
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("chatroom")
        .select("*")
        .eq("roomId", id)
        .order("created_at", { ascending: true }); // Sort by creation time

      if (error) console.error("Error fetching messages:", error);
      else setMessages(data || []);
    };

    // Fetch help section details
    const fetchHelpSection = async () => {
      const { data, error } = await supabase
        .from("helpSection") // Replace with your actual table name
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error("Error fetching help section details:", error);
      else setHelpSectionDetails(data);
    };

    // Check if the logged-in user is the room owner
    const checkRoomOwner = async () => {
      const { data, error } = await supabase
        .from("helpSection")
        .select("userid")
        .eq("id", id)
        .single();

      if (error) console.error("Error fetching room owner:", error);
      else if (data?.userid === userDetails?.userid) {
        setIsRoomOwner(true);
      }
    };

    fetchMessages();
    fetchHelpSection();
    checkRoomOwner();
  }, [id, userDetails]);

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    // Join the room for this help request
    newSocket.emit("join-room", id);

    // Listen for incoming messages
    newSocket.on("receive-message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [id]);

  // Scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send a new message
  const sendMessage = async () => {
    if (newMessage.trim() && socket && userDetails) {
      const messageData = {
        roomId: id,
        body: newMessage,
        senderName: userDetails?.name || "User", // Ensure userName is available
        created_at: new Date().toISOString(),
      };

      // Save the message to the chatroom table
      const { error } = await supabase.from("chatroom").insert([messageData]);

      if (error) {
        console.error("Error saving message:", error);
      } else {
        // Emit the message to the room
        socket.emit("send-message", messageData);
        setNewMessage("");
      }
    }
  };

  // Resolve the help request
  const resolveRequest = async () => {
    if (!resolverName.trim()) {
      alert("Please enter the name of the user who solved the issue.");
      return;
    }
  
    try {
      console.log("Resolving request for:", resolverName);
      console.log("Deleting help request with ID:", id);
  
      // Step 1: Fetch the resolver's `helped` count
      const { data: resolverData, error: resolverError } = await supabase
        .from("users")
        .select("helped")
        .eq("name", resolverName)
        .single();
  
      if (resolverError || !resolverData) {
        console.error("Resolver not found:", resolverError);
        alert("User not found. Ensure the name is correct.");
        return;
      }
  
      const newHelpedCount = (resolverData?.helped ?? 0) + 1;
  
      // Step 2: Update the `helped` count
      const { error: updateError } = await supabase
        .from("users")
        .update({ helped: newHelpedCount })
        .eq("name", resolverName);
  
      if (updateError) {
        console.error("Error updating helped count:", updateError);
        alert("Failed to update helped count.");
        return;
      }
  
      // Step 3: Delete the help request
      const { error: deleteError } = await supabase
        .from("helpSection")
        .delete()
        .eq("id", id);
  
      if (deleteError) {
        console.error("Error deleting request:", deleteError);
        alert("Failed to delete help request.");
        return;
      }
  
      // Step 4: Notify users in the chat room
      if (socket) {
        socket.emit("room-closed", { roomId: id });
      } else {
        console.error("Socket connection is missing.");
      }
  
      // Step 5: Redirect after successful resolution
      alert("Help request resolved successfully!");
      router.push("/help/all-request");
    } catch (error: any) {
      console.error("Error resolving request:", error);
      alert("Failed to resolve the request. Please try again.");
    }
  };
  

  return (
    <div className="p-8 lg:pl-24 lg:pr-24">
      {/* Help Section Card */}
      {helpSectionDetails && (
        <Card className="rounded-lg border border-gray-500 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-blue-500">
              Help Section Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Title:</h3>
                <p className="text-gray-700">{helpSectionDetails?.title}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Description:</h3>
                <p className="text-gray-700">
                  {helpSectionDetails?.description}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Owner:</h3>
                <p className="text-gray-700">{helpSectionDetails?.userid}</p>
              </div>
              {/* Resolve Request Section (only for the owner) */}
              {isRoomOwner && (
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Enter the name of the user who solved the issue"
                    value={resolverName}
                    onChange={(e) => setResolverName(e.target.value)}
                  />
                  <Button onClick={resolveRequest} className="w-full">
                    Resolve Request
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Room Card */}
      <Card className="rounded-lg border border-gray-500 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-blue-500">
            Chat Room for Help Request #{id}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <strong>{msg.senderName}:</strong> {msg.body}
                <br />
                <span className="text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleString()}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="flex gap-2 w-full">
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;