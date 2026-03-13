import mongoose from "mongoose";

const TreeOffsetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    treesPlanted: { type: Number, required: true },
    co2Offset: { type: Number, required: true },
    location: String,
    sponsor: String
  },
  { timestamps: true }
);

export default mongoose.model("TreeOffset", TreeOffsetSchema);
