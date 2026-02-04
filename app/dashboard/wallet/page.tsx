 "use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { supabaseUser } from "@/lib/supabaseClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const quickActions = [
  { label: "Deposit", icon: "⬇", href: "/dashboard/wallet/deposit" },
  { label: "Withdraw", icon: "⬆", href: "/dashboard/wallet/deposit" },
  { label: "Buy Crypto", icon: "💳", href: "/dashboard/wallet/deposit" },
  { label: "Convert", icon: "⇄", href: "/dashboard/wallet/deposit" },
  { label: "Backup Wallet", icon: "🛡", href: "/dashboard/backup-wallet" },
  { label: "More", icon: "⋯" },
];

const marketTabs = ["Favorites", "Hot", "New", "Gainers", "Losers", "Turnover"];

const marketData: Record<string, { pair: string; last: string; change: string }[]> = {
  Favorites: [
    { pair: "BTC/USDT", last: "Last: 346.00", change: "+0.74%" },
    { pair: "ETH/USDT", last: "Last: 262.00", change: "+2.43%" },
    { pair: "SOL/USDT", last: "Last: 357.00", change: "+2.51%" },
    { pair: "BNB/USDT", last: "Last: 470.00", change: "+0.57%" },
  ],
  Hot: [
    { pair: "BNB/USDT", last: "Last: 141.00", change: "+4.13%" },
    { pair: "PEPE/USDT", last: "Last: 251.00", change: "+1.54%" },
  ],
  New: [{ pair: "NEWCOIN/USDT", last: "Last: 231.00", change: "+0.51%" }],
  Gainers: [{ pair: "SOL/USDT", last: "Last: 444.00", change: "+2.44%" }],
  Losers: [{ pair: "DOGE/USDT", last: "Last: 443.00", change: "-3.10%" }],
  Turnover: [{ pair: "BTC/USDT", last: "Last: 409.00", change: "+0.42%" }],
};

export default function DashboardWalletPage() {
  const [activeTab, setActiveTab] = useState("Favorites");
  const activeMarkets = marketData[activeTab] ?? [];
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [walletAmount, setWalletAmount] = useState("$0");
  const [walletSubtext, setWalletSubtext] = useState("~0.00000000 BTC");
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const { data: authData } = await supabaseUser.auth.getUser();
      const userId = authData?.user?.id;

      if (userId) {
        const { data: userBalance } = await supabaseUser
          .from("user_balances")
          .select("wallet_overview_amount,wallet_overview_subtext")
          .eq("user_id", userId)
          .maybeSingle();

        if (userBalance?.wallet_overview_amount) {
          setWalletAmount(userBalance.wallet_overview_amount);
        }
        if (userBalance?.wallet_overview_subtext) {
          setWalletSubtext(userBalance.wallet_overview_subtext);
        }
      } else {
        const { data } = await supabaseUser
          .from("dashboard_stats")
          .select("wallet_overview_amount,wallet_overview_subtext")
          .limit(1)
          .maybeSingle();

        if (data?.wallet_overview_amount) {
          setWalletAmount(data.wallet_overview_amount);
        }
        if (data?.wallet_overview_subtext) {
          setWalletSubtext(data.wallet_overview_subtext);
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
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-300">
              <CardTitle className="text-sm font-semibold">
                Wallet Overview
              </CardTitle>
              <button
                type="button"
                onClick={() => setShowBalance((v) => !v)}
                className="text-xs text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                aria-label={showBalance ? "Hide balance" : "Show balance"}
                title={showBalance ? "Hide balance" : "Show balance"}
              >
                {showBalance ? "👁️" : "🙈"}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                asChild
                className="rounded-full bg-cyan-400 text-slate-900 hover:bg-cyan-300"
              >
                <Link href="/dashboard/wallet/deposit">Deposit</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-slate-200/70 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
              >
                <Link href="/dashboard/backup-wallet">Connect Wallet</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900 dark:text-white">
              {showBalance ? walletAmount : "•••••"}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {showBalance ? walletSubtext : "••••••••••"}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 grid-cols-3 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((action) => {
            const content = (
              <CardContent className="flex flex-col items-center gap-3 py-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-cyan-600 dark:bg-[#161a2f] dark:text-cyan-300">
                  {action.icon}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {action.label}
                </span>
              </CardContent>
            );

            const isMore = action.label === "More";

            return (
              <Card
                key={action.label}
                className="rounded-2xl border-slate-200/70 bg-white text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#0f1118] dark:text-white dark:shadow-[0_12px_30px_rgba(4,10,22,0.45)]"
              >
                {action.href ? (
                  <Link href={action.href} className="block">
                    {content}
                  </Link>
                ) : isMore ? (
                  <button
                    type="button"
                    onClick={() => setIsMoreOpen(true)}
                    className="w-full text-left"
                  >
                    {content}
                  </button>
                ) : (
                  content
                )}
              </Card>
            );
          })}
        </div>

        <Card className="rounded-3xl border-slate-200/70 bg-white text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#1a0f2b] dark:text-white dark:shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">
              Assets
            </CardTitle>
            <div className="text-right">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Total Assets
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                $0.00
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span>Token</span>
              <span>Balance</span>
              <span>Price (USD)</span>
              <span>Value (USD)</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          {marketTabs.map((tab) => (
            <button
              key={tab}
              className={`border-b pb-1 transition ${
                activeTab === tab
                  ? "border-cyan-600 text-cyan-600 dark:border-cyan-300 dark:text-cyan-300"
                  : "border-transparent hover:text-cyan-600 dark:hover:text-cyan-200"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {activeMarkets.map((item) => (
            <Card
              key={item.pair}
              className="rounded-2xl border-slate-200/70 bg-white text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#0f1118] dark:text-white dark:shadow-[0_12px_30px_rgba(4,10,22,0.45)]"
            >
              <CardContent className="space-y-2 py-4">
                <div className="text-sm font-semibold">{item.pair}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {item.last}
                </div>
                <div
                  className={`text-xs font-semibold ${
                    item.change.startsWith("-")
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }`}
                >
                  {item.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {[
          { title: "Copy top traders instantly", subtitle: "2/4" },
          { title: "Stake SXT & Earn", subtitle: "2/4", note: "APR 18%" },
        ].map((card) => (
          <Card
            key={card.title}
              className="rounded-2xl border-slate-200/70 bg-white text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#0f1118] dark:text-white dark:shadow-[0_12px_30px_rgba(4,10,22,0.45)]"
          >
            <CardContent className="flex items-center justify-between gap-4 py-4">
              <div>
                  <Badge className="mb-2 bg-cyan-400/10 text-cyan-700 hover:bg-cyan-400/10 dark:text-cyan-200">
                  {card.subtitle}
                </Badge>
                <div className="text-sm font-semibold">{card.title}</div>
                {card.note ? (
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {card.note}
                    </div>
                ) : null}
              </div>
                <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-[#1a1f3a]" />
            </CardContent>
          </Card>
        ))}
      </section>

      {isMoreOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close more actions overlay"
            onClick={() => setIsMoreOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-[#14172b]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                More Actions
              </h3>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="text-slate-400 transition hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-4 text-center text-xs text-slate-500 dark:text-slate-400">
              {[
                { label: "Invite Friends", icon: "👥", href: "/dashboard/invite" },
                {
                  label: "Rewards Hub",
                  icon: "🎁",
                  href: "/dashboard/backup-wallet",
                },
                {
                  label: "Trading Bot",
                  icon: "🤖",
                  href: "/dashboard/backup-wallet",
                },
                { label: "Earns", icon: "💸", href: "/dashboard/backup-wallet" },
                { label: "KYC", icon: "🪪", href: "/dashboard/kyc" },
                { label: "About", icon: "ℹ️", href: "/about" },
                { label: "Notification", icon: "🔔", href: "/dashboard/notifications" },
              ].map((item) =>
                item.href ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    className="rounded-2xl border border-slate-200/70 bg-slate-50 px-3 py-4 text-slate-600 transition hover:border-cyan-300/60 dark:border-white/10 dark:bg-[#0f1118] dark:text-slate-300 dark:hover:border-cyan-400/40"
                  >
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/15 text-lg text-cyan-600 dark:text-cyan-300">
                      {item.icon}
                    </div>
                    <div className="mt-2 text-[11px] font-semibold">
                      {item.label}
                    </div>
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    type="button"
                    className="rounded-2xl border border-slate-200/70 bg-slate-50 px-3 py-4 text-slate-600 transition hover:border-cyan-300/60 dark:border-white/10 dark:bg-[#0f1118] dark:text-slate-300 dark:hover:border-cyan-400/40"
                  >
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/15 text-lg text-cyan-600 dark:text-cyan-300">
                      {item.icon}
                    </div>
                    <div className="mt-2 text-[11px] font-semibold">
                      {item.label}
                    </div>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
