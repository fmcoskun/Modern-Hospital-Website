/**
 * 3D yetenek ve tercih algılama (plan 9.2 "Mobil", "WebGL yoksa"). three içe aktarmaz.
 * WebGL yoklaması (canvas bağlamı açmak) pahalıdır; yalnız sahne yüklenmeden hemen önce yapılır.
 */
let webgl2: boolean | undefined;

export function hasWebGL2(): boolean {
  if (webgl2 === undefined) {
    try {
      webgl2 = Boolean(document.createElement("canvas").getContext("webgl2"));
    } catch {
      webgl2 = false;
    }
  }
  return webgl2;
}

/** Ucuz kontroller: geniş ekran, yeterli bellek, veri tasarrufu kapalı, ince imleçli cihaz. */
export function suitsAutoLoad(): boolean {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory < 4;
  const saveData = Boolean(nav.connection?.saveData);
  return (
    !lowMemory && !saveData && window.matchMedia("(min-width: 768px) and (pointer: fine)").matches
  );
}

/** Sekme görünürlüğü (gizliyken render durur). */
export const pageVisible = {
  subscribe(cb: () => void) {
    document.addEventListener("visibilitychange", cb);
    return () => document.removeEventListener("visibilitychange", cb);
  },
  get: () => document.visibilityState === "visible",
};
