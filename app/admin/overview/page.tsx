"use client";

import { useEffect, useRef } from "react";

export default function AdminOverviewPage() {
  const chartRef = useRef<HTMLDivElement | null>(null);

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
        height: 220,
        locale: "en",
        dateRange: "1D",
        colorTheme: theme,
        trendLineColor: "#22d3ee",
        underLineColor: "rgba(34, 211, 238, 0.15)",
        underLineBottomColor: "rgba(124, 58, 237, 0.05)",
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

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#15192e] dark:shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
            <span>Wallet Overview</span>
            <span className="text-cyan-600 dark:text-cyan-300">USD</span>
          </div>
          <div className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
            $0.00
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            ~0.00000000 BTC
          </div>
          <button className="mt-5 rounded-full bg-linear-to-r from-cyan-400 to-violet-500 px-5 py-2 text-sm font-semibold text-slate-900 shadow-[0_0_18px_rgba(34,211,238,0.35)]">
            Deposit
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {["Deposit", "Withdraw", "Buy Crypto"].map((action) => (
            <div
              key={action}
              className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-center shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#14172b] dark:shadow-[0_12px_30px_rgba(4,10,22,0.45)]"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-cyan-600 dark:bg-[#1f2340] dark:text-cyan-300">
                ⬤
              </div>
              <div className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                {action}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {["Convert", "Backup Wallet", "More"].map((action) => (
            <div
              key={action}
              className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-center shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#14172b] dark:shadow-[0_12px_30px_rgba(4,10,22,0.45)]"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-cyan-600 dark:bg-[#1f2340] dark:text-cyan-300">
                ⬤
              </div>
              <div className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                {action}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#15192e] dark:shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
            <span>Assets</span>
            <span className="text-slate-500 dark:text-slate-400">
              Total Assets
            </span>
          </div>
          <div className="mt-4 grid gap-3">
            {[
              { name: "Tokens", value: "$0.00" },
              { name: "Balance", value: "$0.00" },
              { name: "Price (USD)", value: "$0.00" },
            ].map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-100 px-4 py-3 text-sm dark:border-white/5 dark:bg-[#121526]"
              >
                <span className="text-slate-500 dark:text-slate-400">
                  {row.name}
                </span>
                <span className="text-slate-700 dark:text-slate-200">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#15192e] dark:shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
            <span>BTC Trend</span>
            <span className="text-cyan-600 dark:text-cyan-300">Live</span>
          </div>
          <div className="mt-4">
            <div ref={chartRef} className="tradingview-widget-container" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#15192e] dark:shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {["Send", "Receive", "Swap", "Stake"].map((action) => (
              <button
                key={action}
                className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-[#14172b] dark:text-slate-200"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#15192e] dark:shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
            <span>Activity</span>
            <span className="text-cyan-600 dark:text-cyan-300">View all</span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              "Deposit completed",
              "Wallet connected",
              "New device login",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200/80 bg-slate-100 px-4 py-3 text-sm text-slate-600 dark:border-white/5 dark:bg-[#121526] dark:text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-white p-6 text-center shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#15192e] dark:shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Backup Your Wallet
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Keep your keys safe and secure with encrypted backups.
          </p>
          <button className="mt-5 rounded-full bg-linear-to-r from-cyan-400 to-violet-500 px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_0_18px_rgba(34,211,238,0.35)]">
            Backup Now
          </button>
        </div>
      </section>
    </div>
  );
}
