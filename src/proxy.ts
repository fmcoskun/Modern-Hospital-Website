import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale } from "@/i18n/config";
import { isKnownPath } from "@/lib/known-paths";
import { routes } from "@/lib/routes";

/**
 * - Varsayılan dil (tr) öneksiz sunulur: /doktorlar → /tr/doktorlar (rewrite).
 * - /tr/... istekleri kanonik öneksiz URL'ye yönlendirilir.
 * - Bilinmeyen yollar prerender edilmiş 404 sayfasına rewrite edilir (gerçek 404 durum kodu).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (hasLocale(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  const target = (await isKnownPath(pathname)) ? pathname : routes.notFound;
  url.pathname = `/${defaultLocale}${target === "/" ? "" : target}`;
  return NextResponse.rewrite(url);
}

// Uzantılı yollar (public/ dosyaları: font, ikon vb.) proxy'ye girmez.
export const config = {
  matcher: ["/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
