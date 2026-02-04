"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabaseUser } from "@/lib/supabaseClient";

type DepositToken = {
  name: string;
  symbol: string;
  price: string;
  networks: string[];
  addresses?: Record<string, string>;
};

export default function NetworkDepositPage() {
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState<
    "idle" | "pending" | "approved" | "rejected"
  >("idle");
  const [confirmMessage, setConfirmMessage] = useState("");
  const params = useParams();
  const symbolParam = Array.isArray(params.symbol)
    ? params.symbol[0]
    : params.symbol;
  const networkParam = Array.isArray(params.network)
    ? params.network[0]
    : params.network;

  const symbol = (symbolParam ?? "").toUpperCase();
  const network = (networkParam ?? "").toLowerCase();

  const [token, setToken] = useState<DepositToken | null>(null);
  const [networks, setNetworks] = useState<string[]>([]);

  useEffect(() => {
    const loadToken = async () => {
      if (!symbol) return;
      const { data } = await supabaseUser
        .from("deposit_tokens")
        .select("name,symbol,price,networks,addresses")
        .eq("symbol", symbol)
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();

      if (!data) {
        setToken(null);
        setNetworks([]);
        return;
      }

      setToken({
        name: data.name,
        symbol: data.symbol,
        price: data.price,
        networks: data.networks ?? [],
        addresses: data.addresses ?? {},
      });
      setNetworks(data.networks ?? []);
    };

    loadToken();
  }, [symbol]);

  useEffect(() => {
    const loadConfirmation = async () => {
      const { data: authData } = await supabaseUser.auth.getUser();
      const userId = authData.user?.id;
      if (!userId || !symbol || !network) return;

      const { data } = await supabaseUser
        .from("deposit_confirmations")
        .select("status")
        .eq("user_id", userId)
        .eq("token_symbol", symbol)
        .eq("network", network)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data?.status === "approved") {
        setConfirmStatus("approved");
      } else if (data?.status === "rejected") {
        setConfirmStatus("rejected");
      } else if (data?.status === "pending") {
        setConfirmStatus("pending");
      }
    };

    loadConfirmation();
  }, [symbol, network]);

  const isValidNetwork = networks.includes(network);
  const address =
    token?.addresses?.[network] ??
    token?.addresses?.[network.toLowerCase()] ??
    "";

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
                  router.push("/dashboard/wallet/deposit");
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  if (window.history.length > 1) {
                    router.back();
                  } else {
                    router.push("/dashboard/wallet/deposit");
                  }
                }
              }}
              className="cursor-pointer bg-slate-200 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/5"
            >
              Back
            </Badge>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {token ? `${token.name} (${token.symbol})` : "Unknown token"}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-[#14172b] dark:text-slate-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Network
                </div>
                <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                  {network}
                </div>
              </div>
              {token ? (
                <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                  {token.price}
                </div>
              ) : null}
            </div>

            {!token || !isValidNetwork ? (
              <div className="mt-6 rounded-2xl border border-rose-200/60 bg-rose-50 px-4 py-4 text-center text-xs text-rose-500 dark:border-rose-500/30 dark:bg-rose-500/10">
                This network is not available for the selected token.
              </div>
            ) : address ? (
              <div className="mt-6 space-y-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Deposit Address
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-xs text-slate-700 dark:border-white/10 dark:bg-[#0f1118] dark:text-slate-200">
                  {address}
                </div>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(address)}
                  className="w-full rounded-full border border-slate-200/70 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-cyan-300/60 dark:border-white/10 dark:bg-[#15172e] dark:text-slate-200 dark:hover:border-cyan-400/40"
                >
                  Copy address
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setConfirmMessage("");
                    const { data: authData } =
                      await supabaseUser.auth.getUser();
                    const userId = authData.user?.id;
                    const userEmail = authData.user?.email ?? "";

                    if (!userId || !token) {
                      setConfirmMessage("Please sign in again.");
                      return;
                    }

                    const { error } = await supabaseUser
                      .from("deposit_confirmations")
                      .insert({
                        user_id: userId,
                        user_email: userEmail || null,
                        token_symbol: token.symbol,
                        network,
                        address,
                        status: "pending",
                      });

                    if (error) {
                      setConfirmMessage(error.message);
                      return;
                    }

                    await supabaseUser.from("notifications").insert({
                      user_id: userId,
                      user_email: userEmail || null,
                      type: "deposit",
                      title: "Deposit confirmation sent",
                      message: `We received your ${token.symbol} deposit confirmation on ${network}. Awaiting database review.`,
                      metadata: {
                        token: token.symbol,
                        network,
                        address,
                      },
                    });

                    setIsConfirmed(true);
                    setConfirmStatus("pending");
                  }}
                  className="w-full rounded-full bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-cyan-300"
                >
                  Confirm transfer
                </button>
                {isConfirmed ? (
                  <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50 px-4 py-3 text-center text-xs text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                    Transfer confirmed. Waiting for database confirmation.
                  </div>
                ) : null}
                {confirmMessage ? (
                  <div className="rounded-2xl border border-rose-200/70 bg-rose-50 px-4 py-3 text-center text-xs text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
                    {confirmMessage}
                  </div>
                ) : null}
                {confirmStatus !== "idle" ? (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-center text-xs ${
                      confirmStatus === "approved"
                        ? "border-emerald-200/70 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                        : confirmStatus === "rejected"
                          ? "border-rose-200/70 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
                          : "border-amber-200/70 bg-amber-50 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                    }`}
                  >
                    Database status:{" "}
                    {confirmStatus === "approved"
                      ? "Accepted"
                      : confirmStatus === "rejected"
                        ? "Declined"
                        : "Pending"}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-rose-200/60 bg-rose-50 px-4 py-4 text-center text-xs text-rose-500 dark:border-rose-500/30 dark:bg-rose-500/10">
                No wallet address configured for this network.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
