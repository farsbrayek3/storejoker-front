"use client";
import { useLoader } from "./LoaderContext";

export default function Loader() {
  const { loading } = useLoader();
  if (!loading) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#38E54D]"></div>
    </div>
  );
}
