"use client";

import { useEffect, useState } from "react";
import { supabaseUser } from "@/lib/supabaseClient";

const scopes = [
  { label: "All", value: "all" },
  { label: "Public", value: "public" },
  { label: "Dashboard", value: "dashboard" },
] as const;

type LiveChartSettings = {
  id?: string;
  enabled: boolean | null;
  url: string | null;
  scope: "all" | "public" | "dashboard" | null;
  width: number | null;
  height: number | null;
};

export default function AdminLiveChartPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string>("");

  const [enabled, setEnabled] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [scope, setScope] = useState<"all" | "public" | "dashboard">("all");
  const [width, setWidth] = useState<number>(360);
  const [height, setHeight] = useState<number>(240);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setStatus("");
      const { data } = await supabaseUser
        .from("live_chart_settings")
        .select("id, enabled, url, scope, width, height, updated_at")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setEnabled(!!data.enabled);
        setUrl(data.url ?? "");
        setScope((data.scope as any) ?? "all");
        setWidth((data.width as any) ?? 360);
        setHeight((data.height as any) ?? 240);
      }
      setLoading(false);
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    setStatus("");
    const payload: LiveChartSettings = {
      enabled,
      url,
      scope,
      width,
      height,
    };

    const { error } = await supabaseUser.from("live_chart_settings").insert(payload);
    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Saved. It may take up to 60s to reflect everywhere.");
    }
    setSaving(false);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Live Chart Settings</h1>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-white p-4 dark:border-white/10 dark:bg-[#0f1118]">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            <span>Enabled</span>
          </label>

          <div className="space-y-1">
            <div className="text-xs text-slate-500">Iframe URL</div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/embed"
              className="w-full rounded-lg border border-slate-200/70 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#14172b]"
            />
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-500">Scope</div>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200/70 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#14172b]"
            >
              {scopes.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-slate-500">Width</div>
              <input
                type="number"
                min={200}
                max={800}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200/70 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#14172b]"
              />
            </div>
            <div className="space-y-1">
              <div className="text-xs text-slate-500">Height</div>
              <input
                type="number"
                min={120}
                max={600}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200/70 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-[#14172b]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-300 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            {status ? <div className="text-sm text-slate-500">{status}</div> : null}
          </div>
        </div>
      )}

      <div className="text-xs text-slate-500">
        Position is fixed to bottom-right on both public and dashboard layouts.
      </div>
    </div>
  );
}
