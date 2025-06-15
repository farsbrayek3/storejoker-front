"use client";
import { useState, useMemo } from "react";
import { useAuth } from "@/components/AuthContext";
import clsx from "clsx";
import {
  UserCog,
  Mail,
  CheckCircle,
  Ban,
  Percent,
  Save,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

// Example mock data
const mockSellers = [
  {
    id: 2,
    username: "seller",
    email: "seller@site.com",
    commission: 10,
    status: "active",
    registeredAt: "2024-03-15",
    lastLogin: "2025-06-13",
  },
  {
    id: 3,
    username: "blockedguy",
    email: "blocked@s.com",
    commission: 15,
    status: "blocked",
    registeredAt: "2024-01-12",
    lastLogin: "2025-05-28",
  },
];

export default function SellersPage() {
  const auth = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [editId, setEditId] = useState<number | null>(null);
  const [commissionEdit, setCommissionEdit] = useState("");
  const [sellers, setSellers] = useState(mockSellers);

  // Filtering
  const filtered = useMemo(() => {
    let arr = sellers;
    if (search)
      arr = arr.filter(
        (s) =>
          s.username.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase())
      );
    if (statusFilter) arr = arr.filter((s) => s.status === statusFilter);
    return arr;
  }, [search, statusFilter, sellers]);

  if (!auth?.user?.roles.includes("admin"))
    return <div className="p-8 text-red-500">Unauthorized</div>;

  // Pagination
  const pageCount = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice(page * pageSize, page * pageSize + pageSize);

  // Actions
  function handleEditCommission(seller: (typeof sellers)[0]) {
    setEditId(seller.id);
    setCommissionEdit(seller.commission.toString());
  }

  function handleSaveCommission(seller: (typeof sellers)[0]) {
    const val = Number(commissionEdit);
    if (isNaN(val) || val < 0 || val > 100) {
      toast.error("Commission must be 0-100.");
      return;
    }
    setSellers((prev) =>
      prev.map((s) => (s.id === seller.id ? { ...s, commission: val } : s))
    );
    setEditId(null);
    toast.success("Commission updated!");
  }

  function handleBlockUnblock(seller: (typeof sellers)[0]) {
    setSellers((prev) =>
      prev.map((s) =>
        s.id === seller.id
          ? {
              ...s,
              status: s.status === "active" ? "blocked" : "active",
            }
          : s
      )
    );
    toast.success(
      seller.status === "active" ? "Seller blocked." : "Seller unblocked."
    );
  }

  function handleViewProfile(seller: (typeof sellers)[0]) {
    toast(`View profile for ${seller.username}`);
  }

  // Handle page changes
  function gotoPage(idx: number) {
    setPage(Math.max(0, Math.min(idx, pageCount - 1)));
  }

  return (
    <div>
      <h1 className="text-2xl mb-6 font-bold text-[#38E54D]">Sellers</h1>
      <div className="flex flex-col sm:flex-row gap-3 items-center mb-6">
        <input
          type="text"
          placeholder="Search username or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="rounded px-4 py-2 border border-[#222] bg-[#19161a] text-white w-full sm:w-64 outline-none focus:border-[#38E54D] transition"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          className="rounded px-2 py-2 bg-[#19161a] text-white border border-[#222] outline-none focus:border-[#38E54D]"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(0);
          }}
          className="rounded px-2 py-2 bg-[#19161a] text-white border border-[#222] outline-none focus:border-[#38E54D]"
        >
          {[5, 10, 25, 50].map((sz) => (
            <option key={sz} value={sz}>
              {sz} / page
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg border border-[#222]">
        <table className="min-w-full bg-[#18141c] text-white">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="py-2 px-4 text-left">Username</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Commission</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Registered</th>
              <th className="py-2 px-4 text-left">Last Login</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((s) => (
              <tr
                key={s.id}
                className="border-b border-[#222] hover:bg-[#222] transition"
              >
                <td className="py-2 px-4 font-semibold flex items-center gap-2">
                  <UserCog size={18} className="text-[#38E54D]" />
                  {s.username}
                </td>
                <td className="py-2 px-4">
                  <span className="inline-flex items-center gap-1">
                    <Mail size={16} className="text-blue-400" />
                    {s.email}
                  </span>
                </td>
                <td className="py-2 px-4">
                  {editId === s.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={commissionEdit}
                        autoFocus
                        onChange={(e) => setCommissionEdit(e.target.value)}
                        className="w-16 p-1 bg-[#111] text-white rounded border border-[#38E54D] focus:outline-[#38E54D] text-right"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveCommission(s);
                          if (e.key === "Escape") setEditId(null);
                        }}
                      />
                      <span className="text-xs text-[#38E54D]">%</span>
                      <button
                        onClick={() => handleSaveCommission(s)}
                        title="Save"
                        className="p-1 rounded bg-[#232f2a] hover:bg-[#38E54D]/20 text-[#38E54D] transition"
                      >
                        <Save size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Percent size={15} className="text-[#38E54D]" />
                      {s.commission}%
                      <button
                        className="ml-1 p-1 rounded hover:bg-[#38E54D]/10"
                        title="Edit commission"
                        onClick={() => handleEditCommission(s)}
                      >
                        <UserCog size={15} />
                      </button>
                    </span>
                  )}
                </td>
                <td className="py-2 px-4">
                  <span
                    className={clsx(
                      "font-semibold capitalize flex items-center gap-1",
                      s.status === "active" && "text-green-400",
                      s.status === "blocked" && "text-red-400"
                    )}
                  >
                    {s.status === "active" ? (
                      <CheckCircle size={15} />
                    ) : (
                      <Ban size={15} />
                    )}
                    {s.status}
                  </span>
                </td>
                <td className="py-2 px-4 text-xs">{s.registeredAt}</td>
                <td className="py-2 px-4 text-xs">{s.lastLogin}</td>
                <td className="py-2 px-4">
                  <div className="flex gap-2">
                    <button
                      className={clsx(
                        "p-1 rounded transition",
                        s.status === "active"
                          ? "bg-[#2e1c23] hover:bg-red-400/20 text-red-400"
                          : "bg-[#1d2c1d] hover:bg-green-400/20 text-green-400"
                      )}
                      title={
                        s.status === "active"
                          ? "Block Seller"
                          : "Unblock Seller"
                      }
                      onClick={() => handleBlockUnblock(s)}
                    >
                      {s.status === "active" ? (
                        <Ban size={16} />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                    </button>
                    <button
                      className="p-1 rounded bg-[#19161a] hover:bg-[#19161a]/60 text-[#38E54D] transition"
                      title="View Seller Profile"
                      onClick={() => handleViewProfile(s)}
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-[#777]">
                  No sellers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-[#18141c] gap-2 border-t border-[#222]">
          <div className="text-sm text-gray-400">
            Page <span className="font-bold text-white">{page + 1}</span> of{" "}
            <span className="font-bold text-white">{pageCount}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => gotoPage(0)}
              disabled={page === 0}
              className="px-2 py-1 rounded bg-[#222] text-white disabled:opacity-40"
            >
              {"<<"}
            </button>
            <button
              onClick={() => gotoPage(page - 1)}
              disabled={page === 0}
              className="px-2 py-1 rounded bg-[#222] text-white disabled:opacity-40"
            >
              {"<"}
            </button>
            <button
              onClick={() => gotoPage(page + 1)}
              disabled={page >= pageCount - 1}
              className="px-2 py-1 rounded bg-[#222] text-white disabled:opacity-40"
            >
              {">"}
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={page >= pageCount - 1}
              className="px-2 py-1 rounded bg-[#222] text-white disabled:opacity-40"
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
