import { Inter } from "next/font/google";

// Tek yazı tipi: Inter. next/font build sırasında self-host eder;
// istemciden Google'a istek gitmez (KVKK, plan 6.3). Değişken font: 400–700 dahil tüm ağırlıklar.
export const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});
