import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { z } from "zod";

// Zod schema
const bookSchema = z.object({
  nama_buku: z.string().min(1),
  author: z.string().min(1),
  genre_buku: z.enum([
    "Self-Improvement",
    "Politics",
    "Biography",
    "Politics-Biography",
    "Fiction",
    "Novel",
  ]),
  gambar: z.string().url(),
  status: z.enum(["tersedia", "dipinjam"]).optional(),
  id_buku: z.number().optional(),
});

export async function GET() {
  try {
    const [books] = await pool.query(
      "SELECT * FROM books ORDER BY created_at DESC"
    );
    return NextResponse.json(books);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = bookSchema.parse(body);

    const [result] = await pool.query(
      "INSERT INTO books (nama_buku, author, genre_buku, gambar, status) VALUES (?, ?, ?, ?, ?)",
      [
        parsed.nama_buku,
        parsed.author,
        parsed.genre_buku,
        parsed.gambar,
        parsed.status || "tersedia",
      ]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error(error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to add book" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const parsed = bookSchema.parse(body);

    if (!parsed.id_buku)
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );

    await pool.query(
      "UPDATE books SET nama_buku=?, author=?, genre_buku=?, gambar=?, status=? WHERE id_buku=?",
      [
        parsed.nama_buku,
        parsed.author,
        parsed.genre_buku,
        parsed.gambar,
        parsed.status || "tersedia",
        parsed.id_buku,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ error: "Book ID required" }, { status: 400 });

    await pool.query("DELETE FROM books WHERE id_buku=?", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
