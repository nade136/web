"use client";
import Image from "next/image";

import Navbar from "../components/Navbar";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function SecurePage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-[#0b0b12] text-white">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            <span className="block">{t("secure.hero.title.line1")}</span>
            <span className="block">
              <span className="text-[#2dd4f8]">{t("secure.hero.title.line2.part1")}</span>{" "}
              <span className="bg-linear-to-r from-[#f4b9df] to-[#de6dae] bg-clip-text text-transparent">
                {t("secure.hero.title.line2.highlight")}
              </span>{" "}
              <span className="text-[#f472b6]">{t("secure.hero.title.line2.part2")}</span>
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold text-slate-400 sm:text-lg">
            {t("secure.hero.subtitle")}
          </p>
          <a
            href="/connect-wallet"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-linear-to-r from-cyan-400 to-blue-500 px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
          >
            {t("secure.hero.cta")}
          </a>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="transition duration-300 ease-out hover:-translate-y-1">
            <Image
              src="/images/secure-wallet.png"
              alt="Secure wallet illustration"
              width={640}
              height={420}
              className="h-auto w-[480px] sm:w-[560px]"
              priority
            />
          </div>
        </div>
      </main>

      <section className="bg-[#0f1122] py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {t("secure.why.title")}
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl bg-[#15192e] p-6 text-center shadow-[0_12px_30px_rgba(6,10,22,0.45)] ring-1 ring-white/5 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(6,10,22,0.6)]">
              <div className="text-sm font-semibold text-cyan-300">
                {t("secure.why.card1.title")}
              </div>
              <p className="mt-3 text-sm text-slate-400">
                {t("secure.why.card1.desc")}
              </p>
            </article>

            <article className="rounded-2xl bg-[#15192e] p-6 text-center shadow-[0_12px_30px_rgba(6,10,22,0.45)] ring-1 ring-white/5 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(6,10,22,0.6)]">
              <div className="text-sm font-semibold text-cyan-300">
                {t("secure.why.card2.title")}
              </div>
              <p className="mt-3 text-sm text-slate-400">
                {t("secure.why.card2.desc")}
              </p>
            </article>

            <article className="rounded-2xl bg-[#15192e] p-6 text-center shadow-[0_12px_30px_rgba(6,10,22,0.45)] ring-1 ring-white/5 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(6,10,22,0.6)]">
              <div className="text-sm font-semibold text-cyan-300">
                {t("secure.why.card3.title")}
              </div>
              <p className="mt-3 text-sm text-slate-400">
                {t("secure.why.card3.desc")}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {t("secure.how.title")}
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl bg-[#15192e] p-6 text-center shadow-[0_12px_30px_rgba(6,10,22,0.45)] ring-1 ring-white/5 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(6,10,22,0.6)]">
              <div className="text-2xl font-bold text-[#f472b6]">1</div>
              <div className="mt-4 text-sm font-semibold text-cyan-300">
                {t("secure.how.step1.title")}
              </div>
              <p className="mt-3 text-sm text-slate-400">
                {t("secure.how.step1.desc")}
              </p>
            </article>

            <article className="rounded-2xl bg-[#15192e] p-6 text-center shadow-[0_12px_30px_rgba(6,10,22,0.45)] ring-1 ring-white/5 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(6,10,22,0.6)]">
              <div className="text-2xl font-bold text-[#f472b6]">2</div>
              <div className="mt-4 text-sm font-semibold text-cyan-300">
                {t("secure.how.step2.title")}
              </div>
              <p className="mt-3 text-sm text-slate-400">
                {t("secure.how.step2.desc")}
              </p>
            </article>

            <article className="rounded-2xl bg-[#15192e] p-6 text-center shadow-[0_12px_30px_rgba(6,10,22,0.45)] ring-1 ring-white/5 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(6,10,22,0.6)]">
              <div className="text-2xl font-bold text-[#f472b6]">3</div>
              <div className="mt-4 text-sm font-semibold text-cyan-300">
                {t("secure.how.step3.title")}
              </div>
              <p className="mt-3 text-sm text-slate-400">
                {t("secure.how.step3.desc")}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[#0f1122] py-16">
        <div className="mx-auto w-full max-w-5xl px-6 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {t("secure.cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 sm:text-base">
            {t("secure.cta.desc")}
          </p>
          <a
            href="/connect-wallet"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-linear-to-r from-pink-400 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_0_18px_rgba(56,189,248,0.35)]"
          >
            {t("secure.cta.button")}
          </a>
        </div>
      </section>
    </div>
  );
}
