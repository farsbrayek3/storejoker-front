"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthContext";

export default function NewTicketPage() {
  const auth = useAuth();
  const [form, setForm] = useState({ title: "", reason: "", message: "" });
  const [success, setSuccess] = useState(false);

  if (!auth?.user) return <div>Unauthorized</div>;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">Open Ticket</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Ticket Title"
          className="w-full rounded p-2 bg-[#111] text-white border border-[#333]"
          required
        />
        <select
          name="reason"
          value={form.reason}
          onChange={handleChange}
          className="w-full rounded p-2 bg-[#111] text-white border border-[#333]"
          required
        >
          <option value="">Select reason</option>
          <option value="Payment">Payment</option>
          <option value="Become Seller Request">Become Seller Request</option>
          <option value="Other">Other</option>
        </select>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your message"
          rows={4}
          className="w-full rounded p-2 bg-[#111] text-white border border-[#333]"
          required
        />
        <button
          type="submit"
          className="bg-[#38E54D] text-[#18141c] px-4 py-2 rounded font-bold"
        >
          Submit Ticket
        </button>
        {success && (
          <div className="text-green-400 mt-2">Ticket submitted!</div>
        )}
      </form>
    </div>
  );
}
