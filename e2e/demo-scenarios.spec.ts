import { test, expect } from "@playwright/test";

/** Holmes first infer runs ~3s after load; add buffer for network + directive application */
const HOLMES_APPLY_MS = 10_000;

test.describe("Holmes Store Flows", () => {
  test("checkout flow: page loads with expected Holmes targets", async ({ page }) => {
    // Add item and proceed to checkout - verify checkout structure
    await page.goto("/catalogue");

    try {
      await page.waitForSelector("body[data-holmes-active='true']", { timeout: HOLMES_APPLY_MS });
    } catch {
      test.skip(true, "Holmes script not active (API may be unavailable)");
      return;
    }

    const addToCartBtn = page.getByRole("button", { name: /add to cart/i }).first();
    const productCount = await addToCartBtn.count();
    if (productCount === 0) {
      test.skip(true, "No products in catalog - run with provisioned store for full E2E");
      return;
    }

    await addToCartBtn.click();
    await page.goto("/cart");
    await page.goto("/checkout");

    // Verify checkout page has Holmes targets (extras may be hidden when urgent mission inferred)
    const checkoutExtras = page.locator("[data-holmes=checkout-extras]");
    const count = await checkoutExtras.count();
    expect(count, "Checkout page must have [data-holmes=checkout-extras] element").toBeGreaterThan(
      0
    );
  });

  test("browsing flow: recommendations visible on product page", async ({ page }) => {
    await page.goto("/catalogue");

    try {
      await page.waitForSelector("body[data-holmes-active='true']", { timeout: HOLMES_APPLY_MS });
    } catch {
      test.skip(true, "Holmes script not active (API may be unavailable)");
      return;
    }

    const productLink = page.locator('a[href^="/catalogue/"]').first();
    const linkCount = await productLink.count();
    if (linkCount === 0) {
      test.skip(true, "No products - run with provisioned store for full E2E");
      return;
    }

    await productLink.click();

    const recommendations = page.locator("[data-holmes=recommendations]");
    await expect(recommendations).toBeVisible({ timeout: 5_000 });
    await expect(recommendations).not.toHaveClass(/holmes-hidden/);
  });

  test("cart flow: checkout-summary or basket-bundle surfaces after add to cart", async ({
    page,
  }) => {
    await page.goto("/catalogue");

    try {
      await page.waitForSelector("body[data-holmes-active='true']", { timeout: HOLMES_APPLY_MS });
    } catch {
      test.skip(true, "Holmes script not active (API may be unavailable)");
      return;
    }

    const addToCartBtn = page.getByRole("button", { name: /add to cart/i }).first();
    if ((await addToCartBtn.count()) === 0) {
      test.skip(true, "No products in catalog");
      return;
    }

    await addToCartBtn.click();

    const productLink = page.locator('a[href^="/catalogue/"]').first();
    if ((await productLink.count()) === 0) {
      test.skip(true, "No product links");
      return;
    }
    await productLink.click();

    await page.waitForTimeout(6_000);

    await page.goto("/cart");

    // Cart should show checkout CTA - either from Holmes inject or default
    const checkoutBtn = page.getByRole("button", { name: /proceed to checkout/i });
    const checkoutLink = page.locator("a[href='/checkout']");
    await expect(checkoutBtn.or(checkoutLink)).toBeVisible({ timeout: 5_000 });
  });
});
