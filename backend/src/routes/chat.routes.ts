import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { protectRoute } from "../middleware/auth";
import { getChats, getOrCreateChats } from "../controllers/chat.controller";

const router = Router();

router.use(protectRoute);

router.get("/", asyncHandler(getChats));
router.post("/with/:participantId", asyncHandler(getOrCreateChats));

export { router as chatRoutes };
