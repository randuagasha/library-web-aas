import Link from "next/link";
import Image from "next/image";

export default function BookCard({ book, horizontal = false }) {
  // Data normalization
  const title = book.nama_buku ?? "Untitled";
  const author = book.penulis ?? "Unknown Author";
  const cover = book.cover ?? book.gambar ?? null;
  const slugOrId = book.slug ?? book.id_buku;

  const normalizeImageSrc = (src) => {
    if (!src) return "/picture/placeholder.png";
    if (src.startsWith("public/")) src = src.replace("public/", "");
    if (!src.startsWith("/")) src = "/" + src;
    return src;
  };

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating || 0);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={i < full ? "text-yellow-400" : "text-gray-300"}
        >
          ⭐
        </span>
      );
    }
    return stars;
  };

  /* ================= HORIZONTAL CARD ================= */
  if (horizontal) {
    return (
      <Link href={`/books/${slugOrId}`}>
        <div className="card flex h-40 overflow-hidden hover:scale-[1.02] transition-transform duration-300 rounded-xl shadow">
          {/* Cover */}
          <div className="w-28 h-full bg-gray-100 relative flex items-center justify-center">
            <Image
              src={normalizeImageSrc(cover)}
              alt={title}
              width={112}
              height={160}
              className="object-cover w-full h-full rounded-l-xl"
            />
          </div>

          {/* Info */}
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
    );
  }

  /* ================= VERTICAL CARD ================= */
  return (
    <Link href={`/books/${slugOrId}`}>
      <div className="card overflow-hidden hover:scale-[1.02] transition-transform duration-300 rounded-xl shadow">
        {/* Cover */}
        <div className="h-64 bg-gray-100 relative">
          <Image
            src={normalizeImageSrc(cover)}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
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
  );
}
