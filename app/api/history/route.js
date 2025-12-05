import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/lib/db";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "5");
  const offset = (page - 1) * pageSize;

  // hitung total history user
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM borrow_history
     WHERE user_id = ?`,
    [session.user.id]
  );

  // ambil data
  const [rows] = await pool.query(
    `SELECT b.*, 
            bk.nama_buku,
            bk.author,
            bk.cover_buku AS gambar
     FROM borrow_history b
     JOIN books bk ON b.book_id = bk.id_buku
     WHERE b.user_id = ?
     ORDER BY b.borrow_date DESC
     LIMIT ? OFFSET ?`,
    [session.user.id, pageSize, offset]
  );

  return NextResponse.json({
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
    data: rows,
  });
}
