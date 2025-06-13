"use client";
import { Bell, Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  const auth = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      await auth.logout?.();
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch {
      toast.error("Error during logout.");
    } finally {
      setLoading(false);
    }
  };

  // Don't render user info or logout button until auth is loaded
  if (auth === undefined) {
    return (
      <header className="h-14 px-6 flex items-center gap-3 bg-[#18141c] border-b border-[#231b2a] sticky top-0 z-10">
        <label className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]"
            size={18}
          />
          <input
            className="w-full rounded-md bg-[#161616] pl-10 pr-4 py-2 text-sm placeholder-[#aaa] text-white focus:ring-0 focus:border-[#38E54D] border border-[#231b2a] outline-none"
            placeholder="Search"
            disabled
          />
        </label>
        <ThemeToggle />
        <button className="relative p-2 hover:bg-[#251f2c] rounded-md" disabled>
          <Bell size={20} className="text-[#aaa]" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#EF4444]" />
          <span className="sr-only">Notifications</span>
        </button>
      </header>
    );
  }

  return (
    <header className="h-14 px-6 flex items-center gap-3 bg-[#18141c] border-b border-[#231b2a] sticky top-0 z-10">
      <label className="relative flex-1 max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]"
          size={18}
        />
        <input
          className="w-full rounded-md bg-[#161616] pl-10 pr-4 py-2 text-sm placeholder-[#aaa] text-white focus:ring-0 focus:border-[#38E54D] border border-[#231b2a] outline-none"
          placeholder="Search"
        />
      </label>
      <ThemeToggle />
      <button className="relative p-2 hover:bg-[#251f2c] rounded-md">
        <Bell size={20} className="text-[#aaa]" />
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#EF4444]" />
        <span className="sr-only">Notifications</span>
      </button>
      {auth?.user ? (
        <>
          <div className="flex items-center gap-2">
            <div className="rounded-full border-2 border-[#251f2c] h-8 w-8 flex items-center justify-center bg-[#29222a] uppercase text-[#38E54D] font-bold text-base select-none">
              {auth.user.username?.slice(0, 2) || "??"}
            </div>
            <span className="text-white text-sm font-bold">
              {auth.user.username}
            </span>
          </div>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="ml-2 px-3 py-1 rounded text-[#EF4444] font-semibold bg-[#231b2a] hover:bg-[#2f232a] transition flex items-center"
          >
            {loading && (
              <svg className="animate-spin mr-1 h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-40"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-80"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => router.push("/login")}
          className="ml-2 px-3 py-1 rounded text-[#38E54D] font-semibold bg-[#231b2a] hover:bg-[#2f232a] transition"
        >
          Login
        </button>
      )}
    </header>
  );
}
