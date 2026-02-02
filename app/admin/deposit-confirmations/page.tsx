"use client";

import { useEffect, useState } from "react";

import { supabaseAdmin } from "@/lib/supabaseClient";

type DepositConfirmation = {
  id: string;
  user_id: string;
  user_email: string | null;
  token_symbol: string;
  network: string;
  address: string;
  status: string;
  created_at: string;
};

export default function AdminDepositConfirmationsPage() {
  const [requests, setRequests] = useState<DepositConfirmation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      const { data, error: loadError } = await supabaseAdmin
        .from("deposit_confirmations")
        .select(
          "id,user_id,user_email,token_symbol,network,address,status,created_at"
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

  const handleStatus = async (
    requestId: string,
    status: "pending" | "approved" | "rejected"
  ) => {
    setError("");
    setUpdatingId(requestId);
    const targetRequest = requests.find((item) => item.id === requestId);
    const { error: updateError } = await supabaseAdmin
      .from("deposit_confirmations")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (updateError) {
      setError(updateError.message);
      setUpdatingId(null);
      return;
    }

    setRequests((prev) =>
      prev.map((item) =>
        item.id === requestId ? { ...item, status } : item
      )
    );

    if (targetRequest) {
      await supabaseAdmin.from("notifications").insert({
        user_id: targetRequest.user_id,
        user_email: targetRequest.user_email,
        type: "deposit",
        title: "Deposit status updated",
        message: `Your ${targetRequest.token_symbol} deposit on ${targetRequest.network} was marked as ${status}.`,
        metadata: {
          token: targetRequest.token_symbol,
          network: targetRequest.network,
          address: targetRequest.address,
          status,
        },
      });
    }
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-[#15192e] p-6 text-white shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <h2 className="text-lg font-semibold">Deposit Confirmations</h2>
        <p className="mt-2 text-sm text-slate-400">
          Review user deposit confirmations and approve or decline.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f1118] text-slate-200 shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        {isLoading ? (
          <div className="p-6 text-sm text-slate-400">Loading...</div>
        ) : error ? (
          <div className="p-6 text-sm text-rose-400">{error}</div>
        ) : requests.length ? (
          <div className="divide-y divide-white/10">
            {requests.map((request) => (
              <div key={request.id} className="p-6 text-sm">
                <div className="grid gap-2 sm:grid-cols-6">
                  <div>
                    <div className="text-xs text-slate-500">User</div>
                    <div className="font-semibold">
                      {request.user_email ?? "Unknown"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Token</div>
                    <div>{request.token_symbol}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Network</div>
                    <div>{request.network}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Address</div>
                    <div className="break-all">{request.address}</div>
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

                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatus(request.id, "pending")}
                    disabled={updatingId === request.id}
                    className="rounded-full border border-slate-500/30 px-4 py-1 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-70"
                  >
                    Mark Pending
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatus(request.id, "approved")}
                    disabled={updatingId === request.id}
                    className="rounded-full border border-emerald-400/30 px-4 py-1 text-xs text-emerald-300 hover:bg-emerald-400/10 disabled:opacity-70"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatus(request.id, "rejected")}
                    disabled={updatingId === request.id}
                    className="rounded-full border border-rose-400/30 px-4 py-1 text-xs text-rose-300 hover:bg-rose-400/10 disabled:opacity-70"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-sm text-slate-400">
            No deposit confirmations yet.
          </div>
        )}
      </div>
    </div>
  );
}
