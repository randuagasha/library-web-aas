import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import BookCard from "@/components/bookCard";
import { books, forYou } from "@/lib/dummyData";
import Link from "next/link";

export default function BookDetailPage({ params }) {
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
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400 text-lg">
            ⭐
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400 text-lg">
            ⭐
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300 text-lg">
            ⭐
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <div className="flex min-h-screen bg-beige">
      <Sidebar />

      <div className="ml-[280px] flex-1">
        <Header />

        <main className="mt-20 p-8">
          {/* Back Button */}
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <span className="text-xl">←</span>
            <span>Back</span>
          </Link>

          {/* Book Detail Card */}
          <div className="card p-8 mb-12">
            <div className="flex gap-8">
              {/* Book Cover */}
              <div
                className={`w-64 h-80 ${book.coverColor} rounded-xl flex items-center justify-center text-white p-8 flex-shrink-0 shadow-lg`}
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-4 line-clamp-6">
                    {book.title}
                  </h3>
                  <p className="text-sm opacity-90">{book.author}</p>
                </div>
              </div>

              {/* Book Info */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                      {book.title}
                    </h1>
                    <p className="text-lg text-gray-600 mb-4">{book.author}</p>

                    <div className="flex items-center gap-2 mb-6">
                      {renderStars(book.rating)}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {book.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <span className="text-2xl text-gray-400">🔖</span>
                  </button>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 text-green-600 font-medium">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Available ({book.available})
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-auto">
                  <button className="flex-1 bg-white border-2 border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
                    Buy E-Book
                  </button>
                  <button className="flex-1 btn-primary">Borrow Now</button>
                </div>
              </div>
            </div>
          </div>

          {/* For You Section */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
              For You
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {forYou.slice(0, 4).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>

          {/* Second Row */}
          <section className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {forYou.slice(4, 8).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>

          {/* Third Row */}
          <section className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {forYou.slice(8, 12).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
