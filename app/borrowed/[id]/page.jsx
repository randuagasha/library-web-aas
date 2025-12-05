"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BorrowDetail({ params }) {
  const { id } = params;
  const [borrow, setBorrow] = useState(null);
  const router = useRouter();

  const fetchDetail = async () => {
    const res = await fetch("/api/user/history");
    const data = await res.json();
    setBorrow(data.find((d) => d.borrow_id == id));
  };

  const handleReturn = async () => {
    const res = await fetch("/api/user/return", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ borrow_id: id }),
    });

    const data = await res.json();
    alert("Return success");
    router.push("/user/profile/history");
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  if (!borrow) return "Loading...";

  return (
    <div className="p-6">
      <img src={borrow.gambar} className="w-full h-72 object-cover rounded" />
      <h1 className="text-2xl font-bold mt-4">{borrow.nama_buku}</h1>

      <div className="mt-4">
        <p>Status: {borrow.status}</p>
        <p>Borrowed: {borrow.borrow_date?.split("T")[0]}</p>
        <p>Due: {borrow.due_date?.split("T")[0]}</p>
        {borrow.status !== "returned" && (
          <button
            onClick={handleReturn}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
          >
            Return Book
          </button>
        )}
      </div>
    </div>
  );
}
