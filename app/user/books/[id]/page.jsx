"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BookDetail({ params }) {
    const unwrappedParams = use(params);
    const bookId = unwrappedParams.id;

    const { data: session, status } = useSession();
    const router = useRouter();
    const [book, setBook] = useState(null);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (session && bookId) {
            fetchBookDetail();
            fetchBooks();
        }
    }, [session, bookId]);

    const fetchBookDetail = async () => {
        try {
            const response = await fetch(`/api/books/${bookId}`);
            const data = await response.json();
            setBook(data);
        } catch (error) {
            console.error("Error fetching book:", error);
        }
    }; const fetchBooks = async () => {
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

    if (!book) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#FAF6F0]">
                <div className="text-lg">Book not found</div>
            </div>
        );
    }

    const relatedBooks = books.filter(
        (b) => b.genre_buku === book.genre_buku && b.id_buku !== book.id_buku
    );

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
                            placeholder="Search..."
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
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="mb-6 flex items-center text-[#2E2E2E] hover:text-[#3A4750]"
                    >
                        ← Back
                    </button>

                    {/* Book Detail */}
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                        <div className="flex gap-8">
                            <div className="w-64 h-96 flex-shrink-0">
                                <Image
                                    src={book.gambar}
                                    alt={book.nama_buku}
                                    width={256}
                                    height={384}
                                    className="w-full h-full object-cover rounded-lg shadow-lg"
                                />
                            </div>

                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-[#2E2E2E] mb-2">
                                    {book.nama_buku}
                                </h1>
                                <p className="text-lg text-gray-600 mb-4">{book.author}</p>

                                <div className="flex gap-2 mb-6">
                                    <span className="px-3 py-1 bg-[#D4A373] text-white rounded-full text-sm">
                                        {book.genre_buku}
                                    </span>
                                    {book.genre_buku?.includes("Politics") && (
                                        <span className="px-3 py-1 bg-[#5A7184] text-white rounded-full text-sm">
                                            Politics
                                        </span>
                                    )}
                                    {book.genre_buku?.includes("Biography") && (
                                        <span className="px-3 py-1 bg-[#8B6F47] text-white rounded-full text-sm">
                                            History
                                        </span>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <span
                                        className={`px-4 py-2 rounded-lg text-sm font-medium ${book.status === "tersedia"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {book.status === "tersedia"
                                            ? `Available (${Math.floor(Math.random() * 10) + 1})`
                                            : "Borrowed"}
                                    </span>
                                </div>

                                <div className="flex gap-4 mb-6">
                                    <button className="flex-1 bg-[#3A4750] text-white px-6 py-3 rounded-lg hover:bg-[#2d373e] font-medium">
                                        Buy E-Book
                                    </button>
                                    <button className="flex-1 border-2 border-[#3A4750] text-[#3A4750] px-6 py-3 rounded-lg hover:bg-gray-50 font-medium">
                                        Borrow Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* For You Section */}
                    <div>
                        <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">For You</h3>
                        <div className="grid grid-cols-4 gap-6">
                            {relatedBooks.slice(0, 8).map((relatedBook) => (
                                <Link
                                    key={relatedBook.id_buku}
                                    href={`/user/books/${relatedBook.id_buku}`}
                                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                                >
                                    <div className="h-64 overflow-hidden rounded-t-lg">
                                        <Image
                                            src={relatedBook.gambar}
                                            alt={relatedBook.nama_buku}
                                            width={200}
                                            height={256}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-semibold text-[#2E2E2E] text-sm mb-1 line-clamp-1">
                                            {relatedBook.nama_buku}
                                        </h4>
                                        <p className="text-xs text-gray-600">{relatedBook.author}</p>
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
