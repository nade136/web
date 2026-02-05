"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseUser } from "@/lib/supabaseClient";

type SessionInfo = {
  userId: string | null;
  email: string | null;
  expiresAt: string | null;
};

export default function AuthDebugPage() {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
    userId: null,
    email: null,
    expiresAt: null,
  });
  const [rawSession, setRawSession] = useState<string>("");
  const [cookiesText, setCookiesText] = useState<string>("");
  const [storageSummary, setStorageSummary] = useState<string>("");
  const [error, setError] = useState<string>("");

  const load = async () => {
    try {
      setError("");
      const { data } = await supabaseUser.auth.getSession();
      const s = data.session;
      setSessionInfo({
        userId: s?.user?.id ?? null,
        email: (s?.user?.email as string | null) ?? null,
        expiresAt: s?.expires_at ? new Date(s.expires_at * 1000).toISOString() : null,
      });
      setRawSession(JSON.stringify(s, null, 2));

      const cookieStr = typeof document !== "undefined" ? document.cookie : "";
      setCookiesText(cookieStr);

      const ss = typeof window !== "undefined" ? window.sessionStorage : undefined;
      const ls = typeof window !== "undefined" ? window.localStorage : undefined;
      const sbKey = "sb-user-session";
      const ssKeys = ss ? Object.keys(ss) : [];
      const lsKeys = ls ? Object.keys(ls) : [];
      const sbSess = ss ? ss.getItem(sbKey) : null;
      const lines = [
        `sessionStorage keys: ${ssKeys.join(", ")}`,
        `localStorage keys: ${lsKeys.join(", ")}`,
        `sb-user-session present: ${sbSess ? "yes" : "no"}`,
        `sb-user-session length: ${sbSess ? sbSess.length : 0}`,
      ];
      setStorageSummary(lines.join("\n"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load session");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen grid place-items-center bg-[#0b0b12] text-white px-6">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#15192e] p-6 shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <div className="text-lg font-semibold mb-4">Auth Debug</div>
        {error ? (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</div>
        ) : null}
        <div className="grid gap-4 text-xs text-slate-300">
          <div>
            <div className="text-slate-400">Summary</div>
            <pre className="mt-1 whitespace-pre-wrap rounded-xl border border-white/10 bg-[#0f1122] p-3">{JSON.stringify(sessionInfo, null, 2)}</pre>
          </div>
          <div>
            <div className="text-slate-400">Session (raw)</div>
            <pre className="mt-1 whitespace-pre-wrap break-all rounded-xl border border-white/10 bg-[#0f1122] p-3">{rawSession || "null"}</pre>
          </div>
          <div>
            <div className="text-slate-400">Cookies</div>
            <pre className="mt-1 whitespace-pre-wrap break-all rounded-xl border border-white/10 bg-[#0f1122] p-3">{cookiesText || "(empty)"}</pre>
          </div>
          <div>
            <div className="text-slate-400">Storage</div>
            <pre className="mt-1 whitespace-pre-wrap break-all rounded-xl border border-white/10 bg-[#0f1122] p-3">{storageSummary}</pre>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={load}
            className="rounded-full border border-cyan-400/30 px-4 py-1 text-xs text-cyan-200 hover:bg-cyan-400/10"
          >
            Refresh
          </button>
          <Link
            href="/dashboard/overview"
            className="rounded-full border border-slate-500/30 px-4 py-1 text-xs text-slate-300 hover:bg-white/5"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
