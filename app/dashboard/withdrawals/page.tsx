"use client";
import { useAuth } from "@/components/AuthContext";

export default function WithdrawalsPage() {
  const auth = useAuth();
  const roles = auth?.user?.roles || [];
  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">Withdrawals</h1>
      {roles.includes("admin") && (
        <p className="text-white">Admin: All withdrawal records.</p>
      )}
      {roles.includes("seller") && !roles.includes("admin") && (
        <p className="text-white">Seller: Your withdrawal history.</p>
      )}
    </div>
  );
}
