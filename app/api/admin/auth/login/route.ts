import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyPassword, signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { AdminUserRecord } from "@/types/admin.types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Query admin user from MySQL database
    const users = await query<AdminUserRecord>(
      `SELECT id, email, name, role, password_hash as passwordHash 
       FROM admin_users 
       WHERE email = ? 
       LIMIT 1`,
      [email.trim().toLowerCase()]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const admin = users[0];
    const isPasswordValid = verifyPassword(password, admin.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update last_login_at in MySQL
    await query(
      "UPDATE admin_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?",
      [admin.id]
    );

    // Sign JWT token
    const token = signAdminToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    // Set secure HttpOnly cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days persistent session
    });

    return response;
  } catch (err: any) {
    console.error("Login API Error:", err);
    return NextResponse.json(
      { error: "Internal database or server error", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
