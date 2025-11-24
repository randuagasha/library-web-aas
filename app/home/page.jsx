"use client";

import { useSearch } from "../context/searchContext";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import BookCard from "@/components/bookCard";
import { recentlyAdded, forYou } from "@/lib/dummyData";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const { query } = useSearch();

  const filterBooks = (book) =>
    book.title.toLowerCase().includes(query.toLowerCase());

  const filteredRecentlyAdded = recentlyAdded.filter(filterBooks);
  const filteredForYou = forYou.filter(filterBooks);

  return (
    <div className="flex min-h-screen bg-[#FAF6F0]">
      <Sidebar />

      <div className="ml-[280px] flex-1">
        <Header />

        <main className="mt-20 p-8">
          <section className="mb-12">
            <div className="card p-8 flex items-center justify-between">
              <div className="flex-1 max-w-xl">
                <h1 className="text-4xl flex font-semibold text-[#2E2E2E] mb-4">
                  Fresh Books Has Arrived
                </h1>
                <p className="text-[#2E2E2E] mb-6 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad
                </p>
                <Link href="/books">
                <button className="bg-[#A0937D] rounded-md p-2 px-8 ">
                  Explore Now
                </button>
                </Link>
              </div>

              <div className="flex items-center gap-4 ml-8">
                <div className="w-32 h-44 flex items-center">
                  <Image
                    src="/picture/48power.png"
                    alt="48power"
                    width={128}
                    height={176}
                    className="object-contain"
                  />
                </div>

                <div className="w-40 h-55 flex items-center">
                  <Image
                    src="/picture/dariPenjara.jpg"
                    alt="dariPenjara"
                    width={160}
                    height={220}
                    className="object-contain"
                  />
                </div>

                <div className="w-32 h-44 flex items-center">
                  <Image
                    src="/picture/richdad_poordad.jpg"
                    alt="richdad_poordad"
                    width={128}
                    height={176}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl flex font-semibold text-[#2E2E2E] mb-6">
              Recently Added
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredRecentlyAdded.map((book) => (
                <BookCard key={book.id} book={book} horizontal />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl flex font-semibold text-[#2E2E2E] mb-6">
              For You
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredForYou.slice(0, 8).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>

          <section className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredForYou.slice(8, 12).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
