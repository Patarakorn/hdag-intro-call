// index.ts
import { Hono } from "hono";
import authors from "./authors";
import books from "./books";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.route("/authors", authors).route("/books", books);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof app;
