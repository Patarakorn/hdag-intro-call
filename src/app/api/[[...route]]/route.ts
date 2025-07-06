// src/app/api/[[...route]]/route.ts
import { Hono } from "hono";
import { handle } from "hono/vercel";

import authors from "./authors";
import books from "./books";
import admin from "./admin";
import auth from "./auth";

export const runtime = "nodejs"; // so mongoose works, etc.

const app = new Hono()
  .basePath("/api")
  .route("/authors", authors)
  .route("/books", books)
  .route("/auth", auth)
  .route("/admin", admin);

export const GET = handle(app);
export const POST = handle(app);

// This is the type you’ll pass to `hc<AppType>(…)`
export type AppType = typeof app;
