import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({}, { status: 401 });

  const [rows] = await pool.query(
    "SELECT user_id, nama, email, avatar FROM users WHERE user_id = ?",
    [session.user.id]
  );

  return NextResponse.json(rows[0]);
}
