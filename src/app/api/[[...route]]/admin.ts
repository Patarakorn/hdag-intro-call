// src/app/api/[[...route]]/admin/users/route.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { AllowedEmail } from "@/lib/models/AllowedEmail";
import { requireAuth, isAdmin } from "@/lib/middleware/requireAuth";

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
  });

export default app;
