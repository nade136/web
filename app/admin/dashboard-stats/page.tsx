"use client";

import { useEffect, useState } from "react";

import { supabaseAdmin } from "@/lib/supabaseClient";

type DashboardStats = {
  id: string;
  wallet_overview_amount: string;
  wallet_overview_subtext: string;
  overview_total_balance: string;
  overview_change: string;
  overview_assets: string;
  overview_risk_level: string;
};

const defaultStats = {
  wallet_overview_amount: "$0",
  wallet_overview_subtext: "~0.00000000 BTC",
  overview_total_balance: "$0",
  overview_change: "+0.0%",
  overview_assets: "0",
  overview_risk_level: "Medium",
};

export default function AdminDashboardStatsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [formState, setFormState] = useState(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      const { data, error: loadError } = await supabaseAdmin
        .from("dashboard_stats")
        .select(
          "id,wallet_overview_amount,wallet_overview_subtext,overview_total_balance,overview_change,overview_assets,overview_risk_level"
        )
        .limit(1)
        .maybeSingle();

      if (loadError) {
        setError(loadError.message);
        setIsLoading(false);
        return;
      }

      if (data) {
        setStats(data);
        setFormState({
          wallet_overview_amount: data.wallet_overview_amount,
          wallet_overview_subtext: data.wallet_overview_subtext,
          overview_total_balance: data.overview_total_balance,
          overview_change: data.overview_change,
          overview_assets: data.overview_assets,
          overview_risk_level: data.overview_risk_level,
        });
      }

      setIsLoading(false);
    };

    loadStats();
  }, []);

  const handleSave = async () => {
    setError("");
    setIsSaving(true);

    const payload = {
      wallet_overview_amount: formState.wallet_overview_amount.trim() || "$0",
      wallet_overview_subtext:
        formState.wallet_overview_subtext.trim() || "~0.00000000 BTC",
      overview_total_balance: formState.overview_total_balance.trim() || "$0",
      overview_change: formState.overview_change.trim() || "+0.0%",
      overview_assets: formState.overview_assets.trim() || "0",
      overview_risk_level: formState.overview_risk_level.trim() || "Medium",
      updated_at: new Date().toISOString(),
    };

    const response = stats
      ? await supabaseAdmin
          .from("dashboard_stats")
          .update(payload)
          .eq("id", stats.id)
      : await supabaseAdmin.from("dashboard_stats").insert(payload).select().single();

    setIsSaving(false);

    if (response.error) {
      setError(response.error.message);
      return;
    }

    if (!stats && response.data) {
      setStats(response.data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-[#15192e] p-6 text-white shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <h2 className="text-lg font-semibold">Dashboard Stats</h2>
        <p className="mt-2 text-sm text-slate-400">
          Edit the wallet and overview balances shown to users.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0f1118] p-6 text-slate-200 shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        {isLoading ? (
          <div className="text-sm text-slate-400">Loading...</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-slate-400">
              Wallet overview amount
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                value={formState.wallet_overview_amount}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    wallet_overview_amount: event.target.value,
                  }))
                }
              />
            </label>
            <label className="text-xs text-slate-400">
              Wallet overview subtext
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                value={formState.wallet_overview_subtext}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    wallet_overview_subtext: event.target.value,
                  }))
                }
              />
            </label>
            <label className="text-xs text-slate-400">
              Overview total balance
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                value={formState.overview_total_balance}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    overview_total_balance: event.target.value,
                  }))
                }
              />
            </label>
            <label className="text-xs text-slate-400">
              Overview 24h change
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                value={formState.overview_change}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    overview_change: event.target.value,
                  }))
                }
              />
            </label>
            <label className="text-xs text-slate-400">
              Overview assets count
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                value={formState.overview_assets}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    overview_assets: event.target.value,
                  }))
                }
              />
            </label>
            <label className="text-xs text-slate-400">
              Overview risk level
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                value={formState.overview_risk_level}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    overview_risk_level: event.target.value,
                  }))
                }
              />
            </label>
          </div>
        )}

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {error}
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="mt-4 rounded-full bg-linear-to-r from-cyan-400 to-violet-500 px-6 py-2 text-xs font-semibold text-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
