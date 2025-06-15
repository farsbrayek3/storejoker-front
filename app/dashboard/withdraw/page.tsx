"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import clsx from "clsx";

// Demo/mock withdraw history data (replace with real API/query if needed)
const mockWithdrawals = [
  {
    id: "w1",
    date: "2025-06-10 13:33",
    amount: 100,
    address: "0x123...abcd",
    status: "pending",
  },
  {
    id: "w2",
    date: "2025-06-03 16:19",
    amount: 250,
    address: "0x123...abcd",
    status: "completed",
  },
  {
    id: "w3",
    date: "2025-05-18 11:22",
    amount: 60,
    address: "0x123...abcd",
    status: "rejected",
  },
];

type WithdrawStatus = "pending" | "completed" | "rejected";

export default function WithdrawPage() {
  const auth = useAuth();
  const [tab, setTab] = useState<"withdraw" | "history">("withdraw");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState(auth?.user?.walletAddress || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  // Search, filter, pagination state for table
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | WithdrawStatus>("");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);

  // Auth check (remove if public view is wanted)
  if (!auth?.user?.roles.includes("seller")) return <div>Unauthorized</div>;

  // Filter and search history
  const filtered = mockWithdrawals.filter((w) => {
    if (
      search &&
      !(
        w.amount.toString().includes(search) ||
        w.date.toLowerCase().includes(search.toLowerCase()) ||
        w.address.toLowerCase().includes(search.toLowerCase())
      )
    )
      return false;
    if (status && w.status !== status) return false;
    return true;
  });

  const paginated = filtered.slice(page * pageSize, page * pageSize + pageSize);
  const pageCount = Math.ceil(filtered.length / pageSize);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage("Withdrawal request submitted! Await admin approval.");
      // Optionally clear form
      setAmount("");
      // Optionally update mockWithdrawals here for demo
    }, 1200);
  };

  return (
    <div>
      <h1 className="text-2xl mb-6 font-bold text-[#38E54D]">
        Withdraw Earnings
      </h1>
      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#28212c] mb-6">
        <button
          className={clsx(
            "px-4 py-2 font-semibold transition",
            tab === "withdraw"
              ? "border-b-2 border-[#38E54D] text-[#38E54D]"
              : "text-[#aaa] hover:text-[#38E54D]"
          )}
          onClick={() => setTab("withdraw")}
        >
          Withdraw
        </button>
        <button
          className={clsx(
            "px-4 py-2 font-semibold transition",
            tab === "history"
              ? "border-b-2 border-[#38E54D] text-[#38E54D]"
              : "text-[#aaa] hover:text-[#38E54D]"
          )}
          onClick={() => setTab("history")}
        >
          History
        </button>
      </div>

      {tab === "withdraw" && (
        <form
          onSubmit={handleWithdraw}
          className="max-w-sm space-y-4 bg-[#18141c] p-6 rounded-lg border border-[#28212c] shadow"
        >
          <div className="mb-1 text-xs text-[#bbb]">
            Enter the amount you wish to withdraw from your available balance.
          </div>
          <input
            type="number"
            min={1}
            max={auth.user.sellerBalance}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Withdrawal amount"
            className="w-full rounded p-2 bg-[#111] text-white border border-[#333] outline-none focus:border-[#38E54D]"
          />
          <div className="mb-1 text-xs text-[#bbb]">
            Enter your payout wallet address (ERC20, PayPal, Bank, etc).
          </div>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Your payout wallet address"
            className="w-full rounded p-2 bg-[#111] text-white border border-[#333] outline-none focus:border-[#38E54D]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#38E54D] text-[#18141c] px-4 py-2 rounded font-bold hover:bg-[#2fd44d] transition"
          >
            {loading ? "Submitting..." : "Request Withdraw"}
          </button>
          <div className="text-xs text-[#38E54D] mt-2">
            Balance:{" "}
            <span className="font-bold">${auth.user.sellerBalance}</span>
          </div>
          {message && <div className="mt-2 text-green-400">{message}</div>}
        </form>
      )}

      {tab === "history" && (
        <div className="max-w-2xl">
          <div className="mb-4 flex flex-col sm:flex-row gap-2 items-center">
            <input
              type="text"
              placeholder="Search by amount, date, address..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="rounded px-3 py-2 bg-[#19161a] text-white border border-[#222] outline-none focus:border-[#38E54D] w-full sm:w-64"
            />
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as WithdrawStatus | "");
                setPage(0);
              }}
              className="rounded px-2 py-2 bg-[#19161a] text-white border border-[#222] outline-none focus:border-[#38E54D]"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
              className="rounded px-2 py-2 bg-[#19161a] text-white border border-[#222] outline-none focus:border-[#38E54D]"
            >
              {[5, 10, 25].map((sz) => (
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
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Amount</th>
                  <th className="py-2 px-4 text-left">Address</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-[#777]">
                      No withdrawals found.
                    </td>
                  </tr>
                )}
                {paginated.map((w) => (
                  <tr
                    key={w.id}
                    className="border-b border-[#222] hover:bg-[#23232a]"
                  >
                    <td className="py-2 px-4">{w.date}</td>
                    <td className="py-2 px-4 font-mono">${w.amount}</td>
                    <td className="py-2 px-4 font-mono">{w.address}</td>
                    <td className="py-2 px-4">
                      <span
                        className={clsx(
                          "font-semibold capitalize",
                          w.status === "completed" && "text-green-400",
                          w.status === "pending" && "text-yellow-400",
                          w.status === "rejected" && "text-red-400"
                        )}
                      >
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-[#18141c] gap-2 border-t border-[#222]">
              <div className="text-sm text-gray-400">
                Page <span className="font-bold text-white">{page + 1}</span> of{" "}
                <span className="font-bold text-white">{pageCount || 1}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                  className="px-2 py-1 rounded bg-[#222] text-white disabled:opacity-40"
                >
                  {"<<"}
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 0))}
                  disabled={page === 0}
                  className="px-2 py-1 rounded bg-[#222] text-white disabled:opacity-40"
                >
                  {"<"}
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, pageCount - 1))}
                  disabled={page >= pageCount - 1}
                  className="px-2 py-1 rounded bg-[#222] text-white disabled:opacity-40"
                >
                  {">"}
                </button>
                <button
                  onClick={() => setPage(pageCount - 1)}
                  disabled={page >= pageCount - 1}
                  className="px-2 py-1 rounded bg-[#222] text-white disabled:opacity-40"
                >
                  {">>"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
