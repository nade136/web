import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import LiveChartWidget from "@/components/LiveChartWidget";
import { I18nProvider } from "@/lib/i18n/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Web3Vault | Your Gateway to the Decentralized Future",
    template: "%s | Web3Vault",
  },
  description:
    "Buy, sell, and store crypto securely in seconds. Web3Vault provides secure wallets, trading, and portfolio tools.",
  keywords: [
    "Web3Vault",
    "crypto wallet",
    "buy crypto",
    "sell crypto",
    "portfolio tracker",
    "DeFi",
  ],
  openGraph: {
    title: "Web3Vault | Your Gateway to the Decentralized Future",
    description:
      "Buy, sell, and store crypto securely in seconds. Web3Vault provides secure wallets, trading, and portfolio tools.",
    url: "/",
    siteName: "Web3Vault",
    images: [
      {
        url: "/images/logo1.jpeg",
        width: 512,
        height: 512,
        alt: "Web3Vault Logo",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Web3Vault",
    description:
      "Buy, sell, and store crypto securely in seconds. Web3Vault provides secure wallets, trading, and portfolio tools.",
    images: [
      {
        url: "/images/logo1.jpeg",
        alt: "Web3Vault Logo",
      },
    ],
  },
  icons: {
    icon: "/images/logo1.jpeg",
    shortcut: "/images/logo1.jpeg",
    apple: "/images/logo1.jpeg",
  },
  themeColor: "#0b0b12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          <SmoothScroll>{children}</SmoothScroll>
          <LiveChartWidget scope="public" />
        </I18nProvider>
      </body>
    </html>
  );
}
