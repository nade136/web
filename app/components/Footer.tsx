export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0b0b12]">
      <div className="mx-auto w-full max-w-7xl px-6 pb-10 pt-12">
        <div className="grid gap-10 lg:grid-cols-4">
          <div>
            <div className="text-xl font-semibold text-cyan-300">Web3Vault</div>
            <p className="mt-4 max-w-xs text-base text-slate-400">
              Your gateway to the decentralized future. Secure, fast, and
              reliable crypto wallet.
            </p>
          </div>

          <div>
            <div className="text-base font-semibold text-white">Product</div>
            <ul className="mt-4 space-y-3 text-base text-slate-400">
              <li>Features</li>
              <li>Security</li>
              <li>Pricing</li>
              <li>API</li>
            </ul>
          </div>

          <div>
            <div className="text-base font-semibold text-white">Company</div>
            <ul className="mt-4 space-y-3 text-base text-slate-400">
              <li>About</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <div className="text-base font-semibold text-white">Legal</div>
            <ul className="mt-4 space-y-3 text-base text-slate-400">
              <li>FAQ</li>
              <li>Terms</li>
              <li>Privacy</li>
              <li>Licenses</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-sm text-slate-500">
          © 2025 VaultX. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
