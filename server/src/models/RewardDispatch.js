import mongoose from "mongoose";

const RewardDispatchSchema = new mongoose.Schema(
  {
    rewardId: { type: String, required: true },
    winnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
    dispatchStatus: {
      type: String,
      enum: ["PENDING", "DISPATCHED", "DELIVERED"],
      default: "PENDING"
    },
    trackingNumber: String,
    deliveryDate: Date,
    rewardType: { type: String, enum: ["DIGITAL", "PHYSICAL"], default: "DIGITAL" }
  },
  { timestamps: true }
);

export default mongoose.model("RewardDispatch", RewardDispatchSchema);
