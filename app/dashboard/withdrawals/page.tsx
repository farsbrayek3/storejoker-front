"use client";
import { useState, useMemo } from "react";
import { useAuth } from "@/components/AuthContext";
import { Eye } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

const mockWithdrawals = [
  {
    id: 1,
    seller: "seller",
    total: 100,
    received: 90,
    percent: 10,
    receivedBTC: "0.0012",
    payoutAddress: "0xsellerwallet",
    transactionId: "TX123456",
    status: "paid",
    orders: 3,
  },
  {
    id: 2,
    seller: "another",
    total: 220,
    received: 180,
    percent: 18.2,
    receivedBTC: "0.0023",
    payoutAddress: "0xAnotherWallet",
    transactionId: "TX654321",
    status: "pending",
    orders: 6,
  },
];

export default function WithdrawalsPage() {
  const auth = useAuth();
  const roles = auth?.user?.roles || [];
  const username = auth?.user?.username;
  // Only show seller's own withdrawals if a seller (not admin)
  let withdrawals = mockWithdrawals;
  if (auth && roles.includes("seller") && !roles.includes("admin")) {
    withdrawals = withdrawals.filter((w) => w.seller === username);
  }

  // Search, filter, pagination state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);

  // Filtering logic
  const filtered = useMemo(() => {
    let arr = withdrawals;
    if (search)
      arr = arr.filter(
        (w) =>
          w.seller.toLowerCase().includes(search.toLowerCase()) ||
          w.payoutAddress.toLowerCase().includes(search.toLowerCase()) ||
          w.transactionId.toLowerCase().includes(search.toLowerCase())
      );
    if (statusFilter) arr = arr.filter((w) => w.status === statusFilter);
    return arr;
  }, [withdrawals, search, statusFilter]);

  // Pagination logic
  const pageCount = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice(page * pageSize, page * pageSize + pageSize);

  function gotoPage(idx: number) {
    setPage(Math.max(0, Math.min(idx, pageCount - 1)));
  }

  function handleView(w: (typeof mockWithdrawals)[0]) {
    toast(
      `Withdrawal #${w.id}\nSeller: ${w.seller}\nTxID: ${w.transactionId}\nStatus: ${w.status}\nTotal: $${w.total}\nReceived: $${w.received} (${w.percent}%)\nBTC: ${w.receivedBTC}\nAddress: ${w.payoutAddress}\nOrders: ${w.orders}`,
      { duration: 6000 }
    );
  }

  return (
    <div>
      <h1 className="text-2xl mb-6 font-bold text-[#38E54D]">Withdrawals</h1>
      <div className="flex flex-col sm:flex-row gap-3 items-center mb-6">
        <input
          type="text"
          placeholder="Search seller, address, or TxID..."
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
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
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
              <th className="py-2 px-4 text-left">Seller</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Received</th>
              <th className="py-2 px-4 text-left">BTC</th>
              <th className="py-2 px-4 text-left">Address</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">TxID</th>
              <th className="py-2 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((w) => (
              <tr
                key={w.id}
                className="border-b border-[#222] hover:bg-[#222] transition"
              >
                <td className="py-2 px-4">{w.seller}</td>
                <td className="py-2 px-4">${w.total}</td>
                <td className="py-2 px-4">
                  ${w.received}
                  <span className="text-xs text-[#38E54D] ml-1">
                    ({w.percent}% fee)
                  </span>
                </td>
                <td className="py-2 px-4">{w.receivedBTC}</td>
                <td className="py-2 px-4 font-mono">{w.payoutAddress}</td>
                <td className="py-2 px-4">
                  <span
                    className={clsx(
                      "font-semibold capitalize",
                      w.status === "paid" && "text-green-400",
                      w.status === "pending" && "text-yellow-400"
                    )}
                  >
                    {w.status}
                  </span>
                </td>
                <td className="py-2 px-4 font-mono">{w.transactionId}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    title="View withdrawal details"
                    className="p-1 rounded bg-[#19161a] hover:bg-[#38E54D]/20 text-[#38E54D] transition"
                    onClick={() => handleView(w)}
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10 text-[#777]">
                  No withdrawal records found.
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
