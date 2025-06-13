"use client";
import { useAuth } from "@/components/AuthContext";

export default function AccountPage() {
  const auth = useAuth();
  if (!auth?.user) return <div>Unauthorized</div>;
  const { user } = auth;
  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">Account</h1>
      <div className="bg-[#18141c] p-4 rounded-lg text-white">
        <p>
          <b>Username:</b> {user.username}
        </p>
        <p>
          <b>Email:</b> {user.email}
        </p>
        <p>
          <b>Roles:</b> {user.roles.join(", ")}
        </p>
        <p>
          <b>Registered:</b> {user.registeredAt}
        </p>
        <p>
          <b>Last login:</b> {user.lastLogin}
        </p>
        {user.walletAddress && (
          <p>
            <b>Wallet:</b> {user.walletAddress}
          </p>
        )}
        {user.sellerId && (
          <p>
            <b>Seller ID:</b> {user.sellerId}
          </p>
        )}
      </div>
    </div>
  );
}
