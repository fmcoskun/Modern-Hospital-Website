import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // jsx-a11y eklentisi next tarafından kaydediliyor; yalnız önerilen kuralları açıyoruz.
  { rules: jsxA11y.flatConfigs.recommended.rules },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/lib/data/**", "src/features/scene3d/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/content/*", "**/content/seed/*"],
              message: "Seed verisine yalnız @/lib/data üzerinden erişin.",
            },
            {
              group: ["three", "@react-three/*"],
              message: "3D kütüphaneleri yalnız features/scene3d içinde.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
