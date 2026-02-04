"use client";

import { useEffect, useRef, useState } from "react";

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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      const currentAvatar = (user.user_metadata?.avatar_url as string | undefined) ?? null;
      setAvatarUrl(currentAvatar);
      setUserId(user.id);
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

  const triggerFilePicker = () => {
    setUploadStatus("");
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadStatus("");
      const file = event.target.files?.[0];
      if (!file) return;
      if (!userId) {
        setUploadStatus("Not authenticated.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setUploadStatus("Please select an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadStatus("Image must be under 5MB.");
        return;
      }

      const ext = file.name.split(".").pop() || "png";
      const path = `${userId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabaseUser.storage
        .from("avatars")
        .upload(path, file, { upsert: true, cacheControl: "3600" });
      if (uploadError) {
        setUploadStatus(uploadError.message);
        return;
      }

      const { data: publicData } = supabaseUser.storage
        .from("avatars")
        .getPublicUrl(path);
      const publicUrl = publicData.publicUrl;

      const { error: metaError } = await supabaseUser.auth.updateUser({
        data: { avatar_url: publicUrl },
      });
      if (metaError) {
        setUploadStatus(metaError.message);
        return;
      }

      setAvatarUrl(publicUrl);
      setUploadStatus("Profile photo updated.");
      // notify header to sync avatar
      window.dispatchEvent(
        new CustomEvent("avatar-updated", { detail: { url: publicUrl } })
      );
      // clear input value so same file can be re-selected later
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setUploadStatus(err?.message || "Failed to upload image.");
    }
  };

  const extractStoragePath = (url: string) => {
    try {
      const marker = "/avatars/";
      const i = url.indexOf(marker);
      if (i === -1) return null;
      return url.slice(i + marker.length);
    } catch {
      return null;
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setUploadStatus("");
      if (!avatarUrl) return;
      const objectPath = extractStoragePath(avatarUrl);
      if (objectPath) {
        await supabaseUser.storage.from("avatars").remove([objectPath]);
      }
      const { error: metaError } = await supabaseUser.auth.updateUser({
        data: { avatar_url: null as any },
      });
      if (metaError) {
        setUploadStatus(metaError.message);
        return;
      }
      setAvatarUrl(null);
      setUploadStatus("Profile photo removed.");
      window.dispatchEvent(
        new CustomEvent("avatar-updated", { detail: { url: null } })
      );
    } catch (err: any) {
      setUploadStatus(err?.message || "Failed to remove image.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-cyan-300">Profile Settings</h2>
      <div className="rounded-3xl border border-white/10 bg-[#1a1130] p-6 shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={triggerFilePicker}
              className="relative group flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10 text-lg font-semibold text-cyan-300 overflow-hidden"
              aria-label="Upload profile photo"
              title="Click to upload profile photo"
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                initial
              )}
              <span className="absolute inset-0 hidden items-center justify-center bg-black/40 text-[10px] font-semibold text-white group-hover:flex">
                Change
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
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
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={triggerFilePicker}
                className="rounded-full border border-white/20 px-4 py-2 text-[11px] font-semibold text-slate-200 hover:bg-white/5"
              >
                Change Photo
              </button>
              {avatarUrl ? (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="rounded-full border border-rose-400/30 px-4 py-2 text-[11px] font-semibold text-rose-300 hover:bg-rose-500/10"
                >
                  Remove Photo
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {uploadStatus ? (
        <div className="-mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-200">
          {uploadStatus}
        </div>
      ) : null}

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
