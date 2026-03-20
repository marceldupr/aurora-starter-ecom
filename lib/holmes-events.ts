/**
 * Holmes event bridge - push storefront signals to the Holmes script.
 * Works for any storefront: call directly or dispatch DOM events.
 * The Holmes script (loaded via layout) listens and sends data to Aurora.
 *
 * Integration: paste <script src=".../holmes/v1/script.js?site=X"></script>
 * then call these helpers or dispatch the equivalent CustomEvents.
 */

declare global {
  interface Window {
    holmes?: {
      setSearch: (q: string | string[]) => void;
      setProductsViewed: (ids: string[]) => void;
      setCartCount: (n: number) => void;
      setCartItems: (items: Array<{ id: string; name: string; price: number }>) => void;
      setRecipeViewed?: (slug: string, title: string) => void;
      setRecipeMissionLock?: (key: string) => void;
      clearRecipeMissionLock?: () => void;
      getSessionId?: () => string;
      getMissionStartTimestamp?: () => number | null;
      addBundleToCart?: (
        products: Array<{ id: string; name: string; price: number; image?: string }>,
        tableSlug: string
      ) => void;
    };
  }
}

export function holmesRecipeView(slug: string, title: string): void {
  if (typeof document === "undefined") return;
  const s = String(slug || "").trim();
  const t = String(title || "").trim();
  if (!s || !t) return;
  holmesMissionLockCombo();
  if (window.holmes?.setRecipeViewed) window.holmes.setRecipeViewed(s, t);
  document.dispatchEvent(
    new CustomEvent("holmes:recipeView", { detail: { slug: s, title: t } })
  );
}

/** Dispatch event for Holmes to add a bundle to cart. CartProvider listens and calls addItem. */
export function holmesAddBundle(
  products: Array<{ id: string; name: string; price: number; image?: string }>,
  tableSlug: string
): void {
  if (typeof document === "undefined") return;
  document.dispatchEvent(
    new CustomEvent("holmes:addBundle", { detail: { products, tableSlug } })
  );
}

const MEAL_SEARCH_LOCK_RE =
  /dinner|lunch|breakfast|brunch|supper|recipe|cook\b|meal\b|paella|curry|pasta|steak|roast|ingredient|grill|bbq|beef|lamb|pork|salmon|chicken|fish/i;

/** Lock recipe/combo mission on the server until reset (meal searches, mission pills). */
export function holmesMissionLockCombo(): void {
  if (typeof document === "undefined") return;
  document.dispatchEvent(new CustomEvent("holmes:missionLock", { detail: { key: "combo_mission" } }));
}

/** Clear sticky recipe mission (e.g. mission bar reset). */
export function holmesMissionLockClear(): void {
  if (typeof document === "undefined") return;
  document.dispatchEvent(new CustomEvent("holmes:missionLockClear"));
}

export function holmesSearch(query: string): void {
  if (typeof window === "undefined") return;
  const q = String(query || "").trim();
  if (!q) return;
  if (MEAL_SEARCH_LOCK_RE.test(q)) holmesMissionLockCombo();
  if (window.holmes) window.holmes.setSearch(q);
  document.dispatchEvent(new CustomEvent("holmes:search", { detail: { q } }));
}

export function holmesProductView(productIds: string[]): void {
  if (typeof window === "undefined") return;
  const ids = Array.isArray(productIds) ? productIds : [];
  if (ids.length === 0) return;
  if (window.holmes) window.holmes.setProductsViewed(ids);
  document.dispatchEvent(new CustomEvent("holmes:productView", { detail: { productIds: ids } }));
}

export function holmesCartUpdate(
  count: number,
  items?: Array<{ id: string; name: string; price: number }>,
  bootstrap?: boolean
): void {
  if (typeof window === "undefined") return;
  if (window.holmes) {
    window.holmes.setCartCount(count);
    if (items) window.holmes.setCartItems(items);
  }
  document.dispatchEvent(
    new CustomEvent("holmes:cartUpdate", {
      detail: { count, items: items ?? [], bootstrap: bootstrap === true },
    })
  );
}
