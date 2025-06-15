"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function NewTicketPage() {
  const auth = useAuth();
  const [form, setForm] = useState({ title: "", reason: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!auth?.user)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-red-400">
        <AlertCircle size={40} className="mb-2" />
        <span className="font-bold text-lg">Unauthorized</span>
      </div>
    );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title.trim() || !form.reason.trim() || !form.message.trim()) {
      setError("All fields are required.");
      return;
    }
    setSuccess(true);
    setForm({ title: "", reason: "", message: "" });
  };

  return (
    <div>
      <h1 className="text-2xl mb-6 font-bold text-[#38E54D]">
        Open a Support Ticket
      </h1>
      <div className="bg-[#18141c] border border-[#28212c] rounded-lg p-8 max-w-xl mx-auto shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-semibold text-[#38E54D]">
              Ticket Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter a short descriptive title"
              className="w-full rounded px-3 py-2 bg-[#111] text-white border border-[#333] focus:border-[#38E54D] outline-none transition"
              maxLength={80}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-[#38E54D]">
              Reason
            </label>
            <select
              name="reason"
              value={form.reason}
              onChange={handleChange}
              className="w-full rounded px-3 py-2 bg-[#111] text-white border border-[#333] focus:border-[#38E54D] outline-none transition"
              required
            >
              <option value="">Select reason</option>
              <option value="Payment">Payment Issue</option>
              <option value="Become Seller Request">
                Become Seller Request
              </option>
              <option value="Account Issue">Account Issue</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-[#38E54D]">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe your issue or request in detail..."
              rows={5}
              className="w-full rounded px-3 py-2 bg-[#111] text-white border border-[#333] focus:border-[#38E54D] outline-none transition"
              maxLength={1000}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#38E54D] text-[#18141c] px-4 py-2 rounded font-bold hover:bg-[#2fd44d] transition"
          >
            Submit Ticket
          </button>
          {error && (
            <div className="flex items-center gap-2 mt-2 text-red-400">
              <AlertCircle size={18} /> <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 mt-2 text-green-400">
              <CheckCircle2 size={18} />{" "}
              <span>Ticket submitted successfully!</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
