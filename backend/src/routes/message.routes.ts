import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getChatMessages } from "../controllers/message.controller";
import { protectRoute } from "../middleware/auth";

const router = Router();

router.use(protectRoute);

router.get("/chat/:chatId", asyncHandler(getChatMessages));

export { router as messageRoutes };
