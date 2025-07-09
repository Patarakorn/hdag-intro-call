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

  // Stash user on context so isAdmin can access it
  c.set("user", payload);
  return next();
});

export const isAdmin = createMiddleware(async (c, next) => {
  const payload = c.get("user") as JWTPayload;
  if (!payload || typeof payload.email !== "string") {
    return c.json({ ok: false, error: "Unauthorized" }, 401);
  }
  
  if (payload.email !== process.env.ADMIN_EMAIL) {
    return c.json({ ok: false, error: "Forbidden" }, 403);
  }
  return next();
});
