import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { requireAuth } from "@/lib/middleware/requireAuth";
import { CaseDocument } from "@/lib/models/CaseDocument";
import OpenAI from "openai";

// Schema for POST request body
const similarCasesBodySchema = z.object({
  companyInfo: z.string().min(1, "Company information is required"),
  limit: z.number().optional().default(5),
});

const app = new Hono()
  .post("/similar",
    requireAuth,
    zValidator("json", similarCasesBodySchema),
    async (c) => {
      const { companyInfo, limit } = c.req.valid("json");
      
      try {
        const similarCases = await findSimilarCases(companyInfo, limit);
        return c.json({ ok: true, data: similarCases });
      } catch (error) {
        console.error("Similar cases search error:", error);
        return c.json({ ok: false, error: "Failed to find similar cases" }, 500);
      }
    }
  );

export default app;

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must have the same length");
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  const similarity = dotProduct / (normA * normB);
  
  // Handle floating point precision issues
  if (isNaN(similarity) || !isFinite(similarity)) {
    return 0;
  }
  
  return similarity;
}

async function findSimilarCases(companyInfo: string, limit: number = 5) {
  try {
    // Generate embedding for the input company information
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: companyInfo,
    });

    const queryVector = embeddingResponse.data[0].embedding;

    // Get all case documents that have embeddings
    const caseDocuments = await CaseDocument.find({
      vector: { $exists: true, $ne: null }
    }).exec();

    if (caseDocuments.length === 0) {
      return [];
    }

    // Calculate similarity scores for each case
    const casesWithSimilarity = caseDocuments.map(doc => {
      const similarity = cosineSimilarity(queryVector, doc.vector);
      
      return {
        id: doc._id,
        filename: doc.filename,
        extractedText: doc.extractedText,
        similarity: similarity
      };
    });

    // Sort by similarity (highest first) and return top results
    const topSimilarCases = casesWithSimilarity
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(case_ => ({
        ...case_,
        similarity: Math.round(case_.similarity * 100) / 100 // Round to 2 decimal places
      }));

    return topSimilarCases;

  } catch (error) {
    console.error("Error finding similar cases:", error);
    throw new Error("Failed to find similar cases");
  }
} 