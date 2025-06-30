// src/middleware/requireAuth.ts
import { createMiddleware } from "hono/factory";
import type { JWTPayload } from "jose";
import { verifyToken } from "@/lib/jwt";

export const requireAuth = createMiddleware(async (c, next) => {
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
    payload = await verifyToken(token);
  } catch {
    return c.json({ ok: false, error: "Unauthorized" }, 401);
  }

  if (typeof payload.email !== "string") {
    return c.json({ ok: false, error: "Unauthorized" }, 401);
  }

  // Optionally stash user on context: c.set("user", payload);
  return next();
});
