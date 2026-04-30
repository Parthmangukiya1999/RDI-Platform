import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["leader", "member"],
      default: "member",
    },
  },
  { _id: false }
);

const pendingMemberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    skills: [{ type: String, trim: true }],
    duration: { type: String, trim: true, default: "" },
    teamSize: { type: Number, min: 1, default: 1 },
    goals: { type: String, trim: true, default: "" },
    startDate: { type: Date },
    endDate: { type: Date },
    deadline: { type: Date },
    openForMembers: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["Draft", "Open for Members", "In Progress", "Submitted", "Completed", "Closed"],
      default: "Draft",
    },
    projectType: {
      type: String,
      enum: ["individual", "group"],
      default: "individual",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [memberSchema],
    pendingMembers: [pendingMemberSchema],
    completedAt: { type: Date },
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ratingSummary: {
      compositeScore: { type: Number, default: 0 },
      mentorAverage: { type: Number, default: 0 },
      peerAverage: { type: Number, default: 0 },
      companyAverage: { type: Number, default: 0 },
      expertAverage: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
      isVerified: { type: Boolean, default: false },
      lastCalculatedAt: { type: Date },
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
