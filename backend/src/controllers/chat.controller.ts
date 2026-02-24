import type { Request, Response } from "express";
import { Chat } from "../models/Chat.model";
import { Types } from "mongoose";

export async function getChats(req: Request, res: Response) {
  const chats = await Chat.find({ participants: req._id })
    .populate("participants", "name email avatar")
    .populate("lastMessage")
    .sort({ lastMessageAt: -1 });
  const formattedChats = chats.map((chat) => {
    const otherParticipant = chat.participants.find(
      (p) => p._id.toString() !== req._id,
    );
    return {
      _id: chat._id,
      participant: otherParticipant ?? null,
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
    };
  });
  return res.status(200).json(formattedChats);
}

export async function getOrCreateChats(req: Request, res: Response) {
  const { participantId } = req.params;
  if (!participantId) {
    return res.status(400).send("Participant ID is required");
  }

  if (
    typeof participantId === "string" &&
    !Types.ObjectId.isValid(participantId)
  ) {
    return res.status(400).send("Invalid participant ID");
  }
  if (participantId === req._id) {
    return res.status(400).send("Cannot create chat with yourself");
  }
  let chat = await Chat.findOne({
    participants: { $all: [req._id, participantId] },
  })
    .populate("participants", "name email avatar")
    .populate("lastMessage");

  if (!chat) {
    const newChat = new Chat({ participants: [req._id, participantId] });
    await newChat.save();
    chat = await newChat.populate("participants", "name email avatar");
  }
  const otherParticipant = chat.participants.find(
    (p) => p._id.toString() !== req._id,
  );
  return res.status(200).json({
    _id: chat._id,
    participants: otherParticipant ?? null,
    lastMessage: chat.lastMessage,
    lastMessageAt: chat.lastMessageAt,
    createdAt: chat.createdAt,
  });
}
