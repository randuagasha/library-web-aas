import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const offset = (page - 1) * pageSize;
    const status = searchParams.get("status") || "";

    // Total borrows count
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM borrows ${status ? "WHERE status=?" : ""}`,
      status ? [status] : []
    );

    // Fetch borrows
    const [rows] = await pool.query(
      `SELECT b.borrow_id, b.user_id, b.id_buku, b.borrow_date, b.due_date,
              b.return_date, b.status, b.fine_amount,
              bk.nama_buku, bk.author
       FROM borrows b
       JOIN books bk ON b.id_buku = bk.id_buku
       ${status ? "WHERE b.status=?" : ""}
       ORDER BY b.borrow_date DESC
       LIMIT ? OFFSET ?`,
      status ? [status, pageSize, offset] : [pageSize, offset]
    );

    return NextResponse.json({
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      data: rows,
    });
  } catch (err) {
    console.error("Admin borrows GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
