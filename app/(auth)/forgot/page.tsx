"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm();
  const onSubmit = () => {
    /* call api */
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#161616] px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xs rounded-2xl bg-[#18141c] p-8 shadow-2xl border border-[#251f2c]"
        style={{ boxShadow: "0 0 40px 0 #000" }}
      >
        <h1
          className="font-serif text-[2.2rem] mb-3 text-center"
          style={{
            color: "#38E54D",
            fontFamily: "'Permanent Marker', cursive",
            letterSpacing: "2px",
          }}
        >
          Forgot Password
        </h1>
        <p className="text-white text-center mb-8 opacity-80">
          Enter your email to reset your password
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-white mb-2 opacity-90 text-sm">
              Email address
            </label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full rounded-md bg-[#161616] border border-[#3D3D3D] focus:border-[#38E54D] focus:ring-0 text-white px-3 py-2 placeholder:text-[#8e8e8e] text-base outline-none transition"
              placeholder="Email address"
              autoComplete="email"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-[#38E54D] hover:bg-[#28a745] font-semibold text-[#18141c] text-lg transition"
          >
            Send Reset Link
          </button>
        </form>
        <p className="text-center text-[#abaabc] mt-8 text-sm">
          Remembered your password?{" "}
          <Link
            href="/auth/login"
            className="text-[#76b7f7] underline hover:text-[#38E54D]"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
