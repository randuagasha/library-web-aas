import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("avatar");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Simpan file ke /public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `avatar_${session.user.id}_${Date.now()}.png`;
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    fs.writeFileSync(filePath, buffer);

    const avatarUrl = `/uploads/${fileName}`;

    // update database
    await pool.query("UPDATE users SET avatar = ? WHERE user_id = ?", [
      avatarUrl,
      session.user.id,
    ]);

    return NextResponse.json({ avatar: avatarUrl });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
