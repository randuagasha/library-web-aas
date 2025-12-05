"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default function BookDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBook() {
      try {
        const res = await fetch(`/api/books/${id}`);
        const data = await res.json();
        console.log("BOOK DETAIL:", data);x
        setBook(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching book:", err);
      }
    }
    loadBook();
  }, [id]);

  async function handleBorrow() {
    try {
      const res = await fetch("/api/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_id: book.id_buku }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("Book borrowed successfully!");
      router.push("/books");
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen bg-[#FAF6F0]">
      <Sidebar />
      <div className="ml-[280px] flex-1">
        <Header />

        <main className="mt-20 p-8">
          <div className="bg-white shadow-lg rounded-xl p-6 flex gap-8">
            {/* IMAGE */}
            <div className="relative w-64 h-96 rounded overflow-hidden shadow">
              <Image
                src={book.gambar || "/placeholder.png"}
                alt={book.nama_buku || "Book Cover"}
                fill
                className="object-cover bg-gray-200"
                unoptimized
              />
            </div>

            {/* BOOK INFO */}
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {book.nama_buku}
                </h1>

                <p className="text-gray-600 mt-2 text-lg">
                  Author: {book.author}
                </p>

                <p className="mt-1 text-gray-700">Genre: {book.genre_buku}</p>

                <p className="mt-4 text-gray-800">
                  {book.deskripsi || "Tidak ada deskripsi."}
                </p>

                <p className="mt-4 font-semibold text-[#2e2e2e]">
                  Status:{" "}
                  <span
                    className={
                      book.status === "tersedia"
                        ? "text-green-700"
                        : "text-red-600"
                    }
                  >
                    {book.status}
                  </span>
                </p>
              </div>

              <button
                onClick={handleBorrow}
                disabled={book.status !== "tersedia"}
                className={`mt-6 px-6 py-3 rounded-lg w-fit font-semibold transition ${
                  book.status === "tersedia"
                    ? "bg-[#A0937D] text-white hover:bg-[#8a816c]"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
              >
                {book.status === "tersedia"
                  ? "Borrow Book"
                  : "Currently Unavailable"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
