"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { supabaseUser } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const redirectUser = async () => {
      const { data } = await supabaseUser.auth.getSession();
      if (data.session) {
        router.replace("/dashboard/overview");
      } else {
        router.replace("/signin");
      }
    };

    redirectUser();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b12] text-white">
      Checking session...
    </div>
  );
}
