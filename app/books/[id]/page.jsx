"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import BookCard from "@/components/bookCard";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loadingBorrow, setLoadingBorrow] = useState(false);

  // recommendations for "For You" subpage
  const [recs, setRecs] = useState([]);
  const [recsLoading, setRecsLoading] = useState(true);

  useEffect(() => {
    async function loadBook() {
      const res = await fetch(`/api/books/${id}`);
      const data = await res.json();
      setBook(data);
    }
    loadBook();
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    async function loadRecs() {
      setRecsLoading(true);
      try {
        const res = await fetch(`/api/books`);
        if (!res.ok) {
          setRecs([]);
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          const arr = Array.isArray(data) ? data : data.data || [];
          setRecs(
            arr.filter((b) => String(b.id_buku) !== String(id)).slice(0, 12)
          );
        }
      } catch (err) {
        console.error("recs fetch error", err);
        if (!cancelled) setRecs([]);
      } finally {
        if (!cancelled) setRecsLoading(false);
      }
    }
    loadRecs();
    return () => (cancelled = true);
  }, [id]);

  async function handleBorrow() {
    setLoadingBorrow(true);
    try {
      const res = await fetch("/api/borrow", {
        method: "POST",
        body: JSON.stringify({ book_id: id }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error);
        setLoadingBorrow(false);
        return;
      }
      alert("Borrow success!");
      router.push("/profile");
    } catch (err) {
      console.error(err);
    }
    setLoadingBorrow(false);
  }

  if (!book) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2E2E2E] flex">
      <div className="w-[260px]">
        <Sidebar />
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 relative">
        <div className="ml-[280px] bg-[#FAF6F0]">
          <Header />
        </div>

        <main className="pt-24 px-8 pb-12 max-w-6xl mx-auto">
          {/* Back arrow */}
          <div className="mb-4">
            <button
              onClick={() => history.back()}
              className="inline-flex items-center gap-2 text-sm text-[#2E2E2E] opacity-80 hover:opacity-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          </div>

          {/* Detail card */}
          <section className="bg-[#FAF6F0]/80 border border-[#E6DDCF] rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48">
                <div className="relative w-full h-[340px] md:h-[360px] rounded-lg overflow-hidden">
                  <Image
                    src={book.gambar || "/placeholder.png"}
                    alt={book.nama_buku}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-semibold">
                      {book.nama_buku}
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">{book.author}</p>

                    {/* tags */}
                    {book.tags && book.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {book.tags.map((t, i) => (
                          <span
                            key={i}
                            className="text-xs px-3 py-1 rounded-full border border-[#E6DDCF] text-[#2E2E2E]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* availability */}
                    <div className="mt-4 flex items-center gap-4">
                      <span className="text-green-600 font-semibold">
                        Available ({book.available_count ?? 0})
                      </span>

                      {/* rating */}
                      <div className="flex items-center gap-1">
                        {book.rating ? (
                          <>
                            {Array.from({ length: 5 }, (_, i) =>
                              i < Math.floor(book.rating) ? (
                                <StarSolid
                                  key={i}
                                  className="w-5 h-5 text-yellow-400"
                                />
                              ) : (
                                <StarOutline
                                  key={i}
                                  className="w-5 h-5 text-gray-300"
                                />
                              )
                            )}
                            <span className="ml-2 text-sm text-gray-600">
                              {book.rating.toFixed(1)}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No ratings yet
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* bookmark icon */}
                  <div className="ml-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <Image
                        src="/icon/save.png"
                        alt="Save Book"
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>
                </div>

                {/* description */}
                <p className="mt-6 text-[#2e2e2e] leading-relaxed">
                  {book.description}
                </p>

                {/* actions */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    className="px-4 py-2 rounded-lg border text-sm hover:bg-[#f3efe7]"
                    onClick={() => {
                      if (book.ebook_link)
                        window.open(book.ebook_link, "_blank");
                      else alert("E-Book not available");
                    }}
                  >
                    Buy E-Book
                  </button>

                  <button
                    onClick={handleBorrow}
                    disabled={book.status_buku === "borrowed" || loadingBorrow}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      book.status_buku === "borrowed"
                        ? "bg-[#FAF6F0] text-white cursor-not-allowed"
                        : "bg-[#FAF6F0] border border-[#008CFF] text-[#008CFF] hover:bg-[#e2f2ff]"
                    }`}
                  >
                    {loadingBorrow
                      ? "Processing..."
                      : book.status_buku === "borrowed"
                      ? "Already Borrowed"
                      : "Borrow Now"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Subpage: For You */}
          <section className="mt-10">
            <h2 className="text-lg font-semibold mb-4">For You</h2>

            {recsLoading ? (
              <div className="text-gray-500">Loading recommendations…</div>
            ) : recs.length === 0 ? (
              <div className="text-gray-500">No recommendations available.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
                {recs.map((book, index) => (
                  <BookCard key={book.id_buku ?? index} book={book} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
