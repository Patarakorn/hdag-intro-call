// src/lib/jwt.ts
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const encoder = new TextEncoder();

// Tell TS this payload _is_ a JWTPayload
export async function signToken(
  payload: JWTPayload,
  expiresIn = "1h"
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encoder.encode(process.env.JWT_SECRET!));
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(
    token,
    encoder.encode(process.env.JWT_SECRET!)
  );
  return payload;
}
