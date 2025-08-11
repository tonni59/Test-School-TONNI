import express from "express";
import { getUserAnalytics } from "../../controllers/analyticsController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Only logged-in users can view their own analytics
router.get("/me", authMiddleware, getUserAnalytics);

export default router;
