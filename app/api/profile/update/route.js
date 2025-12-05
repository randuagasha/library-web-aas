import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/lib/db";

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { nama } = await req.json();

  await pool.query("UPDATE users SET nama = ? WHERE user_id = ?", [
    nama,
    session.user.id,
  ]);

  return NextResponse.json({ success: true });
}
