import express from "express";
import { generateAdvice } from "../services/sustainabilityAdvisor.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/advice", requireAuth, async (req, res) => {
  const data = req.body?.user_activity_data || {};
  const advice = generateAdvice(data);
  res.json(advice);
});

export default router;
