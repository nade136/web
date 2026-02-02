import LivePricesSection from "./components/LivePricesSection";
import StartJourneySection from "./components/StartJourneySection";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0b12] text-white">
      <Navbar />

      <main className="relative overflow-hidden">
        <div className="relative mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-6 pb-24 pt-16 text-center">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2">
            <div className="orb-pulse h-full w-full rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.45)_0%,rgba(37,99,235,0.25)_35%,rgba(15,23,42,0)_70%)] opacity-90" />
          </div>
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2">
            <div className="orb-drift h-full w-full rounded-full bg-[radial-gradient(circle,rgba(15,23,42,0)_40%,rgba(15,23,42,0.6)_70%,rgba(15,23,42,0.9)_90%)]" />
          </div>
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2">
            <div
              className="orb-drift h-full w-full rounded-full bg-[radial-gradient(rgba(56,189,248,0.45)_1px,transparent_1px)] bg-size-[14px_14px] opacity-70"
              style={{
                maskImage:
                  "radial-gradient(circle at center, #000 54%, transparent 72%)",
              }}
            />
          </div>

          <h1 className="relative z-10 text-5xl font-bold leading-tight text-white sm:text-6xl md:text-7xl">
            <span className="block text-white">
              <span className="text-[#25b8d5]">Your</span>{" "}
              <span className="text-[#7372f6]">Gateway</span>{" "}
              <span className="text-[#25b8d5]">to the</span>
            </span>
            <span className="block text-white">Decentralized Future</span>
          </h1>
          <p className="relative z-10 mt-3 text-sm text-slate-400 sm:text-base">
            Buy, sell, and store crypto securely in seconds.
          </p>
          <div className="relative z-10 mt-14 flex items-center justify-center">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <button className="rounded-lg bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_0_18px_rgba(34,211,238,0.45)]">
                Get Started
              </button>
              <button className="rounded-lg border border-white/15 bg-transparent px-6 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-[#110d1c]/60 hover:text-slate-100">
                Connect Wallet
              </button>
            </div>
            <span className="float-y absolute left-1/2 top-1/2 flex h-9 w-6 items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/10">
              <span className="h-3 w-1.5 rounded-full bg-cyan-200/80" />
            </span>
          </div>
        </div>
      </main>

      <section className="mx-auto w-full max-w-7xl px-6 pb-24 pt-6">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl md:text-4xl">
            <span className="bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="mt-3 font-black text-3xl text-slate-400 sm:text-base">
            Everything you need to manage your crypto portfolio with confidence
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <article className="min-h-[260px] rounded-2xl border border-white/5 bg-[#101018] p-8 shadow-[0_10px_30px_rgba(8,10,20,0.35)]">
            <div className="group flex h-12 w-12 items-center justify-center rounded-xl bg-[#151a2a]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-shield h-7 w-7 text-[#00e5ff] transition-colors duration-300 group-hover:text-[#7b5cff]"
              >
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">
              Secure Wallet
            </h3>
            <p className="mt-3 text-sm text-slate-400">
              Military-grade encryption protects your assets 24/7 with
              multi-signature security.
            </p>
          </article>

          <article className="min-h-[260px] rounded-2xl border border-white/5 bg-[#101018] p-8 shadow-[0_10px_30px_rgba(8,10,20,0.35)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#151a2a] text-cyan-300">
              <svg viewBox="0 0 24 24" className="h-6 w-6">
                <path
                  fill="currentColor"
                  d="M12 3a1 1 0 0 1 1 1v6.2l4.4-4.4a1 1 0 0 1 1.4 1.4L14.4 12l4.4 4.4a1 1 0 0 1-1.4 1.4L13 13.4V20a1 1 0 1 1-2 0v-6.6l-4.4 4.4a1 1 0 1 1-1.4-1.4L9.6 12 5.2 7.6a1 1 0 0 1 1.4-1.4L11 10.2V4a1 1 0 0 1 1-1Z"
                />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">
              Buy &amp; Sell Instantly
            </h3>
            <p className="mt-3 text-sm text-slate-400">
              Execute trades in milliseconds with our lightning-fast transaction
              engine.
            </p>
          </article>

          <article className="min-h-[260px] rounded-2xl border border-white/5 bg-[#101018] p-8 shadow-[0_10px_30px_rgba(8,10,20,0.35)]">
            <div className="group flex h-12 w-12 items-center justify-center rounded-xl bg-[#151a2a]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-repeat h-7 w-7 text-[#00e5ff] transition-colors duration-300 group-hover:text-[#7b5cff]"
              >
                <path d="m17 2 4 4-4 4" />
                <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
                <path d="m7 22-4-4 4-4" />
                <path d="M21 13v1a4 4 0 0 1-4 4H3" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">
              Swap Tokens
            </h3>
            <p className="mt-3 text-sm text-slate-400">
              Seamlessly exchange between thousands of cryptocurrencies at the
              best rates.
            </p>
          </article>

          <article className="min-h-[260px] rounded-2xl border border-white/5 bg-[#101018] p-8 shadow-[0_10px_30px_rgba(8,10,20,0.35)]">
            <div className="group flex h-12 w-12 items-center justify-center rounded-xl bg-[#151a2a]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trending-up h-7 w-7 text-[#00e5ff] transition-colors duration-300 group-hover:text-[#7b5cff]"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">
              Track Portfolio
            </h3>
            <p className="mt-3 text-sm text-slate-400">
              Real-time analytics and insights to maximize your crypto
              investments.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-28 pt-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            How It <span className="text-[#25b8d5]">Works</span>
          </h2>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            Get started with VaultX in three simple steps
          </p>
        </div>

        <div className="relative mt-15">
          <div className="absolute left-0 right-0 top-[96px] h-px bg-linear-to-r from-transparent via-cyan-400/60 to-transparent" />
          <div className="grid gap-10 md:grid-cols-3">
            <div className="text-center">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/40 bg-[#0c0f1a] shadow-[0_0_30px_rgba(34,211,238,0.35)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#25b8d5]"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <path d="M3.3 7 12 12l8.7-5" />
                  <path d="M12 22V12" />
                </svg>
                <span className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#7b5cff] text-xs font-bold text-white">
                  1
                </span>
              </div>
              <h3 className="mt-12 text-lg font-semibold text-white">
                Create Your Wallet
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Sign up in seconds and get your secure crypto wallet instantly.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/40 bg-[#0c0f1a] shadow-[0_0_30px_rgba(34,211,238,0.35)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#25b8d5]"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
                <span className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#7b5cff] text-xs font-bold text-white">
                  2
                </span>
              </div>
              <h3 className="mt-12 text-lg font-semibold text-white">
                Fund Your Account
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Add funds via bank transfer, card, or existing crypto assets.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/40 bg-[#0c0f1a] shadow-[0_0_30px_rgba(34,211,238,0.35)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#25b8d5]"
                >
                  <path d="M12 2a10 10 0 1 0 10 10" />
                  <path d="M12 2a10 10 0 0 1 10 10h-5l-2-2-2 2H6l2-3 2-3 2 3 2-3 2 3" />
                </svg>
                <span className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#7b5cff] text-xs font-bold text-white">
                  3
                </span>
              </div>
              <h3 className="mt-12 text-lg font-semibold text-white">
                Start Trading
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Buy, sell, and swap cryptocurrencies with just a few clicks.
              </p>
            </div>
          </div>
        </div>
      </section>

      <LivePricesSection />

      <section className="mx-auto w-full max-w-7xl px-6 pb-32 pt-8">
        <div className="text-center">
          <h2 className="text-4xl font-black text-white sm:text-5xl">
            Trust &amp; <span className="text-[#25b8d5]">Security</span>
          </h2>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            Your assets are protected by industry-leading security measures
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          <article className="min-h-[230px] rounded-2xl border border-white/5 bg-[#101018] p-8 shadow-[0_10px_30px_rgba(8,10,20,0.35)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#151a2a] text-cyan-300">
              <svg viewBox="0 0 24 24" className="h-6 w-6">
                <path
                  fill="currentColor"
                  d="M12 2a7 7 0 0 1 7 7v3.1a5 5 0 0 1-2 4V21a1 1 0 0 1-1.6.8L12 19l-3.4 2.8A1 1 0 0 1 7 21v-4.9a5 5 0 0 1-2-4V9a7 7 0 0 1 7-7Z"
                />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">
              Bank-Level Security
            </h3>
            <p className="mt-3 text-sm text-slate-400">
              256-bit encryption and cold storage for maximum protection
            </p>
          </article>

          <article className="min-h-[230px] rounded-2xl border border-white/5 bg-[#101018] p-8 shadow-[0_10px_30px_rgba(8,10,20,0.35)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#151a2a] text-cyan-300">
              <svg viewBox="0 0 24 24" className="h-6 w-6">
                <path
                  fill="currentColor"
                  d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4V7Z"
                />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">
              Multi-Signature
            </h3>
            <p className="mt-3 text-sm text-slate-400">
              Advanced multi-sig technology for enterprise-grade security
            </p>
          </article>

          <article className="min-h-[230px] rounded-2xl border border-white/5 bg-[#101018] p-8 shadow-[0_10px_30px_rgba(8,10,20,0.35)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#151a2a] text-cyan-300">
              <svg viewBox="0 0 24 24" className="h-6 w-6">
                <path
                  fill="currentColor"
                  d="M12 5c-5 0-9.27 3-11 7 1.73 4 6 7 11 7s9.27-3 11-7c-1.73-4-6-7-11-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
                />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">
              Full Transparency
            </h3>
            <p className="mt-3 text-sm text-slate-400">
              Open-source code audited by leading security firms
            </p>
          </article>

          <article className="min-h-[230px] rounded-2xl border border-white/5 bg-[#101018] p-8 shadow-[0_10px_30px_rgba(8,10,20,0.35)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#151a2a] text-cyan-300">
              <svg viewBox="0 0 24 24" className="h-6 w-6">
                <path
                  fill="currentColor"
                  d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Zm0 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"
                />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">
              Fully Compliant
            </h3>
            <p className="mt-3 text-sm text-slate-400">
              Licensed and regulated in multiple jurisdictions
            </p>
          </article>
        </div>

        <div className="mx-auto mt-10 flex flex-wrap justify-center gap-6 lg:max-w-6xl">
          <article className="w-full max-w-[300px] rounded-2xl border border-white/5 bg-[#101018] p-7 shadow-[0_10px_30px_rgba(8,10,20,0.35)]">
            <div className="flex items-center gap-1 text-cyan-300">
              {"★★★★★"}
            </div>
            <p className="mt-4 text-sm text-slate-400">
              &quot;VaultX has transformed how I manage my portfolio. The
              security features give me complete peace of mind.&quot;
            </p>
            <div className="mt-6">
              <div className="text-sm font-semibold text-white">Sarah Chen</div>
              <div className="text-xs text-slate-500">Crypto Investor</div>
            </div>
          </article>

          <article className="w-full max-w-[300px] rounded-2xl border border-white/5 bg-[#101018] p-7 shadow-[0_10px_30px_rgba(8,10,20,0.35)]">
            <div className="flex items-center gap-1 text-cyan-300">
              {"★★★★★"}
            </div>
            <p className="mt-4 text-sm text-slate-400">
              &quot;Lightning-fast transactions and the best rates in the
              market. VaultX is my go-to platform.&quot;
            </p>
            <div className="mt-6">
              <div className="text-sm font-semibold text-white">
                Michael Rodriguez
              </div>
              <div className="text-xs text-slate-500">Day Trader</div>
            </div>
          </article>

          <article className="w-full max-w-[300px] rounded-2xl border border-white/5 bg-[#101018] p-7 shadow-[0_10px_30px_rgba(8,10,20,0.35)]">
            <div className="flex items-center gap-1 text-cyan-300">
              {"★★★★★"}
            </div>
            <p className="mt-4 text-sm text-slate-400">
              &quot;The user experience is incredible. Finally, a crypto wallet
              that just works.&quot;
            </p>
            <div className="mt-6">
              <div className="text-sm font-semibold text-white">
                Emma Thompson
              </div>
              <div className="text-xs text-slate-500">DeFi Enthusiast</div>
            </div>
          </article>
        </div>
      </section>

      <StartJourneySection />
      <Footer />
    </div>
  );
}
