"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      const userType = user?.unsafeMetadata?.userType;
      
      if (!userType) {
        router.push("/select-role");
      } else {
        switch (userType) {
          case "borrower":
            router.push("/borrower");
            break;
          case "lender":
            router.push("/lender");
            break;
          case "insurer":
            router.push("/insurer");
            break;
          default:
            router.push("/select-role");
        }
      }
    }
  }, [isLoaded, user, router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-zinc-400">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
