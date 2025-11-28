"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function UserHome() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        } else if (status === "authenticated" && session?.user?.role === "admin") {
            router.push("/admin/dashboard");
        }
    }, [status, session, router]);

    useEffect(() => {
        if (session?.user?.role === "user") {
            fetchBooks();
        }
    }, [session]);

    const fetchBooks = async () => {
        try {
            const response = await fetch("/api/books");
            const data = await response.json();
            setBooks(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching books:", error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        signOut({ callbackUrl: "/auth/login" });
    };

    if (loading || status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#FAF6F0]">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    const groupedBooks = {
        "Self-Improvement": books.filter(
            (b) => b.genre_buku === "Self-Improvement"
        ),
        "Politics-Biography": books.filter(
            (b) => b.genre_buku === "Politics-Biography" || b.genre_buku === "Politics" || b.genre_buku === "Biography"
        ),
        Fiction: books.filter((b) => b.genre_buku === "Fiction"),
        Novel: books.filter((b) => b.genre_buku === "Novel"),
    };

    const recentBooks = books.slice(0, 3);

    return (
        <div className="flex min-h-screen bg-[#FAF6F0]">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-[#2E2E2E]">Starbhak Library</h1>
                </div>

                <nav className="mt-6">
                    <Link
                        href="/user/home"
                        className="flex items-center px-6 py-3 bg-[#3A4750] text-white"
                    >
                        <span className="mr-3">🏠</span>
                        Home
                    </Link>
                    <Link
                        href="/user/books"
                        className="flex items-center px-6 py-3 text-[#2E2E2E] hover:bg-gray-100"
                    >
                        <span className="mr-3">📚</span>
                        Books
                    </Link>
                    <Link
                        href="/user/categories"
                        className="flex items-center px-6 py-3 text-[#2E2E2E] hover:bg-gray-100"
                    >
                        <span className="mr-3">📑</span>
                        Categories
                    </Link>
                </nav>

                <div className="absolute bottom-0 w-64 p-6 border-t">
                    <Link
                        href="/user/settings"
                        className="flex items-center px-6 py-3 text-[#2E2E2E] hover:bg-gray-100"
                    >
                        <span className="mr-3">⚙️</span>
                        Settings
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-6 py-3 text-[#C65D5D] hover:bg-gray-100 w-full text-left"
                    >
                        <span className="mr-3">🚪</span>
                        Log out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {/* Header */}
                <div className="bg-white shadow-sm p-4 flex items-center justify-between">
                    <div className="flex-1 max-w-md mx-auto">
                        <input
                            type="search"
                            placeholder="Search books or authors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchQuery) {
                                    router.push(`/user/books?search=${encodeURIComponent(searchQuery)}`);
                                }
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A4750]"
                        />
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                        <button className="p-2 hover:bg-gray-200 rounded-full">🔔</button>
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            👤
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="p-8">
                    <div className="bg-gradient-to-r from-[#5A7184] to-[#3A4750] rounded-lg p-8 mb-8 text-white">
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold mb-4">Fresh Books</h2>
                                <h3 className="text-2xl mb-4">Has Arrived</h3>
                                <p className="text-sm mb-6 max-w-md opacity-90">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                                    do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    Ut enim ad
                                </p>
                                <button className="bg-white text-[#3A4750] px-6 py-2 rounded-md hover:bg-gray-100">
                                    Explore Now
                                </button>
                            </div>
                            <div className="flex gap-4">
                                {recentBooks.map((book) => (
                                    <div
                                        key={book.id_buku}
                                        className="w-32 h-44 bg-white rounded-lg overflow-hidden shadow-lg"
                                    >
                                        <Image
                                            src={book.gambar}
                                            alt={book.nama_buku}
                                            width={128}
                                            height={176}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recently Added */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[#2E2E2E]">
                                Recently Added
                            </h3>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            {books.slice(0, 3).map((book) => (
                                <Link
                                    key={book.id_buku}
                                    href={`/user/books/${book.id_buku}`}
                                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                                >
                                    <div className="h-64 overflow-hidden rounded-t-lg">
                                        <Image
                                            src={book.gambar}
                                            alt={book.nama_buku}
                                            width={300}
                                            height={256}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-semibold text-[#2E2E2E] mb-1">
                                            {book.nama_buku}
                                        </h4>
                                        <p className="text-sm text-gray-600">{book.author}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex text-yellow-400">★★★★★</div>
                                            <button className="ml-auto p-2 hover:bg-gray-100 rounded">
                                                🔖
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded">
                                                ⋮
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* For You Section */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[#2E2E2E]">For You</h3>
                        </div>
                        <div className="grid grid-cols-4 gap-6">
                            {books.slice(3, 11).map((book) => (
                                <Link
                                    key={book.id_buku}
                                    href={`/user/books/${book.id_buku}`}
                                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                                >
                                    <div className="h-64 overflow-hidden rounded-t-lg">
                                        <Image
                                            src={book.gambar}
                                            alt={book.nama_buku}
                                            width={200}
                                            height={256}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-semibold text-[#2E2E2E] text-sm mb-1">
                                            {book.nama_buku}
                                        </h4>
                                        <p className="text-xs text-gray-600">{book.author}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex text-yellow-400 text-sm">★★★★★</div>
                                            <button className="ml-auto p-1 hover:bg-gray-100 rounded text-sm">
                                                🔖
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded text-sm">
                                                ⋮
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
