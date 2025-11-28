import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre");

    let query = "SELECT * FROM books ORDER BY created_at DESC";
    let params = [];

    if (genre) {
      query =
        "SELECT * FROM books WHERE genre_buku = ? ORDER BY created_at DESC";
      params = [genre];
    }

    const [books] = await pool.query(query, params);

    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
