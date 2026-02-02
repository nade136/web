export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#15192e] dark:shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Profile
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-[#14172b] dark:text-slate-300">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Name
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              Admin User
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-[#14172b] dark:text-slate-300">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Email
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              admin@web3vault.app
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#15192e] dark:shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Preferences
        </h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
          {[
            "Enable notifications",
            "Require 2FA for admin actions",
            "Auto-lock after inactivity",
          ].map((item) => (
            <label
              key={item}
              className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-[#14172b]"
            >
              <span>{item}</span>
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 bg-transparent text-cyan-600 dark:border-white/20 dark:text-cyan-300"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
