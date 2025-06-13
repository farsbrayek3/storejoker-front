"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthContext";

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
];

export default function SellersPage() {
  const auth = useAuth();
  const [search, setSearch] = useState("");
  const [sellers] = useState(mockSellers);
  if (!auth?.user?.roles.includes("admin")) return <div>Unauthorized</div>;

  const filtered = sellers.filter(
    (s) =>
      search === "" ||
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">Sellers</h1>
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search seller"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded p-2 bg-[#111] text-white border border-[#333] w-56"
        />
      </div>
      <table className="min-w-full bg-[#18141c] rounded-lg text-white">
        <thead>
          <tr className="border-b border-[#333]">
            <th className="py-2 px-4 text-left">Username</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Commission (%)</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s) => (
            <tr key={s.id} className="border-b border-[#222] hover:bg-[#222]">
              <td className="py-2 px-4">{s.username}</td>
              <td className="py-2 px-4">{s.email}</td>
              <td className="py-2 px-4">{s.commission}%</td>
              <td className="py-2 px-4">
                <span
                  className={
                    s.status === "active"
                      ? "text-green-400 font-semibold"
                      : "text-red-400 font-semibold"
                  }
                >
                  {s.status}
                </span>
              </td>
              <td className="py-2 px-4 flex gap-2">
                <button className="bg-[#222] border border-[#38E54D] text-[#38E54D] px-2 py-1 rounded">
                  Edit
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-10 text-[#777]">
                No sellers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
