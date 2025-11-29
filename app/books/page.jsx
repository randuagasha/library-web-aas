"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import BookCard from "@/components/bookCard";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Self-Improvement",
    "Politics",
    "Biography",
    "Politics-Biography",
    "Fiction",
    "Noval",
  ];

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
    loadBooks();
  }, []);

  const filteredBooks =
    selectedCategory === "All"
      ? books
      : books.filter((b) => b.genre_buku === selectedCategory);

  return (
    <div className="flex min-h-screen bg-[#FAF6F0]">
      <Sidebar />

      <div className="ml-[280px] flex-1">
        <Header />

        <main className="mt-20 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Books Genres
            </h1>
          </div>

          {/* Category Pills */}
          <div className="mb-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  selectedCategory === category
                    ? "bg-[#A0937D] text-[#FAF6F0]"
                    : "bg-[#FAF6F0] text-[#2E2E2E] hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Books Grid */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Library Collections
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id_buku} book={book} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
