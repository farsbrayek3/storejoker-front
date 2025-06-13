"use client";
import { useAuth } from "@/components/AuthContext";

const mockDeposits = [
  {
    id: 1,
    date: "2025-06-01",
    amount: 100,
    method: "Credit Card",
    before: 0,
    after: 100,
    bonus: 0,
    paymentId: "P123",
    paidAt: "2025-06-01",
  },
];

export default function DepositHistoryPage() {
  const auth = useAuth();
  if (!auth?.user) return <div>Unauthorized</div>;
  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">
        Deposit History
      </h1>
      <table className="min-w-full bg-[#18141c] rounded-lg text-white">
        <thead>
          <tr className="border-b border-[#333]">
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-left">Amount</th>
            <th className="py-2 px-4 text-left">Method</th>
            <th className="py-2 px-4 text-left">Before</th>
            <th className="py-2 px-4 text-left">After</th>
            <th className="py-2 px-4 text-left">Bonus</th>
            <th className="py-2 px-4 text-left">Payment ID</th>
          </tr>
        </thead>
        <tbody>
          {mockDeposits.map((d) => (
            <tr key={d.id} className="border-b border-[#222] hover:bg-[#222]">
              <td className="py-2 px-4">{d.date}</td>
              <td className="py-2 px-4">${d.amount}</td>
              <td className="py-2 px-4">{d.method}</td>
              <td className="py-2 px-4">${d.before}</td>
              <td className="py-2 px-4">${d.after}</td>
              <td className="py-2 px-4">${d.bonus}</td>
              <td className="py-2 px-4">{d.paymentId}</td>
            </tr>
          ))}
          {mockDeposits.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-10 text-[#777]">
                No deposit records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
