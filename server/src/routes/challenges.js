import express from "express";
import Challenge from "../models/Challenge.js";
import RewardDispatch from "../models/RewardDispatch.js";
import Submission from "../models/Submission.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  if (!req.body?.title) return res.status(400).json({ message: "title is required" });
  const challenge = await Challenge.create(req.body);
  res.status(201).json(challenge);
});

router.get("/", requireAuth, async (_, res) => {
  const challenges = await Challenge.find().sort({ createdAt: -1 });
  res.json(challenges);
});

router.post("/:challengeId/submit", requireAuth, async (req, res) => {
  const { challengeId } = req.params;
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) return res.status(404).json({ message: "Challenge not found" });
  if (challenge.status !== "OPEN") return res.status(400).json({ message: "Challenge is closed" });
  if (challenge.endDate && new Date(challenge.endDate) < new Date()) {
    return res.status(400).json({ message: "Challenge deadline has passed" });
  }

  const existing = await Submission.findOne({ challengeId, userId: req.user.id });
  if (existing) {
    existing.proofUrl = req.body?.proofUrl || existing.proofUrl;
    existing.score = req.body?.score ?? existing.score;
    existing.verified = false;
    await existing.save();
    return res.json(existing);
  }

  const submission = await Submission.create({ challengeId, ...req.body, userId: req.user.id });
  res.status(201).json(submission);
});

router.get("/submissions/pending", requireAuth, requireAdmin, async (_, res) => {
  const submissions = await Submission.find({ verified: false })
    .sort({ createdAt: -1 })
    .populate("userId", "name email")
    .populate("challengeId", "title");
  res.json(submissions);
});

router.patch("/submissions/:submissionId/verify", requireAuth, requireAdmin, async (req, res) => {
  const submission = await Submission.findByIdAndUpdate(
    req.params.submissionId,
    { verified: true, score: req.body.score ?? 0 },
    { new: true }
  );
  if (!submission) return res.status(404).json({ message: "Submission not found" });
  res.json(submission);
});

router.post("/:challengeId/close", requireAuth, requireAdmin, async (req, res) => {
  const { challengeId } = req.params;
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) return res.status(404).json({ message: "Challenge not found" });
  if (challenge.status === "CLOSED") return res.status(400).json({ message: "Challenge already closed" });

  challenge.status = "CLOSED";
  await challenge.save();

  const existingRewards = await RewardDispatch.countDocuments({ challengeId });
  if (existingRewards > 0) {
    const rewards = await RewardDispatch.find({ challengeId }).sort({ createdAt: -1 });
    const winners = await Submission.find({ challengeId, verified: true }).sort({ score: -1 }).limit(3);
    return res.json({ challenge, winners, rewards, reused: true });
  }

  const submissions = await Submission.find({ challengeId, verified: true }).sort({ score: -1 }).limit(3);

  const rewardTypes = ["DIGITAL", "DIGITAL", "PHYSICAL"];
  const rewards = await Promise.all(
    submissions.map((s, index) =>
      RewardDispatch.create({
        rewardId: `RW-${Date.now()}-${index + 1}`,
        winnerId: s.userId,
        challengeId,
        dispatchStatus: "PENDING",
        rewardType: rewardTypes[index] || "DIGITAL"
      })
    )
  );

  res.json({ challenge, winners: submissions, rewards });
});

router.get("/rewards", requireAuth, requireAdmin, async (_, res) => {
  const rewards = await RewardDispatch.find().sort({ createdAt: -1 }).populate("winnerId", "name email");
  res.json(rewards);
});

router.patch("/rewards/:id/dispatch", requireAuth, requireAdmin, async (req, res) => {
  const reward = await RewardDispatch.findByIdAndUpdate(
    req.params.id,
    {
      dispatchStatus: req.body.dispatchStatus || "DISPATCHED",
      trackingNumber: req.body.trackingNumber,
      deliveryDate: req.body.deliveryDate
    },
    { new: true }
  );
  if (!reward) return res.status(404).json({ message: "Reward not found" });
  res.json(reward);
});

router.get("/leaderboard/:challengeId", requireAuth, async (req, res) => {
  const leaderboard = await Submission.find({ challengeId: req.params.challengeId, verified: true })
    .sort({ score: -1 })
    .limit(20)
    .populate("userId", "name");
  res.json(leaderboard);
});

export default router;
