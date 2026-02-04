"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useI18n } from "@/lib/i18n/I18nProvider";

const coins = [
  { name: "Bitcoin", symbol: "BTC", price: "$42,568.42", change: "+2.34%", up: true },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: "$3,456.78",
    change: "-1.23%",
    up: false,
    active: true,
  },
  { name: "Solana", symbol: "SOL", price: "$142.34", change: "+5.67%", up: true },
  { name: "Cardano", symbol: "ADA", price: "$0.58", change: "+3.45%", up: true },
  { name: "Avalanche", symbol: "AVAX", price: "$38.92", change: "-0.89%", up: false },
  { name: "Polkadot", symbol: "DOT", price: "$7.23", change: "+1.72%", up: true },
];

export default function LivePricesSection() {
  const { t } = useI18n();
  return (
    <section className="mx-auto w-full max-w-7xl overflow-hidden px-6 pb-28 pt-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          {t("live.title.prefix")} <span className="text-[#25b8d5]">{t("live.title.highlight1")}</span>{" "}
          <span className="text-[#7b5cff]">{t("live.title.highlight2")}</span>
        </h2>
        <p className="mt-3 text-sm text-slate-400 sm:text-base">
          {t("live.subtitle")}
        </p>
      </div>

      <div className="mt-10">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={5}
          spaceBetween={24}
          loop
          speed={9000}
          autoplay={{ delay: 0, disableOnInteraction: false }}
          grabCursor
          className="pb-6"
          breakpoints={{
            0: { slidesPerView: 1.2 },
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 4.2 },
            1280: { slidesPerView: 5 },
          }}
        >
          {coins.map((coin) => (
            <SwiperSlide key={coin.symbol}>
              <div
                className="h-full rounded-2xl border border-white/5 bg-[#101018] p-6 shadow-[0_10px_30px_rgba(8,10,20,0.35)] transition-colors duration-300 hover:border-[#5b45ba]"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{coin.name}</span>
                  <span
                    className={`font-semibold ${
                      coin.up ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {coin.up ? "↗" : "↘"} {coin.change}
                  </span>
                </div>
                <div className="mt-3 text-sm font-semibold text-cyan-300">
                  {coin.symbol}
                </div>
                <div className="mt-3 text-2xl font-semibold text-white">
                  {coin.price}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
