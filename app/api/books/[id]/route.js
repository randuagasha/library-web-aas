import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request, context) {
  try {
    const { id } = await context.params;

    const [books] = await pool.query("SELECT * FROM books WHERE id_buku = ?", [
      id,
    ]);

    if (books.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(books[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}
