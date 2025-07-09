// src/app/api/[[...route]]/admin.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { AllowedEmail } from "@/lib/models/AllowedEmail";
import { requireAuth, isAdmin } from "@/lib/middleware/requireAuth";
import { CaseDocument } from "@/lib/models/CaseDocument";
import pdfParse from "pdf-parse"; 
import { ObjectId } from "mongodb";
import OpenAI from "openai";

const createAllowedEmailSchema = z.object({
  email: z.string().email(),
});

const app = new Hono()
  // List all allowed emails
  .get("/users", requireAuth, isAdmin, async (c) => {
    const emails = await AllowedEmail.find({}, { email: 1, invitedAt: 1 });
    return c.json({ ok: true, data: emails });
  })
  // Add a new allowed email
  .post(
    "/users",
    requireAuth,
    isAdmin,
    zValidator("json", createAllowedEmailSchema),
    async (c) => {
      const { email } = c.req.valid("json");
      try {
        const doc = await AllowedEmail.create({ email });
        return c.json(
          {
            ok: true,
            message: "User invited",
            data: {
              id: doc._id,
              email: doc.email,
              invitedAt: doc.invitedAt,
            },
          },
          201
        );
      } catch (err: unknown) {
        if (
          typeof err === "object" &&
          err !== null &&
          "code" in err &&
          (err as { code?: number }).code === 11000
        ) {
          return c.json({ ok: false, error: "Email already invited" }, 409);
        }
        console.error(err);
        return c.json({ ok: false, error: "Server error" }, 500);
      }
    }
  )
  // Delete an allowed email by email address
  .delete("/users", requireAuth, isAdmin, async (c) => {
    const { email } = await c.req.json();
    if (!email || typeof email !== "string") {
      return c.json({ ok: false, error: "Email required" }, 400);
    }
    const result = await AllowedEmail.findOneAndDelete({ email });
    if (!result) {
      return c.json({ ok: false, error: "Email not found" }, 404);
    }
    return c.json({ ok: true, message: "Email deleted" });
  })
  // POST /cases for PDF upload and parsing
  .post("/cases", requireAuth, isAdmin, async (c) => {
    try {
      const formData = await c.req.parseBody();
      const file = formData["file"];
      if (!file || !(file instanceof File)) {
        return c.json({ ok: false, error: "No file uploaded" }, 400);
      }
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const extractedText = await pdfParse(buffer).then((data: { text: string }) => data.text);
      const vector = await getEmbedding(extractedText);
      const doc = await CaseDocument.create({
        filename: file.name || "uploaded.pdf",
        extractedText,
        vector,
      });
      return c.json({ ok: true, id: doc._id, filename: doc.filename }, 201);
    } catch (err) {
      console.error(err);
      return c.json({ ok: false, error: "Upload failed" }, 500);
    }
  })
  // DELETE /cases/:id for deleting a case
  .delete("/cases/:id", requireAuth, isAdmin, async (c) => {
    const id = c.req.param("id");
    if (!id || !ObjectId.isValid(id)) {
      return c.json({ ok: false, error: "Invalid case ID" }, 400);
    }
    const result = await CaseDocument.findOneAndDelete({ _id: new ObjectId(id) });
    if (!result) {
      return c.json({ ok: false, error: "Case not found" }, 404);
    }
    return c.json({ ok: true, message: "Case deleted" });
  })
  // GET /cases to list all cases
  .get("/cases", requireAuth, isAdmin, async (c) => {
    const cases = await CaseDocument.find({}, {
      _id: 1,
      filename: 1,
      uploadedAt: 1
    });
    const data = cases.map((doc) => ({
      id: doc._id,
      name: doc.filename,
      uploadDate: doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "-",
    }));
    return c.json({ ok: true, data });
  });

export default app;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return response.data[0].embedding;
}
