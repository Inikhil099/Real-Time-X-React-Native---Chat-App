import express from "express";
import { AuthRoutes } from "./routes/auth.routes";
import { chatRoutes } from "./routes/chat.routes";
import { messageRoutes } from "./routes/message.routes";
import { userRoutes } from "./routes/user.routes";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
const allowedOrigins = [process.env.FRONTEND_UR!, "http://localhost:8081"];

const app = express();

app.use(express.json());
app.use(clerkMiddleware());
app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  }),
);

app.get("/health", (req, res) => {
  console.log(req);
  console.log("inside health route");
  return res.status(200).json({ status: "ok", msg: "Server is running" });
});

app.use("/api/auth", AuthRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);

export default app;
