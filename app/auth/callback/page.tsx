"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseUser } from "@/lib/supabaseClient";

function CallbackInner() {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      try {
        const redirect = search.get("redirect") || "/dashboard";
        const code = search.get("code");

        if (code) {
          const { error: exchError } = await supabaseUser.auth.exchangeCodeForSession(code);
          if (exchError) {
            setError(exchError.message);
            return;
          }
          router.replace(redirect);
          return;
        }

        if (typeof window !== "undefined" && window.location.hash) {
          const hash = new URLSearchParams(window.location.hash.slice(1));
          const access_token = hash.get("access_token");
          const refresh_token = hash.get("refresh_token");
          if (access_token && refresh_token) {
            const { error: setErr } = await supabaseUser.auth.setSession({ access_token, refresh_token });
            if (setErr) {
              setError(setErr.message);
              return;
            }
            router.replace(redirect);
            return;
          }
        }

        setError("Missing auth parameters.");
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Auth error";
        setError(msg);
      }
    };
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen grid place-items-center bg-[#0b0b12] text-white px-6">
      <div className="rounded-2xl border border-white/10 bg-[#15192e] p-6 shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <div className="text-sm">Signing you in...</div>
        {error ? <div className="mt-3 text-xs text-rose-300">{error}</div> : null}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center bg-[#0b0b12] text-white px-6">Loading…</div>}>
      <CallbackInner />
    </Suspense>
  );
}
