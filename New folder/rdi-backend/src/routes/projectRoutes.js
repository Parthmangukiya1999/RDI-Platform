import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  applyToProject,
  getProjectApplications,
  updateApplicationStatus,
  markProjectCompleted,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.post("/", protect, createProject);
router.post("/:id/apply", protect, applyToProject);
router.get("/:id/applications", protect, getProjectApplications);
router.put("/:id/application-status", protect, updateApplicationStatus);
router.put("/:id/complete", protect, markProjectCompleted);

export default router;
