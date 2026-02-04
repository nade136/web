"use client";

import Image from "next/image";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useI18n } from "@/lib/i18n/I18nProvider";

const coreValues = [
  {
    title: "Security First",
    description:
      "We prioritize user safety with enterprise-grade encryption and zero-knowledge design.",
  },
  {
    title: "Transparency",
    description:
      "Our operations and architecture are open, auditable, and community-driven.",
  },
  {
    title: "Innovation",
    description:
      "We continuously build smarter, faster, and safer ways to interact with Web3.",
  },
  {
    title: "Simplicity",
    description:
      "Managing wallets and backups should be effortless — and we make it so.",
  },
  {
    title: "Trust",
    description:
      "We earn it through reliability, integrity, and user-centered design.",
  },
  {
    title: "Decentralization",
    description:
      "Empowering individuals by removing unnecessary intermediaries.",
  },
];

export default function AboutPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-[#0b0b12] text-white">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-14">
        <section className="text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            {t("about.title")} {" "}
            <span className="bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Web3Vault
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 sm:text-base">
            {t("about.tagline")}
          </p>
        </section>

        <section className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              {t("about.mission.title")}
            </h2>
            <p className="mt-4 text-sm text-slate-400 sm:text-base">
              {t("about.mission.body")}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#101018] p-6 shadow-[0_20px_50px_rgba(8,10,20,0.45)]">
            <Image
              src="/images/secure-wallet.png"
              alt="Secure wallet illustration"
              width={960}
              height={640}
              className="h-auto w-full rounded-2xl object-cover"
              priority
            />
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-center text-2xl font-semibold text-white sm:text-3xl">
            {t("about.values.title")}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-white/10 bg-[#101018] px-6 py-5 shadow-[0_16px_40px_rgba(8,10,20,0.35)]"
              >
                <h3 className="text-lg font-semibold text-white">
                  {t(value.title === "Security First" ? "about.values.securityFirst.title" :
                     value.title === "Transparency" ? "about.values.transparency.title" :
                     value.title === "Innovation" ? "about.values.innovation.title" :
                     value.title === "Simplicity" ? "about.values.simplicity.title" :
                     value.title === "Trust" ? "about.values.trust.title" :
                     "about.values.decentralization.title")}
                </h3>
                <p className="mt-3 text-sm text-slate-400">
                  {t(value.title === "Security First" ? "about.values.securityFirst.desc" :
                     value.title === "Transparency" ? "about.values.transparency.desc" :
                     value.title === "Innovation" ? "about.values.innovation.desc" :
                     value.title === "Simplicity" ? "about.values.simplicity.desc" :
                     value.title === "Trust" ? "about.values.trust.desc" :
                     "about.values.decentralization.desc")}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
