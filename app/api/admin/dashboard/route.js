import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get statistics
    const [totalBooksResult] = await pool.query(
      "SELECT COUNT(*) as count FROM books"
    );
    const [activeLoanResult] = await pool.query(
      "SELECT COUNT(*) as count FROM borrows WHERE status IN ('ongoing', 'pending')"
    );
    const [overdueResult] = await pool.query(
      "SELECT COUNT(*) as count FROM borrows WHERE status = 'late'"
    );
    const [usersResult] = await pool.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'user'"
    );

    // Get borrow by category stats
    const [borrowByCategory] = await pool.query(`
      SELECT 
        b.genre_buku as category,
        COUNT(br.borrow_id) as count
      FROM borrows br
      JOIN books b ON br.id_buku = b.id_buku
      GROUP BY b.genre_buku
    `);

    // Get recent borrows with details
    const [recentBorrows] = await pool.query(`
      SELECT 
        br.borrow_id,
        br.user_id,
        br.id_buku,
        br.borrow_date,
        br.due_date,
        br.return_date,
        br.status,
        b.nama_buku,
        u.nama as user_name
      FROM borrows br
      JOIN books b ON br.id_buku = b.id_buku
      JOIN users u ON br.user_id = u.user_id
      ORDER BY br.borrow_date DESC
      LIMIT 10
    `);

    return NextResponse.json({
      statistics: {
        totalBooks: totalBooksResult[0].count,
        activeLoans: activeLoanResult[0].count,
        overdue: overdueResult[0].count,
        usersRegistered: usersResult[0].count,
      },
      borrowByCategory,
      recentBorrows,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
