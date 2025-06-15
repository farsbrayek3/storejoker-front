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
import { fakeDb, User, UserRole } from "@/lib/fakeDatabase";
import { useState, useMemo } from "react";
import clsx from "clsx";
import { UserCog, MailQuestion, Ban, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

export default function UsersPage() {
  // Filtering/search/pagination state
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fakeDb.getUsers,
  });

  // Get unique roles for filter dropdown
  const allRoles = useMemo(() => {
    const set = new Set<string>();
    (users ?? []).forEach((u) => (u.roles || []).forEach((r) => set.add(r)));
    return Array.from(set);
  }, [users]);

  // Filtered users (role-based)
  const filteredUsers = useMemo(() => {
    let result = users ?? [];
    if (roleFilter)
      result = result.filter((u) => u.roles?.includes(roleFilter as UserRole));
    if (globalFilter)
      result = result.filter(
        (u) =>
          u.username?.toLowerCase().includes(globalFilter.toLowerCase()) ||
          u.email?.toLowerCase().includes(globalFilter.toLowerCase()) ||
          u.roles?.some((r) =>
            r.toLowerCase().includes(globalFilter.toLowerCase())
          )
      );
    return result;
  }, [users, roleFilter, globalFilter]);

  // Action handlers
  function handleMakeSeller(user: User) {
    toast.success(`Made ${user.username} a seller!`);
    // Call your backend/mutation here
  }
  function handleOpenTicket(user: User) {
    toast.success(`Opened a ticket for ${user.username}`);
  }
  function handleBlock(user: User) {
    toast.error(`${user.username} is now blocked!`);
  }
  function handleChangePassword() {
    toast("Password reset link sent!");
  }

  const columns: ColumnDef<User>[] = [
    {
      header: "Username",
      accessorKey: "username",
      cell: (info) => (
        <span className="font-semibold text-blue-300">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (info) => (
        <span className="font-mono text-white">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      header: "Roles",
      accessorKey: "roles",
      cell: (info) => (
        <span>
          {(info.getValue() as string[]).map((r) => (
            <span
              key={r}
              className={clsx(
                "inline-block px-2 py-0.5 rounded text-xs mr-1 font-bold",
                r === "admin" && "bg-pink-700 text-white",
                r === "seller" && "bg-green-800 text-green-200",
                r === "buyer" && "bg-purple-800 text-purple-200"
              )}
            >
              {r}
            </span>
          ))}
        </span>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const user = row.original as User;
        const isSeller = user.roles?.includes("seller");
        return (
          <div className="flex gap-2">
            {/* Make Seller */}
            {!isSeller && (
              <button
                onClick={() => handleMakeSeller(user)}
                title="Promote to Seller"
                className="p-1 rounded bg-[#212f23] hover:bg-[#38E54D]/20 text-[#38E54D] transition"
              >
                <UserCog size={18} />
              </button>
            )}
            {/* Open Ticket */}
            <button
              onClick={() => handleOpenTicket(user)}
              title="Open Support Ticket"
              className="p-1 rounded bg-[#221b2a] hover:bg-pink-400/20 text-pink-400 transition"
            >
              <MailQuestion size={18} />
            </button>
            {/* Block */}
            <button
              onClick={() => handleBlock(user)}
              title="Block User"
              className="p-1 rounded bg-[#2e1c23] hover:bg-red-400/20 text-red-400 transition"
            >
              <Ban size={18} />
            </button>
            {/* Change Password */}
            <button
              onClick={() => handleChangePassword()}
              title="Send Password Reset"
              className="p-1 rounded bg-[#22223a] hover:bg-blue-400/20 text-blue-400 transition"
            >
              <KeyRound size={18} />
            </button>
          </div>
        );
      },
      size: 140,
    },
  ];

  const table = useReactTable({
    data: filteredUsers,
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

  const pageCount = Math.ceil(filteredUsers.length / pageSize);
  const pageIndex = table.getState().pagination.pageIndex;

  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">Users</h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search username, email or role..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="px-4 py-2 rounded border border-[#222] bg-[#19161a] text-white w-full sm:w-64 outline-none focus:border-[#38E54D] transition"
        />
        <div className="flex items-center gap-2">
          <label htmlFor="role" className="text-sm text-gray-400">
            Role:
          </label>
          <select
            id="role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded px-2 py-1 bg-[#19161a] text-white border border-[#222] focus:border-[#38E54D] transition"
          >
            <option value="">All</option>
            {allRoles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
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
