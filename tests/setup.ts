import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, expect, vi } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);
afterEach(() => cleanup());

// server-only, istemci dışı modülleri testte içe aktarabilmek için etkisizleştirilir.
vi.mock("server-only", () => ({}));
