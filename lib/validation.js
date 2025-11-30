import { z } from "zod";

export const bookSchema = z.object({
  nama_buku: z.string().min(1, "Nama buku wajib diisi"),
  penulis: z.string().min(1, "Nama penulis wajib diisi"),
  genre_buku: z.string().min(1, "Genre wajib diisi"),
  cover: z.string().url("URL cover tidak valid"),
  stok: z.number().min(0, "Stok minimal 0"),
});
