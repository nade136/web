"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { supabaseUser } from "@/lib/supabaseClient";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function SignInPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const { error: signInError } = await supabaseUser.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    document.cookie = "web3_user_auth=1; Path=/; Max-Age=604800; SameSite=Lax";
    router.push("/dashboard/overview");
  };

  return (
    <div className="min-h-screen bg-[#0b0b12] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#15192e] p-8 shadow-[0_20px_50px_rgba(4,10,22,0.6)]">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">{t("auth.signin.title")}</h1>
            <p className="mt-2 text-sm text-slate-400">{t("auth.signin.subtitle")}</p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSignIn}>
            <div>
              <label className="text-xs font-semibold text-slate-300">
                {t("auth.email")}
              </label>
              <input
                type="email"
                placeholder={t("auth.email.placeholder")}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1122] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">
                {t("auth.password")}
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.password.placeholder")}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0f1122] px-4 py-3 pr-14 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 transition hover:text-cyan-200"
                >
                  {showPassword ? t("auth.hide") : t("auth.show")}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-transparent text-cyan-300"
                />
                {t("auth.rememberMe")}
              </label>
              <button
                type="button"
                className="text-cyan-300 hover:text-cyan-200"
              >
                {t("auth.forgotPassword")}
              </button>
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-linear-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? t("auth.signin.loading") : t("auth.signin.cta")}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            {t("auth.signin.noAccount")} {" "}
            <Link className="text-cyan-300 hover:text-cyan-200" href="/signup">
              {t("auth.signin.createOne")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
