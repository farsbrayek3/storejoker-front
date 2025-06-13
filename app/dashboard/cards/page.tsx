"use client";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { fakeDb, Card } from "@/lib/fakeDatabase";
import { useUserStore } from "@/stores/useUserStore";
import clsx from "clsx";

export default function CardsPage() {
  const user = useUserStore((s) => s.user);

  const { data: cards, isLoading } = useQuery<Card[]>({
    queryKey: ["cards", user?.id, user?.roles],
    queryFn: async () => {
      if (user?.roles?.includes("admin")) return fakeDb.getCards();
      if (user?.roles?.includes("seller"))
        return fakeDb.getCardsBySeller(user.id);
      return [];
    },
    enabled: !!user,
  });

  const columns: ColumnDef<Card>[] = [
    { header: "Card Number", accessorKey: "cardNumber" },
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
      header: "Seller",
      accessorKey: "sellerId",
      cell: (info) => <span>{info.getValue() as string}</span>, // You can fetch/display username if desired
    },
  ];

  const table = useReactTable({
    data: cards || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (
    !user ||
    !(user.roles.includes("admin") || user.roles.includes("seller"))
  ) {
    return <div className="p-8 text-red-500">Unauthorized</div>;
  }

  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">Cards</h1>
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
        </div>
      )}
    </div>
  );
}
