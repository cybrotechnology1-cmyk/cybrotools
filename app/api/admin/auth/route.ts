import { NextRequest, NextResponse } from "next/server";
import { getAdminCredentials, generateToken, verifyToken } from "@/lib/auth";
import { addAuditLog } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const creds = getAdminCredentials();

    if (username === creds.username && password === creds.password) {
      const token = generateToken();
      addAuditLog("Admin Login Success", `Admin account '${username}' logged in successfully.`);
      const response = NextResponse.json({ success: true, token });
      
      // Set secure cookie as well for native browser requests if any
      response.cookies.set("admin_token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;
    }

    addAuditLog("Admin Login Failed", `Failed login attempt for user '${username}'.`);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const cookieToken = req.cookies.get("admin_token")?.value;
    const token = authHeader?.replace("Bearer ", "") || cookieToken;

    if (token && verifyToken(token)) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ authenticated: false, error: "Verification failed" }, { status: 500 });
  }
}
