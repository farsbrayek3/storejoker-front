"use client";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import {
  Home,
  User,
  BarChart2,
  CreditCard,
  ShoppingCart,
  Users,
  DollarSign,
  Settings,
  Ticket,
  LogOut,
  Package,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

const sidebarLinks = {
  admin: [
    { href: "/dashboard", label: "Dashboard", icon: <Home size={22} /> },
    { href: "/dashboard/users", label: "Users", icon: <Users size={22} /> },
    {
      href: "/dashboard/cards",
      label: "Cards",
      icon: <CreditCard size={22} />,
    },
    {
      href: "/dashboard/orders",
      label: "Orders",
      icon: <ShoppingCart size={22} />,
    },
    {
      href: "/dashboard/sellers",
      label: "Sellers",
      icon: <BarChart2 size={22} />,
    },
    {
      href: "/dashboard/tickets",
      label: "Tickets",
      icon: <Ticket size={22} />,
    },
    {
      href: "/dashboard/withdrawals",
      label: "Withdrawals",
      icon: <DollarSign size={22} />,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: <Settings size={22} />,
    },
  ],
  seller: [
    { href: "/dashboard", label: "Dashboard", icon: <Home size={22} /> },
    {
      href: "/dashboard/cards",
      label: "My Cards",
      icon: <CreditCard size={22} />,
    },
    {
      href: "/dashboard/add-card",
      label: "Add Card",
      icon: <Package size={22} />,
    },
    {
      href: "/dashboard/orders",
      label: "Sales",
      icon: <BarChart2 size={22} />,
    },
    {
      href: "/dashboard/withdraw",
      label: "Withdraw",
      icon: <DollarSign size={22} />,
    },
    { href: "/dashboard/account", label: "Account", icon: <User size={22} /> },
    {
      href: "/dashboard/tickets",
      label: "Tickets",
      icon: <Ticket size={22} />,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: <Settings size={22} />,
    },
  ],
  buyer: [
    { href: "/dashboard", label: "Dashboard", icon: <Home size={22} /> },
    {
      href: "/dashboard/cards",
      label: "Buy Cards",
      icon: <CreditCard size={22} />,
    },
    {
      href: "/dashboard/orders",
      label: "My Orders",
      icon: <ShoppingCart size={22} />,
    },
    { href: "/dashboard/account", label: "Account", icon: <User size={22} /> },
    {
      href: "/dashboard/tickets",
      label: "Tickets",
      icon: <Ticket size={22} />,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: <Settings size={22} />,
    },
  ],
};

function getSidebarLinks(roles: string[]) {
  if (roles.includes("admin")) return sidebarLinks.admin;
  if (roles.includes("seller")) return sidebarLinks.seller;
  return sidebarLinks.buyer;
}

export default function Sidebar() {
  const auth = useAuth();
  const user = auth?.user;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // If not logged in, redirect to login (optional for your main layout)
  if (!user) {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  const links = getSidebarLinks(user.roles ?? []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await auth?.logout();
      toast.success("Logged out!");
      router.push("/login");
    } catch {
      toast.error("Logout failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="bg-[#18141c] flex flex-col py-4 w-[80px] xl:w-[90px] transition-all duration-300 border-r border-[#231b2a] h-screen">
      <div className="mb-8 flex flex-col items-center">
        <Link href="/dashboard">
          <span className="text-[#38E54D] text-3xl font-bold font-mono">
            Jk
          </span>
        </Link>
      </div>
      <nav className="flex flex-col gap-4 flex-1">
        {links.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className="flex flex-col items-center gap-1 text-[#b0b0b0] hover:text-[#38E54D] transition text-xs"
          >
            {item.icon}
            <span className="text-[10px]">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="flex flex-col items-center mt-8">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex flex-col items-center gap-1 text-[#EF4444] hover:text-[#fff] transition"
        >
          {loading ? (
            <svg className="animate-spin mb-1 h-4 w-4" viewBox="0 0 24 24">
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
          ) : (
            <LogOut size={22} />
          )}
          <span className="text-[10px]">Logout</span>
        </button>
      </div>
    </aside>
  );
}
