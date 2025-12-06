import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { book_id, rating, comment } = body;

    if (!book_id || !rating) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Insert rating
    await pool.query(
      "INSERT INTO ratings (book_id, user_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())",
      [book_id, session.user.id, rating, comment || ""]
    );

    // Optional: update average rating in books table
    const [rows] = await pool.query(
      "SELECT AVG(rating) as avg_rating FROM ratings WHERE book_id = ?",
      [book_id]
    );

    const avgRating = rows[0]?.avg_rating || 0;
    await pool.query("UPDATE books SET rating = ? WHERE id_buku = ?", [
      avgRating,
      book_id,
    ]);

    return NextResponse.json({ success: true, avgRating });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
