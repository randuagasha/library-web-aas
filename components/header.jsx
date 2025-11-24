"use client";

import { useSearch } from "@/app/context/searchContext";
import Image from "next/image";

export default function Header() {
  const { query: searchQuery, setQuery: setSearchQuery } = useSearch();

  return (
    <header className="h-20 bg-[#FAF6F0] border-b flex items-center justify-between px-8 fixed top-0 right-0 left-[280px] z-40">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-[#2E2E2E] w-full pl-10 pr-4 py-2 border border-[#D3C0A6] rounded-lg focus:outline-none transition-colors duration-200"
          />

          <Image
            src="/icon/search.png"
            alt="Search Icon"
            width={20}
            height={20}
            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2"
          />
        </div>
      </div>

      <div className="flex items-center gap-10 ml-8">
        <button className="text-gray-600 hover:text-gray-900 transition-colors duration-200 relative">
          <Image
            src="/icon/notif1.png"
            alt="Notification"
            width={28}
            height={28}
            className="w-7 h-7"
          />
        </button>

        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
          <Image
            src="/icon/profile.png"
            alt="Profile"
            width={36}
            height={36}
            className="w-9 h-9"
          />
          <span className="text-gray-900 font-medium"></span>
        </button>
      </div>
    </header>
  );
}
