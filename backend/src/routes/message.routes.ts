import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getChatMessages } from "../controllers/message.controller";
import { protectRoute } from "../middleware/auth";

const router = Router()



router.get("/chat/:chatId",protectRoute,asyncHandler(getChatMessages))





export {router as messageRoutes}