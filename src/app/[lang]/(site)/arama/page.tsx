import { MaterialIcon } from "@/components/ui/Icon";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { buttonClass } from "@/components/ui/Button";
import { Badge, EmptyState, Skeleton } from "@/components/ui/Feedback";
import { Breadcrumb, Container, PageHeader } from "@/components/ui/Layout";
import { searchSite } from "@/features/search/siteSearch";
import { format, getDictionary, type Dictionary } from "@/i18n";
import { routes } from "@/lib/routes";

type SP = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  // Arama sonuç sayfaları dizine eklenmez.
  return {
    title: t.searchPage.title,
    robots: { index: false, follow: true },
    alternates: { canonical: routes.search },
  };
}

const readQ = async (sp: SP) => {
  const v = (await sp).q;
  return ((Array.isArray(v) ? v[0] : v) ?? "").slice(0, 80);
};

export default async function SearchPage({ searchParams }: { searchParams: SP }) {
  const t = await getDictionary();
  const s = t.searchPage;
  return (
    <>
      <PageHeader
        image="banner-genel"
        title={s.title}
        breadcrumb={
          <Breadcrumb
            label={t.common.breadcrumb}
            items={[{ name: t.common.home, href: routes.home }, { name: s.title }]}
          />
        }
      >
        <Suspense fallback={<Skeleton className="mt-6 h-14 max-w-2xl rounded-input" />}>
          <SearchForm t={t} searchParams={searchParams} />
        </Suspense>
      </PageHeader>
      <Container className="max-w-4xl py-10">
        <Suspense fallback={<Skeleton className="h-64 rounded-card" />}>
          <Results t={t} searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function SearchForm({ t, searchParams }: { t: Dictionary; searchParams: SP }) {
  const q = await readQ(searchParams);
  const s = t.searchPage;
  return (
    <form
      role="search"
      action={routes.search}
      className="mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row"
    >
      <label htmlFor="site-q" className="sr-only">
        {s.label}
      </label>
      <div className="relative flex-1">
        <MaterialIcon
          name="search"
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-muted"
        />
        <input
          key={q}
          id="site-q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder={s.placeholder}
          className="h-14 w-full rounded-input border border-control bg-raised pr-4 pl-12 text-lg text-ink focus-ring placeholder:text-ink-muted"
        />
      </div>
      <button type="submit" className={buttonClass("primary", "lg")}>
        {t.search.submit}
      </button>
    </form>
  );
}

async function Results({ t, searchParams }: { t: Dictionary; searchParams: SP }) {
  const q = await readQ(searchParams);
  const s = t.searchPage;
  if (!q.trim()) return <p className="text-ink-muted">{s.prompt}</p>;
  const results = await searchSite(q);
  return (
    <section aria-labelledby="results">
      <h2 id="results" role="status" className="mb-5 font-sans text-lg font-semibold">
        {results.length ? format(s.results, { q, n: results.length }) : ""}
      </h2>
      {results.length === 0 ? (
        <EmptyState
          title={format(s.empty, { q })}
          action={
            <Link href={routes.doctors} className={buttonClass("secondary")}>
              {t.common.findDoctor}
            </Link>
          }
        />
      ) : (
        <ol className="space-y-3">
          {results.map((r) => (
            <li
              key={r.href}
              className="rounded-card border border-subtle bg-raised p-5 shadow-neu-flat"
            >
              <Badge tone="brand">{s.types[r.type]}</Badge>
              <h3 className="mt-2 font-sans text-lg font-semibold">
                <Link
                  href={r.href}
                  className="rounded text-brand-700 underline-offset-4 focus-ring hover:underline"
                >
                  {r.title}
                </Link>
              </h3>
              <p className="mt-1 line-clamp-2 text-ink-muted">{r.snippet}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
