import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const ADMIN_USER = process.env.ADMIN_USER?.trim();
  const ADMIN_PASS = process.env.ADMIN_PASS?.trim();

  if (username?.trim() === ADMIN_USER && password === ADMIN_PASS) {
    // Set a simple auth cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return NextResponse.json({ success: true });
  }

  // Debug info (only if not in production or you can remove this later)
  const isUserCorrect = username?.trim() === ADMIN_USER;
  const isPassCorrect = password === ADMIN_PASS;

  return NextResponse.json(
    { 
      success: false, 
      message: !ADMIN_USER || !ADMIN_PASS 
        ? "伺服器尚未設定管理員環境變數" 
        : !isUserCorrect ? "帳號錯誤" : "密碼錯誤"
    },
    { status: 401 }
  );
}
