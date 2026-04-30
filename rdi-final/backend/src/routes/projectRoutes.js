import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createProject,
  getProjects,
  getProjectById,
  applyToProject,
  updateApplicationStatus,
  getProjectApplications,
  removeMemberFromProject,
  leaveProject,
  markProjectCompleted,
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.post("/", protect, createProject);

router.post("/:id/apply", protect, applyToProject);
router.get("/:id/applications", protect, getProjectApplications);
router.put("/:id/application-status", protect, updateApplicationStatus);

router.delete("/:id/members/:userId", protect, removeMemberFromProject);
router.post("/:id/leave", protect, leaveProject);

router.put("/:id/complete", protect, markProjectCompleted);

export default router;

// import React from "react";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children, allowedRole }) {
//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user"));

//   if (!token || !user) {
//     return res.status(401).json({ message: "Unauthorized. Please login." });
//   }

//   if (Array.isArray(allowedRole)) {
//     if (!allowedRole.includes(user.role)) {
//       return res.status(401).json({ message: "Unauthorized. Please login." });
//     }
//   } else {
//     if (user.role !== allowedRole) {
//       return res.status(401).json({ message: "Unauthorized. Please login." });
//     }
//   }

//   return children;
// }