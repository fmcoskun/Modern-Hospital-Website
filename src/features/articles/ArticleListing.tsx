import Link from "next/link";
import { ArticleCard } from "@/components/cards/Cards";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { Breadcrumb, Container, PageHeader } from "@/components/ui/Layout";
import { getDictionary } from "@/i18n";
import { cn } from "@/lib/cn";
import { data, type ArticleCategory } from "@/lib/data";
import { env } from "@/lib/env";
import { routes } from "@/lib/routes";

/** Sağlık rehberi listesi; `category` verilirse kategori sayfası olarak render edilir. */
export async function ArticleListing({ category }: { category?: ArticleCategory }) {
  const t = await getDictionary();
  const [articles, categories] = await Promise.all([
    data.articles.list(category ? { categoryId: category.id } : {}),
    data.articles.categories(),
  ]);
  const all = await data.articles.list();
  const used = categories.filter((c) => all.some((a) => a.categoryId === c.id));
  const crumbs = [
    { name: t.common.home, href: routes.home },
    { name: t.articles.title, href: routes.articles },
    ...(category ? [{ name: category.name.tr, href: routes.articleCategory(category.slug) }] : []),
  ];
  const nav: { label: string; href: string; active: boolean }[] = [
    { label: t.articles.all, href: routes.articles, active: !category },
    ...used.map((c) => ({
      label: c.name.tr,
      href: routes.articleCategory(c.slug),
      active: c.id === category?.id,
    })),
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(env.NEXT_PUBLIC_SITE_URL, crumbs)} />
      <PageHeader
        image="banner-saglik"
        title={category ? `${t.articles.title}: ${category.name.tr}` : t.articles.title}
        lead={t.articles.lead}
        breadcrumb={<Breadcrumb label={t.common.breadcrumb} items={crumbs} />}
      >
        <nav aria-label={t.articles.categories} className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={n.active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-input px-4 font-medium focus-ring",
                    n.active
                      ? "border border-brand-700 bg-brand-600 text-inverse"
                      : "neu-raised-sm hover:bg-brand-100",
                  )}
                >
                  {n.active && <span aria-hidden="true">✓&nbsp;</span>}
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>
      <Container className="py-10">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <li key={a.id} className="flex">
              <ArticleCard
                article={a}
                categoryName={categories.find((c) => c.id === a.categoryId)?.name.tr ?? ""}
                t={t}
              />
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
