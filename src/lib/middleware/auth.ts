// src/lib/middleware/auth.ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { JWTPayload } from "jose";
import { verifyToken } from "@/lib/jwt";

export interface UserPayload extends Record<string, unknown> {
  email: string;
}

export async function requireAuth(): Promise<UserPayload> {
  // 1) grab the cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/login");
  }

  // 2) verify it (jwtVerify will throw if invalid/expired)
  let payload: JWTPayload;
  try {
    payload = await verifyToken(token);
  } catch {
    redirect("/login");
  }

  // 3) ensure the email claim is present and a string
  if (typeof payload.email !== "string") {
    redirect("/login");
  }

  // 4) return it as our UserPayload
  return payload as UserPayload;
}
