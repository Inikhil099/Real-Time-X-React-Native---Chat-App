import type { Response, Request } from "express";
import { User } from "../models/User.model";
export async function getUsersForChat(req: Request, res: Response) {
  const users = await User.find({ _id: { $ne: req._id } })
    .select("name email avatar")
    .limit(50);
  return res.status(200).json(users);
}
