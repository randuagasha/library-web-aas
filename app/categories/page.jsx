import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import BookCard from "@/components/bookCard";
import { books } from "@/lib/dummyData";
import Link from "next/link";

export default function CategoriesPage() {
  const selfImprovement = books
    .filter((b) => b.category === "Self-Improvement")
    .slice(0, 4);
  const politicsBiography = books
    .filter((b) => b.category.includes("Politics"))
    .slice(0, 4);
  const fiction = books.filter((b) => b.category === "Fiction").slice(0, 4);
  const novel = books.filter((b) => b.category === "Novel").slice(0, 4);

  const BookSection = ({ title, books, slug }) => (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#2E2E2E]">{title}</h2>
        <Link
          href={`/books?category=${slug}`}
          className="text-primary hover:underline font-medium flex items-center gap-2"
        >
          See More <span>→</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
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
            slug="self-improvement"
          />

          <BookSection
            title="Politics-Biography"
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
