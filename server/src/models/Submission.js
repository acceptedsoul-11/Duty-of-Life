import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    proofUrl: String,
    score: { type: Number, default: 0 },
    verified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Submission", SubmissionSchema);
