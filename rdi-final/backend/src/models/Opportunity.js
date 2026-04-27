import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      enum: ["internship", "project", "job", "collaboration"],
      default: "internship",
    },
    location: {
      type: String,
      default: "",
    },
    deadline: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicants: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["pending", "shortlisted", "rejected", "accepted"],
          default: "pending",
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

export default Opportunity;