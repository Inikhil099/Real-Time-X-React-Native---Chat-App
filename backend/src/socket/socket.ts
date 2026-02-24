import { verifyToken } from "@clerk/express";
import { Socket, Server } from "socket.io";
import { Server as httpServer } from "http";
import { User } from "../models/User.model";
import { Chat } from "../models/Chat.model";
import { Message } from "../models/Message.model";

export const onlineUsersMap = new Map<string, string>();

export const initializeSocket = (httpServer: httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication failed"));
    }
    try {
      const session = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      const clerkId = session.sub;
      const user = await User.findOne({ clerkId });
      if (!user) {
        return next(new Error("User not found"));
      }
      socket.userId = user._id.toString();
      next();
    } catch (error: any) {
      next(new Error(error));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.userId!;
    socket.emit("online-users", {
      onlineUsers: Array.from(onlineUsersMap.keys()),
    });
    onlineUsersMap.set(userId, socket.id);

    socket.broadcast.emit("user-online", { userId });

    socket.join(`user:${userId}`);

    socket.on("join-chat", (chatId: string) => {
      socket.join(`chat:${chatId}`);
    });

    socket.on("leave-chat", (chatId: string) => {
      socket.leave(`chat:${chatId}`);
    });

    // ------------------------------------------------ message events --------------------------------

    socket.on(
      "send-message",
      async ({ chatId, text }: { chatId: string; text: string }) => {
        try {
          const chat = await Chat.findOne({
            _id: chatId,
            participants: userId,
          });
          if (!chat) {
            return socket.emit("socket-error", { message: "Chat not found" });
          }

          const message = await Message.create({
            chat: chat?._id,
            sender: userId,
            text,
          });

          chat.lastMessage = message._id;
          chat.lastMessageAt = new Date();
          await chat?.save();
          await message.populate("sender", "name avatar");
          io.to(`chat:${chatId}`).emit("new-message", message);

          for (const participantId of chat.participants) {
            io.to(`user:${participantId}`).emit("new-message", message);
          }
        } catch (error) {
          return socket.emit("socket-error", {
            message: "failed to send message",
          });
        }
      },
    );

    socket.on("typing", async () => {});

    socket.on("disconnect", () => {
      onlineUsersMap.delete(userId);
      socket.broadcast.emit("user-offline", { userId });
      console.log("user disconnected with id", socket.id);
    });
  });
  return io;
};
