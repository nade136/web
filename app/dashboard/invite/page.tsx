"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardInvitePage() {
  const referralLink = "https://web3vault.app/ref/your-code";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Invite Friends
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Share your referral link to earn rewards.
        </p>
      </div>

      <Card className="rounded-3xl border-slate-200/70 bg-white text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#1a0f2b] dark:text-white dark:shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-[#0f1118] dark:text-slate-300">
            {referralLink}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={handleCopy}
              className="rounded-full bg-cyan-400 text-slate-900 hover:bg-cyan-300"
            >
              {copied ? "Copied!" : "Copy Link"}
            </Button>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Share this link with friends to invite them.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
