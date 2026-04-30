import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
  createOpportunity,
  getAllOpportunities,
  getMyOpportunities,
  applyToOpportunity,
  updateApplicantStatus,
} from "../controllers/opportunityController.js";

const router = express.Router();

router.get("/", protect, getAllOpportunities);
router.get("/my", protect, authorizeRoles("company"), getMyOpportunities);
router.post("/", protect, authorizeRoles("company"), createOpportunity);
router.post("/:id/apply", protect, authorizeRoles("student"), applyToOpportunity);
router.put("/:id/applicant-status", protect, authorizeRoles("company"), updateApplicantStatus);

export default router;