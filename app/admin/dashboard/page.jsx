"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        } else if (status === "authenticated" && session?.user?.role !== "admin") {
            router.push("/user/home");
        }
    }, [status, session, router]);

    useEffect(() => {
        if (session?.user?.role === "admin") {
            fetchDashboardData();
        }
    }, [session]);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch("/api/admin/dashboard");
            const data = await response.json();
            setDashboardData(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
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

    const stats = dashboardData?.statistics || {};
    const borrowByCategory = dashboardData?.borrowByCategory || [];
    const recentBorrows = dashboardData?.recentBorrows || [];

    // Calculate percentages for chart
    const total = borrowByCategory.reduce((sum, item) => sum + item.count, 0);
    const categoryData = borrowByCategory.map((item) => ({
        ...item,
        percentage: total > 0 ? ((item.count / total) * 100).toFixed(0) : 0,
    }));

    const getStatusBadge = (status) => {
        const badges = {
            borrowed: "bg-[#C65D5D] text-white",
            ongoing: "bg-[#C65D5D] text-white",
            pending: "bg-[#E8B86D] text-white",
            returned: "bg-[#5A9E6F] text-white",
            late: "bg-[#8B4513] text-white",
        };
        return badges[status] || "bg-gray-400 text-white";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
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
                        href="/admin/dashboard"
                        className="flex items-center px-6 py-3 bg-[#3A4750] text-white"
                    >
                        <span className="mr-3">📊</span>
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/collections"
                        className="flex items-center px-6 py-3 text-[#2E2E2E] hover:bg-gray-100"
                    >
                        <span className="mr-3">📚</span>
                        Collections
                    </Link>
                    <Link
                        href="/admin/reports"
                        className="flex items-center px-6 py-3 text-[#2E2E2E] hover:bg-gray-100"
                    >
                        <span className="mr-3">📋</span>
                        Reports
                    </Link>
                </nav>

                <div className="absolute bottom-0 w-64 p-6 border-t">
                    <Link
                        href="/admin/settings"
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
            <div className="flex-1 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-[#2E2E2E]">Dashboard</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-200 rounded-full">
                            🔔
                        </button>
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            👤
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-3xl">📖</span>
                        </div>
                        <div className="text-2xl font-bold text-[#2E2E2E]">
                            {stats.totalBooks || 0}
                        </div>
                        <div className="text-sm text-gray-600">Total Books</div>
                        <div className="text-xs text-gray-500 mt-1">459 items</div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-3xl">📝</span>
                        </div>
                        <div className="text-2xl font-bold text-[#2E2E2E]">
                            {stats.activeLoans || 0}
                        </div>
                        <div className="text-sm text-gray-600">Active Loan</div>
                        <div className="text-xs text-gray-500 mt-1">112 Active Loan</div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-3xl">⏰</span>
                        </div>
                        <div className="text-2xl font-bold text-[#2E2E2E]">
                            {stats.overdue || 0}
                        </div>
                        <div className="text-sm text-gray-600">Overdue Books</div>
                        <div className="text-xs text-gray-500 mt-1">4 Overdue</div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-3xl">👥</span>
                        </div>
                        <div className="text-2xl font-bold text-[#2E2E2E]">
                            {stats.usersRegistered || 0}
                        </div>
                        <div className="text-sm text-gray-600">Users Registered</div>
                        <div className="text-xs text-gray-500 mt-1">388 Users</div>
                    </div>
                </div>

                {/* Borrow by Category */}
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <h3 className="text-lg font-bold text-[#2E2E2E] mb-6">
                        Borrow by Category
                    </h3>
                    <div className="flex items-center gap-8">
                        {/* Donut Chart */}
                        <div className="relative w-48 h-48">
                            <svg viewBox="0 0 200 200" className="transform -rotate-90">
                                {categoryData.map((item, index) => {
                                    const colors = [
                                        "#B8775D",
                                        "#8B4513",
                                        "#D4A373",
                                        "#4A5759",
                                    ];
                                    const color = colors[index % colors.length];
                                    const percentage = parseFloat(item.percentage);
                                    const circumference = 2 * Math.PI * 70;
                                    const offset =
                                        circumference -
                                        (percentage / 100) * circumference;
                                    const prevPercentages = categoryData
                                        .slice(0, index)
                                        .reduce((sum, i) => sum + parseFloat(i.percentage), 0);
                                    const rotation = (prevPercentages / 100) * 360;

                                    return (
                                        <circle
                                            key={index}
                                            cx="100"
                                            cy="100"
                                            r="70"
                                            fill="none"
                                            stroke={color}
                                            strokeWidth="40"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={offset}
                                            style={{
                                                transformOrigin: "center",
                                                transform: `rotate(${rotation}deg)`,
                                            }}
                                        />
                                    );
                                })}
                            </svg>
                        </div>

                        {/* Legend */}
                        <div className="flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                {categoryData.map((item, index) => {
                                    const colors = [
                                        "#B8775D",
                                        "#8B4513",
                                        "#D4A373",
                                        "#4A5759",
                                    ];
                                    const color = colors[index % colors.length];
                                    return (
                                        <div key={index} className="flex items-center gap-2">
                                            <div
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: color }}
                                            ></div>
                                            <span className="text-sm text-[#2E2E2E]">
                                                {item.category} ({item.percentage}%)
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loan Overview */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-[#2E2E2E]">Loan Overview</h3>
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                            Export Data
                        </button>
                    </div>

                    <table className="w-full">
                        <thead>
                            <tr className="border-b text-left text-sm text-gray-600">
                                <th className="pb-3">Loan ID</th>
                                <th className="pb-3">Book</th>
                                <th className="pb-3">Book</th>
                                <th className="pb-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentBorrows.map((borrow) => (
                                <tr key={borrow.borrow_id} className="border-b">
                                    <td className="py-4 text-sm">{borrow.borrow_id}</td>
                                    <td className="py-4 text-sm">{borrow.nama_buku}</td>
                                    <td className="py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${getStatusBadge(
                                                borrow.status
                                            )}`}
                                        >
                                            {borrow.status.charAt(0).toUpperCase() +
                                                borrow.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-4 text-sm">
                                        {formatDate(borrow.borrow_date)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
