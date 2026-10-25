"use client";

import { MaterialIcon } from "@/components/ui/Icon";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

/** Harita üçüncü taraf istek yapar; yalnız kullanıcı onayıyla yüklenir (plan 4.H, KVKK). */
export function ConsentMap({
  lat,
  lng,
  title,
  labels,
}: {
  lat: number;
  lng: number;
  title: string;
  labels: { consent: string; load: string };
}) {
  const [loaded, setLoaded] = useState(false);
  const d = 0.008;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d},${lat - d},${lng + d},${lat + d}&layer=mapnik&marker=${lat},${lng}`;
  return loaded ? (
    <iframe
      title={title}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer"
      className="aspect-[4/3] w-full rounded-card border border-subtle"
    />
  ) : (
    <div className="flex aspect-[4/3] flex-col items-center justify-center gap-4 rounded-card neu-inset p-6 text-center">
      <MaterialIcon name="location_on" size={40} className="text-brand-600" />
      <p className="max-w-sm text-sm text-ink-muted">{labels.consent}</p>
      <Button variant="secondary" onClick={() => setLoaded(true)}>
        {labels.load}
      </Button>
    </div>
  );
}
