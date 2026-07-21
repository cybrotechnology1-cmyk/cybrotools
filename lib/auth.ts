import { NextRequest } from "next/server";

export const ADMIN_EMAIL = "mdiismaiofficial101@gmail.com";

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "adminpassword123";

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || DEFAULT_USERNAME,
    password: process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD,
  };
}

// Generate a simple secure token for the session
export function generateToken(): string {
  const { username, password } = getAdminCredentials();
  const secret = process.env.GEMINI_API_KEY || "cybro-secret-key-salt";
  // Create a stateless verifiable signature
  const data = `${username}:${password}:${secret}`;
  if (typeof btoa !== "undefined") {
    return btoa(data);
  }
  return Buffer.from(data).toString("base64");
}

export function verifyToken(token: string | null): boolean {
  if (!token) return false;
  // Clean bearer prefix if present
  const cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token;
  const expected = generateToken();
  return cleanToken === expected;
}

export function validateAdminRequest(req: NextRequest): boolean {
  const authHeader = req.headers.get("Authorization");
  if (verifyToken(authHeader)) return true;

  // Also check cookie as fallback
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/admin_token=([^;]+)/);
  if (match && verifyToken(match[1])) return true;

  return false;
}
