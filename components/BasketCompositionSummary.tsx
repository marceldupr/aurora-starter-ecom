"use client";

import { getBasketCompositionSummary } from "@/lib/cart-intelligence";
import type { CartItem } from "@/components/CartProvider";

export function BasketCompositionSummary({ items }: { items: CartItem[] }) {
  const summary = getBasketCompositionSummary(items.map((i) => i.name));
  return (
    <p className="text-sm text-aurora-muted mb-6">
      Your shop: {summary}
    </p>
  );
}
