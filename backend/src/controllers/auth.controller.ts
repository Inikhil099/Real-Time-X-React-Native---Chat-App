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
  console.log("inside auth call back");
  const { userId } = getAuth(req);
  if (!userId) return res.status(400).send("Unauthorized");

  let user = await User.findOne({ clerkId: userId });
  console.log("this is user inside callback handler", user);

  if (!user) {
    console.log("user not found creating new");
    const clerkUser = await clerkClient.users.getUser(userId);
    console.log("this is clerk user", clerkUser);
    user = await User.create({
      clerkId: userId,
      name: clerkUser.firstName
        ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
        : clerkUser.emailAddresses[0]?.emailAddress.split("@")[0] || "User",
      email: clerkUser.emailAddresses[0]?.emailAddress,
      avatar: clerkUser.imageUrl,
    });
  }
  console.log("returning res after success");
  return res.status(200).json(user);
}
