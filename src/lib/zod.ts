import { z } from "zod";

// Zod v4 varsayılanda `new Function` ile JIT dener; CSP 'unsafe-eval' içermediği için
// tarayıcıda ihlal kaydı oluşur. jitless ile bu yoklama tamamen kapatılır (ADR 0003).
z.config({ jitless: true });

export { z };
