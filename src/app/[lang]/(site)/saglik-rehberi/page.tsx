import type { Metadata } from "next";
import { ArticleListing } from "@/features/articles/ArticleListing";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.articles.title,
    description: t.articles.lead,
    alternates: { canonical: routes.articles },
  };
}

export default function ArticlesPage() {
  return <ArticleListing />;
}
