"use client";

import { useEffect, useState } from "react";
import { supabaseUser } from "@/lib/supabaseClient";

type Scope = "public" | "dashboard";

type LiveChartSettings = {
  id: string;
  enabled: boolean | null;
  url: string | null;
  scope: "all" | "public" | "dashboard" | null;
  width: number | null;
  height: number | null;
  updated_at?: string | null;
};

export default function LiveChartWidget({ scope, variant = "float" }: { scope: Scope; variant?: "float" | "inline" }) {
  const [settings, setSettings] = useState<LiveChartSettings | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const { data, error } = await supabaseUser
        .from("live_chart_settings")
        .select("id, enabled, url, scope, width, height, updated_at")
        .in("scope", ["all", scope])
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!isMounted) return;
      if (!error) setSettings(data as LiveChartSettings | null);
    };

    load();
    const interval = window.setInterval(load, 60000);
    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [scope]);

  const enabled = settings?.enabled ?? false;
  const url = settings?.url ?? "";
  const width = settings?.width ?? 360;
  const height = settings?.height ?? 240;

  if (!enabled || !url) return null;

  const containerClass =
    variant === "inline"
      ? "w-full overflow-hidden rounded-xl border border-white/10 bg-black/30 shadow-[0_12px_30px_rgba(4,10,22,0.45)]"
      : "fixed bottom-4 right-4 z-50 overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-[0_18px_40px_rgba(4,10,22,0.6)] backdrop-blur";

  const containerStyle =
    variant === "inline" ? { height } : { width, height };

  return (
    <div className={containerClass} style={containerStyle} aria-label="Live chart">
      <iframe
        src={url}
        title="Live Chart"
        width={variant === "inline" ? "100%" : width}
        height={height}
        style={{ border: 0 }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
