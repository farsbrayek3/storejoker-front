"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import clsx from "clsx";
import { useUserStore } from "@/stores/useUserStore"; // <-- Make sure this exists

const rolesList = [
  { value: "admin", label: "Admin" },
  { value: "seller", label: "Seller" },
  { value: "buyer", label: "Buyer" },
];

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.enum(["admin", "seller", "buyer"]),
});

const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters."),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
    role: z.enum(["admin", "seller", "buyer"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function AuthCard() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const setUser = useUserStore((s) => s.setUser);

  // Login form
  const {
    register: loginRegister,
    handleSubmit: handleLogin,
    formState: { errors: loginErrors, isSubmitting: isLoggingIn },
    reset: loginReset,
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: "buyer" },
  });

  // Register form
  const {
    register: regRegister,
    handleSubmit: handleRegister,
    formState: { errors: regErrors, isSubmitting: isRegistering },
    reset: regReset,
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "buyer" },
  });

  // Simulate API
  async function onLogin(data: z.infer<typeof loginSchema>) {
    await new Promise((r) => setTimeout(r, 900));
    setUser({
      id: Math.random().toString(),
      username: data.email.split("@")[0],
      email: data.email,
      roles: [data.role],
    });
    toast.success(`Logged in as ${data.role}`);
    // redirect or close modal etc
  }

  async function onRegister(data: z.infer<typeof registerSchema>) {
    await new Promise((r) => setTimeout(r, 1100));
    toast.success("Registration successful!");
    setMode("login");
    loginReset({ email: data.email, password: "", role: data.role });
    regReset();
  }

  return (
    <div className="w-full max-w-[400px] mx-auto mt-24">
      <div className="bg-[#18141c] rounded-2xl shadow-lg p-8 border border-[#222]">
        <div className="flex justify-center mb-6">
          <button
            className={clsx(
              "text-lg px-4 py-2 rounded-t-lg font-bold transition-all outline-none",
              mode === "login"
                ? "bg-[#38E54D] text-[#18141c] shadow"
                : "bg-transparent text-[#38E54D] hover:text-white"
            )}
            onClick={() => setMode("login")}
            aria-current={mode === "login"}
          >
            Login
          </button>
          <button
            className={clsx(
              "text-lg px-4 py-2 rounded-t-lg font-bold transition-all outline-none",
              mode === "register"
                ? "bg-[#38E54D] text-[#18141c] shadow"
                : "bg-transparent text-[#38E54D] hover:text-white"
            )}
            onClick={() => setMode("register")}
            aria-current={mode === "register"}
          >
            Register
          </button>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {mode === "login" ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleLogin(onLogin)}
              className="flex flex-col gap-4"
              autoComplete="off"
            >
              <input
                {...loginRegister("email")}
                type="email"
                placeholder="Email"
                className={clsx(
                  "rounded p-3 bg-[#111] text-white border",
                  loginErrors.email ? "border-[#EF4444]" : "border-[#333]"
                )}
                autoFocus
              />
              {loginErrors.email && (
                <span className="text-red-400 text-xs">
                  {loginErrors.email.message}
                </span>
              )}
              <input
                {...loginRegister("password")}
                type="password"
                placeholder="Password"
                className={clsx(
                  "rounded p-3 bg-[#111] text-white border",
                  loginErrors.password ? "border-[#EF4444]" : "border-[#333]"
                )}
              />
              {loginErrors.password && (
                <span className="text-red-400 text-xs">
                  {loginErrors.password.message}
                </span>
              )}
              <select
                {...loginRegister("role")}
                className={clsx(
                  "rounded p-3 bg-[#111] text-white border",
                  loginErrors.role ? "border-[#EF4444]" : "border-[#333]"
                )}
              >
                {rolesList.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {loginErrors.role && (
                <span className="text-red-400 text-xs">
                  {loginErrors.role.message}
                </span>
              )}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="mt-2 bg-[#38E54D] text-[#18141c] font-bold rounded p-3 transition-all hover:brightness-125 disabled:opacity-60"
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </button>
              <div className="text-center mt-2 text-xs text-[#aaa]">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="underline text-[#38E54D] hover:text-white"
                >
                  Register
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleRegister(onRegister)}
              className="flex flex-col gap-4"
              autoComplete="off"
            >
              <input
                {...regRegister("username")}
                placeholder="Username"
                className={clsx(
                  "rounded p-3 bg-[#111] text-white border",
                  regErrors.username ? "border-[#EF4444]" : "border-[#333]"
                )}
                autoFocus
              />
              {regErrors.username && (
                <span className="text-red-400 text-xs">
                  {regErrors.username.message}
                </span>
              )}
              <input
                {...regRegister("email")}
                type="email"
                placeholder="Email"
                className={clsx(
                  "rounded p-3 bg-[#111] text-white border",
                  regErrors.email ? "border-[#EF4444]" : "border-[#333]"
                )}
              />
              {regErrors.email && (
                <span className="text-red-400 text-xs">
                  {regErrors.email.message}
                </span>
              )}
              <input
                {...regRegister("password")}
                type="password"
                placeholder="Password"
                className={clsx(
                  "rounded p-3 bg-[#111] text-white border",
                  regErrors.password ? "border-[#EF4444]" : "border-[#333]"
                )}
              />
              {regErrors.password && (
                <span className="text-red-400 text-xs">
                  {regErrors.password.message}
                </span>
              )}
              <input
                {...regRegister("confirmPassword")}
                type="password"
                placeholder="Confirm Password"
                className={clsx(
                  "rounded p-3 bg-[#111] text-white border",
                  regErrors.confirmPassword
                    ? "border-[#EF4444]"
                    : "border-[#333]"
                )}
              />
              {regErrors.confirmPassword && (
                <span className="text-red-400 text-xs">
                  {regErrors.confirmPassword.message}
                </span>
              )}
              <select
                {...regRegister("role")}
                className={clsx(
                  "rounded p-3 bg-[#111] text-white border",
                  regErrors.role ? "border-[#EF4444]" : "border-[#333]"
                )}
              >
                {rolesList.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {regErrors.role && (
                <span className="text-red-400 text-xs">
                  {regErrors.role.message}
                </span>
              )}
              <button
                type="submit"
                disabled={isRegistering}
                className="mt-2 bg-[#38E54D] text-[#18141c] font-bold rounded p-3 transition-all hover:brightness-125 disabled:opacity-60"
              >
                {isRegistering ? "Registering..." : "Register"}
              </button>
              <div className="text-center mt-2 text-xs text-[#aaa]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="underline text-[#38E54D] hover:text-white"
                >
                  Login
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
