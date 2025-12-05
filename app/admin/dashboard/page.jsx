"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarAdmin from "@/components/admin/sidebar";
import HeaderAdmin from "@/components/admin/header";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#B8775D","#8B4513","#D4A373","#4A5759","#C65D5D","#5A9E6F"];

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    else if (status === "authenticated" && session?.user?.role !== "admin")
      router.push("/user/home");
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === "admin") fetchDashboardData();
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed fetch");
      setDashboardData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => signOut({ callbackUrl: "/auth/login" });

  const exportCSV = () => {
    if (!dashboardData?.recentBorrows?.length) return;
    const headers = [
      "Loan ID","Book","User","Status","Borrow Date","Due Date","Return Date"
    ];
    const rows = dashboardData.recentBorrows.map(b => [
      b.borrow_id,b.nama_buku,b.user_name,b.status,b.borrow_date||"",b.due_date||"",b.return_date||""
    ]);
    const csvContent = [headers,...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `recent_borrows_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (loading || status === "loading") {
    return <div className="flex items-center justify-center min-h-screen bg-[#FAF6F0] text-lg">Loading...</div>;
  }

  const stats = dashboardData?.statistics || {};
  const borrowByCategory = dashboardData?.borrowByCategory || [];
  const recentBorrows = dashboardData?.recentBorrows || [];

  return (
    <div className="flex min-h-screen bg-[#FAF6F0]">
      <SidebarAdmin handleLogout={handleLogout} />
      <div className="flex-1 p-8 ml-[280px]">
        <HeaderAdmin title="Dashboard" />

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8 mt-20">
          {[ 
            {label:"Total Books", value: stats.totalBooks, icon:"📖"},
            {label:"Active Loans", value: stats.activeLoans, icon:"📝"},
            {label:"Overdue Books", value: stats.overdue, icon:"⏰"},
            {label:"Users Registered", value: stats.usersRegistered, icon:"👥"}
          ].map((s,i)=>(
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-2xl font-bold text-[#2E2E2E]">{s.value}</div>
              <div className="text-sm text-gray-600">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Borrow by Category Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-bold text-[#2E2E2E] mb-6">Borrow by Category</h3>
          {borrowByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={borrowByCategory}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                >
                  {borrowByCategory.map((entry,index)=>(
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value)=>[value,"Borrows"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 py-16">No borrow data to display.</div>
          )}
        </div>

        {/* Recent Borrows Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-bold text-[#2E2E2E]">Recent Borrows</h3>
            <button onClick={exportCSV} className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Export CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600 border-collapse">
              <thead>
                <tr>
                  {["Loan ID","Book","User","Status","Borrow Date","Due Date","Return Date"].map((h,i)=>(
                    <th key={i} className="pb-3 border-b">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBorrows.length ? recentBorrows.map(b=>(
                  <tr key={b.borrow_id} className="border-b">
                    <td className="py-2">{b.borrow_id}</td>
                    <td className="py-2">{b.nama_buku}</td>
                    <td className="py-2">{b.user_name}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        {
                          borrowed:"bg-[#C65D5D] text-white",
                          ongoing:"bg-[#C65D5D] text-white",
                          pending:"bg-[#E8B86D] text-white",
                          returned:"bg-[#5A9E6F] text-white",
                          late:"bg-[#8B4513] text-white"
                        }[b.status] || "bg-gray-400 text-white"
                      }`}>
                        {b.status.charAt(0).toUpperCase()+b.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-2">{b.borrow_date?.split("T")[0] || "-"}</td>
                    <td className="py-2">{b.due_date?.split("T")[0] || "-"}</td>
                    <td className="py-2">{b.return_date?.split("T")[0] || "-"}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-gray-500">No recent borrows.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
