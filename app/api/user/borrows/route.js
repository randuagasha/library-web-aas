import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [borrows] = await pool.query(
      `
      SELECT 
        br.borrow_id,
        br.borrow_date,
        br.due_date,
        br.return_date,
        br.status,
        b.nama_buku,
        b.author,
        b.gambar
      FROM borrows br
      JOIN books b ON br.id_buku = b.id_buku
      WHERE br.user_id = ?
      ORDER BY br.borrow_date DESC
    `,
      [userId]
    );

    return NextResponse.json(borrows);
  } catch (error) {
    console.error("Error fetching borrow history:", error);
    return NextResponse.json(
      { error: "Failed to fetch borrow history" },
      { status: 500 }
    );
  }
}
