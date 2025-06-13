"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthContext";

export default function ChangePasswordPage() {
  const auth = useAuth();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [success, setSuccess] = useState(false);
  if (!auth?.user) return <div>Unauthorized</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold text-[#38E54D]">
        Change Password
      </h1>
      <form className="max-w-sm space-y-4" onSubmit={handleSubmit}>
        <input
          type="password"
          name="current"
          value={form.current}
          onChange={handleChange}
          placeholder="Current password"
          className="w-full rounded p-2 bg-[#111] text-white border border-[#333]"
        />
        <input
          type="password"
          name="next"
          value={form.next}
          onChange={handleChange}
          placeholder="New password"
          className="w-full rounded p-2 bg-[#111] text-white border border-[#333]"
        />
        <input
          type="password"
          name="confirm"
          value={form.confirm}
          onChange={handleChange}
          placeholder="Confirm new password"
          className="w-full rounded p-2 bg-[#111] text-white border border-[#333]"
        />
        <button
          type="submit"
          className="bg-[#38E54D] text-[#18141c] px-4 py-2 rounded font-bold"
        >
          Change Password
        </button>
        {success && (
          <div className="text-green-400 mt-2">Password changed!</div>
        )}
      </form>
    </div>
  );
}
