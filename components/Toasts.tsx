"use client";
import { useToast } from "./ToastContext";

export default function Toasts() {
  const { toasts } = useToast();
  return (
    <div className="fixed z-50 top-4 right-4 flex flex-col gap-2 items-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 min-w-[220px] rounded shadow-lg text-sm font-medium transition
            ${
              toast.type === "success"
                ? "bg-[#38E54D] text-[#18141c]"
                : toast.type === "error"
                ? "bg-[#EF4444] text-white"
                : "bg-[#232323] text-white"
            }
          `}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
