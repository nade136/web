"use client";

import { useEffect, useState } from "react";

import { supabaseAdmin } from "@/lib/supabaseClient";

type DepositToken = {
  id: string;
  name: string;
  symbol: string;
  price: string;
  networks: string[];
  addresses?: Record<string, string>;
  is_active: boolean;
  sort_order: number;
};

export default function AdminDepositTokensPage() {
  const [tokens, setTokens] = useState<DepositToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("$0.00");
  const [networks, setNetworks] = useState("");
  const [addressMap, setAddressMap] = useState<Record<string, string>>({});
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSymbol, setEditSymbol] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editNetworks, setEditNetworks] = useState("");
  const [editAddressMap, setEditAddressMap] = useState<Record<string, string>>(
    {}
  );
  const [editSortOrder, setEditSortOrder] = useState(0);
  const [editIsActive, setEditIsActive] = useState(true);

  const loadTokens = async () => {
    const { data, error: loadError } = await supabaseAdmin
      .from("deposit_tokens")
      .select("id,name,symbol,price,networks,addresses,is_active,sort_order")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (loadError) {
      setError(loadError.message);
      setIsLoading(false);
      return;
    }

    setTokens(data ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadTokens();
  }, []);

  const parseNetworks = (value: string) =>
    value
      .split(/[,\n;]+/)
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => entry.toLowerCase());

  useEffect(() => {
    const normalized = parseNetworks(networks);
    setAddressMap((prev) => {
      const next: Record<string, string> = {};
      normalized.forEach((network) => {
        next[network] = prev[network] ?? "";
      });
      return next;
    });
  }, [networks]);

  useEffect(() => {
    const normalized = parseNetworks(editNetworks);
    setEditAddressMap((prev) => {
      const next: Record<string, string> = {};
      normalized.forEach((network) => {
        next[network] = prev[network] ?? "";
      });
      return next;
    });
  }, [editNetworks]);

  const handleCreate = async () => {
    setError("");
    setIsSaving(true);

    if (!name.trim() || !symbol.trim()) {
      setError("Name and symbol are required.");
      setIsSaving(false);
      return;
    }

    const networkList = parseNetworks(networks);

    const { error: insertError } = await supabaseAdmin
      .from("deposit_tokens")
      .insert({
        name: name.trim(),
        symbol: symbol.trim().toUpperCase(),
        price: price.trim() || "$0.00",
        networks: networkList,
        addresses: addressMap,
        is_active: isActive,
        sort_order: sortOrder,
      });

    setIsSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setName("");
    setSymbol("");
    setPrice("$0.00");
    setNetworks("");
    setAddressMap({});
    setSortOrder(0);
    setIsActive(true);
    loadTokens();
  };

  const handleToggle = async (token: DepositToken) => {
    await supabaseAdmin
      .from("deposit_tokens")
      .update({ is_active: !token.is_active })
      .eq("id", token.id);

    loadTokens();
  };

  const handleDelete = async (tokenId: string) => {
    await supabaseAdmin.from("deposit_tokens").delete().eq("id", tokenId);
    loadTokens();
  };

  const startEdit = (token: DepositToken) => {
    setEditingId(token.id);
    setEditName(token.name);
    setEditSymbol(token.symbol);
    setEditPrice(token.price);
    setEditNetworks(token.networks.join(", "));
    setEditAddressMap(token.addresses ?? {});
    setEditSortOrder(token.sort_order);
    setEditIsActive(token.is_active);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditSymbol("");
    setEditPrice("");
    setEditNetworks("");
    setEditAddressMap({});
    setEditSortOrder(0);
    setEditIsActive(true);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setError("");
    setIsSaving(true);

    if (!editName.trim() || !editSymbol.trim()) {
      setError("Name and symbol are required.");
      setIsSaving(false);
      return;
    }

    const networkList = parseNetworks(editNetworks);

    const { error: updateError } = await supabaseAdmin
      .from("deposit_tokens")
      .update({
        name: editName.trim(),
        symbol: editSymbol.trim().toUpperCase(),
        price: editPrice.trim() || "$0.00",
        networks: networkList,
        addresses: editAddressMap,
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
    loadTokens();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-[#15192e] p-6 text-white shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <h2 className="text-lg font-semibold">Deposit Tokens</h2>
        <p className="mt-2 text-sm text-slate-400">
          Control which tokens appear in the deposit list and their networks.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0f1118] p-6 text-slate-200 shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <h3 className="text-sm font-semibold text-cyan-200">Add Token</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-xs text-slate-400">
            Name
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="Aave"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="text-xs text-slate-400">
            Symbol
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="AAVE"
              value={symbol}
              onChange={(event) => setSymbol(event.target.value)}
            />
          </label>
          <label className="text-xs text-slate-400">
            Price
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="$0.00"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </label>
          <label className="text-xs text-slate-400">
            Networks (comma separated)
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="ethereum, arbitrum"
              value={networks}
              onChange={(event) => setNetworks(event.target.value)}
            />
          </label>
          <div className="sm:col-span-2">
            <div className="text-xs text-slate-400">Wallet Addresses</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {Object.keys(addressMap).length ? (
                Object.entries(addressMap).map(([network, value]) => (
                  <label key={network} className="text-xs text-slate-400">
                    {network}
                    <input
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                      placeholder="Enter wallet address"
                      value={value}
                      onChange={(event) =>
                        setAddressMap((prev) => ({
                          ...prev,
                          [network]: event.target.value,
                        }))
                      }
                    />
                  </label>
                ))
              ) : (
                <div className="text-xs text-slate-500">
                  Add networks first to set addresses.
                </div>
              )}
            </div>
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
          {isSaving ? "Saving..." : "Add Token"}
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f1118] text-slate-200 shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        {isLoading ? (
          <div className="p-6 text-sm text-slate-400">Loading...</div>
        ) : tokens.length ? (
          <div className="divide-y divide-white/10">
            {tokens.map((token) => (
              <div key={token.id} className="p-6 text-sm">
                {editingId === token.id ? (
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
                        Symbol
                        <input
                          className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                          value={editSymbol}
                          onChange={(event) => setEditSymbol(event.target.value)}
                        />
                      </label>
                      <label className="text-xs text-slate-400">
                        Price
                        <input
                          className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                          value={editPrice}
                          onChange={(event) => setEditPrice(event.target.value)}
                        />
                      </label>
                      <label className="text-xs text-slate-400">
                        Networks (comma separated)
                        <input
                          className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                          value={editNetworks}
                          onChange={(event) => setEditNetworks(event.target.value)}
                        />
                      </label>
                      <div className="sm:col-span-2">
                        <div className="text-xs text-slate-400">
                          Wallet Addresses
                        </div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          {Object.keys(editAddressMap).length ? (
                            Object.entries(editAddressMap).map(
                              ([network, value]) => (
                                <label key={network} className="text-xs text-slate-400">
                                  {network}
                                  <input
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#15192e] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                    placeholder="Enter wallet address"
                                    value={value}
                                    onChange={(event) =>
                                      setEditAddressMap((prev) => ({
                                        ...prev,
                                        [network]: event.target.value,
                                      }))
                                    }
                                  />
                                </label>
                              )
                            )
                          ) : (
                            <div className="text-xs text-slate-500">
                              Add networks first to set addresses.
                            </div>
                          )}
                        </div>
                      </div>
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
                    <div>
                      <div className="font-semibold">
                        {token.name} ({token.symbol})
                      </div>
                      <div className="text-xs text-slate-500">
                        Networks: {token.networks.join(", ") || "None"}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">
                      Price: {token.price}
                    </div>
                    <div className="text-xs text-slate-400">
                      Order: {token.sort_order}
                    </div>
                    <div className="text-xs text-slate-400">
                      {token.is_active ? "Active" : "Inactive"}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(token)}
                        className="rounded-full border border-cyan-400/30 px-4 py-1 text-xs text-cyan-200 hover:bg-cyan-400/10"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggle(token)}
                        className="rounded-full border border-cyan-400/30 px-4 py-1 text-xs text-cyan-200 hover:bg-cyan-400/10"
                      >
                        {token.is_active ? "Disable" : "Enable"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(token.id)}
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
          <div className="p-6 text-sm text-slate-400">No tokens yet.</div>
        )}
      </div>
    </div>
  );
}
