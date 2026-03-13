import express from "express";
import TreeOffset from "../models/TreeOffset.js";
import User from "../models/User.js";
import { resolveBadges } from "../services/badgeService.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const CO2_PER_TREE_KG = 21;

router.post("/offset", requireAuth, async (req, res) => {
  const { monthlyEmissionKg, treesPlanted = 0, location, sponsor } = req.body;
  const userId = req.user.id;

  const requiredTrees = Math.ceil((monthlyEmissionKg || 0) / CO2_PER_TREE_KG);
  const co2Offset = treesPlanted * CO2_PER_TREE_KG;
  const record = await TreeOffset.create({ userId, treesPlanted, co2Offset, location, sponsor });

  const user = await User.findById(userId);
  if (user) {
    const mergedBadges = new Set([
      ...user.badges,
      ...resolveBadges({
        score: user.sustainabilityScore,
        treesPlanted,
        emissionReduction: co2Offset / 10
      })
    ]);
    user.badges = [...mergedBadges];
    await user.save();
  }

  res.json({ requiredTrees, co2Offset, record });
});

router.get("/dashboard", requireAuth, async (req, res) => {
  const records = await TreeOffset.find({ userId: req.user.id }).sort({ createdAt: -1 });
  const totalTrees = records.reduce((sum, item) => sum + item.treesPlanted, 0);
  const totalOffset = records.reduce((sum, item) => sum + item.co2Offset, 0);
  res.json({ totalTrees, totalOffset, records });
});

export default router;
