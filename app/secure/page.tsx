import Image from "next/image";

import Navbar from "../components/Navbar";

export default function SecurePage() {
  return (
    <div className="min-h-screen bg-[#0b0b12] text-white">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            <span className="block">Connect Your Wallet.</span>
            <span className="block">
              <span className="text-[#2dd4f8]">Enter the</span>{" "}
              <span className="bg-linear-to-r from-[#f4b9df] to-[#de6dae] bg-clip-text text-transparent">
                Decentralized
              </span>{" "}
              <span className="text-[#f472b6]">World</span>
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold text-slate-400 sm:text-lg">
            Securely access your digital assets, manage your tokens, and explore
            Web3Vault&apos;s decentralized features — all in one connection.
          </p>
          <a
            href="/connect-wallet"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-linear-to-r from-cyan-400 to-blue-500 px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
          >
            Connect Wallet
          </a>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="transition duration-300 ease-out hover:-translate-y-1">
            <Image
              src="/images/secure-wallet.png"
              alt="Secure wallet illustration"
              width={640}
              height={420}
              className="h-auto w-[480px] sm:w-[560px]"
              priority
            />
          </div>
        </div>
      </main>

      <section className="bg-[#0f1122] py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Why Connect Your Wallet?
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl bg-[#15192e] p-6 text-center shadow-[0_12px_30px_rgba(6,10,22,0.45)] ring-1 ring-white/5 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(6,10,22,0.6)]">
              <div className="text-sm font-semibold text-cyan-300">
                Seamless Access
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Instantly access your decentralized identity and digital assets
                in seconds.
              </p>
            </article>

            <article className="rounded-2xl bg-[#15192e] p-6 text-center shadow-[0_12px_30px_rgba(6,10,22,0.45)] ring-1 ring-white/5 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(6,10,22,0.6)]">
              <div className="text-sm font-semibold text-cyan-300">
                Enhanced Security
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Your assets stay under your control. We never store private keys
                or credentials.
              </p>
            </article>

            <article className="rounded-2xl bg-[#15192e] p-6 text-center shadow-[0_12px_30px_rgba(6,10,22,0.45)] ring-1 ring-white/5 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(6,10,22,0.6)]">
              <div className="text-sm font-semibold text-cyan-300">
                Unified Experience
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Use one connection to access NFTs, DeFi, staking, and crypto
                tools.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              How It Works
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl bg-[#15192e] p-6 text-center shadow-[0_12px_30px_rgba(6,10,22,0.45)] ring-1 ring-white/5 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(6,10,22,0.6)]">
              <div className="text-2xl font-bold text-[#f472b6]">1</div>
              <div className="mt-4 text-sm font-semibold text-cyan-300">
                Choose Your Wallet
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Select from trusted providers like MetaMask, WalletConnect, or
                Coinbase Wallet.
              </p>
            </article>

            <article className="rounded-2xl bg-[#15192e] p-6 text-center shadow-[0_12px_30px_rgba(6,10,22,0.45)] ring-1 ring-white/5 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(6,10,22,0.6)]">
              <div className="text-2xl font-bold text-[#f472b6]">2</div>
              <div className="mt-4 text-sm font-semibold text-cyan-300">
                Authorize Connection
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Your wallet will ask for permission to connect securely and
                transparently.
              </p>
            </article>

            <article className="rounded-2xl bg-[#15192e] p-6 text-center shadow-[0_12px_30px_rgba(6,10,22,0.45)] ring-1 ring-white/5 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(6,10,22,0.6)]">
              <div className="text-2xl font-bold text-[#f472b6]">3</div>
              <div className="mt-4 text-sm font-semibold text-cyan-300">
                Start Exploring
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Access all your Web3Vault tools, from staking to asset recovery.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[#0f1122] py-16">
        <div className="mx-auto w-full max-w-5xl px-6 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to Secure Your Web3 Experience?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 sm:text-base">
            Connect your wallet today and unlock the full power of decentralized
            finance, ownership, and asset security with Web3Vault.
          </p>
          <a
            href="/connect-wallet"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-linear-to-r from-pink-400 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_0_18px_rgba(56,189,248,0.35)]"
          >
            Connect Wallet Now
          </a>
        </div>
      </section>
    </div>
  );
}
