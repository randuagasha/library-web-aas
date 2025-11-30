"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import LogoutModal from "../ui/LogoutModal";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "/icon/home.png", activeIcon: "/icon/home_hover.png" },
    { name: "Collections", path: "/admin/collections", icon: "/icon/books.png", activeIcon: "/icon/books_hover.png" },
    { name: "Reports", path: "/admin/reports", icon: "/icon/categories.png", activeIcon: "/icon/categories_hover.png" },
  ];

  const isActive = (path) => pathname === path;

  const handleLogout = () => setShowModal(true);
  const confirmLogout = () => signOut({ callbackUrl: "/auth/login" });

  return (
    <>
      <div className="w-[280px] h-screen bg-sidebar border-r border-[#D3C0A6] flex flex-col fixed left-0 top-0">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-serif font-bold text-[#2E2E2E]">Starbhak Library</h1>
        </div>

        <nav className="flex-1 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors duration-200 ${
                isActive(item.path) ? "bg-[#3A4750] text-[#D3C0A6]" : "text-[#2E2E2E] hover:bg-gray-200"
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

        <div className="px-4 mb-6">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 text-[#2E2E2E] hover:bg-gray-200 rounded-lg mb-2"
          >
            <Image src="/icon/setting.png" alt="Settings" width={24} height={24} className="w-6 h-6" />
            <span className="font-medium">Settings</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-[#C65D5D] hover:bg-gray-200 rounded-lg w-full"
          >
            <span>🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Modal Logout */}
      <LogoutModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
}
