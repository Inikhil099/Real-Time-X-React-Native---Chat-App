import type { Request, Response } from "express";
import { Chat } from "../models/Chat.model";
import { Message } from "../models/Message.model";

export async function getChatMessages(req: Request, res: Response) {
  const { chatId } = req.params;
  const chat = await Chat.find({ _id: chatId, participants: req._id });
  if (!chat) {
    return res.status(404).send("Chat not found");
  }
  const messages = await Message.find({ chat: chatId })
    .populate("sender", "name email avatar")
    .sort({ createdAt: 1 });
  return res.status(200).json(messages);
}
