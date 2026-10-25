import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3100);

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: `http://localhost:${PORT}`, trace: "on-first-retry" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    // Kritik akışlar diğer motorlarda (plan 13.1 "Tarayıcı uyumluluğu")
    { name: "firefox", use: { ...devices["Desktop Firefox"] }, testMatch: "flows.spec.ts" },
    { name: "webkit", use: { ...devices["Desktop Safari"] }, testMatch: "flows.spec.ts" },
    { name: "mobile-safari", use: { ...devices["iPhone 13"] }, testMatch: "flows.spec.ts" },
  ],
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    env: { APPOINTMENT_CONFLICT_RATE: "0" },
  },
});
