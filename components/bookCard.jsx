import Link from "next/link";
import Image from "next/image";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

export default function BookCard({ book, horizontal = false }) {
  const title = book.nama_buku || "Untitled";
  const author = book.author || "Unknown Author";
  const cover = book.gambar || "/picture/placeholder.png";
  const id = book.id_buku;

  const isBorrowed = book.status_buku === "borrowed";

  // Normalisasi gambar
  const normalizeImageSrc = (src) => {
    if (!src) return "/picture/placeholder.png";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    if (src.startsWith("/http://") || src.startsWith("/https://"))
      return src.slice(1);
    if (src.startsWith("public/")) src = src.replace("public/", "");
    if (!src.startsWith("/")) src = "/" + src;
    return src;
  };

  // Render rating dengan Heroicons
  const renderStars = (rating) => {
    const full = Math.floor(rating || 0);
    return Array.from({ length: 5 }, (_, i) => {
      return i < full ? (
        <StarSolid key={i} className="w-5 h-5 text-yellow-400" />
      ) : (
        <StarOutline key={i} className="w-5 h-5 text-gray-300" />
      );
    });
  };

  /* ================= HORIZONTAL CARD ================= */
  if (horizontal) {
    return (
      <div
        className={`relative ${
          isBorrowed ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isBorrowed && (
          <span className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs px-2 py-1 rounded">
            Borrowed
          </span>
        )}

        <Link href={isBorrowed ? "#" : `/books/${book.id_buku}`}>
          <div className="card flex h-40 overflow-hidden hover:scale-[1.02] transition-transform duration-300 rounded-xl shadow">
            <div className="w-28 h-full bg-gray-100 relative flex items-center justify-center">
              <Image
                src={normalizeImageSrc(cover)}
                alt={title}
                width={112}
                height={160}
                className="object-cover w-full h-full rounded-l-xl"
              />
            </div>

            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-600">{author}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex">{renderStars(book.rating)}</div>
                <button className="p-1 hover:bg-gray-100 rounded">🔖</button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  /* ================= VERTICAL CARD ================= */
  return (
    <div
      className={`relative ${
        isBorrowed ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isBorrowed && (
        <span className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs px-2 py-1 rounded">
          Borrowed
        </span>
      )}

      <Link href={isBorrowed ? "#" : `/books/${book.id_buku}`}>
        <div className="card overflow-hidden hover:scale-[1.02] transition-transform duration-300 rounded-xl shadow">
          <div className="h-64 bg-gray-100 relative">
            <Image
              src={normalizeImageSrc(cover)}
              alt={title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{author}</p>

            <div className="flex items-center justify-between">
              <div className="flex text-sm">{renderStars(book.rating)}</div>
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
        </div>
      </Link>
    </div>
  );
}
