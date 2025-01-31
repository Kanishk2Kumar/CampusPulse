import { Server } from "socket.io";

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Initializing Socket.IO");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      // Join a room based on the help request ID
      socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
      });

      // Handle chat messages
      socket.on("send-message", (data) => {
        const { roomId, message, sender } = data;
        io.to(roomId).emit("receive-message", { sender, message });
        console.log(`Message sent to room ${roomId}: ${message}`);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
      });
    });
  }
  res.end();
}