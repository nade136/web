"use client";

import { useState } from "react";

export default function StartJourneySection() {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  return (
    <section
      className="relative overflow-hidden py-28"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setPos({ x, y });
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[#0b0b12]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.25),rgba(17,13,28,0.85)_55%,rgba(11,11,18,1)_75%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(123,92,255,0.25),transparent_55%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(220px circle at ${pos.x}% ${pos.y}%, rgba(11, 11, 18, 0.65), transparent 70%)`,
        }}
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center">
        <h2 className="text-5xl font-black text-white sm:text-6xl md:text-7xl">
          <span className="block">
            Start Your <span className="text-[#25b8d5]">Crypto</span>
          </span>
          <span className="block">
            <span className="text-[#7b5cff]">Journey</span> Today
          </span>
        </h2>
        <p className="mt-5 text-base text-slate-400 sm:text-lg">
          Join millions of users who trust VaultX for their crypto needs. Get
          started in minutes.
        </p>
        <button className="mt-8 inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-cyan-400 to-violet-500 px-10 py-4 text-base font-semibold text-white shadow-[0_0_26px_rgba(45,212,255,0.5)] sm:text-lg">
          Launch VaultX
          <span className="text-xl leading-none">→</span>
        </button>

        <div className="mt-12 grid w-full max-w-4xl grid-cols-2 gap-8 text-center sm:grid-cols-4">
          <div>
            <div className="text-2xl font-semibold text-cyan-300">10M+</div>
            <div className="text-base text-slate-400">Active Users</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-cyan-300">$50B+</div>
            <div className="text-base text-slate-400">Assets Secured</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-cyan-300">150+</div>
            <div className="text-base text-slate-400">Countries</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-cyan-300">24/7</div>
            <div className="text-base text-slate-400">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
