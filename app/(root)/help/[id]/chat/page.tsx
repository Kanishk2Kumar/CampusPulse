"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/utils/supabase/client";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/UserContext"; // Assuming you have a UserContext

const ChatPage: React.FC = () => {
  const { id } = useParams(); // Get the help request ID from the URL
  const [messages, setMessages] = useState<{ sender: string; body: string; created_at: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
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

    fetchMessages();
  }, [id]);

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
        senderName: userDetails?.name || "User", // Use the current user's name
        created_at: new Date().toISOString(),
      };

      // Save the message to the chatroom table
      const { error } = await supabase
        .from("chatroom")
        .insert([messageData]);

      if (error) {
        console.error("Error saving message:", error);
      } else {
        // Emit the message to the room
        socket.emit("send-message", messageData);
        setNewMessage(""); // Clear the input after sending
      }
    }
  };

  return (
    <div className="p-8 lg:pl-24 lg:pr-24">
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
          <div className="flex gap-2">
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
