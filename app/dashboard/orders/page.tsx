"use client";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { fakeDb, Order } from "@/lib/fakeDatabase";
import { useUserStore } from "@/stores/useUserStore";
import clsx from "clsx";

export default function OrdersPage() {
  const user = useUserStore((s) => s.user);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["orders", user?.id, user?.roles],
    queryFn: async () => {
      if (!user) return [];
      if (user.roles.includes("admin")) return fakeDb.getOrders();
      if (user.roles.includes("buyer")) return fakeDb.getOrdersByBuyer(user.id);
      // Optionally, for sellers, filter by sellerId
      if (user.roles.includes("seller"))
        return (await fakeDb.getOrders()).filter((o) => o.sellerId === user.id);
      return [];
    },
    enabled: !!user,
  });

  const columns: ColumnDef<Order>[] = [
    { header: "Order ID", accessorKey: "id" },
    { header: "Card ID", accessorKey: "cardId" },
    { header: "Buyer", accessorKey: "buyerId" },
    { header: "Seller", accessorKey: "sellerId" },
    { header: "Price", accessorKey: "price" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info) => (
        <span
          className={clsx(
            "font-semibold",
            info.getValue() === "completed" && "text-green-400",
            info.getValue() === "pending" && "text-yellow-400",
            info.getValue() === "cancelled" && "text-red-400"
          )}
        >
          {info.getValue() as string}
        </span>
      ),
    },
    { header: "Date", accessorKey: "date" },
  ];

  const table = useReactTable({
    data: orders || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!user) return <div className="p-8 text-red-500">Unauthorized</div>;

  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">Orders</h1>
      {isLoading ? (
        <div>Loading orders...</div>
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
                    No orders found.
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
