import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/posts", requireAuth, async (req, res) => {
  const post = await Post.create({ ...req.body, userId: req.user.id });
  res.status(201).json(post);
});

router.get("/users", requireAuth, async (_, res) => {
  const users = await User.find().select("name email role badges sustainabilityScore").sort({ createdAt: -1 }).limit(100);
  res.json(users);
});

router.get("/feed", requireAuth, async (_, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }).limit(50).populate("userId", "name");
  res.json(posts);
});

router.get("/leaderboard", requireAuth, async (_, res) => {
  const users = await User.find()
    .select("name sustainabilityScore badges")
    .sort({ sustainabilityScore: -1, createdAt: 1 })
    .limit(10);
  res.json(users);
});

router.post("/follow", requireAuth, async (req, res) => {
  const { followingId } = req.body;
  const followerId = req.user.id;
  const [follower, following] = await Promise.all([User.findById(followerId), User.findById(followingId)]);
  if (!follower || !following) return res.status(404).json({ message: "User not found" });

  if (!follower.following.includes(followingId)) follower.following.push(followingId);
  if (!following.followers.includes(followerId)) following.followers.push(followerId);

  await Promise.all([follower.save(), following.save()]);
  res.json({ message: "Followed successfully" });
});

export default router;
