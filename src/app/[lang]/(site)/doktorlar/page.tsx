import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DoctorCard } from "@/components/cards/Cards";
import { buttonClass } from "@/components/ui/Button";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import { Breadcrumb, Container, PageHeader } from "@/components/ui/Layout";
import { AutoSubmitForm } from "@/features/doctors/AutoSubmitForm";
import { format, getDictionary, type Dictionary } from "@/i18n";
import { data, type DoctorFilter } from "@/lib/data";
import { routes } from "@/lib/routes";

type SP = Promise<Record<string, string | string[] | undefined>>;
const PAGE_SIZE = 12;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  // Filtreli URL'lerin kanoniği filtresiz liste (plan 4.D).
  return {
    title: t.doctors.title,
    description: t.doctors.lead,
    alternates: { canonical: routes.doctors },
  };
}

const one = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v)?.slice(0, 80) || undefined;

export default async function DoctorsPage({ searchParams }: { searchParams: SP }) {
  const t = await getDictionary();
  const [departments, branches] = await Promise.all([
    data.departments.list(),
    data.branches.list(),
  ]);
  const withDoctors = (
    await Promise.all(
      departments.map(async (d) => ((await data.doctors.byDepartment(d.id)).length ? d : null)),
    )
  ).filter((d) => d !== null);
  const languages = ["en", "de", "fr", "ar", "ru"];

  return (
    <>
      <PageHeader
        image="banner-doktorlar"
        title={t.doctors.title}
        lead={t.doctors.lead}
        breadcrumb={
          <Breadcrumb
            label={t.common.breadcrumb}
            items={[{ name: t.common.home, href: routes.home }, { name: t.doctors.title }]}
          />
        }
      />
      <Container className="grid gap-8 py-10 lg:grid-cols-[300px_minmax(0,1fr)]">
        <Suspense fallback={<FiltersSkeleton />}>
          <Filters
            t={t}
            searchParams={searchParams}
            departments={withDoctors.map((d) => ({ value: d.slug, label: d.name.tr }))}
            branches={branches.map((b) => ({ value: b.slug, label: b.name.tr }))}
            languages={languages.map((l) => ({ value: l, label: t.langNames[l] ?? l }))}
          />
        </Suspense>
        <Suspense fallback={<ResultsSkeleton />}>
          <Results t={t} searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function readFilter(searchParams: SP): Promise<DoctorFilter & { page: number }> {
  const sp = await searchParams;
  return {
    q: one(sp.q),
    departmentSlug: one(sp.bolum),
    branchSlug: one(sp.sube),
    language: one(sp.dil),
    page: Math.min(Math.max(Number(one(sp.sayfa)) || 1, 1), 20),
  };
}

type Opt = { value: string; label: string };

async function Filters({
  t,
  searchParams,
  departments,
  branches,
  languages,
}: {
  t: Dictionary;
  searchParams: SP;
  departments: Opt[];
  branches: Opt[];
  languages: Opt[];
}) {
  const f = await readFilter(searchParams);
  const d = t.doctors;
  const select = (name: string, label: string, options: Opt[], value?: string) => (
    <div>
      <label htmlFor={`f-${name}`} className="mb-1.5 block font-medium">
        {label}
      </label>
      <select
        id={`f-${name}`}
        name={name}
        defaultValue={value ?? ""}
        className="min-h-12 w-full rounded-input border border-control neu-inset px-3 focus-ring"
      >
        <option value="">{d.any}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
  const fields = (
    <div className="space-y-5">
      <div>
        <label htmlFor="f-q" className="mb-1.5 block font-medium">
          {d.searchLabel}
        </label>
        <input
          id="f-q"
          name="q"
          type="search"
          defaultValue={f.q ?? ""}
          placeholder={d.searchPlaceholder}
          className="min-h-12 w-full rounded-input border border-control neu-inset px-4 focus-ring"
        />
      </div>
      {select("bolum", d.department, departments, f.departmentSlug)}
      {select("sube", d.branch, branches, f.branchSlug)}
      {select("dil", d.language, languages, f.language)}
      <div className="flex flex-wrap gap-3">
        <button type="submit" className={buttonClass("primary", "md")}>
          {d.applyFilters}
        </button>
        <Link href={routes.doctors} className={buttonClass("ghost", "md")}>
          {d.clear}
        </Link>
      </div>
    </div>
  );
  // Formun key'i URL'ye bağlı: geri/ileri gezinmede defaultValue'lar yeniden yüklenir.
  const key = JSON.stringify(f);
  return (
    <aside aria-label={d.filters}>
      <AutoSubmitForm
        key={key}
        label={d.filters}
        toggleLabel={d.openFilters}
        startOpen={Boolean(f.departmentSlug || f.branchSlug || f.language)}
        className="lg:sticky lg:top-36"
      >
        <div className="rounded-card neu-raised p-6">
          <h2 className="mb-5 font-sans text-lg font-semibold">{d.filters}</h2>
          {fields}
        </div>
      </AutoSubmitForm>
    </aside>
  );
}

async function Results({ t, searchParams }: { t: Dictionary; searchParams: SP }) {
  const f = await readFilter(searchParams);
  const [doctors, departments, branches, bookable] = await Promise.all([
    data.doctors.list(f),
    data.departments.list(),
    data.branches.list(),
    data.departments.bookable(),
  ]);
  const shown = doctors.slice(0, f.page * PAGE_SIZE);
  const branchIds = await Promise.all(shown.map((d) => data.doctors.branchIds(d.id)));
  const params = new URLSearchParams();
  if (f.q) params.set("q", f.q);
  if (f.departmentSlug) params.set("bolum", f.departmentSlug);
  if (f.branchSlug) params.set("sube", f.branchSlug);
  if (f.language) params.set("dil", f.language);
  params.set("sayfa", String(f.page + 1));

  return (
    <section aria-labelledby="results-title">
      <h2 id="results-title" className="sr-only">
        {t.doctors.results}
      </h2>
      <p role="status" className="mb-5 font-semibold">
        {format(t.doctors.count, { n: doctors.length })}
      </p>
      {doctors.length === 0 ? (
        <EmptyState
          title={t.doctors.emptyTitle}
          action={
            <Link href={routes.doctors} className={buttonClass("secondary")}>
              {t.doctors.clear}
            </Link>
          }
        >
          {t.doctors.emptyBody}
        </EmptyState>
      ) : (
        <>
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((doc, i) => (
              <li key={doc.id}>
                <DoctorCard
                  doctor={doc}
                  t={t}
                  bookable={bookable.some((b) => b.id === doc.primaryDepartmentId)}
                  departmentName={
                    departments.find((d) => d.id === doc.primaryDepartmentId)?.name.tr ?? ""
                  }
                  branchNames={(branchIds[i] ?? []).map(
                    (id) => branches.find((b) => b.id === id)?.name.tr ?? "",
                  )}
                />
              </li>
            ))}
          </ul>
          {shown.length < doctors.length && (
            <div className="mt-8 text-center">
              <Link
                href={`${routes.doctors}?${params}`}
                scroll={false}
                className={buttonClass("secondary")}
              >
                {t.doctors.showMore}
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function FiltersSkeleton() {
  return <Skeleton className="h-96 rounded-card" />;
}

function ResultsSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className="h-72 rounded-card" />
      ))}
    </div>
  );
}
