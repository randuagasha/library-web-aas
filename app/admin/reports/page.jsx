"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/pagination";
import Sidebar from "@/components/admin/sidebar";
import Header from "@/components/admin/header";

export default function ReportsPage() {
  const [borrows, setBorrows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchBorrows(page, statusFilter);
  }, [page, statusFilter]);

  async function fetchBorrows(pageNumber = 1, status = "") {
    setLoading(true);
    try {
      const url = new URL("/api/admin/borrows", window.location.origin);
      url.searchParams.append("page", pageNumber);
      url.searchParams.append("pageSize", pageSize);
      if (status) url.searchParams.append("status", status);

      const res = await fetch(url.toString(), { cache: "no-store" });
      const json = await res.json();

      if (res.ok) {
        setBorrows(json.data || []);
        setTotalPages(json.totalPages || 0);
        setPage(json.page || 1);
      } else {
        setBorrows([]);
        setTotalPages(0);
        console.error("Failed fetch:", json.error);
      }
    } catch (err) {
      console.error("Error fetching borrows:", err);
      setBorrows([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex text-[#2E2E2E]">
      <div className="w-[260px]">
        <Sidebar />
      </div>

      <div className="flex-1">
        <div className="ml-280px flex bg-[#FAF6F0]">
          <Header />
        </div>

        <div className="pt-24 px-6 max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4">Borrow Reports</h1>

          {/* FILTER */}
          <div className="mb-4 flex items-center gap-3">
            <label className="text-gray-600 font-medium">
              Filter by status:
            </label>
            <select
              className="border rounded px-3 py-1"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="ongoing">Ongoing</option>
              <option value="returned">Returned</option>
              <option value="late">Late</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto bg-[#FAF6F0] rounded shadow">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">User ID</th>
                  <th className="px-4 py-2 border">Book</th>
                  <th className="px-4 py-2 border">Author</th>
                  <th className="px-4 py-2 border">Borrow</th>
                  <th className="px-4 py-2 border">Due</th>
                  <th className="px-4 py-2 border">Return</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Fine</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : borrows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-4 text-gray-500">
                      No borrows found.
                    </td>
                  </tr>
                ) : (
                  borrows.map((b) => (
                    <tr key={b.borrow_id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border text-center">
                        {b.borrow_id}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {b.user_id}
                      </td>
                      <td className="px-4 py-2 border">{b.nama_buku}</td>
                      <td className="px-4 py-2 border">{b.author}</td>
                      <td className="px-4 py-2 border">
                        {new Date(b.borrow_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border">
                        {new Date(b.due_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border">
                        {b.return_date
                          ? new Date(b.return_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        <span
                          className={`px-2 py-1 rounded text-white ${
                            b.status === "returned"
                              ? "bg-green-600"
                              : b.status === "late"
                              ? "bg-red-600"
                              : b.status === "ongoing"
                              ? "bg-blue-600"
                              : "bg-gray-600"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {b.fine_amount > 0
                          ? `Rp ${b.fine_amount.toLocaleString()}`
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="mt-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
