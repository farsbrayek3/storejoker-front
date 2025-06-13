"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const { register, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    setLoading(true);
    // Simulate async API call
    setTimeout(() => {
      setLoading(false);
      router.push("/login");
    }, 1200);
  };

  const handleNavToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#161616] px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-2xl bg-[#18141c] p-12 shadow-2xl border border-[#251f2c]"
        style={{ boxShadow: "0 0 60px 0 #000" }}
      >
        <h1
          className="mb-6 text-center"
          style={{
            color: "#38E54D",
            fontFamily: "'Fontdiner Swanky', cursive",
            letterSpacing: "2px",
            fontSize: "4rem",
            lineHeight: "1.1",
          }}
        >
          Register
        </h1>
        <p className="text-white font-bold text-center mb-10 opacity-80 text-xl">
          Create your account
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <label className="block text-white mb-2 opacity-90 text-base">
              Email address
            </label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full rounded-md bg-[#161616] border border-[#3D3D3D] focus:border-[#38E54D] focus:ring-0 text-white px-4 py-3 placeholder:text-[#8e8e8e] text-lg outline-none transition"
              placeholder="Email address"
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-white mb-2 opacity-90 text-base">
              Username
            </label>
            <input
              type="text"
              {...register("username", { required: true })}
              className="w-full rounded-md bg-[#161616] border border-[#3D3D3D] focus:border-[#38E54D] focus:ring-0 text-white px-4 py-3 placeholder:text-[#8e8e8e] text-lg outline-none transition"
              placeholder="Username"
              autoComplete="username"
              disabled={loading}
            />
          </div>
          <div className="relative">
            <label className="block text-white mb-2 opacity-90 text-base">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: true })}
              className="w-full rounded-md bg-[#161616] border border-[#3D3D3D] focus:border-[#38E54D] focus:ring-0 text-white px-4 py-3 placeholder:text-[#8e8e8e] text-lg outline-none transition"
              placeholder="Password"
              autoComplete="new-password"
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 text-sm top-3 text-[#38E54D] hover:text-[#28a745] transition focus:outline-none"
              style={{ top: "50px" }}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              disabled={loading}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-md bg-[#38E54D] hover:bg-[#28a745] font-semibold text-[#18141c] text-xl transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin mr-2 h-6 w-6 text-[#18141c]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-40"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-80"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : null}
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-white opacity-70">
          Already have an account?{" "}
          <a
            href="/login"
            onClick={handleNavToLogin}
            className="text-[#38E54D] hover:underline"
          >
            Login here
          </a>
        </p>
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <svg
              className="animate-spin h-20 w-20 text-[#38E54D]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 48 48"
            >
              <circle
                className="opacity-40"
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="6"
              ></circle>
              <path
                className="opacity-80"
                fill="currentColor"
                d="M8 24a16 16 0 0116-16v8a8 8 0 00-8 8H8z"
              ></path>
            </svg>
          </div>
        )}
      </motion.div>
    </div>
  );
}
