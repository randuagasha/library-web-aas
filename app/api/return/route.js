import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import db from "@/lib/db";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { borrow_id, book_id } = await req.json();

    // Hapus history borrow
    await db.query("DELETE FROM borrows WHERE id = ? AND user_id = ?", [
      borrow_id,
      session.user.id,
    ]);

    // Balikan status buku
    await db.query("UPDATE books SET status = 'tersedia' WHERE id_buku = ?", [
      book_id,
    ]);

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Return failed" }, { status: 500 });
  }
}
