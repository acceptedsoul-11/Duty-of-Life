import mongoose from "mongoose";

const ChallengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: String,
    location: String,
    startDate: Date,
    endDate: Date,
    csrPartner: String,
    rewardDetails: String,
    proofRequirements: String,
    rules: String,
    maxParticipants: Number,
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["OPEN", "CLOSED"], default: "OPEN" }
  },
  { timestamps: true }
);

export default mongoose.model("Challenge", ChallengeSchema);
