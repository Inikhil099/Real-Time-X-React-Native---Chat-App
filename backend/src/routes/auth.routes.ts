import { Router } from "express";
import { authCallBack, getMe } from "../controllers/auth.controller";
import { protectRoute } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/me", protectRoute, asyncHandler(getMe));
router.post("/callback", asyncHandler(authCallBack));

export { router as AuthRoutes };
