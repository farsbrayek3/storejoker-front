"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import clsx from "clsx";

export default function SettingsPage() {
  const auth = useAuth();
  // Example state for toggles and fields
  const [theme, setTheme] = useState<"system" | "dark" | "light">("system");
  const [wallet, setWallet] = useState(auth?.user?.walletAddress || "");
  const [notif, setNotif] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState("");

  if (!auth?.user) return <div className="p-8 text-red-500">Unauthorized</div>;

  // Simulated save (replace with your own mutation)
  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setUpdating(true);
    setMsg("");
    setTimeout(() => {
      setUpdating(false);
      setMsg("Settings updated!");
    }, 900);
  }

  return (
    <div>
      <h1 className="text-2xl mb-6 font-bold text-[#38E54D]">Settings</h1>
      <form
        onSubmit={handleSave}
        className="max-w-md bg-[#18141c] p-6 rounded-lg shadow border border-[#27212c] space-y-5"
      >
        <div>
          <label className="block text-[#aaa] mb-1 font-semibold">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as typeof theme)}
            className="rounded px-3 py-2 bg-[#19161a] text-white border border-[#222] outline-none focus:border-[#38E54D] w-full"
          >
            <option value="system">System</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
          <div className="text-xs text-[#bbb] mt-1">
            Choose your dashboard UI theme.
          </div>
        </div>

        <div>
          <label className="block text-[#aaa] mb-1 font-semibold">
            Wallet Address
          </label>
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="Wallet address for payouts"
            className="w-full rounded p-2 bg-[#111] text-white border border-[#333] outline-none focus:border-[#38E54D]"
          />
          <div className="text-xs text-[#bbb] mt-1">
            Used for withdrawals and payments.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="notif"
            type="checkbox"
            checked={notif}
            onChange={() => setNotif((n) => !n)}
            className="accent-[#38E54D] w-4 h-4"
          />
          <label htmlFor="notif" className="text-[#aaa] font-semibold">
            Email notifications
          </label>
        </div>
        <div className="text-xs text-[#bbb] mt-1">
          Get notified about orders, balance, and news.
        </div>

        <button
          type="submit"
          disabled={updating}
          className={clsx(
            "w-full bg-[#38E54D] text-[#18141c] px-4 py-2 rounded font-bold transition hover:bg-[#2fd44d]",
            updating && "opacity-60"
          )}
        >
          {updating ? "Saving..." : "Save Changes"}
        </button>
        {msg && <div className="mt-2 text-green-400 text-center">{msg}</div>}
      </form>
    </div>
  );
}
