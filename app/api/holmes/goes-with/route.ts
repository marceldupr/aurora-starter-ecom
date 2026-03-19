import { NextRequest, NextResponse } from "next/server";
import { getApiBase, getTenantSlug } from "@/lib/aurora";

/**
 * Proxy Holmes goes-with from Aurora.
 * Products that go well with a given product via holmes_insights.goes_well_with.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product_id")?.trim();
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "8") || 8, 16);
    if (!productId) {
      return NextResponse.json({ error: "product_id required", products: [], total: 0 }, { status: 400 });
    }
    const base = getApiBase();
    const tenant = getTenantSlug();
    const apiKey = process.env.AURORA_API_KEY ?? process.env.NEXT_PUBLIC_AURORA_API_KEY ?? "";
    const url = `${base.replace(/\/$/, "")}/api/tenants/${encodeURIComponent(tenant)}/store/holmes/goes-with?product_id=${encodeURIComponent(productId)}&limit=${limit}`;
    const res = await fetch(url, { headers: apiKey ? { "X-Api-Key": apiKey } : {} });
    const data = await res.json().catch(() => ({ products: [], total: 0 }));
    return NextResponse.json(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Goes-with failed";
    return NextResponse.json({ error: msg, products: [], total: 0 }, { status: 500 });
  }
}
