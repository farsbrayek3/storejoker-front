"use client";
import { useAuth } from "@/components/AuthContext";

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
];

export default function WithdrawalsPage() {
  const auth = useAuth();
  const roles = auth?.user?.roles || [];
  let withdrawals = mockWithdrawals;
  if (auth && roles.includes("seller") && !roles.includes("admin")) {
    withdrawals = withdrawals.filter((w) => w.seller === auth.user?.username);
  }

  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">Withdrawals</h1>
      <table className="min-w-full bg-[#18141c] rounded-lg text-white">
        <thead>
          <tr className="border-b border-[#333]">
            <th className="py-2 px-4 text-left">Seller</th>
            <th className="py-2 px-4 text-left">Amount</th>
            <th className="py-2 px-4 text-left">Received</th>
            <th className="py-2 px-4 text-left">BTC</th>
            <th className="py-2 px-4 text-left">Address</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">TxID</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((w) => (
            <tr key={w.id} className="border-b border-[#222] hover:bg-[#222]">
              <td className="py-2 px-4">{w.seller}</td>
              <td className="py-2 px-4">${w.total}</td>
              <td className="py-2 px-4">
                ${w.received} ({w.percent}% fee)
              </td>
              <td className="py-2 px-4">{w.receivedBTC}</td>
              <td className="py-2 px-4">{w.payoutAddress}</td>
              <td className="py-2 px-4">
                <span
                  className={
                    w.status === "paid" ? "text-green-400" : "text-yellow-400"
                  }
                >
                  {w.status}
                </span>
              </td>
              <td className="py-2 px-4">{w.transactionId}</td>
            </tr>
          ))}
          {withdrawals.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-10 text-[#777]">
                No withdrawal records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
