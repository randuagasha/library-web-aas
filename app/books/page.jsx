"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import BookCard from "@/components/bookCard";
import { books } from "@/lib/dummyData";

export default function BooksPage() {
  const [selectedCategory, setSelectedCategory] = useState("Self-Improvement");

  const categories = [
    "Self-Improvement",
    "Romance",
    "Fiction",
    "Non-Fiction",
    "Politics",
    "Finance & Economics",
    "Biography",
  ];

  const filteredBooks =
    selectedCategory === "Self-Improvement"
      ? books.filter((book) => book.category === "Self-Improvement")
      : books.filter(
          (book) =>
            book.category.includes(selectedCategory) ||
            book.category === selectedCategory
        );

  return (
    <div className="flex min-h-screen bg-[#FAF6F0]">
      <Sidebar />

      <div className="ml-[280px] flex-1">
        <Header />

        <main className="mt-20 p-8">
          {/* Page Title */}
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
                className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Library Collections
              </h2>
              <button className="text-gray-600 hover:text-gray-900">
                <span className="text-xl">☰</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
