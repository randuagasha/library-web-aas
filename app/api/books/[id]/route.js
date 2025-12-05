import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request, context) {
  try {
    const { id } = await context.params;

    // Ambil data buku
    const [books] = await pool.query("SELECT * FROM books WHERE id_buku = ?", [
      id,
    ]);

    if (books.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const book = books[0];

    // Hitung berapa yang sedang dipinjam (ongoing)
    const [borrowed] = await pool.query(
      "SELECT COUNT(*) AS total FROM borrows WHERE id_buku = ? AND status = 'ongoing'",
      [id]
    );

    const borrowed_count = borrowed[0].total || 0;

    // Hitung available
    const available_count = Math.max(
      (book.jumlah_buku || 0) - borrowed_count,
      0
    );

    // Return dengan stok baru
    return NextResponse.json({
      ...book,
      borrowed_count,
      available_count,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}
