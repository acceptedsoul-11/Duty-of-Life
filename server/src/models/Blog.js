import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, minlength: 4, maxlength: 140 },
    summary: { type: String, trim: true, maxlength: 240 },
    content: { type: String, required: true, trim: true, minlength: 40, maxlength: 12000 },
    coverImage: { type: String, trim: true },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Blog", BlogSchema);
