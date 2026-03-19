import { NextRequest, NextResponse } from "next/server";
import { getApiBase, getTenantSlug } from "@/lib/aurora";

/**
 * Proxy Holmes recipe products from Aurora.
 * Products for a recipe (paella, curry, pasta) via holmes_insights.recipe_ideas search.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const recipe = searchParams.get("recipe")?.trim();
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "12") || 12, 24);
    if (!recipe) {
      return NextResponse.json({ error: "recipe required", products: [], total: 0 }, { status: 400 });
    }
    const base = getApiBase();
    const tenant = getTenantSlug();
    const apiKey = process.env.AURORA_API_KEY ?? process.env.NEXT_PUBLIC_AURORA_API_KEY ?? "";
    const url = `${base.replace(/\/$/, "")}/api/tenants/${encodeURIComponent(tenant)}/store/holmes/recipe-products?recipe=${encodeURIComponent(recipe)}&limit=${limit}`;
    const res = await fetch(url, { headers: apiKey ? { "X-Api-Key": apiKey } : {} });
    const data = await res.json().catch(() => ({ products: [], total: 0, recipe }));
    return NextResponse.json(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Recipe products failed";
    return NextResponse.json({ error: msg, products: [], total: 0 }, { status: 500 });
  }
}
