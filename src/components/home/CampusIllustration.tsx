import type { CampusBuilding } from "@/lib/data";

/**
 * Kampüsün izometrik SVG çizimi — 3D sahneyle aynı bina verisinden üretilir; hero'nun LCP-dostu
 * posteri ve WebGL yokken fallback'i (plan 9.2). Bilgi taşımaz → aria-hidden; eşdeğer metin sayfada.
 */
const C = 0.866;
const S = 0.5;
/** Sahne birimi → SVG birimi */
const K = 4.4;
const iso = (x: number, y: number, z: number) =>
  `${((x - y) * C).toFixed(1)},${((x + y) * S - z).toFixed(1)}`;
const poly = (...pts: [number, number, number][]) => pts.map((p) => iso(...p)).join(" ");

const palette: Record<CampusBuilding["kind"], { top: string; left: string; right: string }> = {
  clinic: {
    top: "var(--surface-raised)",
    left: "var(--brand-200)",
    right: "var(--surface-sunken)",
  },
  emergency: {
    top: "var(--surface-raised)",
    left: "var(--danger-100)",
    right: "var(--surface-sunken)",
  },
  parking: {
    top: "var(--surface-sunken)",
    left: "var(--surface-sunken)",
    right: "var(--border-subtle)",
  },
  service: {
    top: "var(--surface-raised)",
    left: "var(--surface-sunken)",
    right: "var(--border-subtle)",
  },
};

function Building({ b }: { b: CampusBuilding }) {
  const [cx, cz] = b.position;
  const [w0, d0, h0] = b.size;
  const [x, y, w, d, h] = [(cx - w0 / 2) * K, (cz - d0 / 2) * K, w0 * K, d0 * K, h0 * K];
  const c = palette[b.kind];
  const floorH = b.floors > 1 ? h / b.floors : 0;
  return (
    <g stroke="var(--shadow-dark)" strokeWidth="0.8" strokeLinejoin="round">
      <polygon
        points={poly([x, y + d, 0], [x + w, y + d, 0], [x + w, y + d, h], [x, y + d, h])}
        fill={c.left}
      />
      <polygon
        points={poly([x + w, y, 0], [x + w, y + d, 0], [x + w, y + d, h], [x + w, y, h])}
        fill={c.right}
      />
      <polygon
        points={poly([x, y, h], [x + w, y, h], [x + w, y + d, h], [x, y + d, h])}
        fill={c.top}
      />
      {floorH > 0 &&
        Array.from({ length: b.floors }, (_, i) => {
          const z = i * floorH + floorH * 0.35;
          const zh = floorH * 0.35;
          return (
            <g key={i} stroke="none">
              <polygon
                points={poly(
                  [x + 5, y + d, z],
                  [x + w - 5, y + d, z],
                  [x + w - 5, y + d, z + zh],
                  [x + 5, y + d, z + zh],
                )}
                fill="var(--brand-500)"
                opacity="0.5"
              />
              <polygon
                points={poly(
                  [x + w, y + 5, z],
                  [x + w, y + d - 5, z],
                  [x + w, y + d - 5, z + zh],
                  [x + w, y + 5, z + zh],
                )}
                fill="var(--brand-600)"
                opacity="0.3"
              />
            </g>
          );
        })}
      {b.kind === "emergency" && (
        <g transform={`translate(${iso(x + w, y + d / 2, h * 0.55)})`} stroke="none">
          <rect x="-9" y="-9" width="18" height="18" rx="3" fill="var(--danger-600)" />
          <path d="M-2 -6h4v4h4v4h-4v4h-4v-4h-4v-4h4z" fill="var(--text-inverse)" />
        </g>
      )}
      {b.kind === "parking" && (
        <text
          x={iso(x + w / 2, y + d / 2, h).split(",")[0]}
          y={Number(iso(x + w / 2, y + d / 2, h).split(",")[1]) + 5}
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill="var(--brand-600)"
          stroke="none"
        >
          P
        </text>
      )}
    </g>
  );
}

const trees: [number, number][] = [
  [-22, -18],
  [-2, -2],
  [2, 12],
  [-22, 0],
  [20, 12],
  [22, -16],
  [-4, -18],
  [14, 18],
];

function Tree({ at: [tx, tz] }: { at: [number, number] }) {
  const [px, py] = iso(tx * K, tz * K, 0)
    .split(",")
    .map(Number) as [number, number];
  return (
    <g>
      <rect
        x={px - 1.5}
        y={py - 12}
        width="3"
        height="12"
        fill="var(--text-secondary)"
        opacity="0.6"
      />
      <circle cx={px} cy={py - 18} r="9" fill="var(--success-600)" opacity="0.55" />
    </g>
  );
}

export function CampusIllustration({
  buildings,
  className,
}: {
  buildings: CampusBuilding[];
  className?: string;
}) {
  const g = 30 * K;
  // Ressam algoritması: uzaktaki (x+z küçük) önce çizilir.
  const ordered = [...buildings].sort(
    (a, b) => a.position[0] + a.position[1] - (b.position[0] + b.position[1]),
  );
  const items = [
    ...ordered.map((b) => ({
      key: b.id,
      depth: b.position[0] + b.position[1],
      node: <Building b={b} />,
    })),
    ...trees.map((t) => ({ key: `t${t.join()}`, depth: t[0] + t[1], node: <Tree at={t} /> })),
  ].sort((a, b) => a.depth - b.depth);
  return (
    <svg viewBox="-250 -215 500 360" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="campus-ground" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--surface-raised)" />
          <stop offset="100%" stopColor="var(--surface-base)" />
        </radialGradient>
      </defs>
      <polygon
        points={poly([-g, -g, 0], [g, -g, 0], [g, g, 0], [-g, g, 0])}
        fill="url(#campus-ground)"
        stroke="var(--border-subtle)"
      />
      <polygon
        points={poly([-g, 12 * K, 0], [g, 12 * K, 0], [g, 14.5 * K, 0], [-g, 14.5 * K, 0])}
        fill="var(--surface-sunken)"
      />
      <polygon
        points={poly([22 * K, -g, 0], [24.5 * K, -g, 0], [24.5 * K, g, 0], [22 * K, g, 0])}
        fill="var(--surface-sunken)"
      />
      {items.map((i) => (
        <g key={i.key}>{i.node}</g>
      ))}
    </svg>
  );
}
