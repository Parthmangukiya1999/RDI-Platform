import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewerRole: {
      type: String,
      enum: ["mentor", "peer", "company", "expert"],
      required: true,
    },
    criteria: {
      type: [
        {
          key: { type: String, required: true },
          label: { type: String, required: true },
          score: { type: Number, min: 1, max: 5, required: true },
        },
      ],
      default: [],
    },
    feedback: {
      type: String,
      default: "",
      trim: true,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["assigned", "completed"],
      default: "assigned",
    },
    submittedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ project: 1, reviewer: 1, reviewerRole: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
