// src/app/api/[[...route]]/route.ts
import { Hono } from "hono";
import { handle } from "hono/vercel";

import admin from "./admin";
import auth from "./auth";
import companies from "./companies";

export const runtime = "nodejs"; // so mongoose works, etc.

const app = new Hono()
  .basePath("/api")
  .route("/auth", auth)
  .route("/admin", admin)
  .route("/companies", companies);

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);

// This is the type you'll pass to `hc<AppType>(…)`
export type AppType = typeof app;
