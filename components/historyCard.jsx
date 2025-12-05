import Image from "next/image";

export default function HistoryCard({ item }) {
  const cover = item.gambar || "/picture/placeholder.png";

  const normalizeSrc = (src) => {
    if (!src) return "/picture/placeholder.png";
    if (src.startsWith("http")) return src;
    if (src.startsWith("/http")) return src.slice(1);
    if (src.startsWith("public/")) return src.replace("public/", "/");
    if (!src.startsWith("/")) return "/" + src;
    return src;
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl shadow hover:scale-[1.01] transition">
      <div className="w-24 h-32 relative rounded-lg overflow-hidden bg-gray-200">
        <Image
          src={normalizeSrc(cover)}
          alt={item.nama_buku}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {item.nama_buku}
          </h3>
          <p className="text-sm text-gray-600">{item.author}</p>

          <p className="text-xs text-gray-500 mt-2">
            Borrowed: {new Date(item.borrow_date).toLocaleDateString("id-ID")}
          </p>

          <p className="text-xs text-gray-500">
            Due: {new Date(item.due_date).toLocaleDateString("id-ID")}
          </p>

          {item.return_date && (
            <p className="text-xs text-gray-500">
              Returned: {new Date(item.return_date).toLocaleDateString("id-ID")}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <span
            className={`px-3 py-1 text-xs rounded-full ${
              item.status === "returned"
                ? "bg-green-100 text-green-700"
                : item.status === "late"
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {item.status}
          </span>

          {item.fine_amount > 0 && (
            <span className="text-xs text-red-600 font-semibold">
              Fine: Rp {item.fine_amount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
