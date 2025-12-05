import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM books ORDER BY created_at DESC"
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nama_buku, author, genre_buku, description, gambar } = body;

    const query = `
      INSERT INTO books (nama_buku, author, genre_buku, description, gambar)
      VALUES (?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      nama_buku,
      author,
      genre_buku,
      description,
      gambar,
    ]);

    return NextResponse.json({ message: "Book added successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to add book" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id_buku, nama_buku, author, genre_buku, description, gambar } = body;

    const query = `
      UPDATE books 
      SET nama_buku=?, author=?, genre_buku=?, description=?, gambar=?
      WHERE id_buku=?
    `;

    await pool.query(query, [
      nama_buku,
      author,
      genre_buku,
      description,
      gambar,
      id_buku,
    ]);

    return NextResponse.json({ message: "Book updated successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const id = new URL(request.url).searchParams.get("id");

    await pool.query("DELETE FROM books WHERE id_buku = ?", [id]);

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
