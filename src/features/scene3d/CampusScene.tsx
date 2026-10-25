"use client";

import { ContactShadows, OrbitControls, PerformanceMonitor } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import type { CampusBuilding } from "@/lib/data/types";

/**
 * Prosedürel low-poly kampüs maketi. Geometri bina kayıtlarından üretilir (GLB yok → ek indirme yok).
 * Renkler tokens.css değişkenlerinden okunur; sahnede hex yazılmaz.
 */
export interface CampusSceneProps {
  buildings: CampusBuilding[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  /** Sekme gizliyse render durur. */
  active: boolean;
  onReady: () => void;
  onContextLost: () => void;
}

type Palette = Record<
  | "base"
  | "raised"
  | "sunken"
  | "brand200"
  | "brand500"
  | "brand600"
  | "danger100"
  | "danger600"
  | "green"
  | "trunk"
  | "inverse",
  THREE.Color
>;

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const c = (name: string) => new THREE.Color(css.getPropertyValue(name).trim() || "#cccccc");
  return {
    base: c("--surface-base"),
    raised: c("--surface-raised"),
    sunken: c("--surface-sunken"),
    brand200: c("--brand-200"),
    brand500: c("--brand-500"),
    brand600: c("--brand-600"),
    danger100: c("--danger-100"),
    danger600: c("--danger-600"),
    green: c("--success-600"),
    trunk: c("--text-secondary"),
    inverse: c("--text-inverse"),
  };
}

const TREES: [number, number][] = [
  [-22, -18],
  [-2, -2],
  [2, 12],
  [-22, 0],
  [20, 12],
  [22, -16],
  [-4, -18],
  [14, 18],
];

function Building({
  b,
  palette,
  selected,
  interactive,
  onSelect,
}: {
  b: CampusBuilding;
  palette: Palette;
  selected: boolean;
  interactive: boolean;
  onSelect?: (id: string) => void;
}) {
  const [w, d, h] = b.size;
  const [hovered, setHovered] = useState(false);
  const bodyColor =
    b.kind === "emergency"
      ? palette.danger100
      : b.kind === "parking"
        ? palette.sunken
        : palette.raised;
  const highlight = selected || (interactive && hovered);
  const floorH = b.floors > 1 ? h / b.floors : 0;

  const events = interactive
    ? {
        onClick: (e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onSelect?.(b.id);
        },
        onPointerOver: (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        },
        onPointerOut: () => {
          setHovered(false);
          document.body.style.cursor = "";
        },
      }
    : {};

  return (
    <group position={[b.position[0], 0, b.position[1]]}>
      <mesh position={[0, h / 2, 0]} {...events}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={selected ? palette.brand200 : bodyColor}
          roughness={0.9}
          emissive={palette.brand600}
          emissiveIntensity={selected ? 0.45 : highlight ? 0.25 : 0}
        />
      </mesh>
      {/* Pencere bantları: ön (+z) ve yan (+x) yüzlerde */}
      {floorH > 0 &&
        Array.from({ length: b.floors }, (_, i) => {
          const y = i * floorH + floorH * 0.55;
          return (
            <group key={i}>
              <mesh position={[0, y, d / 2 + 0.03]}>
                <boxGeometry args={[w - 1.6, floorH * 0.32, 0.05]} />
                <meshStandardMaterial color={palette.brand500} roughness={0.4} />
              </mesh>
              <mesh position={[w / 2 + 0.03, y, 0]}>
                <boxGeometry args={[0.05, floorH * 0.32, d - 1.6]} />
                <meshStandardMaterial color={palette.brand600} roughness={0.4} />
              </mesh>
            </group>
          );
        })}
      {/* Çatı detayı */}
      {b.kind === "clinic" && (
        <mesh position={[0, h + 0.4, 0]}>
          <boxGeometry args={[w * 0.35, 0.8, d * 0.35]} />
          <meshStandardMaterial color={palette.sunken} roughness={0.9} />
        </mesh>
      )}
      {b.kind === "emergency" && (
        <group position={[w / 2 + 0.06, h * 0.6, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <planeGeometry args={[2.2, 2.2]} />
            <meshBasicMaterial color={palette.danger600} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[1.4, 0.45]} />
            <meshBasicMaterial color={palette.inverse} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.45, 1.4]} />
            <meshBasicMaterial color={palette.inverse} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function Trees({ palette }: { palette: Palette }) {
  const trunk = useMemo(() => new THREE.CylinderGeometry(0.25, 0.35, 2, 6), []);
  const crown = useMemo(() => new THREE.IcosahedronGeometry(1.6, 0), []);
  useEffect(
    () => () => {
      trunk.dispose();
      crown.dispose();
    },
    [trunk, crown],
  );
  return (
    <group>
      {TREES.map(([x, z]) => (
        <group key={`${x},${z}`} position={[x, 0, z]}>
          <mesh geometry={trunk} position={[0, 1, 0]}>
            <meshStandardMaterial color={palette.trunk} roughness={1} />
          </mesh>
          <mesh geometry={crown} position={[0, 3, 0]}>
            <meshStandardMaterial color={palette.green} roughness={1} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Campus({
  buildings,
  selectedId,
  onSelect,
  palette,
}: {
  buildings: CampusBuilding[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  palette: Palette;
}) {
  return (
    <group>
      {/* Zemin ve yollar */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[38, 48]} />
        <meshStandardMaterial color={palette.raised} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 13.2]}>
        <planeGeometry args={[70, 2.6]} />
        <meshStandardMaterial color={palette.sunken} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[23.2, 0.01, 0]}>
        <planeGeometry args={[2.6, 70]} />
        <meshStandardMaterial color={palette.sunken} roughness={1} />
      </mesh>
      {buildings.map((b) => (
        <Building
          key={b.id}
          b={b}
          palette={palette}
          selected={b.id === selectedId}
          interactive
          onSelect={onSelect}
        />
      ))}
      <Trees palette={palette} />
    </group>
  );
}

export default function CampusScene({
  buildings,
  selectedId,
  onSelect,
  active,
  onReady,
  onContextLost,
}: CampusSceneProps) {
  const [palette] = useState(readPalette);
  const [dpr, setDpr] = useState(1.5);

  useEffect(
    () => () => {
      document.body.style.cursor = "";
    },
    [],
  );

  return (
    <Canvas
      dpr={[1, dpr]}
      // Etkileşim yokken render yok (plan 9.2 "GPU/bellek"); sekme gizliyse hiç render yok.
      frameloop={active ? "demand" : "never"}
      camera={{ position: [64, 54, 64], fov: 30, near: 1, far: 400 }}
      gl={{ antialias: true, powerPreference: "low-power" }}
      onCreated={({ gl, scene }) => {
        scene.background = null;
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onContextLost();
        });
        performance.mark("campus-scene-ready");
        onReady();
      }}
      onPointerMissed={() => onSelect?.("")}
      style={{ touchAction: "none" }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <hemisphereLight args={[palette.raised, palette.base, 1.15]} />
      <directionalLight position={[30, 50, 20]} intensity={1.4} />
      <Campus buildings={buildings} selectedId={selectedId} onSelect={onSelect} palette={palette} />
      {/* Tek seferlik yumuşak gölge (gerçek zamanlı gölge yok) */}
      <ContactShadows
        frames={1}
        position={[0, 0.02, 0]}
        scale={80}
        blur={2.5}
        opacity={0.35}
        far={20}
      />
      <OrbitControls
        enablePan={false}
        minDistance={45}
        maxDistance={140}
        minPolarAngle={0.35}
        maxPolarAngle={1.25}
        target={[0, 4, 0]}
        makeDefault
      />
    </Canvas>
  );
}
