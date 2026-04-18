import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getUsersForChat } from "../controllers/user.controller";
import { protectRoute } from "../middleware/auth";

const router = Router();
router.use(protectRoute)

router.get("/users", asyncHandler(getUsersForChat));

export { router as userRoutes };
