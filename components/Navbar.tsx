"use client";
import { Bell, Menu } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  const auth = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Responsive nav styles to match sidebar (dark, border, neon, etc.)
  return (
    <header className="h-14 px-4 sm:px-6 flex items-center justify-between bg-[#18141c] border-b border-[#251f2c] sticky top-0 z-40 shadow-lg">
      {/* Left section: Hamburger on mobile, logo/title */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          className="sm:hidden p-2 rounded-md hover:bg-[#251f2c] transition"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Open sidebar menu"
        >
          <Menu size={22} className="text-[#38E54D]" />
        </button>
        {/* Logo or App Title */}
        <span
          className="text-[#38E54D] font-extrabold text-xl tracking-wide"
          style={{
            fontFamily: "'Fontdiner Swanky', cursive",
            letterSpacing: "2px",
          }}
        >
          JOKER
        </span>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button className="relative p-2 hover:bg-[#251f2c] rounded-md">
          <Bell size={20} className="text-[#aaa]" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#EF4444]" />
          <span className="sr-only">Notifications</span>
        </button>
        {auth === undefined ? null : auth?.user ? (
          <>
            <div className="hidden sm:flex items-center gap-2">
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
              <span className="hidden sm:inline">Logout</span>
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
      </div>

      {/* Mobile menu drawer (optional, placeholder) */}
      {/* You can add mobile sidebar opening logic here if you wish */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex sm:hidden">
          {/* You can render your sidebar here for mobile */}
          <div className="w-64 bg-[#18141c] border-r border-[#251f2c] p-6">
            <button
              className="mb-4 text-[#EF4444] font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Close
            </button>
            {/* Add sidebar nav here */}
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => {
                  router.push("/dashboard");
                  setMobileMenuOpen(false);
                }}
                className="text-[#38E54D] text-lg font-bold hover:underline text-left"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  router.push("/dashboard/cards");
                  setMobileMenuOpen(false);
                }}
                className="text-[#38E54D] text-lg font-bold hover:underline text-left"
              >
                Cards
              </button>
              {/* Add more nav items as needed */}
              <button
                onClick={handleLogout}
                className="text-[#EF4444] mt-6 text-left"
              >
                Logout
              </button>
            </nav>
          </div>
          <div
            className="flex-1"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          />
        </div>
      )}
    </header>
  );
}
