"use client";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Stats } from "@/components/dashboard/Stats";
import { Activity } from "@/components/dashboard/Activity";
import { RevenuePie, TrafficLine } from "@/components/dashboard/Charts";
import { JokerCard } from "@/components/dashboard/JokerCard";

export default function Dashboard() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth?.user) {
      router.push("/login");
    }
  }, [auth?.user, router]);

  if (!auth?.user) return null;

  const { user } = auth;

  return (
    <div className="min-h-screen bg-[#161616] p-6 grid grid-cols-1 xl:grid-cols-5 gap-6">
      <main className="col-span-5">
        <h1
          className="text-[2.2rem] mb-3 font-bold"
          style={{
            color: "#38E54D",
            fontFamily: "'Permanent Marker', cursive",
          }}
        >
          Dashboard
        </h1>
        <div className="mb-6 flex gap-4 flex-wrap text-[#eee]">
          <div>
            <span className="font-mono text-[#38E54D]">Username:</span>{" "}
            {user.username}
          </div>
          <div>
            <span className="font-mono text-[#38E54D]">Email:</span>{" "}
            {user.email}
          </div>
          <div>
            <span className="font-mono text-[#38E54D]">Roles:</span>{" "}
            {user.roles.join(", ")}
          </div>
          <div>
            <span className="font-mono text-[#38E54D]">Registered:</span>{" "}
            {user.registeredAt}
          </div>
          <div>
            <span className="font-mono text-[#38E54D]">Last login:</span>{" "}
            {user.lastLogin}
          </div>
          {user.walletAddress && (
            <div>
              <span className="font-mono text-[#38E54D]">Wallet:</span>{" "}
              {user.walletAddress}
            </div>
          )}
          {user.sellerId && (
            <div>
              <span className="font-mono text-[#38E54D]">Seller ID:</span>{" "}
              {user.sellerId}
            </div>
          )}
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          <Stats />
        </div>
        <div className="grid gap-6 xl:grid-cols-3 mt-6">
          <section className="xl:col-span-2 flex flex-col gap-6">
            <Activity />
            <TrafficLine />
          </section>
          <section className="flex flex-col gap-6">
            <RevenuePie />
            <JokerCard />
            <div className="rounded-xl bg-[#18141c] px-4 py-2 shadow mt-2">
              <span className="block text-red-500 font-semibold text-center text-base">
                A Suratengend
              </span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
