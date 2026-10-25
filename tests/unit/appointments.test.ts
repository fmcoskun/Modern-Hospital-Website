import { describe, expect, it, vi } from "vitest";
import { buildIcs, escapeIcs } from "@/features/appointments/ics";
import { patientSchema } from "@/features/appointments/schema";

vi.stubEnv("APPOINTMENT_CONFLICT_RATE", "0");
const { createAppointmentAction, getSlotsAction } = await import("@/features/appointments/actions");

const validPatient = {
  firstName: "Deniz",
  lastName: "Örnek",
  phone: "0 (500) 000 12 34",
  email: "",
  birthYear: "1990",
  consent: true as const,
};

describe("patientSchema", () => {
  it("geçerli kurgusal hasta bilgisini kabul eder", () => {
    expect(patientSchema.safeParse(validPatient).success).toBe(true);
    expect(
      patientSchema.safeParse({ ...validPatient, phone: "05000001234", email: "d@ornek.example" })
        .success,
    ).toBe(true);
  });

  it.each([
    ["gerçek cep telefonu kalıbı (demo koruması)", { phone: "0 (532) 123 45 67" }, "phone"],
    ["boş ad", { firstName: " " }, "firstName"],
    ["rakam içeren soyad", { lastName: "Örnek1" }, "lastName"],
    ["geçersiz e-posta", { email: "yok@" }, "email"],
    ["gelecek doğum yılı", { birthYear: String(new Date().getFullYear() + 1) }, "birthYear"],
    ["onaysız aydınlatma", { consent: false }, "consent"],
  ])("%s reddedilir", (_, patch, field) => {
    const r = patientSchema.safeParse({ ...validPatient, ...patch });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]?.path[0]).toBe(field);
  });
});

describe("Server Actions", () => {
  it("slotlar yalnız seçilen bölüm/şube için, geçmiş saat olmadan döner", async () => {
    const res = await getSlotsAction({ departmentId: "d-kardiyoloji", branchId: "br-merkez" });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.slots.length).toBeGreaterThan(0);
    expect(
      res.slots.every((s) => s.departmentId === "d-kardiyoloji" && s.branchId === "br-merkez"),
    ).toBe(true);
    expect(res.slots.every((s) => Date.parse(s.startsAt) > Date.now())).toBe(true);
  });

  it("geçersiz slot isteği reddedilir", async () => {
    expect(await getSlotsAction({ departmentId: 42 })).toEqual({ ok: false });
  });

  it("randevu oluşturur; aynı idempotency anahtarı aynı sonucu verir", async () => {
    const slots = await getSlotsAction({ departmentId: "d-kardiyoloji", branchId: "br-merkez" });
    if (!slots.ok) throw new Error("slot yok");
    const slot = slots.slots.find((s) => s.available)!;
    const input = {
      idempotencyKey: crypto.randomUUID(),
      departmentId: slot.departmentId,
      branchId: slot.branchId,
      doctorId: slot.doctorId,
      startsAt: slot.startsAt,
      patient: validPatient,
    };
    const first = await createAppointmentAction(input);
    expect(first.ok).toBe(true);
    if (first.ok) expect(first.code).toMatch(/^FMC-[A-HJ-NP-Z2-9]{8}$/);
    expect(await createAppointmentAction(input)).toEqual(first);
  });

  it("dolu slot çakışma döner", async () => {
    const slots = await getSlotsAction({ departmentId: "d-kardiyoloji", branchId: "br-merkez" });
    if (!slots.ok) throw new Error("slot yok");
    const taken = slots.slots.find((s) => !s.available)!;
    const res = await createAppointmentAction({
      idempotencyKey: crypto.randomUUID(),
      departmentId: taken.departmentId,
      branchId: taken.branchId,
      doctorId: taken.doctorId,
      startsAt: taken.startsAt,
      patient: validPatient,
    });
    expect(res).toEqual({ ok: false, error: "conflict" });
  });

  it("sunucu doğrulaması istemciden bağımsız: hatalı hasta alanı ve beklenmeyen alan reddedilir", async () => {
    const base = {
      idempotencyKey: crypto.randomUUID(),
      departmentId: "d-kardiyoloji",
      branchId: "br-merkez",
      doctorId: "doc-01",
      startsAt: new Date(Date.now() + 86_400_000).toISOString(),
    };
    const bad = await createAppointmentAction({
      ...base,
      patient: { ...validPatient, phone: "0532 123 45 67" },
    });
    expect(bad).toEqual({ ok: false, error: "validation", fieldErrors: { phone: "phone" } });
    const extra = await createAppointmentAction({
      ...base,
      patient: validPatient,
      tcKimlik: "12345678901",
    });
    expect(extra).toEqual({ ok: false, error: "server" });
  });
});

describe("buildIcs", () => {
  const ics = buildIcs({
    uid: "FMC-ABCDEFGH",
    startsAt: "2027-01-04T06:00:00.000Z",
    endsAt: "2027-01-04T06:20:00.000Z",
    summary: "Kardiyoloji randevusu (demo); Ayşe, Karaca",
    description: "Kod: FMC-ABCDEFGH",
    location:
      "ÖZEL FMC HASTANESİ Merkez Kampüs, Örnek Mah. Şifa Cad. No: 1 (kurgusal adres), Ataşehir",
    now: new Date("2026-12-01T00:00:00Z"),
  });

  it("geçerli VCALENDAR yapısı ve UTC zamanlar", () => {
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
    expect(ics).toContain("DTSTART:20270104T060000Z");
    expect(ics).toContain("DTEND:20270104T062000Z");
    expect(ics).toContain("UID:FMC-ABCDEFGH@fmc-hastanesi.example");
  });

  it("özel karakterleri kaçışlar ve 75 oktet üstü satırları katlar", () => {
    expect(escapeIcs("a;b,c\nd")).toBe("a\\;b\\,c\\nd");
    for (const line of ics.split("\r\n"))
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    expect(ics).toMatch(/\r\n /);
  });
});
