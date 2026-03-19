"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/format-price";
import { ShoppingBag } from "lucide-react";

const SHIPPING_CENTS = 250;
const FREE_DELIVERY_THRESHOLD_CENTS = 2500; // £25

/** Persistent smart cart panel - bridges browsing to conversion */
export function SmartCartPanel() {
  const { items, total } = useCart();

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const shipping = count > 0 ? SHIPPING_CENTS : 0;
  const grandTotal = total + shipping;
  const toFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD_CENTS - total);

  if (count === 0) return null;

  return (
    <div className="sticky bottom-0 z-40 mt-10 p-5 rounded-2xl bg-aurora-surface border border-aurora-border shadow-xl shadow-aurora-primary/5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-aurora-primary/15 text-aurora-primary">
            <ShoppingBag className="w-6 h-6" />
          </span>
          <div>
            <p className="font-semibold text-aurora-text text-lg">
              {count} {count === 1 ? "item" : "items"} · {formatPrice(grandTotal)}
            </p>
            {toFreeDelivery > 0 && (
              <p className="text-sm text-aurora-primary font-medium mt-0.5">
                Add {formatPrice(toFreeDelivery)} more for free delivery
              </p>
            )}
            {toFreeDelivery <= 0 && total > 0 && (
              <p className="text-sm text-aurora-primary font-medium mt-0.5">
                You&apos;ve unlocked free delivery
              </p>
            )}
          </div>
        </div>
        <Link
          href="/cart"
          className="inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-aurora-primary text-white font-semibold hover:bg-aurora-primary-dark transition-colors shrink-0 shadow-lg shadow-aurora-primary/25"
        >
          View cart · Checkout
        </Link>
      </div>
    </div>
  );
}
