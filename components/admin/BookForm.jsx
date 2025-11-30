"use client";

import { useState, useEffect } from "react";
import { z } from "zod";

const bookSchema = z.object({
  nama_buku: z.string().min(1, "Nama buku wajib diisi"),
  author: z.string().min(1, "Author wajib diisi"),
  genre_buku: z.enum([
    "Self-Improvement",
    "Politics",
    "Biography",
    "Politics-Biography",
    "Fiction",
    "Novel",
  ]),
  gambar: z.string().url("Gambar harus berupa URL"),
  status: z.enum(["tersedia", "dipinjam"]).optional(),
});

export default function BookForm({ initialData = null, onSubmit, onCancel }) {
  const defaultForm = {
    nama_buku: "",
    author: "",
    genre_buku: "Self-Improvement",
    gambar: "",
    status: "tersedia",
  };

  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
    } else {
      setForm(defaultForm);
      setErrors({});
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const validated = bookSchema.parse(form);
      setErrors({});
      onSubmit(validated);

      // Reset form only if adding new
      if (!initialData) {
        setForm(defaultForm);
      }
    } catch (err) {
      if (err.name === "ZodError" && err.errors) {
        const fieldErrors = {};
        err.errors.forEach((e) => {
          fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error("Unexpected error:", err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block mb-1 text-[#2e2e2e]">Nama Buku</label>
        <input
          type="text"
          name="nama_buku"
          value={form.nama_buku}
          onChange={handleChange}
          className="w-full p-2 border rounded text-[#2e2e2e]"
        />
        {errors.nama_buku && <p className="text-red-500 text-xs">{errors.nama_buku}</p>}
      </div>

      <div>
        <label className="block mb-1 text-[#2e2e2e]">Author</label>
        <input
          type="text"
          name="author"
          value={form.author}
          onChange={handleChange}
          className="w-full p-2 border rounded text-[#2e2e2e]"
        />
        {errors.author && <p className="text-red-500 text-xs">{errors.author}</p>}
      </div>

      <div>
        <label className="block mb-1 text-[#2e2e2e]">Genre</label>
        <select
          name="genre_buku"
          value={form.genre_buku}
          onChange={handleChange}
          className="w-full p-2 border rounded text-[#2e2e2e]"
        >
          <option>Self-Improvement</option>
          <option>Politics</option>
          <option>Biography</option>
          <option>Politics-Biography</option>
          <option>Fiction</option>
          <option>Novel</option>
        </select>
        {errors.genre_buku && <p className="text-red-500 text-xs">{errors.genre_buku}</p>}
      </div>

      <div>
        <label className="block mb-1 text-[#2e2e2e]">Gambar (URL)</label>
        <input
          type="text"
          name="gambar"
          value={form.gambar}
          onChange={handleChange}
          className="w-full p-2 border rounded text-[#2e2e2e]"
        />
        {errors.gambar && <p className="text-red-500 text-xs">{errors.gambar}</p>}
      </div>

      <div>
        <label className="block mb-1 text-[#2e2e2e]">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 border rounded text-[#2e2e2e]"
        >
          <option value="tersedia">Tersedia</option>
          <option value="dipinjam">Dipinjam</option>
        </select>
      </div>

      <div className="md:col-span-2 flex gap-2 mt-2">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          {initialData ? "Update Book" : "Add Book"}
        </button>
        {initialData && onCancel && (
          <button
            type="button"
            onClick={() => {
              onCancel();
              setForm(defaultForm);
              setErrors({});
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
