import mongoose, {type Document } from "mongoose";

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new mongoose.Schema<IChat>(
  {
    participants: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      required: true,
    },
    lastMessage: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const Chat = mongoose.model("Chat", ChatSchema);
