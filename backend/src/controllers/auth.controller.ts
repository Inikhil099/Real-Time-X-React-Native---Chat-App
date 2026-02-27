import type { Request, Response } from "express";
import { User } from "../models/User.model";
import { clerkClient, getAuth } from "@clerk/express";
export async function getMe(req: Request, res: Response) {
  const user = await User.findOne({ _id: req._id });
  if (!user) {
    return res.status(400).send("User not found");
  }
  return res.status(200).json(user);
}

export async function authCallBack(req: Request, res: Response) {
  const { userId } = getAuth(req);
  if (!userId) return res.status(400).send("Unauthorized");

  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    const clerkUser = await clerkClient.users.getUser(userId);
    user = await User.create({
      clerkId: userId,
      name: clerkUser.firstName
        ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
        : clerkUser.emailAddresses[0]?.emailAddress.split("@")[0] || "User",
      email: clerkUser.emailAddresses[0]?.emailAddress,
      avatar: clerkUser.imageUrl,
    });
  }
  return res.status(200).json(user);
}
