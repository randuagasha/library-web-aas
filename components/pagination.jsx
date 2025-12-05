// components/Pagination.jsx
"use client";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const prev = () => onChange(Math.max(1, page - 1));
  const next = () => onChange(Math.min(totalPages, page + 1));

  const pagesToShow = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pagesToShow.push(i);

  return (
    <div className="flex items-center gap-2 mt-4">
      <button
        onClick={prev}
        disabled={page === 1}
        className="px-3 py-1 rounded bg-gray-200 text-sm disabled:opacity-50"
      >
        Prev
      </button>

      {pagesToShow.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 rounded text-sm ${
            p === page ? "bg-black text-white" : "bg-gray-100"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={next}
        disabled={page === totalPages}
        className="px-3 py-1 rounded bg-gray-200 text-sm disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
