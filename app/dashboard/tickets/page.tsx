"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import clsx from "clsx";

const mockTickets = [
  {
    id: 1,
    title: "Payment not received",
    created: "2025-05-01",
    status: "open",
    lastReply: "admin",
    lastUpdated: "2025-05-02",
  },
  {
    id: 2,
    title: "Card not working",
    created: "2025-05-10",
    status: "closed",
    lastReply: "user1",
    lastUpdated: "2025-05-12",
  },
  {
    id: 3,
    title: "Need refund",
    created: "2025-04-25",
    status: "open",
    lastReply: "admin",
    lastUpdated: "2025-04-26",
  },
];

export default function TicketsPage() {
  const auth = useAuth();
  const roles = auth?.user?.roles || [];
  const router = useRouter();

  // State for search, filter, and pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);

  // User-specific tickets logic
  let tickets = mockTickets;
  if (!roles.includes("admin")) {
    // TODO: Replace with user-specific filter when available
    tickets = tickets.slice();
  }

  // Filtered and searched tickets
  const filtered = useMemo(() => {
    let arr = tickets;
    if (search) {
      arr = arr.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.lastReply.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter) {
      arr = arr.filter((t) => t.status === statusFilter);
    }
    return arr;
  }, [search, statusFilter, tickets]);

  // Pagination logic
  const pageCount = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice(page * pageSize, page * pageSize + pageSize);

  function gotoPage(idx: number) {
    setPage(Math.max(0, Math.min(idx, pageCount - 1)));
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold text-[#38E54D]">Tickets</h1>
        <button
          className="bg-[#38E54D] text-[#18141c] px-4 py-2 rounded font-bold"
          onClick={() => router.push("/dashboard/tickets/new")}
        >
          + New Ticket
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-center">
        <input
          type="text"
          placeholder="Search title or last reply..."
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
          <option value="open">Open</option>
          <option value="closed">Closed</option>
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
        <table className="min-w-full bg-[#18141c] rounded-lg text-white">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4">Created</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Last Reply</th>
              <th className="py-2 px-4">Last Updated</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((t) => (
              <tr key={t.id} className="border-b border-[#222] hover:bg-[#222]">
                <td className="py-2 px-4">{t.title}</td>
                <td className="py-2 px-4">{t.created}</td>
                <td className="py-2 px-4">
                  <span
                    className={clsx(
                      "font-semibold capitalize",
                      t.status === "open" && "text-green-400",
                      t.status === "closed" && "text-yellow-400"
                    )}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="py-2 px-4">{t.lastReply}</td>
                <td className="py-2 px-4">{t.lastUpdated}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-[#222] border border-[#38E54D] text-[#38E54D] px-2 py-1 rounded"
                    onClick={() => router.push(`/dashboard/tickets/${t.id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-[#777]">
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination Controls */}
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
