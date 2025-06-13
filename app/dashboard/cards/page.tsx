"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthContext";

const mockCards = [
  {
    id: 1,
    cardNumber: "4111 1111 1111 1111",
    country: "US",
    type: "Visa",
    bin: "411111",
    ccType: "Credit",
    expiration: "12/27",
    description: "Premium",
    price: 20,
    status: "unsold",
    sellerId: 2,
    addedAt: "2025-05-01",
  },
  {
    id: 2,
    cardNumber: "5555 5555 5555 4444",
    country: "CA",
    type: "MasterCard",
    bin: "555555",
    ccType: "Debit",
    expiration: "11/26",
    description: "",
    price: 15,
    status: "sold",
    sellerId: 2,
    addedAt: "2025-04-18",
  },
];

export default function CardsPage() {
  const auth = useAuth();
  const roles = auth?.user?.roles || [];
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cards, setCards] = useState(mockCards);

  // Card visibility logic
  let visibleCards = cards;

  if (roles.includes("seller") && !roles.includes("admin")) {
    visibleCards = cards.filter((c) => c.sellerId === auth.user?.sellerId);
  } else if (
    roles.includes("buyer") &&
    !roles.includes("admin") &&
    !roles.includes("seller")
  ) {
    visibleCards = cards.filter((c) => c.status === "unsold");
  }

  const filtered = visibleCards.filter(
    (c) =>
      (search === "" ||
        c.cardNumber.includes(search) ||
        c.country.toLowerCase().includes(search.toLowerCase()) ||
        c.type.toLowerCase().includes(search.toLowerCase()) ||
        c.bin.includes(search)) &&
      (statusFilter === "all" || c.status === statusFilter)
  );

  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">Cards</h1>
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search card, country, bin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded p-2 bg-[#111] text-white border border-[#333] w-56"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded p-2 bg-[#111] text-white border border-[#333]"
        >
          <option value="all">All</option>
          <option value="sold">Sold</option>
          <option value="unsold">Unsold</option>
        </select>
        {roles.includes("seller") && (
          <button
            className="rounded px-3 py-2 bg-[#38E54D] text-[#18141c] font-bold ml-auto"
            // onClick={() => router.push('/dashboard/add-card')}
          >
            + Add Card
          </button>
        )}
      </div>
      <table className="min-w-full bg-[#18141c] rounded-lg text-white">
        <thead>
          <tr className="border-b border-[#333]">
            <th className="py-2 px-4 text-left">Card</th>
            <th className="py-2 px-4 text-left">Country</th>
            <th className="py-2 px-4 text-left">Type</th>
            <th className="py-2 px-4 text-left">BIN</th>
            <th className="py-2 px-4 text-left">Exp.</th>
            <th className="py-2 px-4 text-left">Price</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c.id} className="border-b border-[#222] hover:bg-[#222]">
              <td className="py-2 px-4">{c.cardNumber}</td>
              <td className="py-2 px-4">{c.country}</td>
              <td className="py-2 px-4">{c.type}</td>
              <td className="py-2 px-4">{c.bin}</td>
              <td className="py-2 px-4">{c.expiration}</td>
              <td className="py-2 px-4">${c.price}</td>
              <td className="py-2 px-4">
                <span
                  className={
                    c.status === "sold"
                      ? "text-green-400 font-semibold"
                      : "text-yellow-400 font-semibold"
                  }
                >
                  {c.status}
                </span>
              </td>
              <td className="py-2 px-4 flex gap-2">
                {roles.includes("seller") && (
                  <>
                    <button className="bg-[#222] border border-[#38E54D] text-[#38E54D] px-2 py-1 rounded">
                      Edit
                    </button>
                    <button className="bg-[#EF4444] text-white px-2 py-1 rounded">
                      Delete
                    </button>
                  </>
                )}
                {roles.includes("buyer") && c.status === "unsold" && (
                  <button className="bg-[#38E54D] text-[#18141c] px-2 py-1 rounded">
                    Buy
                  </button>
                )}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center py-10 text-[#777]">
                No cards found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
