import { expect, test } from "@playwright/test";

const canvas = '[data-testid="campus-canvas"] canvas';

test.describe("3D kampüs — masaüstü", () => {
  test.skip(({ isMobile }) => isMobile, "masaüstü davranışı");

  test("ana sayfa 3D yüklemez (fotoğraf slider'ı; 3D yalnız Olanaklar'da)", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1500);
    await expect(page.locator(canvas)).toHaveCount(0);
    await expect(page.getByRole("button", { name: "3D görünümü aç" })).toHaveCount(0);
  });

  test("keşif modu sahneyi kendisi yükler; canvas yardımcı teknolojilerden gizli", async ({
    page,
  }) => {
    await page.goto("/kurumsal/olanaklar");
    await expect(page.locator(canvas)).toBeAttached({ timeout: 15_000 });
    await expect(page.locator('[data-testid="campus-canvas"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  test("keşif modu: listeden seçim sahne ve detay panelini günceller", async ({ page }) => {
    await page.goto("/kurumsal/olanaklar");
    await expect(page.locator(canvas)).toBeAttached({ timeout: 15_000 });
    const btn = page.getByRole("button", { name: "Acil servis girişi" });
    await btn.click();
    await expect(btn).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#campus-detail")).toContainText("7/24");
    await page.locator("#campus-detail").getByRole("link", { name: "İlgili sayfaya git" }).click();
    await expect(page).toHaveURL(/\/tibbi-birimler\/acil-servis$/);
  });

  test("sahneye 3 kez girip çıkınca bellek sabit kalır", async ({ page, context }) => {
    const cdp = await context.newCDPSession(page);
    const heap = async () => {
      await cdp.send("HeapProfiler.collectGarbage");
      return page.evaluate(
        () =>
          (performance as Performance & { memory: { usedJSHeapSize: number } }).memory
            .usedJSHeapSize,
      );
    };
    const sizes: number[] = [];
    for (let i = 0; i < 3; i++) {
      await page.goto("/kurumsal/olanaklar");
      await expect(page.locator(canvas)).toBeAttached({ timeout: 15_000 });
      await page.getByRole("link", { name: "Doktorlar" }).first().click();
      await expect(page).toHaveURL(/\/doktorlar$/);
      await page.waitForTimeout(500);
      sizes.push(await heap());
    }
    expect(sizes[2]!).toBeLessThan(sizes[0]! * 1.3);
  });
});

test.describe("3D kampüs — WebGL yok", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const proto = HTMLCanvasElement.prototype as unknown as {
        getContext: (type: string, ...rest: unknown[]) => unknown;
      };
      const orig = proto.getContext;
      // WebGL bağlamlarını devre dışı bırak; 2D bağlam çalışmaya devam eder.
      proto.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
        if (type.startsWith("webgl") || type === "experimental-webgl") return null;
        return orig.call(this, type, ...rest);
      };
    });
  });

  test("poster kalır, destek yok mesajı; bina listesi çalışır", async ({ page }) => {
    await page.goto("/kurumsal/olanaklar");
    await page.waitForTimeout(1500);
    await expect(page.locator(canvas)).toHaveCount(0);
    // Masaüstünde keşif modu yüklemeyi kendisi dener; mobilde kullanıcı butona basar.
    const open3d = page.getByRole("button", { name: "3D görünümü aç" });
    if (await open3d.isVisible()) await open3d.click();
    await expect(page.getByText("Tarayıcınız 3D görünümü desteklemiyor")).toBeVisible();
    await expect(page.locator(canvas)).toHaveCount(0);
    await page.getByRole("button", { name: "D Blok" }).click();
    await expect(page.locator("#campus-detail")).toContainText("Doğum");
  });
});

test.describe("3D kampüs — mobil", () => {
  test.skip(({ isMobile }) => !isMobile, "mobil davranışı");

  test("varsayılan poster; 3D yalnız istek üzerine yüklenir", async ({ page }) => {
    await page.goto("/kurumsal/olanaklar");
    await page.waitForTimeout(1500);
    await expect(page.locator(canvas)).toHaveCount(0);
    await page.getByRole("button", { name: "3D görünümü aç" }).click();
    await expect(page.locator(canvas)).toBeAttached({ timeout: 15_000 });
  });
});
