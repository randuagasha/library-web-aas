import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/lib/db";

// ============================================================
// CREATE BORROW  (POST)
// ============================================================
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id_buku } = await req.json();

  try {
    // cek status buku
    const [bookRows] = await pool.query(
      "SELECT status FROM books WHERE id_buku = ?",
      [id_buku]
    );

    if (bookRows.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (bookRows[0].status === "dipinjam") {
      return NextResponse.json(
        { error: "Book already borrowed" },
        { status: 400 }
      );
    }

    // Insert borrow
    await pool.query(
      `INSERT INTO borrows (user_id, id_buku, status) VALUES (?, ?, 'ongoing')`,
      [userId, id_buku]
    );

    // Update status buku
    await pool.query("UPDATE books SET status = 'dipinjam' WHERE id_buku = ?", [
      id_buku,
    ]);

    return NextResponse.json({
      message: "Borrow Success",
      id_buku,
      user_id: userId,
    });
  } catch (err) {
    console.error("Borrow POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ============================================================
// RETURN BOOK  (PATCH)
// ============================================================
export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id_buku } = await req.json();

  try {
    // ambil data borrow aktif
    const [borrowRows] = await pool.query(
      `SELECT * FROM borrows 
       WHERE id_buku = ? AND user_id = ? AND status = 'ongoing' 
       ORDER BY borrow_id DESC LIMIT 1`,
      [id_buku, userId]
    );

    if (borrowRows.length === 0) {
      return NextResponse.json(
        { error: "No active borrow found" },
        { status: 404 }
      );
    }

    const borrow = borrowRows[0];
    let fine = 0;

    // hitung denda
    const now = new Date();
    const due = new Date(borrow.due_date);

    if (now > due) {
      const diffTime = now - due;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * 1000; // contoh denda 1.000/hari
    }

    // update data borrow
    await pool.query(
      `UPDATE borrows 
       SET return_date = CURRENT_TIMESTAMP, status = 'returned', fine_amount = ?
       WHERE borrow_id = ?`,
      [fine, borrow.borrow_id]
    );

    // update status buku
    await pool.query("UPDATE books SET status = 'tersedia' WHERE id_buku = ?", [
      id_buku,
    ]);

    return NextResponse.json({
      message: "Book returned",
      fine,
    });
  } catch (err) {
    console.error("Borrow RETURN error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ============================================================
// EXTEND DUE DATE  (PUT)
// ============================================================
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { id_buku } = await req.json();

  try {
    // cari borrow aktif
    const [rows] = await pool.query(
      `SELECT * FROM borrows WHERE id_buku = ? AND user_id = ? AND status = 'ongoing'
       ORDER BY borrow_id DESC LIMIT 1`,
      [id_buku, userId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "You have no active borrow for this book" },
        { status: 404 }
      );
    }

    // extend +7 hari dari due_date
    await pool.query(
      `UPDATE borrows 
       SET due_date = DATE_ADD(due_date, INTERVAL 7 DAY)
       WHERE borrow_id = ?`,
      [rows[0].borrow_id]
    );

    return NextResponse.json({ message: "Borrow period extended (+7 days)" });
  } catch (err) {
    console.error("Borrow EXTEND error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ============================================================
// GET HISTORY (GET)
// ============================================================
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT 
        b.borrow_id,
        b.borrow_date,
        b.due_date,
        b.return_date,
        b.status,
        b.fine_amount,

        bk.id_buku,
        bk.nama_buku,
        bk.author,
        bk.gambar,
        bk.genre_buku

      FROM borrows b
      JOIN books bk ON b.id_buku = bk.id_buku
      WHERE b.user_id = ?
      ORDER BY b.borrow_date DESC`,
      [userId]
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Borrow HISTORY error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
