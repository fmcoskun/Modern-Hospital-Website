import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleListing } from "@/features/articles/ArticleListing";
import { getDictionary } from "@/i18n";
import { data } from "@/lib/data";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await data.articles.categories()).map((c) => ({ slug: c.slug }));
}

async function findCategory(slug: string) {
  return (await data.articles.categories()).find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await findCategory((await params).slug);
  if (!c) return {};
  const t = await getDictionary();
  return {
    title: `${c.name.tr} — ${t.articles.title}`,
    alternates: { canonical: routes.articleCategory(c.slug) },
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = await findCategory((await params).slug);
  if (!category) notFound();
  return <ArticleListing category={category} />;
}
