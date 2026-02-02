export default function AdminWalletPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#15192e] dark:shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
          <span>Wallet Balance</span>
          <span className="text-cyan-600 dark:text-cyan-300">USD</span>
        </div>
        <div className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
          $0.00
        </div>
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          ~0.00000000 BTC
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {["Deposit", "Withdraw", "Send", "Receive"].map((action) => (
            <button
              key={action}
              className="rounded-full border border-slate-200/70 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-[#14172b] dark:text-slate-200"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#15192e] dark:shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Saved Wallets
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["Primary Wallet", "Trading Wallet", "Savings Wallet"].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-[#14172b] dark:text-slate-300"
            >
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {item}
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Last used 2 minutes ago
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
