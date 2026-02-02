import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const bulletItems = [
  "Secure AES-256 encryption",
  "100% private — no third-party data sharing",
  "Instant AI-powered verification",
];

export default function KycPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl">
        <Card className="rounded-3xl border-slate-200/70 bg-white text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[#14172b] dark:text-white">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-white">
              Identity Verification (KYC)
            </CardTitle>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              To ensure the safety of your assets and comply with Web3
              regulations, please verify your identity. All data is securely
              encrypted and never shared.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {bulletItems.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-600 dark:text-cyan-300">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard/kyc/form"
              className="mt-6 block w-full rounded-full bg-linear-to-r from-cyan-400 to-violet-500 px-6 py-3 text-center text-sm font-semibold text-slate-900 shadow-[0_10px_24px_rgba(34,211,238,0.35)]"
            >
              Start Verification
            </Link>
          </CardContent>
        </Card>
        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Your identity data is processed securely within the Web3Vault network.
        </p>
      </div>
    </div>
  );
}
