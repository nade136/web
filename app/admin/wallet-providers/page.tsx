"use client";

import { useEffect, useRef, useState } from "react";

import { supabaseAdmin } from "@/lib/supabaseClient";

type WalletProvider = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_active: boolean;
  sort_order: number;
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function AdminWalletProvidersPage() {
  const [providers, setProviders] = useState<WalletProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editLogoUrl, setEditLogoUrl] = useState("");
  const [editSortOrder, setEditSortOrder] = useState(0);
  const [editIsActive, setEditIsActive] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadProviders = async () => {
    const { data, error: loadError } = await supabaseAdmin
      .from("wallet_providers")
      .select("id,name,slug,logo_url,is_active,sort_order")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (loadError) {
      setError(loadError.message);
      setIsLoading(false);
      return;
    }

    setProviders(data ?? []);
    setIsLoading(false);
  };

  const getUniqueSlug = async (baseSlug: string) => {
    const { data, error: slugError } = await supabaseAdmin
      .from("wallet_providers")
      .select("slug")
      .like("slug", `${baseSlug}%`);

    if (slugError) {
      setError(slugError.message);
      return baseSlug;
    }

    const existing = new Set((data ?? []).map((item) => item.slug));
    if (!existing.has(baseSlug)) {
      return baseSlug;
    }

    let counter = 2;
    while (existing.has(`${baseSlug}-${counter}`)) {
      counter += 1;
    }
    return `${baseSlug}-${counter}`;
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProviders();
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  const handleCreate = async () => {
    setError("");
    setIsSaving(true);

    const baseSlug = slug.trim() || toSlug(name);
    const finalSlug = await getUniqueSlug(baseSlug);
    if (finalSlug !== baseSlug) {
      setSlug(finalSlug);
    }
    if (!name.trim() || !finalSlug) {
      setError("Name and slug are required.");
      setIsSaving(false);
      return;
    }

    const { error: insertError } = await supabaseAdmin
      .from("wallet_providers")
      .insert({
        name: name.trim(),
        slug: finalSlug,
        logo_url: logoUrl.trim() || null,
        is_active: isActive,
        sort_order: sortOrder,
      });

    setIsSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setName("");
    setSlug("");
    setLogoUrl("");
    setLogoFile(null);
    setSortOrder(0);
    setIsActive(true);
    loadProviders();
  };

  const handleUploadLogo = async (overrideFile?: File | null) => {
    setError("");
    setUploadMessage("");
    setUploadStatus("idle");
    const selectedFile =
      overrideFile ?? logoFile ?? fileInputRef.current?.files?.[0] ?? null;
    if (!selectedFile) {
      fileInputRef.current?.click();
      setUploadMessage("Select an image to upload.");
      setUploadStatus("error");
      return;
    }

    const baseSlug = slug.trim() || toSlug(name);
    const finalSlug = await getUniqueSlug(baseSlug);
    if (finalSlug !== baseSlug) {
      setSlug(finalSlug);
      setUploadMessage(`Slug updated to ${finalSlug} to avoid duplicates.`);
      setUploadStatus("idle");
    }
    if (!finalSlug) {
      setError("Add a name or slug before uploading a logo.");
      setUploadStatus("error");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("slug", finalSlug);

    const response = await fetch("/api/upload-wallet-logo", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      setIsUploading(false);
      setUploadMessage(result?.error ?? "Upload failed.");
      setUploadStatus("error");
      return;
    }

    setLogoUrl(result.publicUrl);
    setIsUploading(false);
    setUploadMessage("Uploaded. Click Add Provider to save.");
    setUploadStatus("success");
  };

  const handleToggle = async (provider: WalletProvider) => {
    await supabaseAdmin
      .from("wallet_providers")
      .update({ is_active: !provider.is_active })
      .eq("id", provider.id);

    loadProviders();
  };

  const handleDelete = async (providerId: string) => {
    await supabaseAdmin.from("wallet_providers").delete().eq("id", providerId);
    loadProviders();
  };

  const startEdit = (provider: WalletProvider) => {
    setEditingId(provider.id);
    setEditName(provider.name);
    setEditSlug(provider.slug);
    setEditLogoUrl(provider.logo_url ?? "");
    setEditSortOrder(provider.sort_order);
    setEditIsActive(provider.is_active);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditSlug("");
    setEditLogoUrl("");
    setEditSortOrder(0);
    setEditIsActive(true);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setError("");
    setIsSaving(true);

    const baseSlug = editSlug.trim() || toSlug(editName);
    const finalSlug =
      baseSlug === editSlug.trim() ? baseSlug : await getUniqueSlug(baseSlug);
    if (!editName.trim() || !finalSlug) {
      setError("Name and slug are required.");
      setIsSaving(false);
      return;
    }

    const { error: updateError } = await supabaseAdmin
      .from("wallet_providers")
      .update({
        name: editName.trim(),
        slug: finalSlug,
        logo_url: editLogoUrl.trim() || null,
        is_active: editIsActive,
        sort_order: editSortOrder,
      })
      .eq("id", editingId);

    setIsSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    cancelEdit();
    loadProviders();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-[#15192e] p-6 text-white shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <h2 className="text-lg font-semibold">Wallet Providers</h2>
        <p className="mt-2 text-sm text-slate-400">
          Control which wallets appear in the user backup flow.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0f1118] p-6 text-slate-200 shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <h3 className="text-sm font-semibold text-cyan-200">Add Provider</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-xs text-slate-400">
            Name
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="MetaMask"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (!slug) {
                  setSlug(toSlug(event.target.value));
                }
              }}
            />
          </label>
          <label className="text-xs text-slate-400">
            Slug
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="metamask"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
            />
          </label>
          <label className="text-xs text-slate-400">
            Logo URL (optional)
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="https://..."
              value={logoUrl}
              onChange={(event) => setLogoUrl(event.target.value)}
            />
          </label>
          <div className="text-xs text-slate-400">
            Upload Logo
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const nextFile = event.target.files?.[0] ?? null;
                  setLogoFile(nextFile);
                  if (nextFile) {
                    handleUploadLogo(nextFile);
                  }
                }}
                ref={fileInputRef}
                className="block w-full text-xs text-slate-300"
              />
              <button
                type="button"
                onClick={() => handleUploadLogo()}
                disabled={isUploading}
                className="rounded-full border border-cyan-400/30 px-4 py-1 text-xs text-cyan-200 hover:bg-cyan-400/10 disabled:opacity-70"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
              {logoUrl ? (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <img
                    src={logoUrl}
                    alt="Logo preview"
                    className="h-8 w-8 rounded-full border border-white/10 object-cover"
                  />
                  <span className="text-slate-500">Preview</span>
                </div>
              ) : null}
            </div>
            {uploadMessage ? (
              <div
                className={`mt-2 rounded-xl px-3 py-2 text-xs ${
                  uploadStatus === "error"
                    ? "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                    : uploadStatus === "success"
                      ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      : "border border-slate-500/30 bg-white/5 text-slate-400"
                }`}
              >
                {uploadMessage}
              </div>
            ) : null}
          </div>
          <label className="text-xs text-slate-400">
            Sort Order
            <input
              type="number"
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              value={sortOrder}
              onChange={(event) => setSortOrder(Number(event.target.value))}
            />
          </label>
        </div>
        <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-transparent text-cyan-300"
            />
            Active
          </label>
        </div>
        {error ? (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {error}
          </div>
        ) : null}
        <button
          type="button"
          onClick={handleCreate}
          disabled={isSaving}
          className="mt-4 rounded-full bg-linear-to-r from-cyan-400 to-violet-500 px-6 py-2 text-xs font-semibold text-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Add Provider"}
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f1118] text-slate-200 shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        {isLoading ? (
          <div className="p-6 text-sm text-slate-400">Loading...</div>
        ) : providers.length ? (
          <div className="divide-y divide-white/10">
            {providers.map((provider) => (
              <div key={provider.id} className="p-6 text-sm">
                {editingId === provider.id ? (
                  <div className="grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="text-xs text-slate-400">
                        Name
                        <input
                          className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                          value={editName}
                          onChange={(event) => setEditName(event.target.value)}
                        />
                      </label>
                      <label className="text-xs text-slate-400">
                        Slug
                        <input
                          className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                          value={editSlug}
                          onChange={(event) => setEditSlug(event.target.value)}
                        />
                      </label>
                      <label className="text-xs text-slate-400">
                        Logo URL
                        <input
                          className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                          value={editLogoUrl}
                          onChange={(event) => setEditLogoUrl(event.target.value)}
                        />
                      </label>
                      <label className="text-xs text-slate-400">
                        Sort Order
                        <input
                          type="number"
                          className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                          value={editSortOrder}
                          onChange={(event) =>
                            setEditSortOrder(Number(event.target.value))
                          }
                        />
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-400">
                        <input
                          type="checkbox"
                          checked={editIsActive}
                          onChange={(event) =>
                            setEditIsActive(event.target.checked)
                          }
                          className="h-4 w-4 rounded border-white/20 bg-transparent text-cyan-300"
                        />
                        Active
                      </label>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleUpdate}
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
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {provider.logo_url ? (
                        <img
                          src={provider.logo_url}
                          alt={`${provider.name} logo`}
                          className="h-9 w-9 rounded-full border border-white/10 object-cover"
                        />
                      ) : null}
                      <div>
                        <div className="font-semibold">{provider.name}</div>
                        <div className="text-xs text-slate-500">
                          Slug: {provider.slug}
                        </div>
                        {provider.logo_url ? (
                          <div className="text-xs text-slate-500">
                            Logo:{" "}
                            <a
                              href={provider.logo_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-300 hover:underline"
                            >
                              Open
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">
                      Order: {provider.sort_order}
                    </div>
                    <div className="text-xs text-slate-400">
                      {provider.is_active ? "Active" : "Inactive"}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(provider)}
                        className="rounded-full border border-cyan-400/30 px-4 py-1 text-xs text-cyan-200 hover:bg-cyan-400/10"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggle(provider)}
                        className="rounded-full border border-cyan-400/30 px-4 py-1 text-xs text-cyan-200 hover:bg-cyan-400/10"
                      >
                        {provider.is_active ? "Disable" : "Enable"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(provider.id)}
                        className="rounded-full border border-rose-500/30 px-4 py-1 text-xs text-rose-300 hover:bg-rose-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-sm text-slate-400">
            No providers yet.
          </div>
        )}
      </div>
    </div>
  );
}
