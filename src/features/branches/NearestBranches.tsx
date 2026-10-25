"use client";

import { MaterialIcon } from "@/components/ui/Icon";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Alert, Badge } from "@/components/ui/Feedback";
import { format } from "@/i18n/format";

/** Haversine: iki koordinat arası kuş uçuşu mesafe (km). */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/**
 * "Bana en yakın": konum yalnız kullanıcı isteyince alınır ve sıralama tarayıcıda yapılır;
 * koordinat sunucuya gönderilmez (plan 5.3).
 */
export function NearestBranches({
  items,
  labels,
}: {
  items: { id: string; geo: { lat: number; lng: number }; node: ReactNode }[];
  labels: {
    button: string;
    locating: string;
    note: string;
    sorted: string;
    denied: string;
    distance: string;
  };
}) {
  const [state, setState] = useState<"idle" | "locating" | "denied" | "sorted">("idle");
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);

  function locate() {
    if (!("geolocation" in navigator)) return setState("denied");
    setState("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setState("sorted");
      },
      () => setState("denied"),
      { maximumAge: 300_000, timeout: 10_000 },
    );
  }

  const list = origin
    ? items.map((i) => ({ ...i, km: distanceKm(origin, i.geo) })).sort((a, b) => a.km - b.km)
    : items.map((i) => ({ ...i, km: undefined }));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Button
          variant="secondary"
          onClick={locate}
          loading={state === "locating"}
          loadingText={labels.locating}
          icon={<MaterialIcon name="my_location" />}
        >
          {labels.button}
        </Button>
        <p className="text-sm text-ink-muted">{labels.note}</p>
      </div>
      <p role="status" className="sr-only">
        {state === "sorted" ? labels.sorted : ""}
      </p>
      {state === "denied" && (
        <Alert tone="info" className="mb-6">
          {labels.denied}
        </Alert>
      )}
      <ul className="grid gap-5 md:grid-cols-3">
        {list.map((i) => (
          <li key={i.id} className="flex flex-col gap-2">
            {i.km !== undefined && (
              <Badge tone="brand" className="self-start">
                {format(labels.distance, { km: i.km.toFixed(1).replace(".", ",") })}
              </Badge>
            )}
            <div className="flex flex-1">{i.node}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
