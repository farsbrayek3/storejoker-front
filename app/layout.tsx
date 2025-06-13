"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/AuthContext";
import { LoaderProvider } from "@/components/LoaderContext";
import { ToastProvider } from "@/components/ToastContext";
import Loader from "@/components/Loader";
import Toasts from "@/components/Toasts";
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <LoaderProvider>
              <AuthProvider>
                <Loader />
                <Toasts />
                {children}
              </AuthProvider>
            </LoaderProvider>
          </ToastProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
