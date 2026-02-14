"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // TODO: Replace with actual auth check when backend is implemented
    // For now, redirect to home page
    router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400 mb-4">Redirecting...</p>
        
        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-4">Or choose your role:</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/borrower"
              className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-white transition-colors"
            >
              Borrower Dashboard
            </Link>
            <Link
              href="/lender"
              className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-white transition-colors"
            >
              Lender Dashboard
            </Link>
            <Link
              href="/insurer"
              className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-white transition-colors"
            >
              Insurer Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
