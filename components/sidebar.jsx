"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Home",
      path: "/home",
      icon: "/icon/home.png",
      activeIcon: "/icon/home_hover.png",
    },
    {
      name: "Books",
      path: "/books",
      icon: "/icon/books.png",
      activeIcon: "/icon/books_hover.png",
    },
    {
      name: "Categories",
      path: "/categories",
      icon: "/icon/categories.png",
      activeIcon: "/icon/categories_hover.png",
    },
  ];

  const isActive = (path) => pathname === path;

  return (
    <div className="w-[280px] h-screen bg-sidebar border-r border-[#D3C0A6] flex flex-col fixed left-0 top-0">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-serif font-bold text-[#2E2E2E]">
          Starbhak Library
        </h1>
      </div>

      <nav className="flex-1 px-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors duration-200 ${
              isActive(item.path)
                ? "bg-[#3A4750] text-[#D3C0A6]"
                : "text-[#2E2E2E] hover:bg-gray-200"
            }`}
          >
            <Image
              src={isActive(item.path) ? item.activeIcon : item.icon}
              alt={item.name}
              width={24}
              height={24}
              className="w-6 h-6"
            />

            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
