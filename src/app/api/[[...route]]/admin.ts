// src/app/api/[[...route]]/admin/users/route.ts
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { AllowedEmail } from "@/lib/models/AllowedEmail";

const createAllowedEmailSchema = z.object({
  email: z.string().email(),
});

const app = new Hono().post(
  "/users",
  basicAuth({
    username: process.env.ADMIN_USER!,
    password: process.env.ADMIN_PASS!,
    realm: "Admin Area",
  }),
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
);

export default app;
