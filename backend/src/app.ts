import express from "express";
import { AuthRoutes } from "./routes/auth.routes";
import { chatRoutes } from "./routes/chat.routes";
import { messageRoutes } from "./routes/message.routes";
import { userRoutes } from "./routes/user.routes";
import { clerkMiddleware } from "@clerk/express";

const app = express();

app.use(express.json())
app.use(clerkMiddleware())

app.use("/api/auth", AuthRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);

export default app;
