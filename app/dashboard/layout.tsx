"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/I18nProvider";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabaseUser } from "@/lib/supabaseClient";
import LiveChartWidget from "@/components/LiveChartWidget";

const navItems = [
  { label: "Wallet", href: "/dashboard/wallet", icon: "💼" },
  { label: "Overview", href: "/dashboard/overview", icon: "🏠" },
  { label: "Settings", href: "/dashboard/settings", icon: "⚙️" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [userName, setUserName] = useState("Steve");
  const [userInitial, setUserInitial] = useState("S");
  const [profileOpen, setProfileOpen] = useState(false);
  const [kycStatus, setKycStatus] = useState<"pending" | "verified" | "rejected">(
    "pending"
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  // KYC status is shown inside notifications panel now; no separate popover
  const [notifications, setNotifications] = useState<
    Array<{ id: string; title: string | null; body: string | null; created_at: string; status?: string | null }>
  >([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncSession = async () => {
      const { data } = await supabaseUser.auth.getSession();
      const hasSession = !!data.session;

      if (!isMounted) return;

      if (!hasSession) {
        document.cookie = "web3_user_auth=; Path=/; Max-Age=0; SameSite=Lax";
        router.replace("/signin");
      }

      if (data.session?.user) {
        const nameFromProfile =
          (data.session.user.user_metadata?.name as string | undefined) ??
          data.session.user.email ??
          "User";
        const trimmed = nameFromProfile.trim();
        const displayName = trimmed.length ? trimmed : "User";
        const initial = displayName[0]?.toUpperCase() ?? "U";
        setUserName(displayName);
        setUserInitial(initial);
        setUserId(data.session.user.id);
        const avatar = (data.session.user.user_metadata?.avatar_url as string | undefined) ?? null;
        setAvatarUrl(avatar);

        const { data: kycRow } = await supabaseUser
          .from("kyc_requests")
          .select("status")
          .eq("user_id", data.session.user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (kycRow?.status === "verified") {
          setKycStatus("verified");
        } else if (kycRow?.status === "rejected") {
          setKycStatus("rejected");
        } else {
          setKycStatus("pending");
        }
      } else {
        setUserId(null);
      }

      setIsAuthChecked(true);
    };

    syncSession();

    const {
      data: { subscription },
    } = supabaseUser.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        document.cookie = "web3_user_auth=; Path=/; Max-Age=0; SameSite=Lax";
        router.replace("/signin");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  // Helpers and popover handlers (component scope)
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
      if (!avatarUrl) return;
      const objectPath = extractStoragePath(avatarUrl);
      if (objectPath) {
        await supabaseUser.storage.from("avatars").remove([objectPath]);
      }
      const { error } = await supabaseUser.auth.updateUser({ data: { avatar_url: null } });
      if (error) return;
      setAvatarUrl(null);
      window.dispatchEvent(new CustomEvent("avatar-updated", { detail: { url: null } }));
    } catch {
      // ignore errors in quick action
    }
  };

  const loadRecentNotifications = async () => {
    if (!userId) return;
    setIsLoadingNotifications(true);
    const { data, error } = await supabaseUser
      .from("notifications")
      .select("id, title, body, created_at, status")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);
    if (!error && data) setNotifications(data as Array<{ id: string; title: string | null; body: string | null; created_at: string; status?: string | null }>);
    setIsLoadingNotifications(false);
  };

  const toggleNotifications = async () => {
    const next = !notificationsOpen;
    setNotificationsOpen(next);
    if (next) await loadRecentNotifications();
  };

  // No separate KYC popover anymore

  // Listen for avatar updates from settings page
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ url: string | null }>; // TS narrow
      setAvatarUrl(custom.detail?.url ?? null);
    };
    window.addEventListener("avatar-updated", handler);
    return () => window.removeEventListener("avatar-updated", handler);
  }, []);

  useEffect(() => {
    if (!userId) {
      setUnreadCount(0);
      return;
    }

    let isMounted = true;

    const loadUnread = async () => {
      const { count, error } = await supabaseUser
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (!isMounted) return;
      if (error) {
        setUnreadCount(0);
        return;
      }
      setUnreadCount(count ?? 0);
    };

    const handleNotificationsUpdate = () => {
      loadUnread();
    };

    loadUnread();
    const interval = window.setInterval(loadUnread, 20000);
    window.addEventListener("notifications-updated", handleNotificationsUpdate);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
      window.removeEventListener(
        "notifications-updated",
        handleNotificationsUpdate
      );
    };
  }, [userId]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("web3-dashboard-theme");
    const nextIsDark = savedTheme ? savedTheme === "dark" : true;

    setIsDark(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
    if (!savedTheme) {
      localStorage.setItem("web3-dashboard-theme", "dark");
    }
    window.dispatchEvent(
      new CustomEvent("dashboard-theme-change", {
        detail: { theme: nextIsDark ? "dark" : "light" },
      })
    );
  }, []);

  const applyTheme = (nextIsDark: boolean) => {
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
    localStorage.setItem(
      "web3-dashboard-theme",
      nextIsDark ? "dark" : "light"
    );
    window.dispatchEvent(
      new CustomEvent("dashboard-theme-change", {
        detail: { theme: nextIsDark ? "dark" : "light" },
      })
    );
  };

  const handleLogout = async () => {
    await supabaseUser.auth.signOut();
    document.cookie = "web3_user_auth=; Path=/; Max-Age=0; SameSite=Lax";
    router.replace("/signin");
  };

  const triggerAvatarPicker = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;

    const ext = file.name.split(".").pop() || "png";
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabaseUser.storage
      .from("avatars")
      .upload(path, file, { upsert: true, cacheControl: "3600" });
    if (uploadError) return;

    const { data: publicData } = supabaseUser.storage
      .from("avatars")
      .getPublicUrl(path);
    const publicUrl = publicData.publicUrl;

    const { error: metaError } = await supabaseUser.auth.updateUser({
      data: { avatar_url: publicUrl },
    });
    if (metaError) return;

    setAvatarUrl(publicUrl);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  if (!isAuthChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0b12] text-white">
        {t("auth.checkingSession")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0b12] dark:text-white">
      <div className="flex min-h-screen">
        <button
          className={`fixed inset-0 z-30 bg-black/60 transition-opacity dark:bg-black/60 lg:hidden ${
            sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />

        <aside
          className={`fixed left-0 top-0 z-40 flex h-full w-72 shrink-0 border-r border-slate-200/70 bg-white transition-transform duration-300 dark:border-white/10 dark:bg-[#0f1122] lg:relative lg:h-screen lg:overflow-hidden lg:transition-[width] lg:duration-300 lg:translate-x-0 ${
            sidebarOpen
              ? "translate-x-0 lg:w-72"
              : "-translate-x-full lg:w-0 lg:border-r-0"
          }`}
        >
          <div className="flex h-full w-full flex-col px-6 py-8">
            <div className="flex items-center gap-3 text-lg font-semibold text-cyan-600 dark:text-cyan-200">
              <Link href="/" className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/10">
                  <span className="text-cyan-600 dark:text-cyan-300">W</span>
                </span>
                <span>Web3Vault</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white lg:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                ✕
              </Button>
            </div>

            <Separator className="my-6 bg-slate-200/70 dark:bg-white/10" />

            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
              {t("dashboard.menu")}
            </div>
            <nav className="mt-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.href}
                    asChild
                    variant="ghost"
                    className={`w-full justify-start gap-3 rounded-2xl px-4 py-3 ${
                      isActive
                        ? "bg-cyan-400/10 text-cyan-700 ring-1 ring-cyan-400/30 hover:bg-cyan-400/10 dark:text-cyan-200"
                        : "text-slate-600 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-200"
                    }`}
                  >
                    <Link href={item.href}>
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-[#161a2f] dark:text-slate-200">
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </Button>
                );
              })}
            </nav>

            <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/80 p-4 text-xs text-slate-600 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#15192e] dark:text-slate-300 dark:shadow-[0_12px_30px_rgba(4,10,22,0.45)]">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {t("dashboard.theme")}
              </div>
              <div className="mt-3 flex rounded-full border border-slate-200 bg-slate-100 p-1 dark:border-white/10 dark:bg-[#0f1122]">
                <button
                  type="button"
                  onClick={() => applyTheme(true)}
                  className={`flex-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
                    isDark
                      ? "bg-cyan-400/20 text-cyan-700 dark:text-cyan-200"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                  aria-pressed={isDark}
                >
                  {t("common.dark")}
                </button>
                <button
                  type="button"
                  onClick={() => applyTheme(false)}
                  className={`flex-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
                    !isDark
                      ? "bg-cyan-400/20 text-cyan-700 dark:text-cyan-200"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                  aria-pressed={!isDark}
                >
                  {t("common.light")}
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white/80 p-4 text-xs text-slate-600 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#15192e] dark:text-slate-300 dark:shadow-[0_12px_30px_rgba(4,10,22,0.45)]">
              {t("dashboard.needHelp")} {" "}
              <span className="text-cyan-600 dark:text-cyan-200">
                {t("dashboard.contactSupport")}
              </span>
            </div>

            <div className="mt-6">
              <LiveChartWidget scope="dashboard" variant="inline" />
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 w-full rounded-2xl border border-rose-200/60 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-500 transition hover:border-rose-300/60 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
            >
              {t("dashboard.logOut")}
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col lg:min-h-screen">
          <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-[#1a0f2b]/85">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-[#15192e] dark:text-slate-200 dark:hover:bg-[#1f2340]"
                  onClick={() => setSidebarOpen((open) => !open)}
                  aria-label="Toggle sidebar"
                >
                  ☰
                </Button>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t("dashboard.welcomeBack").replace("{name}", userName)}
                  </p>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                    {t("dashboard.title")}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={toggleNotifications}
                    className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-[#15192e] dark:text-slate-200 dark:hover:bg-[#1f2340]"
                    aria-expanded={notificationsOpen}
                    aria-haspopup="true"
                  >
                    {t("common.notifications")}
                  </button>
                  {unreadCount > 0 ? (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  ) : null}
                  {notificationsOpen ? (
                    <>
                      <button
                        type="button"
                        className="fixed inset-0 z-10 cursor-default"
                        onClick={() => setNotificationsOpen(false)}
                        aria-label="Close notifications"
                      />
                      <div className="absolute right-0 z-20 mt-3 w-80 rounded-2xl border border-white/10 bg-[#1a1130] p-2 text-xs text-slate-200 shadow-[0_18px_40px_rgba(4,10,22,0.6)]">
                        <div className="mb-1 px-2 text-[11px] uppercase tracking-wider text-slate-400">{t("common.notifications")}</div>
                        <div className="mx-1 mb-2 rounded-xl border border-white/10 bg-white/5 p-2">
                          <div className="flex items-center justify-between">
                            <div className="text-[11px] text-slate-400">{t("kyc.title")}</div>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              kycStatus === "verified"
                                ? "bg-emerald-500/15 text-emerald-300"
                                : kycStatus === "rejected"
                                  ? "bg-rose-500/15 text-rose-300"
                                  : "bg-amber-500/15 text-amber-300"
                            }`}>
                              {t(`kyc.status.${kycStatus}`)}
                            </span>
                          </div>
                          <div className="mt-1 text-[11px] text-slate-400">
                            {kycStatus === "verified"
                              ? t("kyc.msg.verified")
                              : kycStatus === "rejected"
                                ? t("kyc.msg.rejected")
                                : t("kyc.msg.pending")}
                          </div>
                        </div>
                        {isLoadingNotifications ? (
                          <div className="px-2 py-6 text-center text-slate-400">{t("common.loading")}</div>
                        ) : notifications.length === 0 ? (
                          <div className="px-2 py-6 text-center text-slate-400">{t("common.noNotifications")}</div>
                        ) : (
                          <ul className="max-h-72 space-y-1 overflow-auto px-1">
                            {notifications.map((n) => (
                              <li key={n.id} className="rounded-xl p-2 hover:bg-white/5">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="truncate text-[13px] font-semibold">{n.title || "Notification"}</div>
                                    <div className="truncate text-[11px] text-slate-400">{n.body || ""}</div>
                                  </div>
                                  {n.status ? (
                                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                      n.status === "verified"
                                        ? "bg-emerald-500/15 text-emerald-300"
                                        : n.status === "rejected"
                                          ? "bg-rose-500/15 text-rose-300"
                                          : "bg-amber-500/15 text-amber-300"
                                    }`}>
                                      {t(`kyc.status.${n.status}`)}
                                    </span>
                                  ) : null}
                                </div>
                                <div className="mt-1 text-[10px] text-slate-500">{new Date(n.created_at).toLocaleString()}</div>
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="mt-2 flex justify-end px-2">
                          <Link href="/dashboard/notifications" className="text-[11px] text-cyan-300 hover:underline">
                            {t("common.viewAll")}
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((open) => !open)}
                    className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-sm font-semibold text-cyan-700 transition hover:brightness-105 dark:bg-[#1f2340] dark:text-cyan-300"
                    aria-label="Open profile menu"
                  >
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      userInitial
                    )}
                  </button>
                  {profileOpen ? (
                    <>
                      <button
                        type="button"
                        className="fixed inset-0 z-10 cursor-default"
                        onClick={() => setProfileOpen(false)}
                        aria-label="Close profile menu"
                      />
                      <div className="absolute right-0 z-20 mt-3 w-44 rounded-2xl border border-white/10 bg-[#1a1130] p-2 text-xs text-slate-200 shadow-[0_18px_40px_rgba(4,10,22,0.6)]">
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(false);
                            router.push("/dashboard/settings");
                          }}
                          className="w-full rounded-xl px-3 py-2 text-left transition hover:bg-white/5"
                        >
                          {t("profile.viewProfile")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(false);
                            triggerAvatarPicker();
                          }}
                          className="w-full rounded-xl px-3 py-2 text-left transition hover:bg-white/5"
                        >
                          {t("profile.changePhoto")}
                        </button>
                        {avatarUrl ? (
                          <button
                            type="button"
                            onClick={() => {
                              setProfileOpen(false);
                              handleRemoveAvatar();
                            }}
                            className="w-full rounded-xl px-3 py-2 text-left text-rose-300 transition hover:bg-rose-500/10"
                          >
                            {t("profile.removePhoto")}
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(false);
                            router.push("/dashboard/wallet");
                          }}
                          className="w-full rounded-xl px-3 py-2 text-left transition hover:bg-white/5"
                        >
                          {t("wallet.viewWallet")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(false);
                            handleLogout();
                          }}
                          className="w-full rounded-xl px-3 py-2 text-left text-rose-300 transition hover:bg-rose-500/10"
                        >
                          {t("common.logout")}
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
