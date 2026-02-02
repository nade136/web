"use client";

import { useEffect, useRef, useState } from "react";

import { supabaseUser } from "@/lib/supabaseClient";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardOverviewPage() {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [totalBalance, setTotalBalance] = useState("$0");
  const [changeValue, setChangeValue] = useState("+0.0%");
  const [assetsValue, setAssetsValue] = useState("0");
  const [riskLevel, setRiskLevel] = useState("Medium");

  useEffect(() => {
    if (!chartRef.current) return;

    const renderChart = (theme: "dark" | "light") => {
      if (!chartRef.current) return;
      chartRef.current.innerHTML = "";

      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbol: "BINANCE:BTCUSDT",
        width: "100%",
        height: 260,
        locale: "en",
        dateRange: "1D",
        colorTheme: theme,
        trendLineColor: "#22d3ee",
        underLineColor: "rgba(34, 211, 238, 0.12)",
        underLineBottomColor: "rgba(124, 58, 237, 0.08)",
        isTransparent: true,
      });

      chartRef.current.appendChild(script);
    };

    const initialTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    renderChart(initialTheme);

    const handleThemeChange = (event: Event) => {
      const detail = (event as CustomEvent<{ theme: "dark" | "light" }>).detail;
      renderChart(detail?.theme ?? initialTheme);
    };

    window.addEventListener("dashboard-theme-change", handleThemeChange);
    return () => {
      window.removeEventListener("dashboard-theme-change", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      const { data: authData } = await supabaseUser.auth.getUser();
      const userId = authData?.user?.id;

      if (userId) {
        const { data: userBalance } = await supabaseUser
          .from("user_balances")
          .select(
            "overview_total_balance,overview_change,overview_assets,overview_risk_level"
          )
          .eq("user_id", userId)
          .maybeSingle();

        if (userBalance?.overview_total_balance) {
          setTotalBalance(userBalance.overview_total_balance);
        }
        if (userBalance?.overview_change) {
          setChangeValue(userBalance.overview_change);
        }
        if (userBalance?.overview_assets) {
          setAssetsValue(userBalance.overview_assets);
        }
        if (userBalance?.overview_risk_level) {
          setRiskLevel(userBalance.overview_risk_level);
        }
      } else {
        const { data } = await supabaseUser
          .from("dashboard_stats")
          .select(
            "overview_total_balance,overview_change,overview_assets,overview_risk_level"
          )
          .limit(1)
          .maybeSingle();

        if (data?.overview_total_balance) {
          setTotalBalance(data.overview_total_balance);
        }
        if (data?.overview_change) {
          setChangeValue(data.overview_change);
        }
        if (data?.overview_assets) {
          setAssetsValue(data.overview_assets);
        }
        if (data?.overview_risk_level) {
          setRiskLevel(data.overview_risk_level);
        }
      }
    };

    loadStats();
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
      <section className="space-y-6">
        <Card className="rounded-3xl border-slate-200/70 bg-white text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#1a0f2b] dark:text-white dark:shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">
              Portfolio Overview
            </CardTitle>
            <Badge className="bg-cyan-400/10 text-cyan-700 hover:bg-cyan-400/10 dark:text-cyan-200">
              Live
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-4">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Total Balance
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                {totalBalance}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                24h Change
              </div>
              <div className="mt-2 text-lg font-semibold text-emerald-400">
                {changeValue}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Assets
              </div>
              <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {assetsValue}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Risk Level
              </div>
              <div className="mt-2 text-lg font-semibold text-violet-500 dark:text-violet-300">
                {riskLevel}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200/70 bg-white text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#1a0f2b] dark:text-white dark:shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">
              Market Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#14172b]">
              <div ref={chartRef} className="tradingview-widget-container" />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <Card className="rounded-3xl border-slate-200/70 bg-white text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#1a0f2b] dark:text-white dark:shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-500 dark:text-slate-400">
            No recent activity
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
