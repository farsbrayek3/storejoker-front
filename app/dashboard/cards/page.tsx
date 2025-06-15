"use client";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { fakeDb, CardData } from "@/lib/fakeDatabase";
import { useUserStore } from "@/stores/useUserStore";
import clsx from "clsx";
import { useState, useMemo, JSX } from "react";
// Import react-icons for card brands
import {
  SiVisa,
  SiMastercard,
  SiAmericanexpress,
  SiDiscover,
} from "react-icons/si";

type CardType = "Visa" | "Mastercard" | "Amex" | "Discover";

function maskCardNumber(cardNumber: string) {
  const first4 = cardNumber.replace(/\s/g, "").slice(0, 4);
  return `${first4} **** **** ****`;
}

function getCardType(cardNumber: string): CardType {
  const firstDigit = cardNumber.replace(/\s/g, "").charAt(0);
  if (firstDigit === "4") return "Visa";
  if (firstDigit === "5") return "Mastercard";
  if (firstDigit === "3") return "Amex";
  if (firstDigit === "6") return "Discover";
  return "Visa";
}

// Map card types to react-icons components
const CARD_TYPE_ICONS: Record<CardType, JSX.Element> = {
  Visa: <SiVisa className="text-blue-400" size={28} title="Visa" />,
  Mastercard: (
    <SiMastercard className="text-red-500" size={28} title="Mastercard" />
  ),
  Amex: <SiAmericanexpress className="text-cyan-400" size={28} title="Amex" />,
  Discover: (
    <SiDiscover className="text-orange-400" size={28} title="Discover" />
  ),
};

export default function CardsPage() {
  const user = useUserStore((s) => s.user);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [cardTypeFilter, setCardTypeFilter] = useState<CardType | "">("");

  const { data: cards, isLoading } = useQuery<CardData[]>({
    queryKey: ["cards", user?.id, user?.roles],
    queryFn: async () => {
      let data: CardData[];
      if (user?.roles?.includes("admin")) data = await fakeDb.getCards();
      else if (user?.roles?.includes("seller"))
        data = await fakeDb.getCardsBySeller(user.id);
      else if (user?.roles?.includes("buyer")) {
        const orders = await fakeDb.getOrdersByBuyer(user.id);
        const cardIds = orders.map((o) => o.cardId);
        const allCards = await fakeDb.getCards();
        data = allCards.filter((c) => cardIds.includes(c.id));
      } else {
        data = await fakeDb.getCards();
      }
      // Ensure every card has a cardType (simulate for demo)
      return data.map((c) => ({
        ...c,
        cardType:
          (c as CardData & { cardType?: CardType }).cardType ??
          getCardType(c.cardNumber),
      }));
    },
    enabled: true,
  });

  // Gather unique card types for select filter
  const cardTypes = useMemo(() => {
    const set = new Set<CardType>();
    (cards ?? []).forEach((c: CardData & { cardType?: CardType }) => {
      if (c.cardType) set.add(c.cardType);
    });
    return Array.from(set);
  }, [cards]);

  // Filter cards by cardType if filter is selected
  const filteredCards = useMemo(() => {
    if (!cardTypeFilter) return cards ?? [];
    return (cards ?? []).filter(
      (c: CardData & { cardType?: CardType }) => c.cardType === cardTypeFilter
    );
  }, [cards, cardTypeFilter]);

  const columns: ColumnDef<CardData & { cardType?: CardType }>[] = [
    {
      header: "Card Number",
      accessorKey: "cardNumber",
      cell: (info) => (
        <span className="font-mono tracking-widest">
          {maskCardNumber(info.getValue() as string)}
        </span>
      ),
    },
    { header: "Expiration", accessorKey: "expiration" },
    { header: "CVV", accessorKey: "cvv" },
    { header: "Price", accessorKey: "price" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info) => (
        <span
          className={clsx(
            "font-semibold",
            info.getValue() === "active" && "text-green-400",
            info.getValue() === "sold" && "text-blue-400",
            info.getValue() === "blocked" && "text-red-400"
          )}
        >
          {info.getValue() as string}
        </span>
      ),
    },
    {
      header: "Type",
      accessorKey: "cardType",
      cell: (info) => {
        const type = info.getValue() as CardType;
        return (
          <span className="flex items-center gap-2">
            {type ? (
              <>
                {CARD_TYPE_ICONS[type]}
                <span className="hidden sm:inline text-gray-300">{type}</span>
              </>
            ) : (
              <span className="text-gray-400">Unknown</span>
            )}
          </span>
        );
      },
    },
    {
      header: "Seller",
      accessorKey: "sellerId",
      cell: (info) => <span>{info.getValue() as string}</span>,
    },
  ];

  const table = useReactTable({
    data: filteredCards,
    columns,
    state: {
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;

  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">Cards</h1>
      <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-3">
        <input
          type="text"
          placeholder="Search cards..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="px-4 py-2 rounded border border-[#222] bg-[#19161a] text-white w-full sm:w-64 outline-none focus:border-[#38E54D] transition"
        />
        <div className="flex items-center gap-2">
          <label htmlFor="cardType" className="text-sm text-gray-400">
            Type:
          </label>
          <select
            id="cardType"
            value={cardTypeFilter}
            onChange={(e) => setCardTypeFilter(e.target.value as CardType | "")}
            className="rounded px-2 py-1 bg-[#19161a] text-white border border-[#222] focus:border-[#38E54D] transition"
          >
            <option value="">All</option>
            {cardTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-400">
            Rows per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="rounded px-2 py-1 bg-[#19161a] text-white border border-[#222] focus:border-[#38E54D] transition"
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isLoading ? (
        <div>Loading cards...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#222]">
          <table className="min-w-full bg-[#18141c] text-white">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-[#333]">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="py-2 px-4 text-left"
                      colSpan={header.colSpan}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-10 text-[#777]"
                  >
                    No cards found.
                  </td>
                </tr>
              )}
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#222] hover:bg-[#222]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-2 px-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-[#18141c] gap-2 border-t border-[#222]">
            <div className="text-sm text-gray-400">
              Page <span className="font-bold text-white">{pageIndex + 1}</span>{" "}
              of <span className="font-bold text-white">{pageCount}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-2 py-1 rounded bg-[#222] text-white disabled:opacity-40"
              >
                {"<<"}
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-2 py-1 rounded bg-[#222] text-white disabled:opacity-40"
              >
                {"<"}
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-2 py-1 rounded bg-[#222] text-white disabled:opacity-40"
              >
                {">"}
              </button>
              <button
                onClick={() => table.setPageIndex(pageCount - 1)}
                disabled={!table.getCanNextPage()}
                className="px-2 py-1 rounded bg-[#222] text-white disabled:opacity-40"
              >
                {">>"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
