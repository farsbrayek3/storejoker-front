"use client";
import Link from "next/link";
import Image from "next/image";
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
import { useState, useEffect } from "react";

const iconColor = {
  home: "text-green-500",
  users: "text-pink-500",
  cards: "text-green-500",
  orders: "text-purple-500",
  sellers: "text-green-500",
  tickets: "text-pink-500",
  withdrawals: "text-purple-500",
  settings: "text-pink-500",
  account: "text-purple-500",
  addCard: "text-green-500",
  sales: "text-green-500",
  buyCards: "text-green-500",
  myOrders: "text-pink-500",
  withdraw: "text-pink-500",
  logout: "text-pink-500",
};

const sidebarLinks = {
  admin: [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Home size={26} className={iconColor.home} />,
    },
    {
      href: "/dashboard/users",
      label: "Users",
      icon: <Users size={26} className={iconColor.users} />,
    },
    {
      href: "/dashboard/cards",
      label: "Cards",
      icon: <CreditCard size={26} className={iconColor.cards} />,
    },
    {
      href: "/dashboard/orders",
      label: "Orders",
      icon: <ShoppingCart size={26} className={iconColor.orders} />,
    },
    {
      href: "/dashboard/sellers",
      label: "Sellers",
      icon: <BarChart2 size={26} className={iconColor.sellers} />,
    },
    {
      href: "/dashboard/tickets",
      label: "Tickets",
      icon: <Ticket size={26} className={iconColor.tickets} />,
    },
    {
      href: "/dashboard/withdrawals",
      label: "Withdrawals",
      icon: <DollarSign size={26} className={iconColor.withdrawals} />,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: <Settings size={26} className={iconColor.settings} />,
    },
  ],
  seller: [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Home size={26} className={iconColor.home} />,
    },
    {
      href: "/dashboard/cards",
      label: "My Cards",
      icon: <CreditCard size={26} className={iconColor.cards} />,
    },
    {
      href: "/dashboard/add-card",
      label: "Add Card",
      icon: <Package size={26} className={iconColor.addCard} />,
    },
    {
      href: "/dashboard/orders",
      label: "Sales",
      icon: <BarChart2 size={26} className={iconColor.sales} />,
    },
    {
      href: "/dashboard/withdraw",
      label: "Withdraw",
      icon: <DollarSign size={26} className={iconColor.withdraw} />,
    },
    {
      href: "/dashboard/account",
      label: "Account",
      icon: <User size={26} className={iconColor.account} />,
    },
    {
      href: "/dashboard/tickets",
      label: "Tickets",
      icon: <Ticket size={26} className={iconColor.tickets} />,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: <Settings size={26} className={iconColor.settings} />,
    },
  ],
  buyer: [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Home size={26} className={iconColor.home} />,
    },
    {
      href: "/dashboard/cards",
      label: "Buy Cards",
      icon: <CreditCard size={26} className={iconColor.buyCards} />,
    },
    {
      href: "/dashboard/deposit",
      label: "Deposit",
      icon: <DollarSign size={26} className="text-green-500" />,
    }, // <-- NEW
    {
      href: "/dashboard/orders",
      label: "My Orders",
      icon: <ShoppingCart size={26} className={iconColor.myOrders} />,
    },
    {
      href: "/dashboard/account",
      label: "Account",
      icon: <User size={26} className={iconColor.account} />,
    },
    {
      href: "/dashboard/tickets",
      label: "Tickets",
      icon: <Ticket size={26} className={iconColor.tickets} />,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: <Settings size={26} className={iconColor.settings} />,
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
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
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

  // Helper for icon backgrounds (active/focused)
  function iconBg(isActive: boolean) {
    return isActive
      ? "bg-[#19161a] shadow-lg"
      : "hover:bg-[#19161a] hover:shadow-lg";
  }

  return (
    <aside className="bg-[#0c0b0d] flex flex-col items-center py-4 w-[74px] min-w-[74px] border-r border-[#121114] h-screen">
      <div className="mb-6 flex flex-col items-center">
        <Link href="/dashboard">
          <Image
            src="/joker.png"
            alt="Joker Avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full mb-2 border-2 border-[#23D160] shadow"
            priority
          />
        </Link>
      </div>
      <nav className="flex flex-col gap-2 flex-1 w-full items-center">
        {links.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className={`relative group w-11 h-11 flex items-center justify-center rounded-xl transition duration-150 my-1 ${iconBg(
              active === item.href
            )}`}
            onClick={() => setActive(item.href)}
            tabIndex={0}
          >
            {item.icon}
            {/* Tooltip */}
            <span className="pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-md bg-[#19161a] px-3 py-1 text-xs text-white z-50 shadow-lg border border-[#231b2a]">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
      <div className="flex flex-col items-center mt-auto mb-2">
        <button
          onClick={handleLogout}
          disabled={loading}
          className={`relative group w-11 h-11 flex items-center justify-center rounded-xl transition duration-150 my-1 hover:bg-[#19161a] hover:shadow-lg`}
        >
          {loading ? (
            <svg
              className="animate-spin h-7 w-7 text-pink-500"
              viewBox="0 0 24 24"
            >
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
            <LogOut size={26} className={iconColor.logout} />
          )}
          {/* Tooltip for logout */}
          <span className="pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-md bg-[#19161a] px-3 py-1 text-xs text-white z-50 shadow-lg border border-[#231b2a]">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
