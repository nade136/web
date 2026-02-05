"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { supabaseUser } from "@/lib/supabaseClient";

type DepositToken = {
  id: string;
  name: string;
  symbol: string;
  price: string;
  networks: string[];
  addresses?: Record<string, string>;
};

export default function DepositPage() {
  const router = useRouter();
  const [tokens, setTokens] = useState<DepositToken[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [showTokenList, setShowTokenList] = useState(true);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  const selectedToken = useMemo(
    () => tokens.find((token) => token.symbol === selectedSymbol),
    [selectedSymbol, tokens]
  );
  const availableNetworks = selectedToken?.networks ?? [];

  const visibleTokens = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tokens;
    return tokens.filter((t) =>
      t.name.toLowerCase().includes(q) || t.symbol.toLowerCase().includes(q)
    );
  }, [tokens, query]);

  useEffect(() => {
    setVisibleCount(10);
  }, [tokens, query]);

  useEffect(() => {
    const loadTokens = async () => {
      const { data } = await supabaseUser
        .from("deposit_tokens")
        .select("id,name,symbol,price,networks,addresses")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

      const mapped = (data ?? []).map((item) => ({
        ...item,
        symbol: item.symbol.toUpperCase(),
        networks: item.networks ?? [],
        addresses: item.addresses ?? {},
      }));

      setTokens(mapped);
      setIsLoadingTokens(false);
    };

    loadTokens();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-cyan-600 dark:text-cyan-300">
          Deposit Crypto
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Select a token, choose a network, and copy the deposit address or scan
          the QR code.
        </p>
      </div>

      <Card className="rounded-3xl border-slate-200/70 bg-white text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#1a0f2b] dark:text-white dark:shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-4">
            <Badge
              role="button"
              tabIndex={0}
              onClick={() => {
                if (window.history.length > 1) {
                  router.back();
                } else {
                  router.push("/dashboard/wallet");
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  if (window.history.length > 1) {
                    router.back();
                  } else {
                    router.push("/dashboard/wallet");
                  }
                }
              }}
              className="cursor-pointer bg-slate-200 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/5"
            >
              Back
            </Badge>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tokens (name or symbol)..."
              className="flex-1 rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300/40 dark:border-white/10 dark:bg-[#0f1118] dark:text-slate-200"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="max-h-[420px] space-y-3 overflow-y-auto pr-2">
              {showTokenList ? (
                isLoadingTokens
                  ? null
                  : (
                    <>
                      {visibleTokens
                        .slice(0, Math.min(visibleCount, 15))
                        .map((token) => (
                          <button
                            type="button"
                            key={token.id}
                            onClick={() => {
                              setSelectedSymbol(token.symbol);
                              setShowTokenList(false);
                            }}
                            className="flex w-full items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition hover:border-cyan-300/50 dark:border-white/5 dark:bg-[#14172b] dark:text-slate-200 dark:hover:border-cyan-400/30"
                          >
                            <div>
                              <div className="font-semibold">{token.name}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {token.symbol}
                              </div>
                            </div>
                            <div className="text-sm">{token.price}</div>
                          </button>
                        ))}
                      {visibleTokens.length > Math.min(visibleCount, 15) ? (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => setVisibleCount((c) => Math.min(c + 5, 15))}
                            className="w-full rounded-full border border-slate-200/70 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-cyan-300/60 dark:border-white/10 dark:bg-[#0f1118] dark:text-slate-300 dark:hover:border-cyan-400/40"
                          >
                            Show 5 more (max 15)
                          </button>
                        </div>
                      ) : null}
                    </>
                  )
              ) : selectedToken ? (
                <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4 text-slate-700 dark:border-white/10 dark:bg-[#14172b] dark:text-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-700 dark:text-cyan-200">
                        {selectedToken.symbol[0]}
                      </span>
                      <div>
                        <div className="text-sm font-semibold">
                          {selectedToken.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {selectedToken.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      {selectedToken.price}
                    </div>
                  </div>

                  <div className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Networks
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {availableNetworks.length ? (
                      availableNetworks.map((network) => (
                        <span
                          key={network}
                          className="rounded-full border border-slate-200/70 bg-white px-3 py-1 text-[11px] text-slate-600 dark:border-white/10 dark:bg-[#0f1118] dark:text-slate-300"
                        >
                          {network}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        No networks available yet.
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowTokenList(true)}
                    className="mt-4 w-full rounded-full border border-slate-200/70 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-cyan-300/60 dark:border-white/10 dark:bg-[#0f1118] dark:text-slate-300 dark:hover:border-cyan-400/40"
                  >
                    Change token
                  </button>
                </div>
              ) : null}
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-[#14172b] dark:text-slate-300">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Available Networks
              </div>
              <div className="mt-3 space-y-3">
                {selectedToken ? (
                  availableNetworks.length ? (
                  availableNetworks.map((network) => (
                      <Link
                        key={network}
                        href={`/dashboard/wallet/deposit/${selectedSymbol.toLowerCase()}/${network}`}
                        className="flex w-full items-center justify-between rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-left text-xs text-slate-600 transition hover:border-cyan-300/60 dark:border-white/10 dark:bg-[#0f1118] dark:text-slate-300 dark:hover:border-cyan-400/40"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-800 dark:text-white">
                            {network}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Click to view deposit address
                          </div>
                        </div>
                        <span className="text-slate-400">›</span>
                      </Link>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200/70 bg-white/70 px-4 py-6 text-center text-xs text-slate-500 dark:border-white/10 dark:bg-[#0f1118] dark:text-slate-400">
                      No networks available yet.
                    </div>
                  )
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200/70 bg-white/70 px-4 py-6 text-center text-xs text-slate-500 dark:border-white/10 dark:bg-[#0f1118] dark:text-slate-400">
                    Select a token to see available networks.
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
