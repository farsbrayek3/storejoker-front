"use client";
import { Bell, Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    if (auth) {
      auth.logout();
      router.push("/auth/login");
    }
  };

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
      <Image
        src="/avatar.jpg"
        alt="Profile"
        width={32}
        height={32}
        className="rounded-full border-2 border-[#251f2c] h-8 w-8 object-cover"
        priority
      />
      {auth?.user && (
        <button
          onClick={handleLogout}
          className="ml-2 px-3 py-1 rounded text-[#EF4444] font-semibold bg-[#231b2a] hover:bg-[#2f232a] transition"
        >
          Logout
        </button>
      )}
    </header>
  );
}
