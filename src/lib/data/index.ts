import "server-only";
import { env } from "@/lib/env";
import { mockDataSource } from "./mock";
import type { DataSource } from "./repositories";

const notImplemented = new Proxy({} as DataSource, {
  get(_, repo) {
    throw new Error(`DATA_SOURCE=api henüz uygulanmadı (${String(repo)}). Bkz. docs/adr/0001.`);
  },
});

/** Sayfaların tek veri giriş noktası. */
export const data: DataSource = env.DATA_SOURCE === "mock" ? mockDataSource : notImplemented;

export type * from "./types";
export type { DataSource } from "./repositories";
