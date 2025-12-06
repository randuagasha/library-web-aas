"use client";

import { useSearch } from "../context/searchContext";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import BookCard from "@/components/bookCard";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const { query } = useSearch();

  // SWR untuk fetch dan auto refresh
  const { data: books = [], error } = useSWR("/api/books", fetcher, {
    refreshInterval: 5000, // fetch ulang tiap 5 detik
  });

  const filterBooks = (book) =>
    (book.nama_buku || "").toLowerCase().includes(query.toLowerCase());

  const filteredBooks = books.filter(filterBooks);

  const recentlyAdded = filteredBooks.slice(0, 3);
  const forYou = filteredBooks.slice(3, 15); // section berikutnya

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Failed to load books
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#FAF6F0]">
      <Sidebar />

      <div className="ml-[280px] flex-1">
        <Header />

        <main className="mt-20 p-8">
          {/* ================= HERO ================= */}
          <section className="mb-12">
            <div className="card p-8 flex items-center justify-between">
              <div className="flex-1 max-w-xl">
                <h1 className="text-4xl flex font-semibold text-[#2E2E2E] mb-4">
                  Fresh Books Has Arrived
                </h1>
                <p className="text-[#2E2E2E] mb-6 leading-relaxed">
                  Discover the latest additions to our collection. From history to self-development, explore knowledge without limits.
                </p>
                <Link href="/books">
                  <button className="bg-[#A0937D] rounded-md p-2 px-8">
                    Explore Now
                  </button>
                </Link>
              </div>

              <div className="flex items-center gap-4 ml-8">
                <div className="w-32 h-44 flex items-center">
                  <Image
                    src="/picture/48power.png"
                    alt="48 Laws of Power"
                    width={128}
                    height={176}
                    className="object-contain"
                  />
                </div>

                <div className="w-40 h-55 flex items-center">
                  <Image
                    src="/picture/dariPenjara.jpg"
                    alt="Dari Penjara"
                    width={160}
                    height={220}
                    className="object-contain"
                  />
                </div>

                <div className="w-32 h-44 flex items-center">
                  <Image
                    src="/picture/richdad_poordad.jpg"
                    alt="Rich Dad Poor Dad"
                    width={128}
                    height={176}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ================= RECENTLY ADDED ================= */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#2E2E2E] mb-6">
              Recently Added
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recentlyAdded.map((book) => (
                <BookCard key={book.id_buku} book={book} />
              ))}
            </div>
          </section>

          {/* ================= FOR YOU 1 ================= */}
          <section>
            <h2 className="text-2xl font-semibold text-[#2E2E2E] mb-6">
              For You
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {forYou.slice(0, 8).map((book) => (
                <BookCard key={book.id_buku} book={book} />
              ))}
            </div>
          </section>

          {/* ================= FOR YOU 2 ================= */}
          <section className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {forYou.slice(8, 16).map((book) => (
                <BookCard key={book.id_buku} book={book} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
