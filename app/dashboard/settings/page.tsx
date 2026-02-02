"use client";

import { useEffect, useState } from "react";

import { supabaseUser } from "@/lib/supabaseClient";

export default function DashboardSettingsPage() {
  const [name, setName] = useState("User");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("No country selected");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabaseUser.auth.getSession();
      const user = data.session?.user;
      if (!user) return;

      const displayName =
        (user.user_metadata?.name as string | undefined) ??
        user.email ??
        "User";
      setName(displayName.trim() || "User");
      setEmail(user.email ?? "");
      const currentCountry =
        (user.user_metadata?.country as string | undefined) ??
        "No country selected";
      setCountry(currentCountry);
      setEditName(displayName.trim() || "User");
      setEditCountry(currentCountry === "No country selected" ? "" : currentCountry);
    };

    loadProfile();
  }, []);

  const initial = name[0]?.toUpperCase() ?? "U";

  const handleSaveProfile = async () => {
    setSaveStatus("");
    const { error } = await supabaseUser.auth.updateUser({
      data: {
        name: editName.trim() || "User",
        country: editCountry.trim() || "No country selected",
      },
    });

    if (error) {
      setSaveStatus(error.message);
      return;
    }

    setName(editName.trim() || "User");
    setCountry(editCountry.trim() || "No country selected");
    setIsEditing(false);
    setSaveStatus("Profile updated.");
  };

  const handlePasswordUpdate = async () => {
    setPasswordStatus("");

    if (!newPassword || newPassword.length < 6) {
      setPasswordStatus("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus("Passwords do not match.");
      return;
    }

    const { error } = await supabaseUser.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordStatus(error.message);
      return;
    }

    setNewPassword("");
    setConfirmPassword("");
    setPasswordStatus("Password updated.");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-cyan-300">Profile Settings</h2>
      <div className="rounded-3xl border border-white/10 bg-[#1a1130] p-6 shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10 text-lg font-semibold text-cyan-300">
              {initial}
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <div>
                <div className="text-xs text-slate-400">Name:</div>
                <div className="font-semibold text-white">{name}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Country:</div>
                <div className="text-slate-400">{country}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-300">
            <div>
              <div className="text-xs text-slate-400">Email:</div>
              <div className="font-semibold text-white">
                {email || "Not provided"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing((value) => !value)}
              className="rounded-full bg-cyan-400 px-5 py-2 text-xs font-semibold text-slate-900 shadow-[0_8px_16px_rgba(34,211,238,0.35)]"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="rounded-3xl border border-white/10 bg-[#15192e] p-6 shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
          <h3 className="text-sm font-semibold text-cyan-200">Edit Profile</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-slate-400">
              Name
              <input
                type="text"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1118] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                placeholder="Enter your name"
              />
            </label>
            <label className="text-xs text-slate-400">
              Country
              <input
                type="text"
                value={editCountry}
                onChange={(event) => setEditCountry(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1118] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                placeholder="Enter your country"
              />
            </label>
          </div>
          {saveStatus ? (
            <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-200">
              {saveStatus}
            </div>
          ) : null}
          <button
            type="button"
            onClick={handleSaveProfile}
            className="mt-4 rounded-full bg-linear-to-r from-cyan-400 to-violet-500 px-6 py-2 text-xs font-semibold text-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
          >
            Save Changes
          </button>
        </div>
      ) : null}

      <div className="rounded-3xl border border-white/10 bg-[#15192e] p-6 shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <h3 className="text-sm font-semibold text-cyan-200">Change Password</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-xs text-slate-400">
            New Password
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1118] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="Enter new password"
            />
          </label>
          <label className="text-xs text-slate-400">
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1118] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
              placeholder="Confirm new password"
            />
          </label>
        </div>
        {passwordStatus ? (
          <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-200">
            {passwordStatus}
          </div>
        ) : null}
        <button
          type="button"
          onClick={handlePasswordUpdate}
          className="mt-4 rounded-full bg-linear-to-r from-cyan-400 to-violet-500 px-6 py-2 text-xs font-semibold text-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
