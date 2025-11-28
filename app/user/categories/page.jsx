"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function UserCategories() {
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
            (b) =>
                b.genre_buku === "Politics-Biography" ||
                b.genre_buku === "Politics" ||
                b.genre_buku === "Biography"
        ),
        Fiction: books.filter((b) => b.genre_buku === "Fiction"),
        Novel: books.filter((b) => b.genre_buku === "Novel"),
    };

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
                        className="flex items-center px-6 py-3 text-[#2E2E2E] hover:bg-gray-100"
                    >
                        <span className="mr-3">📚</span>
                        Books
                    </Link>
                    <Link
                        href="/user/categories"
                        className="flex items-center px-6 py-3 bg-[#3A4750] text-white"
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

                <div className="p-8">
                    {/* Self-Improvement Section */}
                    <div className="mb-10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-[#2E2E2E]">
                                Self-Improvement
                            </h2>
                            <Link
                                href="/user/books?category=Self-Improvement"
                                className="text-[#5A7184] hover:underline text-sm font-medium"
                            >
                                See More →
                            </Link>
                        </div>
                        <div className="grid grid-cols-4 gap-6">
                            {groupedBooks["Self-Improvement"].slice(0, 4).map((book) => (
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
                                        <p className="text-xs text-gray-600">{book.author}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex text-yellow-400 text-sm">★★★★★</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Politics-Biography Section */}
                    <div className="mb-10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-[#2E2E2E]">
                                Politics-Biography
                            </h2>
                            <Link
                                href="/user/books?category=Politics"
                                className="text-[#5A7184] hover:underline text-sm font-medium"
                            >
                                See More →
                            </Link>
                        </div>
                        <div className="grid grid-cols-4 gap-6">
                            {groupedBooks["Politics-Biography"].slice(0, 4).map((book) => (
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
                                        <p className="text-xs text-gray-600">{book.author}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex text-yellow-400 text-sm">★★★★★</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Fiction Section */}
                    <div className="mb-10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-[#2E2E2E]">Fiction</h2>
                            <Link
                                href="/user/books?category=Fiction"
                                className="text-[#5A7184] hover:underline text-sm font-medium"
                            >
                                See More →
                            </Link>
                        </div>
                        <div className="grid grid-cols-4 gap-6">
                            {groupedBooks["Fiction"].slice(0, 4).map((book) => (
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
                                        <p className="text-xs text-gray-600">{book.author}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex text-yellow-400 text-sm">★★★★★</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Novel Section */}
                    <div className="mb-10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-[#2E2E2E]">Novel</h2>
                            <Link
                                href="/user/books?category=Novel"
                                className="text-[#5A7184] hover:underline text-sm font-medium"
                            >
                                See More →
                            </Link>
                        </div>
                        <div className="grid grid-cols-4 gap-6">
                            {groupedBooks["Novel"].slice(0, 4).map((book) => (
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
                                        <p className="text-xs text-gray-600">{book.author}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex text-yellow-400 text-sm">★★★★★</div>
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
