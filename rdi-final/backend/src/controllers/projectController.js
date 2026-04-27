import Project from "../models/Project.js";
import User from "../models/User.js";
import Application from "../models/Application.js";
import Review from "../models/Review.js";

const REVIEW_TEMPLATES = {
  company: [
    { key: "commercialRelevance", label: "Commercial relevance" },
    { key: "practicalUsefulness", label: "Practical usefulness" },
    { key: "professionalQuality", label: "Professional quality" },
  ],
  expert: [
    { key: "technicalQuality", label: "Technical quality" },
    { key: "innovation", label: "Innovation" },
    { key: "accuracy", label: "Accuracy" },
  ],
  mentor: [
    { key: "learningProgress", label: "Learning progress" },
    { key: "completionQuality", label: "Completion quality" },
    { key: "academicValue", label: "Academic value" },
  ],
  peer: [
    { key: "teamwork", label: "Teamwork" },
    { key: "communication", label: "Communication" },
    { key: "reliability", label: "Reliability" },
  ],
};

const WEIGHTS = {
  mentor: 0.3,
  peer: 0.2,
  company: 0.25,
  expert: 0.25,
};

const average = (values = []) => {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export const recalculateProjectRatingSummary = async (projectId) => {
  const reviews = await Review.find({ project: projectId, status: "completed" });

  const grouped = {
    mentor: [],
    peer: [],
    company: [],
    expert: [],
  };

  for (const review of reviews) {
    grouped[review.reviewerRole]?.push(review.averageScore || 0);
  }

  const mentorAverage = average(grouped.mentor);
  const peerAverage = average(grouped.peer);
  const companyAverage = average(grouped.company);
  const expertAverage = average(grouped.expert);

  const presentRoles = Object.entries({
    mentorAverage,
    peerAverage,
    companyAverage,
    expertAverage,
  })
    .filter(([, score]) => score > 0)
    .map(([key]) => key.replace("Average", ""));

  const totalWeight = presentRoles.reduce((sum, role) => sum + WEIGHTS[role], 0);

  const weightedTotal = presentRoles.reduce((sum, role) => {
    const scoreMap = {
      mentor: mentorAverage,
      peer: peerAverage,
      company: companyAverage,
      expert: expertAverage,
    };
    return sum + scoreMap[role] * WEIGHTS[role];
  }, 0);

  const compositeScore = totalWeight > 0 ? weightedTotal / totalWeight : 0;

  const summary = {
    compositeScore: Number(compositeScore.toFixed(2)),
    mentorAverage: Number(mentorAverage.toFixed(2)),
    peerAverage: Number(peerAverage.toFixed(2)),
    companyAverage: Number(companyAverage.toFixed(2)),
    expertAverage: Number(expertAverage.toFixed(2)),
    totalRatings: reviews.length,
    isVerified: [mentorAverage, peerAverage, companyAverage, expertAverage].every(
      (score) => score > 0
    ),
    lastCalculatedAt: new Date(),
  };

  await Project.findByIdAndUpdate(projectId, { ratingSummary: summary });
  return summary;
};

export const createProject = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      description,
      category,
      skills,
      duration,
      teamSize,
      goals,
      startDate,
      endDate,
      deadline,
      openForMembers,
      status,
      projectType,
      members,
    } = req.body;

    if (!title || !shortDescription || !description || !category) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const normalizedSkills = Array.isArray(skills)
      ? skills.map((skill) => String(skill).trim()).filter(Boolean)
      : typeof skills === "string"
      ? skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

    const projectMembers = [{ user: req.user._id, role: "leader" }];
    const pendingMembers = [];

    if (projectType === "group" && Array.isArray(members)) {
      for (const memberValue of members) {
        const email = String(memberValue).trim().toLowerCase();
        if (!email) continue;

        const foundUser = await User.findOne({ email });
        if (foundUser) {
          const alreadyAdded = projectMembers.some(
            (member) => member.user.toString() === foundUser._id.toString()
          );

          if (!alreadyAdded) {
            projectMembers.push({ user: foundUser._id, role: "member" });
          }
        } else if (!pendingMembers.some((member) => member.email === email)) {
          pendingMembers.push({ email });
        }
      }
    }

    const project = await Project.create({
      title: title.trim(),
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      category: category.trim(),
      skills: normalizedSkills,
      duration: duration || "",
      teamSize: Number(teamSize) > 0 ? Number(teamSize) : Math.max(projectMembers.length, 1),
      goals: goals || "",
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      deadline: deadline || endDate || undefined,
      openForMembers: openForMembers ?? status === "Open for Members",
      status: status || "Draft",
      projectType: projectType || "individual",
      createdBy: req.user._id,
      members: projectMembers,
      pendingMembers,
    });

    const populatedProject = await Project.findById(project._id)
      .populate("createdBy", "name email role")
      .populate("members.user", "name email role");

    return res.status(201).json(populatedProject);
  } catch (error) {
    console.error("createProject error:", error);
    return res.status(500).json({ message: "Server error while creating project" });
  }
};

export const getProjects = async (_req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email role")
      .populate("members.user", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json(projects);
  } catch (error) {
    console.error("getProjects error:", error);
    return res.status(500).json({ message: "Server error while fetching projects" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("members.user", "name email role")
      .populate("completedBy", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const applications = await Application.find({ projectId: project._id })
      .populate("applicantId", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      ...project.toObject(),
      applications,
    });
  } catch (error) {
    console.error("getProjectById error:", error);
    return res.status(500).json({ message: "Server error while fetching project" });
  }
};

export const applyToProject = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { message } = req.body;

    const project = await Project.findById(projectId).populate("members.user", "name email");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can apply to projects" });
    }

    if (project.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot apply to your own project" });
    }

    if (!project.openForMembers || project.status !== "Open for Members") {
      return res.status(400).json({ message: "This project is not open for applications" });
    }

    const alreadyMember = project.members.some(
      (member) => member.user._id.toString() === req.user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ message: "You are already a project member" });
    }

    if (project.teamSize && project.members.length >= project.teamSize) {
      return res.status(400).json({ message: "Project team is already full" });
    }

    const existingApplication = await Application.findOne({
      projectId,
      applicantId: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied to this project" });
    }

    const application = await Application.create({
      projectId,
      applicantId: req.user._id,
      message: message || "",
      status: "pending",
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("applyToProject error:", error);
    return res.status(500).json({ message: "Server error while applying to project" });
  }
};

export const getProjectApplications = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.createdBy.toString() === req.user._id.toString();
    const canView = isOwner || ["admin", "mentor", "company"].includes(req.user.role);

    if (!canView) {
      return res.status(403).json({ message: "Not authorized to view applications" });
    }

    const applications = await Application.find({ projectId })
      .populate("applicantId", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json(applications);
  } catch (error) {
    console.error("getProjectApplications error:", error);
    return res.status(500).json({ message: "Server error while fetching applications" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { applicationId, status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid application status" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to update applications" });
    }

    const application = await Application.findOne({
      _id: applicationId,
      projectId,
    }).populate("applicantId", "name email role");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status !== "pending") {
      return res.status(400).json({ message: "Application already processed" });
    }

    if (status === "accepted" && project.teamSize && project.members.length >= project.teamSize) {
      return res.status(400).json({ message: "Project team is already full" });
    }

    application.status = status;
    await application.save();

    if (status === "accepted") {
      const alreadyMember = project.members.some(
        (member) => member.user.toString() === application.applicantId._id.toString()
      );

      if (!alreadyMember) {
        project.members.push({
          user: application.applicantId._id,
          role: "member",
        });
      }

      if (project.teamSize && project.members.length >= project.teamSize) {
        project.openForMembers = false;
        if (project.status === "Open for Members") {
          project.status = "In Progress";
        }
      }

      await project.save();
    }

    return res.status(200).json({
      message: `Application ${status} successfully`,
      application,
    });
  } catch (error) {
    console.error("updateApplicationStatus error:", error);
    return res.status(500).json({ message: "Server error while updating application status" });
  }
};

export const removeMemberFromProject = async (req, res) => {
  try {
    const { id: projectId, userId } = req.params;

    const project = await Project.findById(projectId)
      .populate("createdBy", "name email role")
      .populate("members.user", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.createdBy._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Only the project owner or admin can remove members" });
    }

    if (project.createdBy._id.toString() === userId) {
      return res.status(400).json({ message: "Project leader cannot be removed" });
    }

    const memberExists = project.members.some(
      (member) => member.user?._id?.toString() === userId || member.user?.toString?.() === userId
    );

    if (!memberExists) {
      return res.status(404).json({ message: "Member not found in this project" });
    }

    project.members = project.members.filter((member) => {
      const memberId = member.user?._id?.toString() || member.user?.toString();
      return memberId !== userId;
    });

    if (project.openForMembers === false && project.members.length < project.teamSize) {
      project.openForMembers = true;
      if (project.status === "In Progress") {
        project.status = "Open for Members";
      }
    }

    await project.save();

    return res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("removeMemberFromProject error:", error);
    return res.status(500).json({ message: "Server error while removing member" });
  }
};

export const leaveProject = async (req, res) => {
  try {
    const { id: projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate("createdBy", "name email role")
      .populate("members.user", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Project leader cannot leave their own project" });
    }

    const memberExists = project.members.some((member) => {
      const memberId = member.user?._id?.toString() || member.user?.toString();
      return memberId === req.user._id.toString();
    });

    if (!memberExists) {
      return res.status(400).json({ message: "You are not a member of this project" });
    }

    project.members = project.members.filter((member) => {
      const memberId = member.user?._id?.toString() || member.user?.toString();
      return memberId !== req.user._id.toString();
    });

    if (project.openForMembers === false && project.members.length < project.teamSize) {
      project.openForMembers = true;
      if (project.status === "In Progress") {
        project.status = "Open for Members";
      }
    }

    await project.save();

    return res.status(200).json({ message: "You left the project successfully" });
  } catch (error) {
    console.error("leaveProject error:", error);
    return res.status(500).json({ message: "Server error while leaving project" });
  }
};

export const markProjectCompleted = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const project = await Project.findById(projectId).populate("members.user", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.createdBy.toString() === req.user._id.toString();
    const canComplete = isOwner || ["admin", "mentor"].includes(req.user.role);

    if (!canComplete) {
      return res.status(403).json({ message: "Not authorized to complete this project" });
    }

    project.status = "Completed";
    project.openForMembers = false;
    project.completedAt = new Date();
    project.completedBy = req.user._id;
    await project.save();

    const [mentors, experts, companies] = await Promise.all([
      User.find({ role: "mentor" }).select("_id role"),
      User.find({ role: "expert" }).select("_id role"),
      User.find({ role: "company" }).select("_id role"),
    ]);

    const peers = project.members
      .filter((member) => member.user?.role === "student")
      .map((member) => member.user._id.toString());

    const assignments = [
      ...mentors.map((user) => ({ reviewer: user._id, reviewerRole: "mentor" })),
      ...experts.map((user) => ({ reviewer: user._id, reviewerRole: "expert" })),
      ...companies.map((user) => ({ reviewer: user._id, reviewerRole: "company" })),
      ...peers.map((id) => ({ reviewer: id, reviewerRole: "peer" })),
    ];

    let createdCount = 0;

    for (const assignment of assignments) {
      const reviewerId = assignment.reviewer.toString();
      const uniqueKey = `${reviewerId}-${assignment.reviewerRole}`;

      if (assignment.reviewerRole === "peer" && reviewerId === project.createdBy.toString()) {
        continue;
      }

      if (
        assignments.findIndex(
          (item) => `${item.reviewer.toString()}-${item.reviewerRole}` === uniqueKey
        ) !== assignments.indexOf(assignment)
      ) {
        continue;
      }

      try {
        await Review.create({
          project: project._id,
          reviewer: assignment.reviewer,
          reviewerRole: assignment.reviewerRole,
        });
        createdCount += 1;
      } catch (error) {
        if (error.code !== 11000) throw error;
      }
    }

    const summary = await recalculateProjectRatingSummary(project._id);

    return res.status(200).json({
      message: "Project marked completed and rating requests created",
      createdReviewAssignments: createdCount,
      ratingSummary: summary,
    });
  } catch (error) {
    console.error("markProjectCompleted error:", error);
    return res.status(500).json({ message: "Server error while completing project" });
  }
};