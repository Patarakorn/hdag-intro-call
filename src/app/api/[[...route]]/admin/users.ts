// src/app/api/[[...route]]/admin/users/route.ts
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { AllowedEmail } from "@/lib/models/AllowedEmail";

const admin = new Hono();

// Protect every POST to /api/admin/users with HTTP Basic Auth
admin.post(
  "/",
  basicAuth({
    username: process.env.ADMIN_USER!,
    password: process.env.ADMIN_PASS!,
    realm: "Admin Area",
  }),
  async (c) => {
    const { email } = await c.req.json();
    await AllowedEmail.create({ email });
    return c.json({ ok: true });
  }
);

export default admin;
