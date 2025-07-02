// src/app/api/[[...route]]/auth.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { AllowedEmail } from "@/lib/models/AllowedEmail";
import { signToken, verifyToken } from "@/lib/jwt";
import type { JWTPayload } from "jose";
import { requireAuth } from "@/lib/middleware/requireAuth";

// Shared Zod schema
const loginSchema = z.object({
  email: z.string().email(),
});

const app = new Hono()
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email } = c.req.valid("json");
    const exists = await AllowedEmail.exists({ email });
    if (!exists) {
      return c.json({ ok: false, error: "Unauthorized" }, 401);
    }
    const token = await signToken({ email });
    c.header(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`
    );
    return c.json({ ok: true });
  })
  .get("/me", async (c) => {
    const cookie = c.req.header("cookie") || "";
    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];
    if (!token) {
      return c.json({ ok: false, error: "Unauthorized" }, 401);
    }
    let payload: JWTPayload;
    try {
      payload = (await verifyToken(token)) as JWTPayload;
    } catch {
      return c.json({ ok: false, error: "Unauthorized" }, 401);
    }
    if (typeof payload.email !== "string") {
      return c.json({ ok: false, error: "Unauthorized" }, 401);
    }
    return c.json({ ok: true, user: { email: payload.email } });
  })
  .post("/logout", requireAuth, async (c) => {
    // Clear the authentication token by setting it to expire immediately
    c.header(
      "Set-Cookie",
      `token=; HttpOnly; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`
    );
    return c.json({ ok: true, message: "Logged out successfully" });
  });

export default app;
