import { Router } from "express";
import User from "../models/User";

const router = Router();

// GET /api/users
router.get("/", async (_, res) => {
  const users = await User.find();
  res.json(users);
});

// POST /api/users
router.post("/", async (req, res) => {
  const newUser = new User(req.body);
  const saved = await newUser.save();
  res.json(saved);
});

export default router;
