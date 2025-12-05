import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    const [rows] = await db.query(`
      SELECT 
        books.*,
        (
          SELECT user_id 
          FROM borrows 
          WHERE borrows.id_buku = books.id_buku 
          AND borrows.status IN ('pending','ongoing','requested_return')
          LIMIT 1
        ) AS borrowed_by,
        books.jumlah_buku AS total_stock,
        (
          SELECT COUNT(*) 
          FROM borrows br 
          WHERE br.id_buku = books.id_buku 
          AND br.status IN ('pending','ongoing','requested_return')
        ) AS borrowed_count
      FROM books
      ORDER BY books.id_buku DESC
    `);

    const books = Array.isArray(rows) ? rows : [];

    const formatted = books.map((b) => ({
      ...b,
      isBorrowedByUser: b.borrowed_by == userId,
      available_count: (b.total_stock ?? 0) - (b.borrowed_count ?? 0),
    }));

    return Response.json(formatted, { status: 200 });
  } catch (err) {
    console.error("BOOKS API ERROR:", err);
    return Response.json([], { status: 200 });
  }
}
