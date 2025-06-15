"use client";
import { useState } from "react";
import { Tab } from "@headlessui/react";
import { Copy, Check, Bitcoin, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

const depositWallets = {
  BTC: "bc1qexamplebitcoinaddress",
  USDT: "TExampleUSDTaddress123456789",
};

const depositHistory = [
  {
    id: 1,
    date: "2025-06-14 12:20",
    amount: 0.002,
    crypto: "BTC",
    status: "Completed",
    tx: "a1b2c3d4e5f6",
  },
  {
    id: 2,
    date: "2025-06-12 19:01",
    amount: 120,
    crypto: "USDT",
    status: "Pending",
    tx: "f1e2d3c4b5a6",
  },
  // ...more
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function DepositPage() {
  const [cryptoTab, setCryptoTab] = useState<"BTC" | "USDT">("BTC");
  const [copied, setCopied] = useState<"BTC" | "USDT" | null>(null);

  const handleCopy = (value: string, type: "BTC" | "USDT") => {
    navigator.clipboard.writeText(value);
    setCopied(type);
    toast.success(`${type} address copied!`);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-white">Deposit Funds</h1>
      <p className="mb-6 text-gray-300">
        Buy Bitcoin or USDT and fund your account. All deposits are credited
        after network confirmation.
      </p>
      <Tab.Group>
        <Tab.List className="flex space-x-2 mb-6 bg-transparent">
          <Tab
            className={({ selected }) =>
              classNames(
                "px-4 py-2 rounded-lg font-semibold focus:outline-none transition",
                selected
                  ? "bg-[#1d1a22] text-green-400 border-b-2 border-green-400"
                  : "bg-[#18141c] text-gray-400 hover:text-green-400"
              )
            }
          >
            Buy Crypto
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                "px-4 py-2 rounded-lg font-semibold focus:outline-none transition",
                selected
                  ? "bg-[#1d1a22] text-purple-400 border-b-2 border-purple-400"
                  : "bg-[#18141c] text-gray-400 hover:text-purple-400"
              )
            }
          >
            Deposit History
          </Tab>
        </Tab.List>
        <Tab.Panels>
          {/* Buy Crypto Tab */}
          <Tab.Panel>
            <div className="flex space-x-6 mb-6">
              {(["BTC", "USDT"] as const).map((type) => (
                <button
                  key={type}
                  className={classNames(
                    "flex flex-col items-center px-6 py-4 rounded-xl border transition cursor-pointer",
                    cryptoTab === type
                      ? "bg-[#19161a] border-green-400 shadow-lg"
                      : "bg-[#18141c] border-[#232026] hover:border-green-400"
                  )}
                  onClick={() => setCryptoTab(type)}
                  type="button"
                >
                  {type === "BTC" ? (
                    <Bitcoin className="mb-1 text-yellow-400" size={32} />
                  ) : (
                    <DollarSign className="mb-1 text-green-400" size={32} />
                  )}
                  <span className="font-bold text-lg text-white">{type}</span>
                  <span className="uppercase text-xs text-gray-400">
                    {type === "BTC" ? "Bitcoin" : "USDT (TRC20)"}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-2 bg-[#18141c] rounded-xl p-6 border border-[#232026]">
              <div className="text-gray-300 mb-3">
                Send only{" "}
                <span className="font-bold text-white">{cryptoTab}</span> to
                this wallet address:
              </div>
              <div className="flex items-center bg-[#141217] px-4 py-3 rounded-lg mb-4">
                <span className="font-mono text-white text-sm break-all">
                  {depositWallets[cryptoTab]}
                </span>
                <button
                  className="ml-3"
                  onClick={() =>
                    handleCopy(depositWallets[cryptoTab], cryptoTab)
                  }
                  aria-label="Copy wallet address"
                  type="button"
                >
                  {copied === cryptoTab ? (
                    <Check className="text-green-400" size={22} />
                  ) : (
                    <Copy
                      className="text-gray-400 hover:text-green-400 transition"
                      size={22}
                    />
                  )}
                </button>
              </div>
              {/* Optionally: QR code or more instructions */}
              <div className="text-xs text-gray-400">
                <ul className="list-disc ml-5 space-y-1">
                  <li>
                    Minimum deposit:{" "}
                    <span className="text-white">
                      {cryptoTab === "BTC" ? "0.0005 BTC" : "10 USDT"}
                    </span>
                  </li>
                  <li>
                    Network:{" "}
                    <span className="text-white">
                      {cryptoTab === "BTC" ? "Bitcoin" : "TRC20 (USDT)"}
                    </span>
                  </li>
                  <li>Deposits will be credited after 1 confirmation.</li>
                </ul>
              </div>
            </div>
          </Tab.Panel>
          {/* Deposit History Tab */}
          <Tab.Panel>
            <div className="overflow-x-auto rounded-lg bg-[#18141c] border border-[#232026]">
              <table className="min-w-full text-sm text-gray-300">
                <thead>
                  <tr className="bg-[#19161a]">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Crypto</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Tx ID</th>
                  </tr>
                </thead>
                <tbody>
                  {depositHistory.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-10 text-center text-gray-500"
                      >
                        No deposit history yet.
                      </td>
                    </tr>
                  ) : (
                    depositHistory.map((entry) => (
                      <tr
                        key={entry.id}
                        className="border-b border-[#232026] hover:bg-[#151216] transition"
                      >
                        <td className="px-4 py-2">{entry.date}</td>
                        <td className="px-4 py-2 font-bold">{entry.crypto}</td>
                        <td className="px-4 py-2">
                          {entry.amount} {entry.crypto}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={
                              entry.status === "Completed"
                                ? "text-green-400 font-bold"
                                : "text-yellow-400 font-bold"
                            }
                          >
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 font-mono">
                          <span className="bg-[#232026] px-2 py-0.5 rounded">
                            {entry.tx}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
