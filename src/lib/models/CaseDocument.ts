import mongoose from "../mongoose";

const CaseDocumentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  extractedText: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export const CaseDocument =
  mongoose.models.CaseDocument || mongoose.model("CaseDocument", CaseDocumentSchema); 