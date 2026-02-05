"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-white/5 bg-[#0b0b12]">
      <div className="mx-auto w-full max-w-7xl px-6 pb-10 pt-12">
        <div className="grid gap-10 lg:grid-cols-4">
          <div>
            <div className="text-xl font-semibold text-cyan-300">Web3Vault</div>
            <p className="mt-4 max-w-xs text-base text-slate-400">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <div className="text-base font-semibold text-white">{t("footer.product")}</div>
            <ul className="mt-4 space-y-3 text-base text-slate-400">
              <li><Link href="/">{t("footer.features")}</Link></li>
              <li><Link href="/">{t("footer.security")}</Link></li>
              <li><Link href="/">{t("footer.pricing")}</Link></li>
              <li><Link href="/">{t("footer.api")}</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-base font-semibold text-white">{t("footer.company")}</div>
            <ul className="mt-4 space-y-3 text-base text-slate-400">
              <li><Link href="/">{t("footer.about")}</Link></li>
              <li><Link href="/">{t("footer.blog")}</Link></li>
              <li><Link href="/">{t("footer.careers")}</Link></li>
              <li><Link href="/">{t("footer.contact")}</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-base font-semibold text-white">{t("footer.legal")}</div>
            <ul className="mt-4 space-y-3 text-base text-slate-400">
              <li><Link href="/">{t("footer.faq")}</Link></li>
              <li><Link href="/">{t("footer.terms")}</Link></li>
              <li><Link href="/">{t("footer.privacy")}</Link></li>
              <li><Link href="/">{t("footer.licenses")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-sm text-slate-500">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
