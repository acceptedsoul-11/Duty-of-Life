import express from "express";
import Activity from "../models/Activity.js";
import { calculateEmissionKg, greenerAlternative } from "../services/emissionFactors.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/calculate", requireAuth, async (req, res) => {
  const { start, destination, mode } = req.body;
  const { distanceKm } = req.body;
  if (!mode) return res.status(400).json({ message: "mode required" });
  if (!distanceKm) return res.status(400).json({ message: "distanceKm is required" });

  const emissionsKg = calculateEmissionKg(distanceKm, mode);
  const suggestion = greenerAlternative(distanceKm, mode);

  await Activity.create({
    userId: req.user.id,
    travel: { start, destination, mode, distanceKm, emissionsKg }
  });

  res.json({
    distanceKm,
    emissionsKg,
    formula: `${distanceKm} x factor(${mode})`,
    suggestion
  });
});

router.get("/analytics", requireAuth, async (req, res) => {
  const records = await Activity.find({ userId: req.user.id }).sort({ createdAt: 1 });
  const weekly = {};
  const modeBreakdown = {};
  records.forEach((r) => {
    const week = new Date(r.createdAt).toISOString().slice(0, 10);
    weekly[week] = (weekly[week] || 0) + (r.travel?.emissionsKg || 0);
    const mode = r.travel?.mode || "unknown";
    modeBreakdown[mode] = (modeBreakdown[mode] || 0) + (r.travel?.emissionsKg || 0);
  });

  const line = Object.entries(weekly).map(([date, emissions]) => ({ date, emissions }));
  const pie = Object.entries(modeBreakdown).map(([mode, emissions]) => ({ mode, emissions }));
  res.json({ line, pie });
});

export default router;
