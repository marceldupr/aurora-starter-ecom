"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { getRandomVeggieTip } from "@/lib/easter-eggs";

/** Steve the VeggieBuddy – friendly floating mascot that gives helpful shopping tips. */
export function VeggieBuddy() {
  const [tip, setTip] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    if (tip) {
      setTip(null);
      return;
    }
    // Pick a different tip each time for variety (use timestamp so it's not predictable)
    setTip(getRandomVeggieTip(Date.now() * Math.random()));
  }, [tip]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!tip) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setTip(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tip]);

  if (!visible) return null;

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">
      {tip && (
        <button
          type="button"
          onClick={handleClick}
          className="veggie-tip-tooltip max-w-[280px] rounded-2xl border border-aurora-border bg-aurora-surface px-4 py-3 shadow-lg text-left hover:bg-aurora-surface-hover transition-colors"
        >
          <p className="text-sm text-aurora-text leading-relaxed">{tip}</p>
          <p className="mt-2 text-xs text-aurora-muted">Tap Steve again to close</p>
        </button>
      )}
      <button
        type="button"
        onClick={handleClick}
        className="veggie-buddy-btn group flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 border-aurora-border/80 bg-aurora-surface shadow-md transition-all hover:scale-110 hover:border-aurora-primary/50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-aurora-primary/50 overflow-hidden p-0"
        aria-label="Get a shopping tip from Steve"
        title="Tap Steve for a helpful tip!"
      >
        <Image
          src="/steve-veggiebuddy.png"
          alt="Steve the VeggieBuddy"
          width={64}
          height={64}
          className="w-full h-full object-contain transition-transform group-hover:rotate-6"
          unoptimized
        />
      </button>
    </div>
  );
}
