import crypto from "crypto";
import { AdminRole, AdminUser } from "@/types/admin.types";

const JWT_SECRET =
  process.env.ADMIN_JWT_SECRET ||
  "silk_karagiri_luxury_handloom_secret_key_2026_x89a";

export const ADMIN_COOKIE_NAME =
  process.env.ADMIN_COOKIE_NAME || "silk_admin_token";

export interface AdminJwtPayload {
  sub: string; // admin user ID
  email: string;
  name: string;
  role: AdminRole;
  iat: number;
  exp: number;
}

/**
 * Hash a plain text password using scrypt with salt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verify a plain text password against stored salt:hash string.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

/**
 * Create a signed JWT token string.
 */
export function signAdminToken(
  user: Pick<AdminUser, "id" | "email" | "name" | "role">,
  expiresInSeconds: number = 60 * 60 * 24 * 30 // 30 days persistent session
): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminJwtPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  ).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${encodedPayload}`)
    .digest("base64url");

  return `${header}.${encodedPayload}.${signature}`;
}

/**
 * Verify and decode an Admin JWT token. Returns payload or null if invalid/expired.
 */
export function verifyAdminToken(token: string): AdminJwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, encodedPayload, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${encodedPayload}`)
      .digest("base64url");

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload: AdminJwtPayload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    );

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}
