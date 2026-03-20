"use client";

import Image from "next/image";

/**
 * Introduces Steve the VeggieBuddy above the footer – encourages users to tap for tips.
 */
export function FooterTip() {
  return (
    <section className="bg-aurora-surface/40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <Image
            src="/steve-veggiebuddy.png"
            alt="Steve the VeggieBuddy"
            width={64}
            height={64}
            className="shrink-0"
            unoptimized
          />
          <p className="text-aurora-muted text-sm sm:text-base leading-relaxed">
            That&apos;s <strong className="text-aurora-text">Steve</strong> – our friendly VeggieBuddy in the corner! Tap him for helpful tips on cooking, storage, and saving money. He&apos;s full of ideas to make your shop a little easier.
          </p>
        </div>
      </div>
    </section>
  );
}
