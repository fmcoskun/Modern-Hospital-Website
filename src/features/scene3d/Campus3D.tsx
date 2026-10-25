"use client";

import { MaterialIcon } from "@/components/ui/Icon";
import dynamic from "next/dynamic";
import {
  Component,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Spinner } from "@/components/ui/Feedback";
import type { Dictionary } from "@/i18n";
import { cn } from "@/lib/cn";
import type { CampusBuilding } from "@/lib/data/types";
import { hasWebGL2, pageVisible, suitsAutoLoad } from "./capability";

// three + R3F yalnız burada, istemcide ve ihtiyaç anında yüklenir (ana paket dışında).
const CampusScene = dynamic(() => import("./CampusScene"), { ssr: false });

class SceneBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch() {
    this.props.onError();
  }
  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

const idle = (cb: () => void) => {
  if (typeof window.requestIdleCallback === "function")
    window.requestIdleCallback(cb, { timeout: 2500 });
  else setTimeout(cb, 300);
};

type Phase = "poster" | "loading" | "ready" | "failed" | "unsupported";

/**
 * Poster önce (LCP), 3D sonra (plan 9.2): uygun cihazda görünür alana girince ve tarayıcı
 * boştayken otomatik yüklenir; diğer cihazlarda "3D görünümü aç" ile.
 * WebGL yoklaması yalnız yükleme anında yapılır. Canvas aria-hidden; 3D bilgi taşımaz.
 */
export function Campus3D({
  buildings,
  poster,
  labels,
  selectedId,
  onSelect,
  className,
}: {
  buildings: CampusBuilding[];
  poster: ReactNode;
  labels: Dictionary["scene3d"];
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useSyncExternalStore(pageVisible.subscribe, pageVisible.get, () => true);
  const [phase, setPhase] = useState<Phase>("poster");
  const [inView, setInView] = useState(false);

  const load = () =>
    setPhase((p) => (p !== "poster" ? p : hasWebGL2() ? "loading" : "unsupported"));

  // Görünürlüğü izle; görünür olunca ve boşta kalınca otomatik yükle.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(Boolean(entry?.isIntersecting));
        if (entry?.isIntersecting && suitsAutoLoad()) idle(load);
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showScene = phase === "loading" || phase === "ready";
  const canOffer = phase === "poster";

  return (
    <div ref={ref} className={cn("relative size-full", className)}>
      <div
        aria-hidden={phase === "ready" ? true : undefined}
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          phase === "ready" && "opacity-0",
        )}
      >
        {poster}
      </div>

      {showScene && (
        <div
          aria-hidden="true"
          data-testid="campus-canvas"
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            phase === "ready" ? "opacity-100" : "opacity-0",
          )}
        >
          <SceneBoundary onError={() => setPhase("failed")}>
            <CampusScene
              buildings={buildings}
              selectedId={selectedId}
              onSelect={onSelect}
              active={visible && inView}
              onReady={() => setPhase("ready")}
              onContextLost={() => setPhase("failed")}
            />
          </SceneBoundary>
        </div>
      )}

      {phase === "loading" && (
        <p
          role="status"
          className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-input bg-raised/90 px-3 py-1.5 text-sm"
        >
          <Spinner className="size-4" />
          {labels.loading}
        </p>
      )}

      {canOffer && (
        <button
          type="button"
          onClick={load}
          className="absolute top-3 left-3 inline-flex min-h-11 items-center gap-2 rounded-input border border-brand-600 bg-raised px-4 text-sm font-medium text-brand-700 focus-ring"
        >
          <MaterialIcon name="view_in_ar" size={16} />
          {labels.open3d}
        </button>
      )}

      {(phase === "failed" || phase === "unsupported") && (
        <p
          role="status"
          className="absolute inset-x-3 top-3 rounded-input bg-raised/95 p-3 text-sm"
        >
          {phase === "failed" ? labels.failed : labels.unsupported}
        </p>
      )}
    </div>
  );
}
