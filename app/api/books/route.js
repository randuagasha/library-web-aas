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

        -- cek apakah buku sedang dipinjam dan oleh siapa
        (
          SELECT user_id 
          FROM borrows 
          WHERE borrows.id_buku = books.id_buku 
          AND borrows.status IN ('pending','ongoing','requested_return')
          LIMIT 1
        ) AS borrowed_by

      FROM books
      ORDER BY books.id_buku DESC
    `);

    const books = Array.isArray(rows) ? rows : [];

    const formatted = books.map((b) => ({
      ...b,
      isBorrowedByUser: b.borrowed_by == userId,
    }));

    return Response.json(formatted, { status: 200 });
  } catch (err) {
    console.error("BOOKS API ERROR:", err);
    return Response.json([], { status: 200 });
  }
}
