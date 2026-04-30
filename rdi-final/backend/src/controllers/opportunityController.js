import Opportunity from "../models/Opportunity.js";

export const createOpportunity = async (req, res) => {
  try {
    const { title, companyName, description, skillsRequired, type, location, deadline } = req.body;

    const opportunity = await Opportunity.create({
      title,
      companyName,
      description,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [],
      type,
      location,
      deadline,
      createdBy: req.user._id,
    });

    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: "Server error while creating opportunity", error: error.message });
  }
};

export const getAllOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find().populate("createdBy", "name email role");
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching opportunities", error: error.message });
  }
};

export const getMyOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ createdBy: req.user._id });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching company opportunities", error: error.message });
  }
};

export const applyToOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    const alreadyApplied = opportunity.applicants.some(
      (a) => a.student.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: "You already applied to this opportunity" });
    }

    opportunity.applicants.push({ student: req.user._id });
    await opportunity.save();

    res.json({ message: "Applied successfully", opportunity });
  } catch (error) {
    res.status(500).json({ message: "Server error while applying", error: error.message });
  }
};

export const updateApplicantStatus = async (req, res) => {
  try {
    const { studentId, status } = req.body;
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    const applicant = opportunity.applicants.find(
      (a) => a.student.toString() === studentId
    );

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    applicant.status = status;
    await opportunity.save();

    res.json({ message: "Applicant status updated", opportunity });
  } catch (error) {
    res.status(500).json({ message: "Server error while updating applicant status", error: error.message });
  }
};