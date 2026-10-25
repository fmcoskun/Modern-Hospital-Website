import photos from "./photos.json";

/**
 * CC0 stok fotoğraflar (scripts/fetch-photos.mjs; kaynak ve fotoğrafçı bilgisi photos.json'da,
 * README "Lisanslar" bölümünde listelenir). Dosyalar public/images altında, kendi sunucumuzdan.
 */
export type PhotoKey = keyof typeof photos;
export type Photo = (typeof photos)[PhotoKey];

export const photo = (key: PhotoKey): Photo => photos[key];

/** Bölüm slug'ı → sekme/kolaj görseli (yoksa genel görsel). */
export function unitPhoto(slug: string): Photo {
  const key = `unit-${slug.split("-")[0] === "kadin" ? "kadin-dogum" : slug}` as PhotoKey;
  const alias: Record<string, PhotoKey> = {
    "unit-ortopedi-ve-travmatoloji": "unit-ortopedi",
    "unit-goz-hastaliklari": "unit-goz",
    "unit-cocuk-sagligi-ve-hastaliklari": "unit-cocuk",
  };
  return photos[alias[key] ?? key] ?? photos["unit-ek"];
}

/** Duyuru slug'ı → liste görseli (görsel solda liste). */
export function announcementPhoto(slug: string): Photo {
  const map: Record<string, PhotoKey> = {
    "kadikoy-cocuk-acil-yenilendi": "unit-cocuk",
    "grip-asisi-donemi": "news-ilac",
    "diyabet-farkindalik-semineri": "news-doktor",
    "bakirkoy-goz-poliklinigi": "unit-goz",
    "otopark-duzenlemesi": "branch-bakirkoy",
    "akreditasyon-belgesi": "banner-kurumsal",
  };
  return photos[map[slug] ?? "banner-duyurular"];
}

/** Şube slug'ı → şube fotoğrafı. */
export function branchPhoto(slug: string): Photo {
  const key = `branch-${slug.split("-")[0]}` as PhotoKey;
  return photos[key] ?? photos["branch-merkez"];
}
