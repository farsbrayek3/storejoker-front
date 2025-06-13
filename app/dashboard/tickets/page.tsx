"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

const mockTickets = [
  {
    id: 1,
    title: "Payment not received",
    created: "2025-05-01",
    status: "open",
    lastReply: "admin",
    lastUpdated: "2025-05-02",
  },
];

export default function TicketsPage() {
  const auth = useAuth();
  const roles = auth?.user?.roles || [];
  const router = useRouter();

  let tickets = mockTickets;
  if (!roles.includes("admin")) {
    // TODO: Replace with user-specific filter when available
    tickets = tickets.slice();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#38E54D]">Tickets</h1>
        <button
          className="bg-[#38E54D] text-[#18141c] px-4 py-2 rounded font-bold"
          onClick={() => router.push("/dashboard/tickets/new")}
        >
          + New Ticket
        </button>
      </div>
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
          {tickets.map((t) => (
            <tr key={t.id} className="border-b border-[#222] hover:bg-[#222]">
              <td className="py-2 px-4">{t.title}</td>
              <td className="py-2 px-4">{t.created}</td>
              <td className="py-2 px-4">
                <span
                  className={
                    t.status === "open" ? "text-green-400" : "text-yellow-400"
                  }
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
          {tickets.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-10 text-[#777]">
                No tickets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
