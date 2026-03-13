import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import morgan from "morgan";
import aiRoutes from "./routes/ai.js";
import authRoutes from "./routes/auth.js";
import blogRoutes from "./routes/blogs.js";
import challengeRoutes from "./routes/challenges.js";
import emissionsRoutes from "./routes/emissions.js";
import scoreRoutes from "./routes/score.js";
import socialRoutes from "./routes/social.js";
import treeRoutes from "./routes/tree.js";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_, res) => res.json({ ok: true, service: "duty-of-life-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/emissions", emissionsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/tree", treeRoutes);
app.use("/api/score", scoreRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/social", socialRoutes);

app.use((err, _req, res, _next) => {
  console.error("API error:", err);
  if (res.headersSent) return;
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
});

export default app;
