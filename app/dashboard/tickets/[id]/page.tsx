"use client";
import { useState, use } from "react";
import { useAuth } from "@/components/AuthContext";

const mockMessages = [
  { sender: "buyer", message: "I paid but not received.", time: "2025-05-01" },
  {
    sender: "admin",
    message: "We'll check and reply soon.",
    time: "2025-05-02",
  },
];

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const auth = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  if (!auth?.user) return <div>Unauthorized</div>;

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.user) return;
    setMessages([
      ...messages,
      { sender: auth.user.username, message: input, time: "Now" },
    ]);
    setInput("");
  };

  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">Ticket #{id}</h1>
      <div className="bg-[#18141c] rounded-lg p-4 mb-4">
        {messages.map((m, i) => (
          <div key={i} className="mb-3">
            <span className="text-sm text-[#38E54D] font-bold">{m.sender}</span>
            <span className="ml-2 text-xs text-[#888]">{m.time}</span>
            <div className="ml-4 text-white">{m.message}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          className="flex-1 rounded p-2 bg-[#111] text-white border border-[#333]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Reply message..."
        />
        <button
          type="submit"
          className="bg-[#38E54D] text-[#18141c] px-4 py-2 rounded font-bold"
        >
          Send
        </button>
      </form>
    </div>
  );
}
