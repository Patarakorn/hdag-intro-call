// src/lib/models/AllowedEmail.ts
import mongoose from "../mongoose";

const AllowedEmailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  invitedAt: { type: Date, default: Date.now },
});

export const AllowedEmail =
  mongoose.models.AllowedEmail || mongoose.model("AllowedEmail", AllowedEmailSchema);
