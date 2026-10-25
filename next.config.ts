import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Nonce'suz sıkı CSP (ADR 0003): nonce tabanlı CSP tüm sayfaları dinamik render'a zorlar ve
 * Cache Components/PPR ile uyumsuzdur. 'unsafe-inline' yalnız Next'in satır içi RSC/bootstrap
 * betikleri için gereklidir; üçüncü taraf betik yoktur, dış istekler tek tek beyaz listededir.
 */
export const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  // Onaylı harita gömmesi (lokasyon sayfaları)
  "frame-src https://www.openstreetmap.org",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

export const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(self), payment=(), usb=(), interest-cohort=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  experimental: { globalNotFound: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    const demo = process.env.DEMO_MODE !== "false";
    return [
      {
        source: "/:path*",
        headers: demo
          ? [...securityHeaders, { key: "X-Robots-Tag", value: "noindex, nofollow" }]
          : securityHeaders,
      },
    ];
  },
};

export default nextConfig;
