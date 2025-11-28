"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function UserBooks() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Get search query from URL
        const searchFromUrl = searchParams.get('search');
        if (searchFromUrl) {
            setSearchQuery(searchFromUrl);
        }
    }, [searchParams]);

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

    const categories = [
        "Self-Improvement",
        "Romance",
        "Fiction",
        "Non-Fiction",
        "Politics",
        "Finance & Economics",
        "Biography",
    ];

    const filteredBooks = books
        .filter((book) => {
            // Filter by category
            if (selectedCategory !== "All" && book.genre_buku !== selectedCategory) {
                return false;
            }
            // Filter by search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    book.nama_buku.toLowerCase().includes(query) ||
                    book.author.toLowerCase().includes(query)
                );
            }
            return true;
        });

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
                        className="flex items-center px-6 py-3 text-[#2E2E2E] hover:bg-gray-100"
                    >
                        <span className="mr-3">🏠</span>
                        Home
                    </Link>
                    <Link
                        href="/user/books"
                        className="flex items-center px-6 py-3 bg-[#3A4750] text-white"
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
                    <div className="flex-1 max-w-md mx-auto relative">
                        <input
                            type="search"
                            placeholder="Search books or authors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A4750]"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                        <button className="p-2 hover:bg-gray-200 rounded-full">🔔</button>
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            👤
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Search Results Info */}
                    {searchQuery && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                Showing {filteredBooks.length} result(s) for "<strong>{searchQuery}</strong>"
                            </p>
                        </div>
                    )}

                    {/* Category Tabs */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-[#2E2E2E] mb-4">
                            Books Genres
                        </h2>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setSelectedCategory("All")}
                                className={`px-4 py-2 rounded-full text-sm ${selectedCategory === "All"
                                    ? "bg-[#D4A373] text-white"
                                    : "bg-white text-[#2E2E2E] hover:bg-gray-100"
                                    }`}
                            >
                                All
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm ${selectedCategory === category
                                        ? "bg-[#D4A373] text-white"
                                        : "bg-white text-[#2E2E2E] hover:bg-gray-100"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Books Grid */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[#2E2E2E]">
                                Library Collections
                            </h3>
                            <button className="p-2 hover:bg-gray-100 rounded">☰</button>
                        </div>

                        {filteredBooks.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📚</div>
                                <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2">
                                    No books found
                                </h3>
                                <p className="text-gray-600">
                                    {searchQuery
                                        ? `Try searching with different keywords`
                                        : `No books available in this category`}
                                </p>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="mt-4 px-4 py-2 bg-[#3A4750] text-white rounded-lg hover:bg-[#2d373e]"
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-6">
                                {filteredBooks.map((book) => (
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
                                            <h4 className="font-semibold text-[#2E2E2E] text-sm mb-1 line-clamp-1">
                                                {book.nama_buku}
                                            </h4>
                                            <p className="text-xs text-gray-600 mb-2">{book.author}</p>
                                            <div className="flex items-center gap-2">
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
