import express from "express";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Opportunity from "../models/Opportunity.js";
import { protect } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("admin", "mentor"));

router.get("/users", async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

router.get("/projects", async (req, res) => {
  const projects = await Project.find()
    .populate("createdBy", "name email role")
    .populate("members.user", "name email role")
    .sort({ createdAt: -1 });

  res.json(projects);
});

router.get("/teams", async (req, res) => {
  const projects = await Project.find().populate("members.user", "name email role");

  const teams = projects.map((project) => ({
    _id: project._id,
    name: project.title,
    projectName: project.title,
    members: project.members || [],
    memberCount: project.members?.length || 0,
    status: project.status,
  }));

  res.json(teams);
});

router.get("/opportunities", async (req, res) => {
  const opportunities = await Opportunity.find()
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });

  res.json(opportunities);
});

export default router;