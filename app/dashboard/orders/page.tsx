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
import clsx from "clsx";
import { useState, useMemo, JSX } from "react";
// You need to add react-icons to your project for brand icons
import {
  SiVisa,
  SiMastercard,
  SiAmericanexpress,
  SiDiscover,
} from "react-icons/si";

type CardType = "Visa" | "Mastercard" | "Amex" | "Discover";
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

function maskCardNumber(cardNumber: string) {
  const first4 = cardNumber.replace(/\s/g, "").slice(0, 4);
  return `${first4} **** **** ****`;
}

export default function CardsPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [cardTypeFilter, setCardTypeFilter] = useState<CardType | "">("");
  const [statusFilter, setStatusFilter] = useState<
    "" | "active" | "sold" | "blocked"
  >("");
  const [pageSize, setPageSize] = useState(10);

  const { data: cards, isLoading } = useQuery<CardData[]>({
    queryKey: ["cards"],
    queryFn: () => fakeDb.getCards(),
  });

  // Get unique card types from cards data
  const cardTypes = useMemo(() => {
    const set = new Set<CardType>();
    (cards ?? []).forEach((c: CardData) => {
      if (c.cardType) set.add(c.cardType);
    });
    return Array.from(set);
  }, [cards]);

  // Filter cards
  const filteredCards = useMemo(() => {
    let result = cards ?? [];
    if (cardTypeFilter)
      result = result.filter((c) => c.cardType === cardTypeFilter);
    if (statusFilter) result = result.filter((c) => c.status === statusFilter);
    if (globalFilter)
      result = result.filter(
        (c) =>
          c.cardNumber?.toLowerCase().includes(globalFilter.toLowerCase()) ||
          c.expiration?.toLowerCase().includes(globalFilter.toLowerCase()) ||
          c.price?.toString().includes(globalFilter) ||
          c.status?.toLowerCase().includes(globalFilter.toLowerCase()) ||
          c.cardType?.toLowerCase().includes(globalFilter.toLowerCase())
      );
    return result;
  }, [cards, cardTypeFilter, statusFilter, globalFilter]);

  const columns: ColumnDef<CardData>[] = [
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
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  const pageCount = Math.ceil(filteredCards.length / pageSize);
  const pageIndex = table.getState().pagination.pageIndex;

  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">Cards</h1>
      <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-3">
        <input
          type="text"
          placeholder="Search..."
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
          <label htmlFor="status" className="text-sm text-gray-400">
            Status:
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as typeof statusFilter)
            }
            className="rounded px-2 py-1 bg-[#19161a] text-white border border-[#222] focus:border-[#38E54D] transition"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-400">
            Rows:
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
                disabled={pageIndex === 0}
                className="px-2 py-1 rounded bg-[#222] text-white disabled:opacity-40"
              >
                {"<<"}
              </button>
              <button
                onClick={() => table.setPageIndex(Math.max(pageIndex - 1, 0))}
                disabled={pageIndex === 0}
                className="px-2 py-1 rounded bg-[#222] text-white disabled:opacity-40"
              >
                {"<"}
              </button>
              <button
                onClick={() =>
                  table.setPageIndex(Math.min(pageIndex + 1, pageCount - 1))
                }
                disabled={pageIndex >= pageCount - 1}
                className="px-2 py-1 rounded bg-[#222] text-white disabled:opacity-40"
              >
                {">"}
              </button>
              <button
                onClick={() => table.setPageIndex(pageCount - 1)}
                disabled={pageIndex >= pageCount - 1}
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
