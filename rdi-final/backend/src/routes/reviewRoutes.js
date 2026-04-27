import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createReviewAssignment,
  getMyAssignedReviews,
  submitReview,
  getProjectRatingSummary,
  getProjectReviews,
  getReviewCandidates,
  assignProjectReviewers,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", protect, createReviewAssignment);
router.get("/my", protect, getMyAssignedReviews);
router.get("/candidates", protect, getReviewCandidates);
router.put("/:id/submit", protect, submitReview);
router.get("/project/:projectId/summary", protect, getProjectRatingSummary);
router.get("/project/:projectId", protect, getProjectReviews);
router.post("/project/:projectId/assign", protect, assignProjectReviewers);

export default router;
