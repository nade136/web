"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "How it Works", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Blog", href: "#" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-[#0b0b12]/90 backdrop-blur ${
        isScrolled ? "border-[#12343d]" : "border-white/5"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/10">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-cyan-300"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.2 6.8 3.8v8L12 19.8 5.2 16V8l6.8-3.8Zm0 2.2-4.6 2.6v5.4L12 17l4.6-2.6V9L12 6.4Zm0 2 2.6 1.5v3L12 14.2l-2.6-1.5v-3L12 8.4Z"
              />
            </svg>
          </div>
          <div className="text-lg font-semibold tracking-wide text-cyan-200">
            Web3Vault
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-200 md:flex">
          {navLinks.map((link) => {
            const isActive = link.href !== "#" && pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`group relative transition-colors ${
                  isActive ? "text-cyan-200" : "hover:text-cyan-200"
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-0 top-full mt-2 h-0.5 w-full rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.6)] transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden items-center gap-2 rounded-full border border-cyan-400/40 bg-white/5 px-4 py-2 text-sm text-slate-100 backdrop-blur md:flex">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10 text-cyan-200">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
                <path
                  fill="currentColor"
                  d="M12 2a10 10 0 0 0 0 20 10 10 0 0 0 0-20Zm7.8 9h-3.1a14 14 0 0 0-1.2-5 8 8 0 0 1 4.3 5Zm-5.3 0H9.5a12 12 0 0 1 1.3-5.3 12 12 0 0 1 1.3 5.3Zm-7.3 0H4.2a8 8 0 0 1 4.3-5 14 14 0 0 0-1.3 5Zm0 2a14 14 0 0 0 1.3 5 8 8 0 0 1-4.3-5Zm2.3 0h5a12 12 0 0 1-1.3 5.3A12 12 0 0 1 9.5 13Zm7.3 0h3.1a8 8 0 0 1-4.3 5 14 14 0 0 0 1.2-5Z"
                />
              </svg>
            </span>
            English
            <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate-200">
              <path
                fill="currentColor"
                d="M5.6 7.5a1 1 0 0 1 1.4 0L10 10.5l3-3a1 1 0 1 1 1.4 1.4l-3.7 3.7a1 1 0 0 1-1.4 0L5.6 8.9a1 1 0 0 1 0-1.4Z"
              />
            </svg>
          </button>
          <Link
            href="/secure"
            className="flex items-center gap-2 rounded-full bg-linear-to-r from-cyan-400 to-violet-500 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-500/30"
          >
            <span className="flex h-7 w-5 items-center justify-center text-slate-900">
              <svg viewBox="0 0 24 24" className="h-6 w-6">
                <path
                  fill="currentColor"
                  d="M5 7a3 3 0 0 1 3-3h8a1 1 0 1 1 0 2H8a1 1 0 0 0-1 1v8c0 .6.4 1 1 1h8a1 1 0 1 1 0 2H8a3 3 0 0 1-3-3V7Zm11 1h2a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3Zm0 2a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2Zm1 1.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                />
              </svg>
            </span>
            Connect Wallet
          </Link>
        </div>
      </div>
    </header>
  );
}
