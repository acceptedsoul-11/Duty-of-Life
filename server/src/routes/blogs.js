import express from "express";
import Blog from "../models/Blog.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  const { title, summary, content, coverImage, tags } = req.body || {};
  if (!title || !content) return res.status(400).json({ message: "title and content are required" });
  if (String(content).trim().length < 40) return res.status(400).json({ message: "content must be at least 40 characters" });

  const blog = await Blog.create({
    authorId: req.user.id,
    title,
    summary,
    content,
    coverImage,
    tags: Array.isArray(tags) ? tags.slice(0, 8) : []
  });

  const populated = await Blog.findById(blog._id).populate("authorId", "name");
  res.status(201).json(populated);
});

router.get("/", requireAuth, async (_, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 }).populate("authorId", "name").limit(100);
  res.json(blogs);
});

router.get("/:id", requireAuth, async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("authorId", "name");
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json(blog);
});

export default router;
