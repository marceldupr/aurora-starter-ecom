"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getLiveAffinityForItem } from "@/lib/cart-intelligence";

export function AffinityToast() {
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    const handler = (e: Event) => {
      const d = (e as CustomEvent<{ name: string }>).detail;
      if (!d?.name) return;
      const suggestions = getLiveAffinityForItem(d.name);
      if (suggestions.length === 0) return;
      clearTimeout(hideTimer);
      setLastAdded(d.name);
      setVisible(true);
      hideTimer = setTimeout(() => {
        setVisible(false);
        setLastAdded(null);
      }, 5000);
    };
    document.addEventListener("cart:itemAdded", handler);
    return () => {
      document.removeEventListener("cart:itemAdded", handler);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible || !lastAdded) return null;

  const suggestions = getLiveAffinityForItem(lastAdded);
  if (suggestions.length === 0) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-[9999] p-4 rounded-xl bg-aurora-surface border border-aurora-border shadow-lg opacity-0 animate-[holmes-fade-in_0.3s_ease-out_forwards]"
    >
      <p className="text-sm font-medium mb-2">Often added with {lastAdded}:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((term) => (
          <Link
            key={term}
            href={`/catalogue?q=${encodeURIComponent(term)}`}
            className="px-3 py-1.5 rounded-lg bg-aurora-primary/20 text-aurora-primary text-xs font-medium hover:bg-aurora-primary/30 transition-colors"
          >
            {term}
          </Link>
        ))}
      </div>
    </div>
  );
}
