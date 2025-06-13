"use client";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { fakeDb, User } from "@/lib/fakeDatabase";
import { useUserStore } from "@/stores/useUserStore";
export default function UsersPage() {
  const user = useUserStore((s) => s.user);

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fakeDb.getUsers,
  });

  const columns: ColumnDef<User>[] = [
    { header: "Username", accessorKey: "username" },
    { header: "Email", accessorKey: "email" },
    {
      header: "Roles",
      accessorKey: "roles",
      cell: (info) => (info.getValue() as string[]).join(", "),
    },
  ];

  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Only admins can view users
  if (!user?.roles.includes("admin")) {
    return <div className="p-8 text-red-500">Unauthorized</div>;
  }

  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">Users</h1>
      {isLoading ? (
        <div>Loading users...</div>
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
