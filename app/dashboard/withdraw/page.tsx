"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthContext";

export default function WithdrawPage() {
  const auth = useAuth();
  if (!auth?.user?.roles.includes("seller")) return <div>Unauthorized</div>;
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState(auth.user.walletAddress || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage("Withdrawal request submitted! Await admin approval.");
    }, 1200);
  };

  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">
        Withdraw Earnings
      </h1>
      <form onSubmit={handleWithdraw} className="max-w-sm space-y-4">
        <input
          type="number"
          min={1}
          max={auth.user.sellerBalance}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Withdrawal amount"
          className="w-full rounded p-2 bg-[#111] text-white border border-[#333]"
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Your payout wallet address"
          className="w-full rounded p-2 bg-[#111] text-white border border-[#333]"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#38E54D] text-[#18141c] px-4 py-2 rounded font-bold"
        >
          {loading ? "Submitting..." : "Request Withdraw"}
        </button>
        <div className="text-xs text-[#38E54D] mt-2">
          Balance: <span className="font-bold">${auth.user.sellerBalance}</span>
        </div>
        {message && <div className="mt-2 text-green-400">{message}</div>}
      </form>
    </div>
  );
}
