import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createReviewAssignment,
  getMyAssignedReviews,
  submitReview,
  getProjectRatingSummary,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", protect, createReviewAssignment);
router.get("/my", protect, getMyAssignedReviews);
router.put("/:id/submit", protect, submitReview);
router.get("/project/:projectId/summary", protect, getProjectRatingSummary);

export default router;
