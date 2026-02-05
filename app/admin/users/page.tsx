"use client";

import { useEffect, useMemo, useState } from "react";

import { supabaseAdmin } from "@/lib/supabaseClient";

type AdminUser = {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  user_metadata?: {
    name?: string;
    country?: string;
  };
  app_metadata?: { providers?: string[] };
  identities?: Array<{ provider?: string }>;
};

type UserBalance = {
  user_id: string;
  wallet_overview_amount: string;
  wallet_overview_subtext: string;
  overview_total_balance: string;
  overview_change: string;
  overview_assets: string;
  overview_risk_level: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editName, setEditName] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [originalCountry, setOriginalCountry] = useState("");
  const [editWalletAmount, setEditWalletAmount] = useState("$0");
  const [editWalletSubtext, setEditWalletSubtext] =
    useState("~0.00000000 BTC");
  const [editOverviewBalance, setEditOverviewBalance] = useState("$0");
  const [editOverviewChange, setEditOverviewChange] = useState("+0.0%");
  const [editOverviewAssets, setEditOverviewAssets] = useState("0");
  const [editOverviewRisk, setEditOverviewRisk] = useState("Medium");
  const [isSaving, setIsSaving] = useState(false);
  const [balances, setBalances] = useState<Record<string, UserBalance>>({});

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch("/api/admin/users", {
          credentials: "include",
          headers: {
            "x-admin-auth": localStorage.getItem("web3_admin_auth") || "",
          },
        });
        const rawText = await response.text();
        const result = rawText ? JSON.parse(rawText) : {};
        if (!response.ok) {
          setError(result?.error ?? rawText ?? "Failed to load users.");
          setIsLoading(false);
          return;
        }
        setUsers(result.users ?? []);

        const { data: balanceRows } = await supabaseAdmin
          .from("user_balances")
          .select(
            "user_id,wallet_overview_amount,wallet_overview_subtext,overview_total_balance,overview_change,overview_assets,overview_risk_level"
          );

        const nextBalances: Record<string, UserBalance> = {};
        (balanceRows ?? []).forEach((row) => {
          nextBalances[row.user_id] = row as UserBalance;
        });
        setBalances(nextBalances);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load users.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => {
      const email = user.email?.toLowerCase() ?? "";
      const name = user.user_metadata?.name?.toLowerCase() ?? "";
      const country = user.user_metadata?.country?.toLowerCase() ?? "";
      return (
        email.includes(query) || name.includes(query) || country.includes(query)
      );
    });
  }, [search, users]);

  const handleImpersonate = async (user: AdminUser) => {
    if (!user.email) {
      setError("User email is missing.");
      return;
    }
    setError("");
    setImpersonatingId(user.id);

    try {
      const response = await fetch("/api/admin/impersonate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-auth": localStorage.getItem("web3_admin_auth") || "",
        },
        credentials: "include",
        body: JSON.stringify({ email: user.email }),
      });
      const rawText = await response.text();
      const result = rawText ? JSON.parse(rawText) : {};
      if (!response.ok) {
        setError(result?.error ?? rawText ?? "Failed to impersonate user.");
        setImpersonatingId(null);
        return;
      }

      if (user.email) {
        // Ensure admin auth cookie so the server endpoint authorizes this request
        try { document.cookie = `web3_admin_auth=1; Path=/; SameSite=Lax`; } catch {}
        const url = `/api/admin/impersonate/login?email=${encodeURIComponent(
          user.email
        )}`;
        window.location.href = url;
      } else {
        setError("No user email provided.");
      }
    } catch {
      setError("Failed to impersonate user.");
    } finally {
      setImpersonatingId(null);
    }
  };

  const startEdit = (user: AdminUser) => {
    const userBalance = balances[user.id];
    setEditingId(user.id);
    setEditEmail(user.email ?? "");
    setEditName(user.user_metadata?.name ?? "");
    setEditCountry(user.user_metadata?.country ?? "");
    setEditPassword("");
    setOriginalEmail(user.email ?? "");
    setOriginalName(user.user_metadata?.name ?? "");
    setOriginalCountry(user.user_metadata?.country ?? "");
    setEditWalletAmount(userBalance?.wallet_overview_amount ?? "$0");
    setEditWalletSubtext(
      userBalance?.wallet_overview_subtext ?? "~0.00000000 BTC"
    );
    setEditOverviewBalance(userBalance?.overview_total_balance ?? "$0");
    setEditOverviewChange(userBalance?.overview_change ?? "+0.0%");
    setEditOverviewAssets(userBalance?.overview_assets ?? "0");
    setEditOverviewRisk(userBalance?.overview_risk_level ?? "Medium");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditEmail("");
    setEditName("");
    setEditCountry("");
    setEditPassword("");
    setOriginalEmail("");
    setOriginalName("");
    setOriginalCountry("");
    setEditWalletAmount("$0");
    setEditWalletSubtext("~0.00000000 BTC");
    setEditOverviewBalance("$0");
    setEditOverviewChange("+0.0%");
    setEditOverviewAssets("0");
    setEditOverviewRisk("Medium");
  };

  const handleSave = async (user: AdminUser) => {
    setError("");
    setIsSaving(true);

    try {
      const previousBalance = balances[user.id];
      const nextBalance = {
        wallet_overview_amount: editWalletAmount.trim() || "$0",
        wallet_overview_subtext:
          editWalletSubtext.trim() || "~0.00000000 BTC",
        overview_total_balance: editOverviewBalance.trim() || "$0",
        overview_change: editOverviewChange.trim() || "+0.0%",
        overview_assets: editOverviewAssets.trim() || "0",
        overview_risk_level: editOverviewRisk.trim() || "Medium",
      };
      const balanceChanged =
        !previousBalance ||
        previousBalance.wallet_overview_amount !==
          nextBalance.wallet_overview_amount ||
        previousBalance.wallet_overview_subtext !==
          nextBalance.wallet_overview_subtext ||
        previousBalance.overview_total_balance !==
          nextBalance.overview_total_balance ||
        previousBalance.overview_change !== nextBalance.overview_change ||
        previousBalance.overview_assets !== nextBalance.overview_assets ||
        previousBalance.overview_risk_level !== nextBalance.overview_risk_level;

      const { data: balanceRow, error: balanceError } = await supabaseAdmin
        .from("user_balances")
        .upsert(
          {
            user_id: user.id,
            ...nextBalance,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        )
        .select()
        .single();

      if (balanceError) {
        setError(balanceError.message);
        setIsSaving(false);
        return;
      }

      if (balanceRow) {
        setBalances((prev) => ({
          ...prev,
          [user.id]: balanceRow as UserBalance,
        }));
      }

      if (balanceChanged) {
        await supabaseAdmin.from("notifications").insert({
          user_id: user.id,
          user_email: user.email ?? null,
          type: "balance",
          title: "Balance updated",
          message: "Your dashboard balances were updated by the admin.",
          metadata: nextBalance,
        });
      }

      const hasUserChanges =
        editEmail.trim() !== originalEmail ||
        editName.trim() !== originalName ||
        editCountry.trim() !== originalCountry ||
        editPassword.trim().length > 0;

      if (hasUserChanges) {
        const payload = {
          email: editEmail.trim() || undefined,
          password: editPassword.trim() || undefined,
          user_metadata: {
            name: editName.trim(),
            country: editCountry.trim(),
          },
        };

        const response = await fetch(`/api/admin/users/${user.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-auth": localStorage.getItem("web3_admin_auth") || "",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        const rawText = await response.text();
        const result = rawText ? JSON.parse(rawText) : {};
        if (!response.ok) {
          setError(result?.error ?? rawText ?? "Failed to update user.");
          setIsSaving(false);
          return;
        }

        setUsers((prev) =>
          prev.map((item) =>
            item.id === user.id ? (result.user as AdminUser) : item
          )
        );
      }

      cancelEdit();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update user.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-[#15192e] p-6 text-white shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <h2 className="text-lg font-semibold">Users</h2>
        <p className="mt-2 text-sm text-slate-400">
          View registered users and impersonate accounts without passwords.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0f1118] p-6 text-slate-200 shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="text-xs text-slate-400">
            Search
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="Search by email, name, country"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <div className="text-xs text-slate-400">
            Total users:{" "}
            <span className="text-slate-200">{users.length}</span>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {error}
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f1118] text-slate-200 shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        {isLoading ? (
          <div className="p-6 text-sm text-slate-400">Loading users...</div>
        ) : filteredUsers.length ? (
          <div className="divide-y divide-white/10">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-6 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-white">
                      {user.user_metadata?.name || "Unnamed user"}
                    </div>
                    <div className="text-xs text-slate-500">
                      Email: {user.email ?? "No email"}
                    </div>
                    <div className="text-xs text-slate-500">
                      Country: {user.user_metadata?.country ?? "Not set"}
                    </div>
                    <div className="text-xs text-slate-500">
                      Providers: {(() => {
                        const providers = (user.app_metadata?.providers && user.app_metadata.providers.length
                          ? user.app_metadata.providers
                          : (user.identities || []).map((i) => i.provider || "").filter(Boolean)) as string[];
                        return providers && providers.length ? providers.join(", ") : "Unknown";
                      })()}
                    </div>
                    <div className="text-xs text-slate-500">
                      Password: Hidden (use Edit to set a new password)
                    </div>
                    <div className="text-xs text-slate-500">
                      Created:{" "}
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-500">
                      Last sign in:{" "}
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleString()
                        : "Never"}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleImpersonate(user)}
                      disabled={impersonatingId === user.id}
                      className="rounded-full border border-cyan-400/30 px-4 py-1 text-xs text-cyan-200 hover:bg-cyan-400/10 disabled:opacity-70"
                    >
                      {impersonatingId === user.id
                        ? "Opening..."
                        : "Impersonate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(user)}
                      className="rounded-full border border-slate-500/30 px-4 py-1 text-xs text-slate-300 hover:bg-white/5"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {editingId === user.id ? (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="text-xs text-slate-400">
                      Name
                      <input
                        className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        value={editName}
                        onChange={(event) => setEditName(event.target.value)}
                      />
                    </label>
                    <label className="text-xs text-slate-400">
                      Country
                      <input
                        className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        value={editCountry}
                        onChange={(event) => setEditCountry(event.target.value)}
                      />
                    </label>
                    <label className="text-xs text-slate-400">
                      Email
                      <input
                        className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        value={editEmail}
                        onChange={(event) => setEditEmail(event.target.value)}
                      />
                    </label>
                    <label className="text-xs text-slate-400">
                      New Password (optional)
                      <input
                        type="password"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        value={editPassword}
                        onChange={(event) => setEditPassword(event.target.value)}
                      />
                    </label>
                    <label className="text-xs text-slate-400">
                      Wallet overview amount
                      <input
                        className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        value={editWalletAmount}
                        onChange={(event) =>
                          setEditWalletAmount(event.target.value)
                        }
                      />
                    </label>
                    <label className="text-xs text-slate-400">
                      Wallet overview subtext
                      <input
                        className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        value={editWalletSubtext}
                        onChange={(event) =>
                          setEditWalletSubtext(event.target.value)
                        }
                      />
                    </label>
                    <label className="text-xs text-slate-400">
                      Overview total balance
                      <input
                        className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        value={editOverviewBalance}
                        onChange={(event) =>
                          setEditOverviewBalance(event.target.value)
                        }
                      />
                    </label>
                    <label className="text-xs text-slate-400">
                      Overview 24h change
                      <input
                        className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        value={editOverviewChange}
                        onChange={(event) =>
                          setEditOverviewChange(event.target.value)
                        }
                      />
                    </label>
                    <label className="text-xs text-slate-400">
                      Overview assets count
                      <input
                        className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        value={editOverviewAssets}
                        onChange={(event) =>
                          setEditOverviewAssets(event.target.value)
                        }
                      />
                    </label>
                    <label className="text-xs text-slate-400">
                      Overview risk level
                      <input
                        className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        value={editOverviewRisk}
                        onChange={(event) =>
                          setEditOverviewRisk(event.target.value)
                        }
                      />
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                      onClick={() => handleSave(user)}
                        disabled={isSaving}
                        className="rounded-full border border-cyan-400/30 px-4 py-1 text-xs text-cyan-200 hover:bg-cyan-400/10 disabled:opacity-70"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-full border border-slate-500/30 px-4 py-1 text-xs text-slate-300 hover:bg-white/5"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-sm text-slate-400">No users found.</div>
        )}
      </div>
    </div>
  );
}
