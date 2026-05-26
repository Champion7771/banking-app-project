import { Server, Socket } from "socket.io";

let io: Server | null = null;
const onlineUsers = new Map<string, string>();

export const initSocket = (server: any): Server => {
  if (io) {
    return io;
  }

  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket: Socket) => {
    socket.on("register", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      console.log("Registered user:", userId);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};

export { onlineUsers };
