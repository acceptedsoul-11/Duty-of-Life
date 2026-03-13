import express from "express";
import Activity from "../models/Activity.js";
import TreeOffset from "../models/TreeOffset.js";
import User from "../models/User.js";
import { resolveBadges } from "../services/badgeService.js";
import { computeSustainabilityScore } from "../services/scoreService.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const [activities, treeRecords, user] = await Promise.all([
    Activity.find({ userId }),
    TreeOffset.find({ userId }),
    User.findById(userId)
  ]);
  if (!user) return res.status(404).json({ message: "User not found" });

  const monthlyEmissionKg = activities.reduce((sum, item) => sum + (item.travel?.emissionsKg || 0), 0);
  const challengeParticipation = activities.reduce((sum, item) => sum + (item.challengeParticipation || 0), 0);
  const csrImpact = activities.reduce((sum, item) => sum + (item.csrImpact || 0), 0);
  const treesPlanted = treeRecords.reduce((sum, item) => sum + item.treesPlanted, 0);
  const communityImpact = Math.max(0, user.followers.length - user.following.length / 2);

  const score = computeSustainabilityScore({
    monthlyEmissionKg,
    challengeParticipation,
    treesPlanted,
    csrImpact,
    communityImpact
  });
  const badges = resolveBadges({
    score,
    treesPlanted,
    emissionReduction: Math.max(0, 40 - monthlyEmissionKg / 10)
  });

  user.sustainabilityScore = score;
  user.badges = [...new Set([...user.badges, ...badges])];
  await user.save();

  res.json({
    score,
    badges: user.badges,
    breakdown: { monthlyEmissionKg, challengeParticipation, treesPlanted, csrImpact, communityImpact }
  });
});

export default router;
