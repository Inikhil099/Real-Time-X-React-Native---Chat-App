import { getAuth, requireAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User.model";

export const protectRoute = [
  requireAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("inside middleware");
      const { userId } = getAuth(req);
      if (!userId) return res.status(401).send("Unauthorized - Invalid token");
      console.log("this is user id", userId);
      const user = await User.findOne({ clerkId: userId });
      if (!user) return res.status(400).send("User not found");
      console.log("this is use", user);
      req._id = user._id.toString();
      console.log("passing controll to the controller");
      next();
    } catch (error) {
      return res.status(500).send("Internal server error");
    }
  },
];
