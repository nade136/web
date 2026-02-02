export const tokens = [
  { name: "Aave", symbol: "AAVE", price: "$125.89" },
  { name: "Algorand", symbol: "ALGO", price: "$0.103" },
  { name: "Aptos", symbol: "APT", price: "$1.27" },
  { name: "Aster", symbol: "ASTER", price: "$0.542" },
  { name: "Avalanche", symbol: "AVAX", price: "$10.07" },
  { name: "BFUSD", symbol: "BFUSD", price: "$0.999" },
  { name: "Binance Bridged USDC", symbol: "USDC", price: "$1" },
  { name: "Binance Bridged USDT", symbol: "USDT", price: "$0.999" },
];

export const tokenNetworks: Record<string, string[]> = {
  AAVE: [
    "ethereum",
    "base",
    "hydration",
    "harmony-shard-0",
    "huobi-token",
    "fantom",
    "near-protocol",
    "energi",
    "sora",
    "avalanche",
    "polygon-pos",
    "binance-smart-chain",
    "arbitrum-one",
    "optimistic-ethereum",
  ],
  ALGO: ["algorand"],
  APT: ["aptos"],
  ASTER: ["bsc", "ethereum"],
  AVAX: ["avalanche", "c-chain"],
  BFUSD: ["ethereum", "bsc"],
  USDC: ["ethereum", "polygon", "arbitrum", "base"],
  USDT: ["ethereum", "tron", "bsc", "polygon"],
};

export const walletAddresses: Record<string, Record<string, string>> = {
  AAVE: {
    ethereum: "0x8f2A3b1d4A1b94B0b6d5c2F2dA61b2e9b7f45cA1",
    base: "0x1dA0cBf37C3D2E5b2A3D9f1B2c7E3A1e9d4F5b6C",
  },
  USDC: {
    ethereum: "0xF3b1D2a4C5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0",
    polygon: "0xA1b2C3D4e5F60718293aBcD4e5F60718293aBcD4",
  },
  USDT: {
    tron: "TRy7u2yJp9eQd9b7Czqk3Q5ZsM7eH1a9tL",
  },
};
