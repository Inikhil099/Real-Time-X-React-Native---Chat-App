import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getUsersForChat } from "../controllers/user.controller";

const router = Router();

router.get("/users", asyncHandler(getUsersForChat));

export { router as userRoutes };
