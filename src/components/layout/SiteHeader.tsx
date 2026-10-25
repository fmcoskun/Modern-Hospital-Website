"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ButtonLink, IconButton } from "@/components/ui/Button";
import { DataIcon, MaterialIcon } from "@/components/ui/Icon";
import { Dialog } from "@/components/ui/Overlay";
import { GlobalSearchBox } from "@/features/search/GlobalSearchBox";
import type { SearchLabels } from "@/features/search/types";
import { locales } from "@/i18n/config";
import { format } from "@/i18n/format";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import { Logo } from "./Logo";
import type { NavEntry } from "./navigation";

export interface HeaderLabels {
  main: string;
  bookAppointment: string;
  search: string;
  openMenu: string;
  closeMenu: string;
  submenu: string;
  home: string;
  siteName: string;
}

/** Header davranışı: masaüstünde 100 px, mobilde 40 px kaydırınca "sticky" görünüm. */
const stickyThreshold = () => (window.innerWidth <= 768 ? 40 : 100);
/** Bu genişlikte ve üstünde masaüstü menü; açık mobil menü kendiliğinden kapanır. */
const DESKTOP = 1280;

/** proxy rewrite'ı nedeniyle usePathname "/tr/..." dönebilir; dil öneki karşılaştırmadan çıkarılır. */
const stripLocale = (pathname: string) =>
  pathname.replace(new RegExp(`^/(${locales.join("|")})(?=/|$)`), "") || "/";

function isActive(pathname: string, entry: NavEntry) {
  const path = stripLocale(pathname);
  const under = (href: string) => {
    const prefix = href.split("/").slice(0, 2).join("/");
    return prefix !== "" && (path === prefix || path.startsWith(`${prefix}/`));
  };
  return under(entry.href) || (entry.links ?? []).some((l) => under(l.href));
}

/**
 * Site header'ı:
 * - `fixed`; banner/hero üstünde şeffaf ve beyaz metinli, kaydırınca beyaz zemin + alt kenarlık
 *   (`data-sticky`).
 * - Masaüstü (≥1280 px): üst öğe sayfaya gider, alt menü hover'da açılır; "Tıbbi Birimler" iki
 *   sütunlu ikonlu mega menü. Erişilebilirlik eki: odakla da açılır, ok butonu aç/kapa yapar
 *   (aria-expanded), Esc kapatır (WCAG 1.4.13, 2.1.1).
 * - Mobil: 4 çizgili hamburger (X'e döner); header beyaz panele dönüşür, öğeler ortalı ve
 *   alt menüler akordeon; arkada %40 karartma. Esc/karartma/≥1280 px kapatır.
 */
export function SiteHeader({
  nav,
  labels,
  searchLabels,
  topBar,
}: {
  nav: NavEntry[];
  labels: HeaderLabels;
  searchLabels: SearchLabels;
  /** Üstteki acil hattı çubuğu (sunucu bileşeni); header ile birlikte sabit kalır. */
  topBar?: ReactNode;
}) {
  const pathname = usePathname();
  const [sticky, setSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  /** Ok butonuyla açılan alt menü (mobil akordeon / klavye). */
  const [shown, setShown] = useState<string | null>(null);
  /** Esc ile kapatılan hover/odak menüsü; imleç veya odak ayrılınca sıfırlanır. */
  const [dismissed, setDismissed] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const chevronRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY >= stickyThreshold());
    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => {
      if (window.innerWidth >= DESKTOP) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Sayfa değişince menüler kapanır (cacheComponents Activity ile bileşen mount kalır).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setShown(null);
    setDismissed(null);
  }

  // Mobil menü açıkken sayfa kaymaz; Esc kapatır ve odağı hamburgere döndürür.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setShown(null);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Masaüstünde ok butonuyla açılan menü dışarı tıklanınca kapanır.
  useEffect(() => {
    if (!shown || menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setShown(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [shown, menuOpen]);

  // Masaüstü alt menü: Esc kapatır ve odağı ok butonuna döndürür (hover/odakla açılmış olsa bile);
  // imleç ya da odak menüden çıkınca Esc kapatması sıfırlanır (WCAG 1.4.13 "kapatılabilir").
  useEffect(() => {
    if (menuOpen) return;
    const itemOf = (node: EventTarget | null) =>
      node instanceof Element ? (node.closest<HTMLElement>("[data-dd]")?.dataset.dd ?? null) : null;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const id = itemOf(document.activeElement) ?? shown;
      if (!id) return;
      setShown(null);
      setDismissed(id);
      chevronRefs.current[id]?.focus();
    };
    const onMove = (e: PointerEvent) => {
      if (dismissed && itemOf(e.target) !== dismissed) setDismissed(null);
    };
    const onFocusIn = (e: FocusEvent) => {
      const id = itemOf(e.target);
      if (dismissed && id !== dismissed) setDismissed(null);
      if (shown && id !== shown) setShown(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [menuOpen, shown, dismissed]);

  const solid = sticky || menuOpen;
  /** Banner/hero üstünde: şeffaf zemin, beyaz metin. */
  const overlay = !solid;

  return (
    <>
      <header
        ref={headerRef}
        data-sticky={sticky || undefined}
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color] duration-200",
          solid ? "border-subtle bg-raised" : "border-transparent bg-transparent",
          menuOpen && "max-xl:rounded-b-card max-xl:shadow-neu-flat",
        )}
      >
        {topBar}
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8",
            menuOpen ? "max-xl:flex-wrap max-xl:py-4 xl:h-20" : "h-20",
          )}
        >
          <Link
            href={routes.home}
            className="flex shrink-0 items-center gap-2.5 rounded-input focus-ring"
          >
            <Logo />
            <span className="leading-tight">
              <span
                className={cn(
                  "block text-lg font-bold tracking-wide",
                  overlay ? "text-inverse" : "text-brand-700",
                )}
              >
                ÖZEL FMC
              </span>{" "}
              <span
                className={cn(
                  "block text-xs font-semibold tracking-[0.2em]",
                  overlay ? "text-inverse/85" : "text-ink-muted",
                )}
              >
                HASTANESİ
              </span>
              <span className="sr-only"> — {labels.home}</span>
            </span>
          </Link>

          <nav
            id="site-menu"
            aria-label={labels.main}
            className={cn(
              "xl:ml-auto xl:block",
              menuOpen
                ? "order-1 mt-3 block max-h-[calc(100dvh-7rem)] w-full overflow-y-auto border-t border-subtle pt-2 xl:mt-0 xl:max-h-none xl:w-auto xl:overflow-visible xl:border-0 xl:pt-0"
                : "hidden",
            )}
          >
            <ul className="flex flex-col items-stretch xl:flex-row xl:items-center xl:gap-1">
              {nav.map((entry) => {
                const active = isActive(pathname, entry);
                const itemCls = (full: boolean) =>
                  cn(
                    "focus-ring inline-flex min-h-11 items-center whitespace-nowrap rounded-input px-3 font-medium xl:px-2.5 xl:text-[0.95rem]",
                    "max-xl:justify-center max-xl:py-3",
                    full && "max-xl:w-full",
                    overlay
                      ? active
                        ? "text-inverse xl:bg-inverse/15"
                        : "text-inverse hover:bg-inverse/10"
                      : active
                        ? "text-brand-700 xl:bg-brand-100"
                        : "text-ink hover:text-brand-700",
                  );
                if (!entry.links) {
                  return (
                    <li key={entry.id}>
                      <Link
                        href={entry.href}
                        aria-current={active ? "page" : undefined}
                        className={itemCls(true)}
                      >
                        {entry.label}
                      </Link>
                    </li>
                  );
                }
                const isShown = shown === entry.id;
                const panelId = `dd-${entry.id}`;
                return (
                  <li key={entry.id} className="group/dd relative" data-dd={entry.id}>
                    <div className="flex items-center max-xl:justify-center">
                      <Link
                        href={entry.href}
                        aria-current={
                          active && stripLocale(pathname) === entry.href ? "page" : undefined
                        }
                        className={cn(itemCls(false), "xl:pr-0.5")}
                      >
                        {entry.label}
                      </Link>
                      <button
                        ref={(el) => {
                          chevronRefs.current[entry.id] = el;
                        }}
                        type="button"
                        aria-expanded={isShown}
                        aria-controls={panelId}
                        aria-label={format(labels.submenu, { label: entry.label })}
                        onClick={() => {
                          setDismissed(null);
                          setShown(isShown ? null : entry.id);
                        }}
                        className={cn(
                          "inline-flex size-11 items-center justify-center rounded-input focus-ring xl:h-11 xl:w-6",
                          overlay
                            ? "text-inverse/85 hover:text-inverse"
                            : "text-ink-muted hover:text-brand-700",
                        )}
                      >
                        <MaterialIcon
                          name="keyboard_arrow_down"
                          className={cn(
                            "transition-transform duration-150",
                            isShown && "rotate-180",
                          )}
                        />
                      </button>
                    </div>

                    <div
                      id={panelId}
                      className={cn(
                        "xl:absolute xl:top-full xl:z-50 xl:pt-2",
                        entry.mega ? "xl:left-1/2 xl:-translate-x-1/2" : "xl:left-0",
                        isShown ? "block" : "hidden",
                        !isShown &&
                          dismissed !== entry.id &&
                          "xl:group-focus-within/dd:block xl:group-hover/dd:block",
                      )}
                    >
                      <ul
                        className={cn(
                          "rounded-lg bg-raised p-2 xl:border xl:border-subtle xl:shadow-[0_4px_8px_rgb(0_0_0/0.1)]",
                          entry.mega
                            ? "grid grid-cols-2 gap-1 xl:w-[552px] xl:gap-x-2"
                            : "flex flex-col gap-0.5 xl:min-w-64",
                        )}
                      >
                        {entry.links.map((l) => (
                          <li key={l.href}>
                            <Link
                              href={l.href}
                              className={cn(
                                "flex min-h-11 items-center gap-3 rounded-lg p-3 text-ink focus-ring hover:bg-surface hover:text-brand-700",
                                entry.mega
                                  ? "max-xl:flex-col max-xl:text-center"
                                  : "max-xl:justify-center",
                              )}
                            >
                              {l.icon && (
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                                  <DataIcon name={l.icon} size={22} />
                                </span>
                              )}
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-2">
            <IconButton
              label={labels.search}
              onClick={() => setSearchOpen(true)}
              className={cn(overlay && "!border-inverse/60 !bg-transparent !text-inverse")}
            >
              <MaterialIcon name="search" />
            </IconButton>
            <span className="hidden sm:block">
              <ButtonLink href={routes.appointment} icon={<MaterialIcon name="calendar_add_on" />}>
                {labels.bookAppointment}
              </ButtonLink>
            </span>
            {/* Hamburger: 4 çizgi; açıkken ortadakiler çapraz döner, dıştakiler kaybolur */}
            <button
              ref={burgerRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? labels.closeMenu : labels.openMenu}
              onClick={() => {
                setMenuOpen((o) => !o);
                setShown(null);
              }}
              className={cn(
                "relative size-11 rounded-md border focus-ring xl:hidden",
                overlay ? "border-inverse" : "border-brand-600",
              )}
            >
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={cn(
                    "absolute left-1/2 h-0.5 -translate-x-1/2 rounded-full transition-all duration-200",
                    overlay ? "bg-inverse" : "bg-brand-600",
                    // Dış çizgiler açıkken genişliği 0'a iner
                    (i === 0 || i === 3) && menuOpen ? "top-[20px] w-0" : "w-5",
                    i === 0 && !menuOpen && "top-[14px]",
                    (i === 1 || i === 2) && "top-[20px]",
                    i === 1 && menuOpen && "rotate-45",
                    i === 2 && menuOpen && "-rotate-45",
                    i === 3 && !menuOpen && "top-[26px]",
                  )}
                />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* Karartma: mobil menü açıkken sayfa %40 kararır; tıklayınca kapanır */}
      {menuOpen && (
        <div
          aria-hidden="true"
          data-testid="menu-overlay"
          onClick={() => {
            setMenuOpen(false);
            setShown(null);
          }}
          className="fixed inset-0 z-[35] bg-ink/40 xl:hidden"
        />
      )}

      <Dialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        title={labels.search}
        closeLabel={labels.closeMenu}
        initialFocusId="header-search"
      >
        <div className="min-h-72">
          <GlobalSearchBox
            inputId="header-search"
            labels={searchLabels}
            size="md"
            onNavigate={() => setSearchOpen(false)}
          />
        </div>
      </Dialog>
    </>
  );
}
