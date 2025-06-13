"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import Skeleton from "react-loading-skeleton";
import clsx from "clsx";
import toast from "react-hot-toast";
import dayjs from "dayjs";

// Simulate API
const fetchUsers = async () => {
  await new Promise((r) => setTimeout(r, 800));
  return [
    {
      id: 1,
      username: "admin",
      email: "admin@site.com",
      roles: ["admin"],
      status: "active",
      registeredAt: "2024-01-01",
      lastLogin: "2025-06-13",
    },
    {
      id: 2,
      username: "seller",
      email: "seller@site.com",
      roles: ["seller"],
      status: "blocked",
      registeredAt: "2024-03-15",
      lastLogin: "2025-06-13",
    },
  ];
};

const blockUser = async (id: number) => {
  await new Promise((r) => setTimeout(r, 600));
  return id;
};

type User = Awaited<ReturnType<typeof fetchUsers>>[number];

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
  const blockMutation = useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      toast.success("User status updated!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const columns: ColumnDef<User>[] = [
    { header: "Username", accessorKey: "username" },
    { header: "Email", accessorKey: "email" },
    {
      header: "Roles",
      accessorKey: "roles",
      cell: (info) => (info.getValue() as string[]).join(", "),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info) => (
        <span
          className={clsx(
            "font-semibold",
            info.getValue() === "active" ? "text-green-400" : "text-red-400"
          )}
        >
          {info.getValue() as string}
        </span>
      ),
    },
    {
      header: "Registered",
      accessorKey: "registeredAt",
      cell: (info) => dayjs(info.getValue() as string).format("MMM D, YYYY"),
    },
    {
      header: "Last Login",
      accessorKey: "lastLogin",
      cell: (info) => dayjs(info.getValue() as string).format("MMM D, YYYY"),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <button
          disabled={blockMutation.isPending}
          onClick={() => blockMutation.mutate(row.original.id)}
          className={clsx(
            "px-2 py-1 rounded",
            row.original.status === "blocked"
              ? "bg-[#38E54D] text-[#18141c]"
              : "bg-[#EF4444] text-white"
          )}
        >
          {row.original.status === "blocked" ? "Unblock" : "Block"}
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: false,
    manualSorting: false,
  });

  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">
        User Management
      </h1>
      {isLoading ? (
        <div>
          <Skeleton height={32} width={200} />
          <div className="mt-4 space-y-2">
            <Skeleton height={40} />
            <Skeleton height={40} />
          </div>
        </div>
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
                    No users found.
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
