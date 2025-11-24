import Link from "next/link";
import Image from "next/image";

export default function BookCard({ book, horizontal = false }) {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ⭐
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ⭐
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            ⭐
          </span>
        );
      }
    }
    return stars;
  };

  if (horizontal) {
    return (
      <Link href={`/books/${book.slug}`}>
        <div className="card overflow-hidden flex h-40 hover:scale-[1.02] transition-transform duration-300">
          {/* Book Cover */}
          <div
            className={`w-32 ${book.coverColor} flex items-center justify-center text-white p-4`}
          >
            <div className="text-center">
              <div className="text-xs font-medium mb-2 line-clamp-3">
                {book.title}
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{book.author}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex">{renderStars(book.rating)}</div>

              <button className="p-1 hover:bg-gray-100 rounded">
                <Image
                  src="/icon/save.png"
                  alt="save icon"
                  width={16}
                  height={16}
                  className="w-4 h-auto"
                />
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/books/${book.slug}`}>
      <div className="card overflow-hidden hover:scale-[1.02] transition-transform duration-300">
        {/* Book Cover */}
        <div
          className={`h-64 ${book.coverColor} flex items-center justify-center text-white p-6`}
        >
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2 line-clamp-4">
              {book.title}
            </h3>
            <p className="text-sm opacity-90">{book.author}</p>
          </div>
        </div>

        {/* Book Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{book.author}</p>

          <div className="flex items-center justify-between">
            <div className="flex text-sm">{renderStars(book.rating)}</div>

            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Image
                src="/icon/save.png"
                alt="more icon"
                width={20}
                height={20}
                className="w-5 h-auto"
              />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}