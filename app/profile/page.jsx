"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Pagination from "@/components/pagination";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      setUser(null);
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setNameInput(data.nama || "");
          return;
        }
      } catch {}

      setUser({
        user_id: session.user?.id,
        nama: session.user?.name || session.user?.nama || "",
        email: session.user?.email,
        avatar: session.user?.avatar || session.user?.image || null,
      });
      setNameInput(session.user?.name || session.user?.nama || "");
    })();
  }, [session, status]);

  useEffect(() => {
    if (!user) return;
    fetchHistory(page);
  }, [user, page]);

  async function fetchHistory(pageNumber = 1) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/history?page=${pageNumber}&pageSize=${pageSize}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      if (res.ok) {
        setHistory(json.data || []);
        setTotalPages(json.totalPages || 0);
        setPage(json.page || 1);
      } else {
        setHistory([]);
        setTotalPages(0);
      }
    } catch (err) {
      console.error("History error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);

    const fd = new FormData();
    fd.append("avatar", file);

    try {
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();

      if (res.ok && json.avatar) {
        setUser((u) => ({ ...u, avatar: json.avatar }));
      } else {
        alert(json.error || "Upload failed");
      }
    } catch {
      alert("Upload failed");
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleSaveName() {
    if (!nameInput?.trim()) return;
    try {
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama: nameInput }),
      });

      const json = await res.json();
      if (res.ok) {
        setUser((u) => ({ ...u, nama: nameInput }));
        setEditing(false);
      } else {
        alert(json.error || "Update failed");
      }
    } catch {
      alert("Update failed");
    }
  }

  if (status === "loading")
    return <div className="p-8">Loading session...</div>;
  if (!session || !user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">You are not logged in.</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex text-[#2E2E2E]">
      {/* SIDEBAR */}
      <div className="w-[260px]">
        <Sidebar />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1">
        {/* HEADER FIXED */}
        <div className="ml-280px flex bg-[#FAF6F0]">
          <Header />
        </div>

        {/* CONTENT WRAPPER */}
        <div className="pt-24 px-6 max-w-4xl mx-auto">
          {/* PROFILE CARD */}
          <div className="bg-[#FAF6F0] p-6 rounded-xl shadow-md flex gap-6 items-center">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border">
              <Image
                src={user.avatar || "/default-avatar.png"}
                alt="avatar"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-4">
                {editing ? (
                  <>
                    <input
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="border px-3 py-2 rounded-md"
                    />
                    <button
                      onClick={handleSaveName}
                      className="px-3 py-2 bg-black text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-3 py-2 border rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl font-semibold">{user.nama}</h1>
                    <button
                      onClick={() => setEditing(true)}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>

              <p className="text-gray-600 mt-1">{user.email}</p>

              <div className="mt-3 flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 border rounded bg-[#FAF6F0] text-sm">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  {avatarUploading ? "Uploading..." : "Change avatar"}
                </label>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="flex gap-4 mt-6">
            <div className="bg-[#FAF6F0] p-4 rounded shadow flex-1 text-center">
              <div className="text-sm text-gray-500">Total Borrows</div>
              <div className="text-xl font-bold"></div>
            </div>

            <div className="bg-[#FAF6F0] p-4 rounded shadow flex-1 text-center">
              <div className="text-sm text-gray-500">Currently Borrowed</div>
              <div className="text-xl font-bold">
                {history.filter((h) => h.status === "ongoing").length}
              </div>
            </div>
          </div>

          {/* HISTORY */}
          <div className="mt-6 bg-[#FAF6F0] p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Borrow History</h2>

            {loading ? (
              <div className="text-gray-500">Loading history…</div>
            ) : history.length === 0 ? (
              <div className="text-gray-500">No borrow history yet.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {history.map((h) => (
                    <div
                      key={h.borrow_id}
                      className="p-3 border rounded flex gap-3 items-start"
                    >
                      <div className="relative w-20 h-28 flex-shrink-0">
                        <Image
                          src={h.gambar || "/placeholder.png"}
                          alt={h.nama_buku}
                          fill
                          className="object-cover rounded"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">{h.nama_buku}</div>
                            <div className="text-sm text-gray-600">
                              {h.author}
                            </div>
                          </div>

                          <div className="text-xs">
                            <div
                              className={`px-2 py-1 rounded text-white ${
                                h.status === "returned"
                                  ? "bg-green-600"
                                  : h.status === "late"
                                  ? "bg-red-600"
                                  : "bg-blue-600"
                              }`}
                            >
                              {h.status}
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-gray-500 mt-2">
                          <div>
                            Borrowed:{" "}
                            {new Date(h.borrow_date).toLocaleDateString()}
                          </div>
                          <div>
                            Due: {new Date(h.due_date).toLocaleDateString()}
                          </div>
                          {h.return_date && (
                            <div>
                              Returned:{" "}
                              {new Date(h.return_date).toLocaleDateString()}
                            </div>
                          )}
                          {h.fine_amount > 0 && (
                            <div className="text-red-600">
                              Fine: Rp {h.fine_amount.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onChange={(p) => setPage(p)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
