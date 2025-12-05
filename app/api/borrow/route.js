import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { book_id } = await request.json();

    // 1. Cek buku ada dan status available
    const [rows] = await pool.query("SELECT * FROM books WHERE id_buku = ?", [
      book_id,
    ]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const book = rows[0];

    if (book.status_buku !== "available") {
      return NextResponse.json(
        { error: "Book already borrowed" },
        { status: 400 }
      );
    }

    // 2. Update status jadi borrowed
    await pool.query(
      "UPDATE books SET status_buku = 'borrowed' WHERE id_buku = ?",
      [book_id]
    );

    // (optional) Insert ke tabel borrow_log kalau ada
    // await pool.query("INSERT INTO borrows (book_id, user_id) VALUES (?,?)", [book_id, 1]);

    return NextResponse.json({ message: "Borrow success" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to borrow book" },
      { status: 500 }
    );
  }
}
