import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { borrow_id, book_id } = await req.json();

    const [updateResult] = await db.query(
      `UPDATE borrow_history SET status='returned', return_date=NOW()
       WHERE borrow_id=? AND user_id=?`,
      [borrow_id, session.user.id]
    );

    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { error: "Borrow record not found" },
        { status: 404 }
      );
    }

    await db.query(
      `UPDATE borrows SET status='returned', return_date=NOW() WHERE borrow_id=?`,
      [borrow_id]
    );

    await db.query(
      `UPDATE books SET available_count = available_count + 1 WHERE id_buku=?`,
      [book_id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("RETURN API ERROR:", err);
    return NextResponse.json({ error: "Return failed" }, { status: 500 });
  }
}
