"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import BookCard from "@/components/bookCard";
import Link from "next/link";

export default function CategoriesPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const category = (name) =>
    books.filter((b) => (b.genre_buku || "").toLowerCase().includes(name));

  const selfImprovement = category("self").slice(0, 4);
  const politicsBiography = category("politics").slice(0, 4);
  const fiction = category("fiction").slice(0, 4);
  const novel = category("novel").slice(0, 4);

  const BookSection = ({ title, books, slug }) => (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#2E2E2E]">{title}</h2>

        <Link
          href={`/books?category=${slug}`}
          className="text-primary hover:underline font-medium flex items-center gap-2"
        >
          See More →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {books.length === 0 ? (
          <p className="text-gray-600">No books found.</p>
        ) : (
          books.map((book) => <BookCard key={book.id_buku} book={book} />)
        )}
      </div>
    </section>
  );

  return (
    <div className="flex min-h-screen bg-[#FAF6F0]">
      <Sidebar />

      <div className="ml-[280px] flex-1">
        <Header />

        <main className="mt-20 p-8">
          <BookSection
            title="Self-Improvement"
            books={selfImprovement}
            slug="self"
          />

          <BookSection
            title="Politics & Biography"
            books={politicsBiography}
            slug="politics"
          />

          <BookSection title="Fiction" books={fiction} slug="fiction" />

          <BookSection title="Novel" books={novel} slug="novel" />
        </main>
      </div>
    </div>
  );
}
