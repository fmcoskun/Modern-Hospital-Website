"use client";

import { MaterialIcon } from "@/components/ui/Icon";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  use,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Alert, Badge, DemoBadge, Skeleton } from "@/components/ui/Feedback";
import { RadioCard, TextField } from "@/components/ui/Form";
import { StepIndicator } from "@/components/ui/Layout";
import type { Dictionary } from "@/i18n";
import { format } from "@/i18n/format";
import { cn } from "@/lib/cn";
import type { Slot } from "@/lib/data/types";
import { routes } from "@/lib/routes";
import { matchesQuery } from "@/lib/text";
import { createAppointmentAction, getSlotsAction } from "./actions";
import { buildIcs } from "./ics";
import type { PatientInput } from "./schema";

export interface WizardCatalog {
  branches: {
    id: string;
    slug: string;
    name: string;
    address: string;
    hasEmergency: boolean;
    geo: { lat: number; lng: number };
  }[];
  departments: { id: string; slug: string; name: string; group: string; branchIds: string[] }[];
  doctors: {
    id: string;
    slug: string;
    name: string;
    departmentId: string;
    branchIds: string[];
    interests: string[];
  }[];
  callCenter: string;
  callCenterHref: string;
}

export interface WizardLabels {
  a: Dictionary["appointment"];
  common: Dictionary["common"];
  weekdaysShort: string[];
}

type Success = {
  code: string;
  startsAt: string;
  endsAt: string;
  doctorId: string;
  branchId: string;
  departmentId: string;
};

interface State {
  branchId?: string;
  departmentId?: string;
  /** "any" = fark etmez */
  doctorId?: string;
  slot?: { startsAt: string; endsAt: string; doctorId: string };
  patient?: PatientInput;
  result?: Success;
  idempotencyKey: string;
}

type Action =
  | { type: "branch"; id: string; catalog: WizardCatalog }
  | { type: "department"; id: string }
  | { type: "doctor"; id: string }
  | { type: "slot"; slot: State["slot"] }
  | { type: "patient"; patient: PatientInput }
  | { type: "result"; result: Success }
  | { type: "conflict" }
  | { type: "reset" };

const newKey = () => crypto.randomUUID();

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "branch": {
      // Bölüm bu şubede yoksa sonraki seçimler sıfırlanır.
      const dept = a.catalog.departments.find((d) => d.id === s.departmentId);
      const keepDept = dept?.branchIds.includes(a.id);
      return keepDept
        ? { ...s, branchId: a.id, slot: undefined, idempotencyKey: newKey() }
        : {
            ...s,
            branchId: a.id,
            departmentId: undefined,
            doctorId: undefined,
            slot: undefined,
            idempotencyKey: newKey(),
          };
    }
    case "department":
      return s.departmentId === a.id
        ? s
        : {
            ...s,
            departmentId: a.id,
            doctorId: undefined,
            slot: undefined,
            idempotencyKey: newKey(),
          };
    case "doctor":
      return s.doctorId === a.id
        ? s
        : { ...s, doctorId: a.id, slot: undefined, idempotencyKey: newKey() };
    case "slot":
      return { ...s, slot: a.slot, idempotencyKey: newKey() };
    case "patient":
      return { ...s, patient: a.patient };
    case "result":
      return { ...s, result: a.result };
    case "conflict":
      return { ...s, slot: undefined, idempotencyKey: newKey() };
    case "reset":
      return { idempotencyKey: newKey() };
  }
}

// Form kütüphaneleri (React Hook Form + Zod) yalnız bilgiler adımında yüklenir (ilk yük/TBT).
const PatientStep = dynamic(() => import("./PatientStep").then((m) => m.PatientStep), {
  loading: () => <Skeleton className="h-96" />,
});

const STORAGE_KEY = "fmc-demo-randevu";

/**
 * İlk URL parametreleri. Doğrudan açılışta (prerender edilmiş kabuk) useSearchParams ilk render'da
 * boş gelebilir; istemci navigasyonunda ise window.location henüz eski sayfayı gösterir.
 * Bu yüzden önce useSearchParams, boşsa tarayıcı URL'si kullanılır (ClientOnly altında güvenli).
 */
function initialParams(searchParams: URLSearchParams): URLSearchParams {
  return searchParams.size > 0
    ? new URLSearchParams(searchParams)
    : new URLSearchParams(window.location.search);
}
const STEP_IDS = [
  "branch",
  "department",
  "doctor",
  "datetime",
  "patient",
  "summary",
  "confirm",
  "result",
] as const;

/** Kişisel alanlar (patient) sessionStorage'a yazılmaz (plan T08). */
function persist(s: State) {
  try {
    const { patient: _omit, ...rest } = s;
    void _omit;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {
    /* gizli sekme vb. — kalıcılık isteğe bağlı */
  }
}

function restore(): Partial<State> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<State>) : {};
  } catch {
    return {};
  }
}

function maxReachable(s: State): number {
  if (s.result) return 7;
  if (!s.branchId) return 0;
  if (!s.departmentId) return 1;
  if (!s.doctorId) return 2;
  if (!s.slot) return 3;
  if (!s.patient) return 4;
  return 6;
}

const tz = "Europe/Istanbul";
const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(
    new Date(iso),
  );
const fmtDateLong = (iso: string) =>
  new Intl.DateTimeFormat("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: tz,
  }).format(new Date(iso));
const istanbulDay = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date(iso));

export function Wizard({ catalog, labels }: { catalog: WizardCatalog; labels: WizardLabels }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { a } = labels;

  // İlk durum: sessionStorage + URL ön seçimleri (bölüm/doktor/şube sayfalarından gelen).
  const [state, dispatch] = useReducer(reducer, null, (): State => {
    const initial = initialParams(searchParams);
    const saved = restore();
    const s: State = { idempotencyKey: newKey(), ...saved, patient: undefined };
    // Tamamlanmış eski randevu yalnız sonuç adımındayken (ör. sayfa yenileme) geri gelir.
    if (s.result && initial.get("adim") !== String(STEP_IDS.length)) {
      s.result = undefined;
      s.slot = undefined;
    }
    const doc = catalog.doctors.find((d) => d.slug === initial.get("doktor"));
    const dept =
      catalog.departments.find((d) => d.slug === initial.get("bolum")) ??
      catalog.departments.find((d) => d.id === doc?.departmentId);
    const branch = catalog.branches.find((b) => b.slug === initial.get("sube"));
    if (dept || doc || branch) {
      s.result = undefined;
      s.slot = undefined;
      s.departmentId = dept?.id;
      s.doctorId = doc?.id;
      const candidates = doc?.branchIds ?? dept?.branchIds ?? catalog.branches.map((b) => b.id);
      s.branchId =
        branch && candidates.includes(branch.id)
          ? branch.id
          : candidates.length === 1
            ? candidates[0]
            : undefined;
    }
    return s;
  });

  const requested = Math.max(1, Number(searchParams.get("adim")) || 1) - 1;
  const step = Math.min(requested, maxReachable(state));
  const [flash, setFlash] = useState<"conflict" | "server" | null>(null);

  useEffect(() => persist(state), [state]);

  // Ön seçimle gelindiyse (bölüm/doktor/şube sayfalarından) ilk eksik adıma atla; parametreler URL'den temizlenir.
  const [cameWithPreselect] = useState(() => {
    const p = initialParams(searchParams);
    return p.has("bolum") || p.has("doktor") || p.has("sube");
  });
  const startStep = useRef(maxReachable(state));
  // Tek seferlik: cacheComponents (Activity) geri/ileri gezinmede efektleri yeniden çalıştırır.
  const preselectApplied = useRef(false);
  useEffect(() => {
    if (!cameWithPreselect || preselectApplied.current) return;
    preselectApplied.current = true;
    router.replace(`${pathname}?adim=${startStep.current + 1}`, { scroll: false });
  }, [cameWithPreselect, pathname, router]);

  // URL'deki adım henüz erişilemezse (ör. elle yazılmış ?adim=6) ulaşılabilir son adıma düzelt.
  useEffect(() => {
    if (requested > step) router.replace(`${pathname}?adim=${step + 1}`, { scroll: false });
  }, [requested, step, pathname, router]);

  // Adım değişince odak adım başlığına (plan 5.2 erişilebilir akış).
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const go = (n: number) => router.push(`${pathname}?adim=${n + 1}`, { scroll: false });
  const next = () => {
    setFlash(null);
    go(step + 1);
  };

  const branch = catalog.branches.find((b) => b.id === state.branchId);
  const dept = catalog.departments.find((d) => d.id === state.departmentId);
  const doctorName = (id?: string) => catalog.doctors.find((d) => d.id === id)?.name;

  const steps = STEP_IDS.map((id) => ({ id, label: a.steps[id] }));
  const titles = [
    a.branchTitle,
    a.departmentTitle,
    a.doctorTitle,
    a.datetimeTitle,
    a.patientTitle,
    a.summaryTitle,
    a.confirmTitle,
    a.resultTitle,
  ];

  const nav = (canNext: boolean, nextLabel = labels.common.next) => (
    <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-subtle pt-6">
      {step > 0 ? (
        <Button variant="ghost" onClick={() => go(step - 1)}>
          ← {labels.common.back}
        </Button>
      ) : (
        <span />
      )}
      <Button onClick={next} disabled={!canNext}>
        {nextLabel} →
      </Button>
    </div>
  );

  let body: ReactNode;
  switch (step) {
    case 0: {
      const options = dept
        ? catalog.branches.filter((b) => dept.branchIds.includes(b.id))
        : catalog.branches;
      body = (
        <>
          <fieldset>
            <legend className="sr-only">{titles[0]}</legend>
            <div className="grid gap-3 md:grid-cols-3">
              {options.map((b) => (
                <RadioCard
                  key={b.id}
                  name="branch"
                  value={b.id}
                  checked={state.branchId === b.id}
                  onChange={(id) => dispatch({ type: "branch", id, catalog })}
                  icon={<MaterialIcon name="location_on" />}
                  title={b.name}
                  description={
                    <>
                      {b.address}
                      {b.hasEmergency && (
                        <span className="mt-2 block">
                          <Badge tone="danger">
                            <MaterialIcon name="emergency" size={14} /> {labels.common.emergency}{" "}
                            7/24
                          </Badge>
                        </span>
                      )}
                    </>
                  }
                />
              ))}
            </div>
          </fieldset>
          {nav(Boolean(state.branchId))}
        </>
      );
      break;
    }
    case 1:
      body = (
        <>
          <DepartmentStep
            departments={catalog.departments.filter((d) => d.branchIds.includes(state.branchId!))}
            selected={state.departmentId}
            onSelect={(id) => dispatch({ type: "department", id })}
            labels={labels}
            callCenter={catalog.callCenter}
            callCenterHref={catalog.callCenterHref}
          />
          {nav(Boolean(state.departmentId))}
        </>
      );
      break;
    case 2: {
      const doctors = catalog.doctors.filter(
        (d) => d.departmentId === state.departmentId && d.branchIds.includes(state.branchId!),
      );
      body = (
        <>
          <fieldset>
            <legend className="sr-only">{titles[2]}</legend>
            <div className="grid gap-3 md:grid-cols-2">
              <RadioCard
                name="doctor"
                value="any"
                checked={state.doctorId === "any"}
                onChange={(id) => dispatch({ type: "doctor", id })}
                icon={<MaterialIcon name="event_available" />}
                title={a.anyDoctor}
                description={a.anyDoctorHint}
              />
              {doctors.map((d) => (
                <RadioCard
                  key={d.id}
                  name="doctor"
                  value={d.id}
                  checked={state.doctorId === d.id}
                  onChange={(id) => dispatch({ type: "doctor", id })}
                  title={d.name}
                  description={d.interests.slice(0, 2).join(" · ")}
                />
              ))}
            </div>
          </fieldset>
          {nav(Boolean(state.doctorId))}
        </>
      );
      break;
    }
    case 3:
      body = (
        <>
          {flash === "conflict" && (
            <Alert tone="warning" role="alert" className="mb-6">
              {a.conflict}
            </Alert>
          )}
          <SlotStep
            request={{
              departmentId: state.departmentId!,
              branchId: state.branchId!,
              doctorId: state.doctorId === "any" ? undefined : state.doctorId,
            }}
            selected={state.slot?.startsAt}
            selectedDoctor={state.slot?.doctorId}
            onSelect={(slot) => dispatch({ type: "slot", slot })}
            showDoctor={state.doctorId === "any"}
            doctorName={doctorName}
            labels={labels}
          />
          {nav(Boolean(state.slot))}
        </>
      );
      break;
    case 4:
      body = (
        <PatientStep
          labels={labels}
          defaults={state.patient}
          onBack={() => go(3)}
          onValid={(patient) => {
            dispatch({ type: "patient", patient });
            next();
          }}
        />
      );
      break;
    case 5:
      body = (
        <>
          <dl className="divide-y divide-subtle rounded-card border border-subtle bg-raised">
            {[
              { label: a.summaryLabels.branch, value: branch?.name, step: 0 },
              { label: a.summaryLabels.department, value: dept?.name, step: 1 },
              { label: a.summaryLabels.doctor, value: doctorName(state.slot?.doctorId), step: 2 },
              {
                label: a.summaryLabels.datetime,
                value:
                  state.slot &&
                  `${fmtDateLong(state.slot.startsAt)}, ${fmtTime(state.slot.startsAt)}`,
                step: 3,
              },
              {
                label: a.summaryLabels.patient,
                value: state.patient && `${state.patient.firstName} ${state.patient.lastName}`,
                step: 4,
              },
              { label: a.summaryLabels.phone, value: state.patient?.phone, step: 4 },
            ].map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 px-5 py-4"
              >
                <dt className="text-sm text-ink-muted">{row.label}</dt>
                <dd className="col-start-1 font-semibold">{row.value}</dd>
                <dd className="col-start-2 row-span-2 row-start-1">
                  <button
                    type="button"
                    onClick={() => go(row.step)}
                    className="min-h-11 rounded px-2 font-semibold text-brand-600 underline underline-offset-4 focus-ring"
                  >
                    {labels.common.change}
                    <span className="sr-only">: {row.label}</span>
                  </button>
                </dd>
              </div>
            ))}
          </dl>
          {nav(true)}
        </>
      );
      break;
    case 6:
      body = (
        <ConfirmStep
          labels={labels}
          flash={flash}
          onBack={() => go(5)}
          onCreate={async () => {
            setFlash(null);
            const res = await createAppointmentAction({
              idempotencyKey: state.idempotencyKey,
              departmentId: state.departmentId,
              branchId: state.branchId,
              doctorId: state.slot!.doctorId,
              startsAt: state.slot!.startsAt,
              patient: state.patient,
            }).catch(() => ({ ok: false as const, error: "server" as const }));
            if (res.ok) {
              dispatch({ type: "result", result: res });
              go(7);
            } else if (res.error === "conflict") {
              dispatch({ type: "conflict" });
              setFlash("conflict");
              go(3);
            } else {
              setFlash("server");
            }
          }}
        />
      );
      break;
    default:
      body = state.result && (
        <ResultStep
          result={state.result}
          labels={labels}
          branch={catalog.branches.find((b) => b.id === state.result!.branchId)}
          deptName={
            catalog.departments.find((d) => d.id === state.result!.departmentId)?.name ?? ""
          }
          doctorName={doctorName(state.result.doctorId) ?? ""}
          onNew={() => {
            dispatch({ type: "reset" });
            go(0);
          }}
        />
      );
  }

  return (
    <div>
      <StepIndicator label={a.progress} steps={steps} current={step} />
      <p className="mt-6 text-sm font-semibold text-ink-muted">
        {format(a.stepOf, { n: step + 1, total: steps.length })}
      </p>
      <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-h2 focus:outline-none">
        {titles[step]}
      </h2>
      <div className="mt-6">{body}</div>
      {step < 7 && (
        <p className="mt-8 flex items-center gap-2 text-sm text-ink-muted">
          <MaterialIcon name="call" size={16} />
          <a
            href={catalog.callCenterHref}
            className="rounded underline-offset-4 focus-ring hover:underline"
          >
            {format(a.callAlt, { phone: catalog.callCenter })}
          </a>
        </p>
      )}
    </div>
  );
}

function DepartmentStep({
  departments,
  selected,
  onSelect,
  labels,
  callCenter,
  callCenterHref,
}: {
  departments: WizardCatalog["departments"];
  selected?: string;
  onSelect: (id: string) => void;
  labels: WizardLabels;
  callCenter: string;
  callCenterHref: string;
}) {
  const [q, setQ] = useState("");
  const [help, setHelp] = useState(false);
  const filtered = departments.filter((d) => matchesQuery([d.name, d.group], q));
  const groups = [...new Set(filtered.map((d) => d.group))];
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <TextField
          label={labels.a.departmentSearch}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1"
        />
        <Button variant="ghost" aria-expanded={help} onClick={() => setHelp((h) => !h)}>
          {labels.a.notSure}
        </Button>
      </div>
      {help && (
        <Alert tone="info" className="mt-4">
          <p>{labels.a.notSureBody}</p>
          <a
            href={callCenterHref}
            className="mt-1 inline-flex min-h-11 items-center gap-2 rounded font-semibold underline focus-ring"
          >
            <MaterialIcon name="call" size={16} /> {callCenter}
          </a>
        </Alert>
      )}
      <fieldset className="mt-6 space-y-6">
        <legend className="sr-only">{labels.a.departmentTitle}</legend>
        {groups.map((g) => (
          <div key={g}>
            <p className="mb-2 text-sm font-semibold tracking-wide text-ink-muted uppercase">{g}</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered
                .filter((d) => d.group === g)
                .map((d) => (
                  <RadioCard
                    key={d.id}
                    name="department"
                    value={d.id}
                    checked={selected === d.id}
                    onChange={onSelect}
                    title={d.name}
                  />
                ))}
            </div>
          </div>
        ))}
      </fieldset>
    </div>
  );
}

type SlotResult = { ok: true; slots: Slot[] } | { ok: false };

function SlotStep(props: {
  request: { departmentId: string; branchId: string; doctorId?: string };
  selected?: string;
  selectedDoctor?: string;
  onSelect: (slot: { startsAt: string; endsAt: string; doctorId: string }) => void;
  showDoctor: boolean;
  doctorName: (id?: string) => string | undefined;
  labels: WizardLabels;
}) {
  const [attempt, setAttempt] = useState(0);
  const { departmentId, branchId, doctorId } = props.request;
  // React 19: Server Action sözü Suspense + use() ile okunur; bağımlılık değişince yeniden istenir.
  const promise = useMemo<Promise<SlotResult>>(
    () =>
      getSlotsAction({ departmentId, branchId, doctorId }).catch(() => ({ ok: false as const })),
    // attempt: "Tekrar dene" yeni istek üretir
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [departmentId, branchId, doctorId, attempt],
  );
  return (
    <Suspense
      fallback={
        <div aria-busy="true">
          <p role="status" className="sr-only">
            {props.labels.a.slotsLoading}
          </p>
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 7 }, (_, i) => (
              <Skeleton key={i} className="h-20 w-20 shrink-0" />
            ))}
          </div>
          <Skeleton className="mt-6 h-40" />
        </div>
      }
    >
      <SlotGrid {...props} promise={promise} onRetry={() => setAttempt((n) => n + 1)} />
    </Suspense>
  );
}

function SlotGrid({
  promise,
  onRetry,
  selected,
  selectedDoctor,
  onSelect,
  showDoctor,
  doctorName,
  labels,
}: {
  promise: Promise<SlotResult>;
  onRetry: () => void;
  selected?: string;
  selectedDoctor?: string;
  onSelect: (slot: { startsAt: string; endsAt: string; doctorId: string }) => void;
  showDoctor: boolean;
  doctorName: (id?: string) => string | undefined;
  labels: WizardLabels;
}) {
  const res = use(promise);
  const a = labels.a;
  const slots = useMemo(() => (res.ok ? res.slots.filter((s) => s.available) : []), [res]);
  const days = useMemo(() => {
    const today = istanbulDay(new Date().toISOString());
    return Array.from({ length: 14 }, (_, i) => {
      const date = new Date(Date.parse(`${today}T12:00:00+03:00`) + i * 86_400_000);
      const key = istanbulDay(date.toISOString());
      return { key, date, count: slots.filter((s) => istanbulDay(s.startsAt) === key).length };
    });
  }, [slots]);
  const initialDay = (selected && istanbulDay(selected)) || days.find((d) => d.count > 0)?.key;
  const [day, setDay] = useState(initialDay);

  if (!res.ok) {
    return (
      <Alert tone="error" role="alert">
        <p>{a.slotsError}</p>
        <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
          {a.retry}
        </Button>
      </Alert>
    );
  }

  const daySlots = slots.filter((s) => istanbulDay(s.startsAt) === day);
  const dayLabel = days.find((d) => d.key === day);

  return (
    <div>
      <div
        role="group"
        aria-label={a.days}
        className="relative -mx-1 flex gap-2 overflow-x-auto px-1 pb-3"
      >
        {days.map((d) => {
          const isSel = d.key === day;
          const weekday = labels.weekdaysShort[(d.date.getUTCDay() + 6) % 7];
          return (
            <button
              key={d.key}
              type="button"
              disabled={d.count === 0}
              aria-pressed={isSel}
              onClick={() => setDay(d.key)}
              className={cn(
                "flex min-h-20 w-20 shrink-0 flex-col items-center justify-center rounded-input border text-sm focus-ring",
                isSel
                  ? "border-2 border-brand-600 bg-brand-600 text-inverse"
                  : "border-control bg-raised hover:bg-brand-100",
                d.count === 0 &&
                  "cursor-not-allowed border-dashed bg-sunken text-ink-muted hover:bg-sunken",
              )}
            >
              <span className="font-semibold">{weekday}</span>
              <span className="text-lg font-semibold">{d.date.getUTCDate()}</span>
              {d.count === 0 ? (
                <span className="text-[0.7rem] leading-tight">{a.noSlotsDay}</span>
              ) : (
                <span className="sr-only">{d.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {daySlots.length === 0 ? (
        <Alert tone="info" className="mt-4">
          {a.noSlots}
        </Alert>
      ) : (
        <fieldset className="mt-4">
          <legend className="mb-3 font-semibold">
            {dayLabel && format(a.slotsFor, { date: fmtDateLong(dayLabel.date.toISOString()) })}
          </legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {daySlots.map((s) => {
              const isSel = s.startsAt === selected && s.doctorId === selectedDoctor;
              return (
                <button
                  key={`${s.doctorId}-${s.startsAt}`}
                  type="button"
                  aria-pressed={isSel}
                  onClick={() =>
                    onSelect({ startsAt: s.startsAt, endsAt: s.endsAt, doctorId: s.doctorId })
                  }
                  className={cn(
                    "min-h-11 rounded-input border px-3 py-2 text-left focus-ring",
                    isSel
                      ? "border-2 border-brand-600 bg-brand-600 text-inverse"
                      : "border-control bg-raised hover:bg-brand-100",
                  )}
                >
                  <span className="block font-semibold">
                    {isSel && <span aria-hidden="true">✓ </span>}
                    {fmtTime(s.startsAt)}
                  </span>
                  {showDoctor && (
                    <span
                      className={cn("block text-xs", isSel ? "text-inverse" : "text-ink-muted")}
                    >
                      {doctorName(s.doctorId)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
}

function ConfirmStep({
  labels,
  flash,
  onCreate,
  onBack,
}: {
  labels: WizardLabels;
  flash: "conflict" | "server" | null;
  onCreate: () => Promise<void>;
  onBack: () => void;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <div>
      <Alert tone="info">
        <p>{labels.a.confirmBody}</p>
      </Alert>
      {flash === "server" && (
        <Alert tone="error" role="alert" className="mt-4">
          {labels.a.serverError}
        </Alert>
      )}
      <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-subtle pt-6">
        <Button variant="ghost" onClick={onBack} disabled={pending}>
          ← {labels.common.back}
        </Button>
        <Button
          size="lg"
          loading={pending}
          loadingText={labels.a.creating}
          onClick={() => startTransition(onCreate)}
        >
          {labels.a.create}
        </Button>
      </div>
    </div>
  );
}

function ResultStep({
  result,
  labels,
  branch,
  deptName,
  doctorName,
  onNew,
}: {
  result: Success;
  labels: WizardLabels;
  branch?: WizardCatalog["branches"][number];
  deptName: string;
  doctorName: string;
  onNew: () => void;
}) {
  const a = labels.a;
  function downloadIcs() {
    const ics = buildIcs({
      uid: result.code,
      startsAt: result.startsAt,
      endsAt: result.endsAt,
      summary: `${deptName} randevusu (demo) — ${doctorName}`,
      description: `${a.code}: ${result.code}. ${a.resultDemo}`,
      location: branch ? `ÖZEL FMC HASTANESİ ${branch.name}, ${branch.address}` : "",
    });
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `randevu-${result.code}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div>
      <DemoBadge label={a.resultDemo} />
      <div className="mt-5 rounded-card neu-raised p-6">
        <p className="text-sm text-ink-muted">{a.code}</p>
        <p className="font-mono text-3xl font-semibold tracking-wider text-brand-700">
          {result.code}
        </p>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-ink-muted">{a.summaryLabels.datetime}</dt>
            <dd className="font-semibold">
              {fmtDateLong(result.startsAt)}, {fmtTime(result.startsAt)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-ink-muted">{a.summaryLabels.department}</dt>
            <dd className="font-semibold">
              {deptName} — {doctorName}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm text-ink-muted">{a.summaryLabels.branch}</dt>
            <dd className="font-semibold">
              {branch?.name}, {branch?.address}
            </dd>
          </div>
        </dl>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={downloadIcs} icon={<MaterialIcon name="download" />}>
          {a.addToCalendar}
        </Button>
        {branch && (
          <ButtonLink
            variant="secondary"
            href={`https://www.openstreetmap.org/?mlat=${branch.geo.lat}&mlon=${branch.geo.lng}#map=16/${branch.geo.lat}/${branch.geo.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            icon={<MaterialIcon name="location_on" />}
          >
            {labels.common.directions}
          </ButtonLink>
        )}
        <ButtonLink variant="secondary" href={routes.firstVisit}>
          {a.prepare}
        </ButtonLink>
        <Button variant="ghost" onClick={onNew}>
          {a.newAppointment}
        </Button>
      </div>
    </div>
  );
}
