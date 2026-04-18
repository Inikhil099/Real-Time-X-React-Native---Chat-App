import type { Response, Request } from "express";
import { User } from "../models/User.model";
export async function getUsersForChat(req: Request, res: Response) {
  console.log("inside search user", req._id);
  const users = await User.find({ _id: { $ne: req._id } })
    .select("name email avatar")
    .limit(50);
  console.log("users", users);
  return res.status(200).json(users);
}
