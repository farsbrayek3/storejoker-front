"use client";
import { useAuth } from "@/components/AuthContext";

export default function SettingsPage() {
  const auth = useAuth();
  if (!auth?.user) return <div>Unauthorized</div>;
  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">Settings</h1>
      <p className="text-white">Adjust your dashboard preferences.</p>
    </div>
  );
}
