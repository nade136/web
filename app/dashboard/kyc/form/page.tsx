"use client";

import { useEffect, useState } from "react";

import { supabaseUser } from "@/lib/supabaseClient";

export default function KycFormPage() {
  const [country, setCountry] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [kycStatus, setKycStatus] = useState<
    "pending" | "verified" | "rejected" | "none"
  >("none");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const loadStatus = async () => {
      const { data: authData } = await supabaseUser.auth.getUser();
      const userId = authData.user?.id;
      if (!userId) return;

      const { data } = await supabaseUser
        .from("kyc_requests")
        .select("status,rejection_reason")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data?.status === "verified") {
        setKycStatus("verified");
        setRejectionReason("");
      } else if (data?.status === "rejected") {
        setKycStatus("rejected");
        setRejectionReason(data.rejection_reason ?? "");
      } else if (data?.status === "pending") {
        setKycStatus("pending");
        setRejectionReason("");
      } else {
        setKycStatus("none");
        setRejectionReason("");
      }
    };

    loadStatus();
  }, []);

  const handleSubmit = async () => {
    setMessage("");
    setIsSubmitting(true);

    const { data } = await supabaseUser.auth.getUser();
    const userId = data.user?.id;
    const userEmail = data.user?.email ?? "";

    if (!userId) {
      setMessage("Please sign in again.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("user_email", userEmail);
    formData.append("country", country);
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("date_of_birth", dateOfBirth);
    formData.append("id_type", idType);
    formData.append("id_number", idNumber);
    if (idFront) formData.append("id_front", idFront);
    if (idBack) formData.append("id_back", idBack);
    if (selfie) formData.append("selfie", selfie);

    const response = await fetch("/api/kyc/submit", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(result?.error ?? "Failed to submit verification.");
      return;
    }

    setMessage("Submitted. Your verification is pending.");
    setKycStatus("pending");
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-10">
      <div className="w-full max-w-3xl">
        <div className="rounded-3xl border border-white/10 bg-[#14172b] p-8 text-white shadow-[0_24px_60px_rgba(4,10,22,0.6)]">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">KYC Verification Form</h1>
          </div>

          {kycStatus !== "none" ? (
            <div
              className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                kycStatus === "verified"
                  ? "border-emerald-400/30 text-emerald-300"
                  : kycStatus === "rejected"
                    ? "border-rose-400/30 text-rose-300"
                    : "border-amber-400/30 text-amber-300"
              }`}
            >
              KYC Status:{" "}
              {kycStatus === "verified"
                ? "Verified"
                : kycStatus === "rejected"
                  ? "Rejected"
                  : "Pending"}
              {kycStatus === "rejected" && rejectionReason ? (
                <div className="mt-1 text-xs text-slate-300">
                  Reason: {rejectionReason}
                </div>
              ) : null}
            </div>
          ) : null}

          <section className="mt-8">
            <h2 className="text-base font-semibold text-cyan-300">
              Level 1 - Basic Info
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Country</span>
                <input
                  type="text"
                  placeholder="Enter your country"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0f1118] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">FirstName</span>
                <input
                  type="text"
                  placeholder="Enter your firstName"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0f1118] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">LastName</span>
                <input
                  type="text"
                  placeholder="Enter your lastName"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0f1118] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">Date of Birth</span>
                <input
                  type="text"
                  placeholder="dd / mm / yyyy"
                  value={dateOfBirth}
                  onChange={(event) => setDateOfBirth(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0f1118] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                />
              </label>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-base font-semibold text-cyan-300">
              Level 2 - ID Verification
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">ID Type</span>
                <select
                  className="w-full rounded-xl border border-white/10 bg-[#0f1118] px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                  value={idType}
                  onChange={(event) => setIdType(event.target.value)}
                >
                  <option value="" disabled>
                    Select ID Type
                  </option>
                  <option value="passport">Passport</option>
                  <option value="drivers-license">Driver's License</option>
                  <option value="national-id">National ID</option>
                </select>
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-slate-300">ID Number</span>
                <input
                  type="text"
                  placeholder="Enter your ID number"
                  value={idNumber}
                  onChange={(event) => setIdNumber(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0f1118] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                />
              </label>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <label className="flex min-h-[140px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-cyan-400/30 bg-[#0f1118] px-4 py-6 text-center text-xs text-slate-400">
                <span className="text-lg text-cyan-300">⬆</span>
                <span>Upload front side of id</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(event) =>
                    setIdFront(event.target.files?.[0] ?? null)
                  }
                />
              </label>
              <label className="flex min-h-[140px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-cyan-400/30 bg-[#0f1118] px-4 py-6 text-center text-xs text-slate-400">
                <span className="text-lg text-cyan-300">⬆</span>
                <span>Upload back side of id</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(event) =>
                    setIdBack(event.target.files?.[0] ?? null)
                  }
                />
              </label>
              <label className="flex min-h-[140px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-cyan-400/30 bg-[#0f1118] px-4 py-6 text-center text-xs text-slate-400">
                <span className="text-lg text-cyan-300">⬆</span>
                <span>Upload selfie with id</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(event) =>
                    setSelfie(event.target.files?.[0] ?? null)
                  }
                />
              </label>
            </div>
          </section>

          <button
            type="button"
            className="mt-8 w-full rounded-full bg-linear-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_10px_24px_rgba(34,211,238,0.35)]"
            onClick={handleSubmit}
            disabled={isSubmitting || kycStatus === "verified"}
          >
            {isSubmitting ? "Submitting..." : "Submit Verification"}
          </button>
          {message ? (
            <div className="mt-4 rounded-xl border border-white/10 bg-[#0f1118] px-3 py-2 text-xs text-slate-300">
              {message}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
