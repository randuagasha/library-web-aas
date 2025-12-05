"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import Image from "next/image";

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
  description: z.string().min(5, "Deskripsi wajib diisi"),
  gambar: z.string().min(1, "Gambar wajib diisi"),
});

export default function BookForm({ initialData = null, onSubmit, onCancel }) {
  const defaultForm = {
    nama_buku: "",
    author: "",
    genre_buku: "Self-Improvement",
    description: "",
    gambar: "",
  };

  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        nama_buku: initialData.nama_buku,
        author: initialData.author,
        genre_buku: initialData.genre_buku,
        description: initialData.description || "",
        gambar: initialData.gambar,
      });
      setPreview(initialData.gambar);
    } else {
      setForm(defaultForm);
      setPreview("");
      setErrors({});
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "gambar") {
      setPreview(value);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = Date.now() + "-" + file.name;
    const localPath = `/picture/${fileName}`;
    setForm((prev) => ({ ...prev, gambar: localPath }));

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const validated = bookSchema.parse(form);
      setErrors({});
      onSubmit(validated);
      if (!initialData) setForm(defaultForm);
    } catch (err) {
      if (err.name === "ZodError") {
        const fieldErrors = {};
        err.errors.forEach((er) => {
          fieldErrors[er.path[0]] = er.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#2e2e2e]"
    >
      <div>
        <label className="block mb-1">Nama Buku</label>
        <input
          type="text"
          name="nama_buku"
          value={form.nama_buku}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.nama_buku && (
          <p className="text-red-500 text-xs">{errors.nama_buku}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Author</label>
        <input
          type="text"
          name="author"
          value={form.author}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.author && (
          <p className="text-red-500 text-xs">{errors.author}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Genre</label>
        <select
          name="genre_buku"
          value={form.genre_buku}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option>Self-Improvement</option>
          <option>Politics</option>
          <option>Biography</option>
          <option>Politics-Biography</option>
          <option>Fiction</option>
          <option>Novel</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Deskripsi</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={3}
        />
        {errors.description && (
          <p className="text-red-500 text-xs">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Upload Gambar</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1">Masukkan URL Gambar</label>
        <input
          type="text"
          name="gambar"
          value={form.gambar}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {preview && (
        <div className="md:col-span-2">
          <p className="text-sm mb-1">Preview:</p>

          <div className="relative w-32 h-40">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover rounded shadow"
              unoptimized
            />
          </div>
        </div>
      )}

      <div className="md:col-span-2 flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {initialData ? "Update Book" : "Add Book"}
        </button>
        {initialData && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
