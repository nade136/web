"use client";

import { useEffect, useState } from "react";

import { supabaseAdmin } from "@/lib/supabaseClient";

type KycRequest = {
  id: string;
  user_id: string;
  user_email: string | null;
  status: string;
  rejection_reason?: string | null;
  payload: Record<string, string> | string;
  documents: Record<string, string> | string;
  created_at: string;
  verified_at: string | null;
};

export default function AdminKycRequestsPage() {
  const [requests, setRequests] = useState<KycRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      const { data, error: loadError } = await supabaseAdmin
        .from("kyc_requests")
        .select(
          "id,user_id,user_email,status,created_at,verified_at,payload,documents,rejection_reason"
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
    status: "pending" | "verified" | "rejected",
    rejectionReason?: string | null
  ) => {
    setError("");
    setUpdatingId(requestId);
    const { error: updateError } = await supabaseAdmin
      .from("kyc_requests")
      .update({
        status,
        verified_at: status === "verified" ? new Date().toISOString() : null,
        rejection_reason: status === "rejected" ? rejectionReason ?? "" : null,
      })
      .eq("id", requestId);

    if (updateError) {
      setError(updateError.message);
      setUpdatingId(null);
      return;
    }

    setRequests((prev) =>
      prev.map((item) =>
        item.id === requestId
          ? {
              ...item,
              status,
              verified_at:
                status === "verified" ? new Date().toISOString() : null,
              rejection_reason: status === "rejected" ? rejectionReason ?? "" : null,
            }
          : item
      )
    );
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-[#15192e] p-6 text-white shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <h2 className="text-lg font-semibold">KYC Requests</h2>
        <p className="mt-2 text-sm text-slate-400">
          Review submitted KYC details and verify users.
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
                country?: string;
                firstName?: string;
                lastName?: string;
                dateOfBirth?: string;
                idType?: string;
                idNumber?: string;
              } | null = null;
              let parsedDocs: {
                id_front?: string;
                id_back?: string;
                selfie?: string;
              } | null = null;

              try {
                parsedPayload =
                  typeof request.payload === "string"
                    ? JSON.parse(request.payload)
                    : request.payload;
              } catch {
                parsedPayload = null;
              }

              try {
                parsedDocs =
                  typeof request.documents === "string"
                    ? JSON.parse(request.documents)
                    : request.documents;
              } catch {
                parsedDocs = null;
              }

              return (
                <div key={request.id} className="p-6 text-sm">
                  <div className="grid gap-2 sm:grid-cols-6">
                    <div>
                      <div className="text-xs text-slate-500">User</div>
                      <div className="font-semibold">{request.user_email ?? "Unknown"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Status</div>
                      <div className="capitalize">{request.status}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Created</div>
                      <div>{new Date(request.created_at).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Verified</div>
                      <div>
                        {request.verified_at
                          ? new Date(request.verified_at).toLocaleString()
                          : "Not yet"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-[#15192e] p-4 text-xs text-slate-200">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      KYC Details
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <div>
                        <span className="text-slate-400">Name:</span>{" "}
                        {parsedPayload
                          ? `${parsedPayload.firstName ?? ""} ${parsedPayload.lastName ?? ""}`.trim()
                          : "N/A"}
                      </div>
                      <div>
                        <span className="text-slate-400">Country:</span>{" "}
                        {parsedPayload?.country ?? "N/A"}
                      </div>
                      <div>
                        <span className="text-slate-400">DOB:</span>{" "}
                        {parsedPayload?.dateOfBirth ?? "N/A"}
                      </div>
                      <div>
                        <span className="text-slate-400">ID:</span>{" "}
                        {parsedPayload?.idType ?? "N/A"}{" "}
                        {parsedPayload?.idNumber ?? ""}
                      </div>
                      {request.rejection_reason ? (
                        <div className="sm:col-span-2 text-rose-300">
                          <span className="text-slate-400">Rejection:</span>{" "}
                          {request.rejection_reason}
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {parsedDocs?.id_front ? (
                        <a
                          href={parsedDocs.id_front}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-cyan-400/30 px-3 py-1 text-xs text-cyan-200 hover:bg-cyan-400/10"
                        >
                          Front ID
                        </a>
                      ) : null}
                      {parsedDocs?.id_back ? (
                        <a
                          href={parsedDocs.id_back}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-cyan-400/30 px-3 py-1 text-xs text-cyan-200 hover:bg-cyan-400/10"
                        >
                          Back ID
                        </a>
                      ) : null}
                      {parsedDocs?.selfie ? (
                        <a
                          href={parsedDocs.selfie}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-cyan-400/30 px-3 py-1 text-xs text-cyan-200 hover:bg-cyan-400/10"
                        >
                          Selfie
                        </a>
                      ) : null}
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
                      onClick={() => handleStatus(request.id, "verified")}
                      disabled={updatingId === request.id}
                      className="rounded-full border border-emerald-400/30 px-4 py-1 text-xs text-emerald-300 hover:bg-emerald-400/10 disabled:opacity-70"
                    >
                      Verify
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const reason =
                          window.prompt("Reason for rejection (optional):") ??
                          "";
                        handleStatus(request.id, "rejected", reason);
                      }}
                      disabled={updatingId === request.id}
                      className="rounded-full border border-rose-400/30 px-4 py-1 text-xs text-rose-300 hover:bg-rose-400/10 disabled:opacity-70"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-sm text-slate-400">No KYC requests yet.</div>
        )}
      </div>
    </div>
  );
}
