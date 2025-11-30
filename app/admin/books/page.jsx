"use client";
import { useEffect, useState } from "react";
import SidebarAdmin from "@/components/admin/sidebar";
import HeaderAdmin from "@/components/admin/header";
import BookForm from "@/components/admin/BookForm";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/admin/books");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAdd = async (formData) => {
    try {
      await fetch("/api/admin/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, penulis: formData.author}),
      });
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await fetch("/api/admin/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, penulis: formData.author, id_buku: editingBook.id_buku }),
      });
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete this book?")) return;
    try {
      await fetch(`/api/admin/books?id=${id}`, { method: "DELETE" });
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-[#FAF6F0]">
      <SidebarAdmin />
      <div className="flex-1 p-8 ml-[280px]">
        <HeaderAdmin title="Manage Books" />

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-[#2e2e2e]">
            {editingBook ? "Edit Book" : "Add New Book"}
          </h2>
          <BookForm
            initialData={editingBook}
            onSubmit={editingBook ? handleUpdate : handleAdd}
            onCancel={() => setEditingBook(null)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {books.map((book) => (
            <div key={book.id_buku} className="bg-[#FAF6F0] p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-[#2e2e2e]">{book.nama_buku}</h3>
              <p className="text-sm text-[#2E2E2E]">{book.penulis}</p>
              <p className="text-xs text-[#2E2E2E]">{book.genre_buku}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setEditingBook(book)}
                  className="bg-yellow-500 px-2 py-1 text-[#FAF6F0] rounded text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book.id_buku)}
                  className="bg-red-500 px-2 py-1 text-[#FAF6F0] rounded text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
