// index.ts
import { Hono } from "hono";
import authors from "./authors";
import books from "./books";
import adminUsers from "./admin/users";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

app
  .route("/authors", authors)
  .route("/books", books)
  .route("/admin/users", adminUsers);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof app;
