"use client";

import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { getHolmesScriptUrl } from "@aurora-studio/sdk";

/**
 * Loads Holmes script only when holmes_disabled is not in the URL.
 * Used for /simulate page's "Holmes OFF" iframe.
 */
export function ConditionalHolmesScript() {
  const searchParams = useSearchParams();
  const disabled = searchParams.get("holmes_disabled") === "1";

  const apiUrl = process.env.NEXT_PUBLIC_AURORA_API_URL;
  const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG;

  if (disabled || !apiUrl || !tenantSlug) {
    return null;
  }

  const src = getHolmesScriptUrl(apiUrl, tenantSlug);
  return <Script src={src} strategy="afterInteractive" />;
}
