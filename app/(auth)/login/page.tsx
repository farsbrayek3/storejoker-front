"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

type LoginForm = {
  email: string;
  password: string;
};

const quickUsers = [
  { label: "Admin", email: "admin@site.com", password: "test123" },
  { label: "Seller", email: "seller@site.com", password: "test123" },
  { label: "Buyer", email: "buyer@site.com", password: "test123" },
];

export default function Login() {
  const { register, handleSubmit, setValue } = useForm<LoginForm>();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const auth = useAuth();
  const router = useRouter();

  const onSubmit = ({ email, password }: LoginForm) => {
    if (!auth) return;
    const user = auth.login(email, password);
    if (user) {
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Try a quick login below.");
    }
  };

  const handleQuickLogin = (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);
    if (!auth) return;
    const user = auth.login(email, password);
    if (user) {
      router.push("/dashboard");
    } else {
      setError("Quick login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#161616] px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xs rounded-2xl bg-[#18141c] p-8 shadow-2xl border border-[#251f2c]"
        style={{
          boxShadow: "0 0 40px 0 #000",
        }}
      >
        <h1
          className="font-serif text-[2.8rem] mb-3 text-center"
          style={{
            color: "#38E54D",
            fontFamily: "'Permanent Marker', cursive",
            letterSpacing: "2px",
          }}
        >
          Sign in
        </h1>
        <p className="text-white text-center mb-8 opacity-80">
          Sign in to your account
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
          <div className="relative">
            <label className="block text-white mb-2 opacity-90 text-sm">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: true })}
              className="w-full rounded-md bg-[#161616] border border-[#3D3D3D] focus:border-[#38E54D] focus:ring-0 text-white px-3 py-2 placeholder:text-[#8e8e8e] text-base outline-none transition"
              placeholder="Password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-[38px] text-green-400 text-xs font-semibold tracking-wide hover:underline"
              style={{ top: "38px" }}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-[#38E54D] hover:bg-[#28a745] font-semibold text-[#18141c] text-lg transition"
          >
            Sign In
          </button>
          {error && <p className="text-center text-red-500 text-sm">{error}</p>}
        </form>
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            {quickUsers.map((user) => (
              <button
                key={user.label}
                onClick={() => handleQuickLogin(user.email, user.password)}
                className="px-3 py-1 rounded bg-[#25282f] text-xs text-white hover:bg-[#38E54D] hover:text-[#18141c] transition"
                type="button"
              >
                {user.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[#888] text-center">
            Try Admin, Seller, or Buyer quick login!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
