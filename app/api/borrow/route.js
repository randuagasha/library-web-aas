import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/lib/db";

// ============================================================
// CREATE BORROW (POST)
// ============================================================
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { book_id } = await req.json();

    // cek buku
    const [bookRows] = await pool.query(
      "SELECT jumlah_buku, status FROM books WHERE id_buku=?",
      [book_id]
    );

    if (!bookRows.length) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const buku = bookRows[0];

    if (buku.jumlah_buku <= 0) {
      return NextResponse.json(
        { error: "Book is currently unavailable" },
        { status: 400 }
      );
    }

    // INSERT BORROW
    const [result] = await pool.query(
      `INSERT INTO borrows (user_id, id_buku, status, borrow_date, due_date)
       VALUES (?, ?, 'ongoing', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))`,
      [userId, book_id]
    );

    // KURANGI STOK
    await pool.query(
      "UPDATE books SET jumlah_buku = jumlah_buku - 1 WHERE id_buku=?",
      [book_id]
    );

    // Jika habis → ubah status
    if (buku.jumlah_buku - 1 <= 0) {
      await pool.query(
        "UPDATE books SET status='dipinjam' WHERE id_buku=?",
        [book_id]
      );
    }

    return NextResponse.json({
      message: "Borrow success",
      borrow_id: result.insertId,
      user_id: userId,
      book_id,
    });
  } catch (err) {
    console.error("Borrow POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ============================================================
// RETURN BOOK (PATCH)
// ============================================================
export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { borrow_id, book_id } = await req.json();

    const [rows] = await pool.query(
      "SELECT * FROM borrows WHERE borrow_id=? AND user_id=? AND status='ongoing'",
      [borrow_id, userId]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Borrow not found" }, { status: 404 });
    }

    // Hitung denda
    const borrow = rows[0];
    let fine = 0;

    const now = new Date();
    const due = new Date(borrow.due_date);

    if (now > due) {
      const diffDays = Math.ceil((now - due) / (1000 * 60 * 60 * 24));
      fine = diffDays * 1000;
    }

    // UPDATE BORROW
    await pool.query(
      "UPDATE borrows SET status='returned', return_date=NOW(), fine_amount=? WHERE borrow_id=?",
      [fine, borrow_id]
    );

    // KEMBALIKAN STOK
    const [book] = await pool.query(
      "SELECT jumlah_buku FROM books WHERE id_buku=?",
      [book_id]
    );

    const newStock = book[0].jumlah_buku + 1;

    await pool.query(
      "UPDATE books SET jumlah_buku=? WHERE id_buku=?",
      [newStock, book_id]
    );

    if (newStock > 0) {
      await pool.query(
        "UPDATE books SET status='tersedia' WHERE id_buku=?",
        [book_id]
      );
    }

    return NextResponse.json({
      message: "Book returned",
      fine,
    });
  } catch (err) {
    console.error("Borrow PATCH error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ============================================================
// EXTEND BORROW (PUT)
// ============================================================
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { borrow_id } = await req.json();

    const [rows] = await pool.query(
      "SELECT * FROM borrows WHERE borrow_id=? AND user_id=? AND status='ongoing'",
      [borrow_id, userId]
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: "No active borrow found" },
        { status: 404 }
      );
    }

    await pool.query(
      "UPDATE borrows SET due_date = DATE_ADD(due_date, INTERVAL 7 DAY) WHERE borrow_id=?",
      [borrow_id]
    );

    return NextResponse.json({ message: "Borrow extended (+7 days)" });
  } catch (err) {
    console.error("Borrow PUT error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ============================================================
// GET BORROW HISTORY (GET)
// ============================================================
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "5");
    const offset = (page - 1) * pageSize;

    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) AS total FROM borrows WHERE user_id=?",
      [userId]
    );

    const [rows] = await pool.query(
      `SELECT b.borrow_id, b.borrow_date, b.due_date, b.return_date,
              b.status, b.fine_amount,
              bk.id_buku, bk.nama_buku, bk.author, bk.gambar
       FROM borrows b
       JOIN books bk ON b.id_buku = bk.id_buku
       WHERE b.user_id=?
       ORDER BY b.borrow_date DESC
       LIMIT ? OFFSET ?`,
      [userId, pageSize, offset]
    );

    return NextResponse.json({
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      data: rows,
    });
  } catch (err) {
    console.error("Borrow GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
