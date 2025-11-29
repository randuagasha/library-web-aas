import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import BookCard from "@/components/bookCard";
import Link from "next/link";
import Image from "next/image";

export default async function BookDetailPage({ params }) {
  // AMBIL DATA DARI API ROUTE
  const books = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/books`, {
    cache: "no-store",
  }).then((res) => res.json());

  const book = books.find((b) => b.slug === params.slug);

  if (!book) {
    return (
      <div className="flex min-h-screen bg-[#FAF6F0]">
        <Sidebar />
        <div className="ml-[280px] flex-1">
          <Header />
          <main className="mt-20 p-8">
            <div className="text-center py-20">
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                Book Not Found
              </h1>
              <Link href="/books" className="text-primary hover:underline">
                Back to Books
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const stars = [];

    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={`${i < full ? "text-yellow-400" : "text-gray-300"} text-lg`}
        >
          ⭐
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="flex min-h-screen bg-[#FAF6F0]">
      <Sidebar />

      <div className="ml-[280px] flex-1">
        <Header />

        <main className="mt-20 p-8">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <span className="text-xl">←</span>
            <span>Back</span>
          </Link>

          {/* BOOK DETAIL CARD */}
          <div className="card p-8 mb-12">
            <div className="flex gap-8">
              {/* COVER IMAGE NEXT.JS */}
              <Image
                src={book.cover_url}
                alt={book.title}
                width={260}
                height={330}
                className="w-64 h-80 object-cover rounded-xl shadow-lg"
              />

              {/* INFO BUKU */}
              <div className="flex-1 flex flex-col">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                  {book.title}
                </h1>

                <p className="text-lg text-gray-600 mb-4">{book.author}</p>

                <div className="flex items-center gap-2 mb-6">
                  {renderStars(book.rating)}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {book.tags?.split(",").map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 text-green-600 font-medium">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Available ({book.available})
                  </span>
                </div>

                <div className="flex gap-4 mt-auto">
                  <button className="flex-1 bg-white border-2 border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
                    Buy E-Book
                  </button>

                  <button className="flex-1 btn-primary">Borrow Now</button>
                </div>
              </div>
            </div>
          </div>

          {/* FOR YOU SECTION */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
              For You
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {books.slice(0, 8).map((b) => (
                <BookCard key={b.id_book} book={b} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
