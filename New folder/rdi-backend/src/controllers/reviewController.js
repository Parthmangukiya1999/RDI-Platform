import Review from "../models/Review.js";
import Project from "../models/Project.js";
import { recalculateProjectRatingSummary } from "./projectController.js";

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

const getAllowedReviewRoles = (userRole) => {
  switch (userRole) {
    case "mentor":
      return ["mentor"];
    case "expert":
      return ["expert"];
    case "company":
      return ["company"];
    case "student":
      return ["peer"];
    case "admin":
      return ["mentor", "expert", "company", "peer"];
    default:
      return [];
  }
};

export const createReviewAssignment = async (req, res) => {
  try {
    const { projectId, reviewerId, reviewerRole } = req.body;

    if (!projectId || !reviewerId || !reviewerRole) {
      return res.status(400).json({ message: "projectId, reviewerId and reviewerRole are required" });
    }

    const review = await Review.create({
      project: projectId,
      reviewer: reviewerId,
      reviewerRole,
    });

    return res.status(201).json(review);
  } catch (error) {
    console.error("createReviewAssignment error:", error);
    return res.status(500).json({ message: "Server error while creating review assignment" });
  }
};

export const getMyAssignedReviews = async (req, res) => {
  try {
    const allowedRoles = getAllowedReviewRoles(req.user.role);

    const reviews = await Review.find({
      reviewer: req.user._id,
      reviewerRole: { $in: allowedRoles },
    })
      .populate({
        path: "project",
        populate: [
          { path: "createdBy", select: "name email role" },
          { path: "members.user", select: "name email role" },
        ],
      })
      .sort({ createdAt: -1 });

    const enriched = reviews.map((review) => ({
      ...review.toObject(),
      template: REVIEW_TEMPLATES[review.reviewerRole] || [],
    }));

    return res.status(200).json(enriched);
  } catch (error) {
    console.error("getMyAssignedReviews error:", error);
    return res.status(500).json({ message: "Server error while fetching assigned reviews" });
  }
};

export const submitReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { scores = {}, feedback = "" } = req.body;

    const review = await Review.findById(id).populate("project");
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const allowedRoles = getAllowedReviewRoles(req.user.role);
    if (
      req.user.role !== "admin" &&
      (review.reviewer.toString() !== req.user._id.toString() || !allowedRoles.includes(review.reviewerRole))
    ) {
      return res.status(403).json({ message: "Not authorized to submit this review" });
    }

    const template = REVIEW_TEMPLATES[review.reviewerRole] || [];
    const criteria = template.map((criterion) => ({
      key: criterion.key,
      label: criterion.label,
      score: Number(scores[criterion.key]),
    }));

    if (criteria.some((item) => Number.isNaN(item.score) || item.score < 1 || item.score > 5)) {
      return res.status(400).json({ message: "All scores must be between 1 and 5" });
    }

    review.criteria = criteria;
    review.feedback = feedback;
    review.averageScore = Number(
      (criteria.reduce((sum, item) => sum + item.score, 0) / criteria.length).toFixed(2)
    );
    review.status = "completed";
    review.submittedAt = new Date();
    await review.save();

    const ratingSummary = await recalculateProjectRatingSummary(review.project._id);

    return res.status(200).json({
      message: "Review submitted successfully",
      review,
      ratingSummary,
    });
  } catch (error) {
    console.error("submitReview error:", error);
    return res.status(500).json({ message: "Server error while submitting review" });
  }
};

export const getProjectRatingSummary = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate("createdBy", "name email role")
      .populate("members.user", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const reviews = await Review.find({ project: projectId, status: "completed" })
      .populate("reviewer", "name email role")
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      projectId,
      projectTitle: project.title,
      projectStatus: project.status,
      ratingSummary: project.ratingSummary,
      reviews,
    });
  } catch (error) {
    console.error("getProjectRatingSummary error:", error);
    return res.status(500).json({ message: "Server error while fetching rating summary" });
  }
};
