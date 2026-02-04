"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Wallet", href: "/admin/wallet" },
  { label: "Overview", href: "/admin/overview" },
  { label: "Settings", href: "/admin/settings" },
  { label: "Dashboard Stats", href: "/admin/dashboard-stats" },
  { label: "Users", href: "/admin/users" },
  { label: "KYC Requests", href: "/admin/kyc-requests" },
  { label: "Deposit Confirmations", href: "/admin/deposit-confirmations" },
  { label: "Backup Requests", href: "/admin/backup-requests" },
  { label: "Wallet Providers", href: "/admin/wallet-providers" },
  { label: "Deposit Tokens", href: "/admin/deposit-tokens" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [adminName] = useState("Admin");
  const [adminInitial] = useState("A");

  useEffect(() => {
    const hasCookie = document.cookie.includes("web3_admin_auth=1");

    if (!hasCookie && pathname !== "/admin/login") {
      router.replace("/admin/login");
    } else if (hasCookie && pathname === "/admin/login") {
      router.replace("/admin/wallet");
    }

    setIsAuthChecked(true);
  }, [pathname, router]);

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

  const handleLogout = () => {
    document.cookie = "web3_admin_auth=; Path=/; Max-Age=0; SameSite=Lax";
    document.cookie =
      "web3_admin_auth=; Path=/admin; Max-Age=0; SameSite=Lax";
    localStorage.removeItem("web3_admin_auth");
    router.replace("/admin/login");
  };

  if (!isAuthChecked && pathname !== "/admin/login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0b12] text-white">
        Checking session...
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
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
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/10">
                <span className="text-cyan-600 dark:text-cyan-300">W</span>
              </span>
              Web3Vault
              <button
                className="ml-auto text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white lg:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                ✕
              </button>
            </div>

            <div className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
              Menu
            </div>
            <nav className="mt-4 space-y-2 text-sm">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                      isActive
                        ? "bg-cyan-400/10 text-cyan-700 ring-1 ring-cyan-400/30 dark:text-cyan-200"
                        : "text-slate-600 hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-200"
                    }`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-[#161a2f] dark:text-slate-200">
                      {item.label === "Wallet"
                        ? "💼"
                        : item.label === "Overview"
                          ? "🏠"
                        : item.label === "Dashboard Stats"
                          ? "📊"
                          : item.label === "Users"
                            ? "👥"
                            : item.label === "KYC Requests"
                              ? "🧾"
                            : item.label === "Deposit Confirmations"
                              ? "✅"
                            : item.label === "Backup Requests"
                              ? "🗂️"
                              : item.label === "Wallet Providers"
                                ? "🔐"
                                : item.label === "Deposit Tokens"
                                  ? "🪙"
                                  : "⚙️"}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/80 p-4 text-xs text-slate-600 shadow-[0_12px_30px_rgba(4,10,22,0.08)] dark:border-white/10 dark:bg-[#15192e] dark:text-slate-300 dark:shadow-[0_12px_30px_rgba(4,10,22,0.45)]">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Theme
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
                  Dark
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
                  Light
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white/80 p-4 text-xs text-slate-600 shadow-[0_12px_30px_rgba(4,10,22,0.08)] dark:border-white/10 dark:bg-[#15192e] dark:text-slate-300 dark:shadow-[0_12px_30px_rgba(4,10,22,0.45)]">
              Need help?{" "}
              <span className="text-cyan-600 dark:text-cyan-200">
                Contact support
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 w-full rounded-2xl border border-rose-200/60 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-500 transition hover:border-rose-300/60 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
            >
              Log out
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col lg:min-h-screen">
          <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-[#0b0b12]/80">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3">
                <button
                  className="rounded-full border border-slate-200/70 bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:border-white/10 dark:bg-[#15192e] dark:text-slate-200"
                  onClick={() => setSidebarOpen((open) => !open)}
                  aria-label="Toggle sidebar"
                >
                  ☰
                </button>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Welcome back, {adminName} 👋
                  </p>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                    Admin Dashboard
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="rounded-full border border-slate-200/70 bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-[#15192e] dark:text-slate-200">
                  Notifications
                </button>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-cyan-700 dark:bg-[#1f2340] dark:text-cyan-300">
                  {adminInitial}
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
