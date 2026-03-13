import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    travel: {
      start: String,
      destination: String,
      mode: String,
      distanceKm: Number,
      emissionsKg: Number
    },
    electricityKwh: { type: Number, default: 0 },
    meatMealsPerDay: { type: Number, default: 0 },
    challengeParticipation: { type: Number, default: 0 },
    csrImpact: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Activity", ActivitySchema);
