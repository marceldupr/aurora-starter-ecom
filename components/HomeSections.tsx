import Link from "next/link";
import { getHomePersonalization, holmesRecentRecipes } from "@/lib/aurora";
import { getStoreConfig } from "@/lib/aurora";
import { ProductImage } from "@/components/ProductImage";
import { ChefHat } from "lucide-react";
import { AdaptiveFeed } from "./AdaptiveFeed";

const CURRENCY_SYMBOLS: Record<string, string> = {
  gbp: "£",
  usd: "$",
  eur: "€",
  aud: "A$",
};

/** SSR fallback for home sections. AdaptiveFeed listens for holmes:homeSections and takes over when Holmes emits. */
export async function HomeSections() {
  const [homeData, config, recipesResult] = await Promise.all([
    getHomePersonalization(),
    getStoreConfig(),
    holmesRecentRecipes(8),
  ]);

  const currency =
    (config as { currency?: string })?.currency?.toLowerCase() ?? "gbp";
  const symbol = CURRENCY_SYMBOLS[currency] ?? "£";
  const recipes = recipesResult?.recipes ?? [];

  if (!homeData?.sections?.length) {
    return (
      <AdaptiveFeed recipes={recipes} currency={currency}>
        <div className="min-h-[1px]" />
      </AdaptiveFeed>
    );
  }

  return (
    <AdaptiveFeed recipes={recipes} currency={currency}>
      {homeData.sections.map((sec, i) => {
        // "meals" type: show recipes instead of products
        if (sec.type === "meals" && recipes.length > 0) {
          return (
            <section
              key={i}
              data-holmes-home-section
              className="mb-10 last:mb-0"
            >
              <h2 data-holmes-home-section-title className="text-xl font-bold mb-4 flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-aurora-primary" />
                Recipes for tonight
              </h2>
              <div
                data-holmes-home-section-grid
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {recipes.slice(0, 4).map((r) => (
                  <Link
                    key={r.id}
                    href={`/recipes/${encodeURIComponent(r.slug)}`}
                    data-holmes-home-card
                    className="block p-4 rounded-xl bg-aurora-surface border border-aurora-border hover:border-aurora-primary/40 hover:shadow-md transition-all"
                  >
                    <div
                      data-holmes-home-card-image
                      className="aspect-square rounded-lg bg-aurora-surface-hover mb-2 overflow-hidden flex items-center justify-center"
                    >
                      <ChefHat className="w-12 h-12 text-aurora-primary/60" aria-hidden />
                    </div>
                    <div
                      data-holmes-home-card-title
                      className="font-semibold text-sm truncate"
                    >
                      {r.title}
                    </div>
                    {r.description && (
                      <p className="text-xs text-aurora-muted line-clamp-2 mt-0.5">
                        {r.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          );
        }

        // "inspiration" type: render as copy, not carousel
        if (sec.type === "inspiration") {
          return (
            <section
              key={i}
              data-holmes-home-section
              className="mb-10 last:mb-0"
            >
              <h2 data-holmes-home-section-title className="text-xl font-bold mb-3">
                {sec.title}
              </h2>
              <div className="prose prose-sm max-w-none text-aurora-text">
                {sec.subtitle && (
                  <p className="text-aurora-muted mb-2">{sec.subtitle}</p>
                )}
                {sec.cards && sec.cards.length > 0 && (
                  <p className="text-aurora-text">
                    {sec.cards.map((c) => c.title).join(" · ")}
                  </p>
                )}
              </div>
            </section>
          );
        }

        // Default: products grid
        return (
          <section
            key={i}
            data-holmes-home-section
            className="mb-10 last:mb-0"
          >
            <h2 data-holmes-home-section-title className="text-xl font-bold mb-4">
              {sec.title}
            </h2>
            {sec.products && sec.products.length > 0 && (
              <div
                data-holmes-home-section-grid
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {sec.products.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/catalogue/${prod.id}`}
                    data-holmes-home-card
                    className="block p-4 rounded-xl bg-aurora-surface border border-aurora-border hover:border-aurora-primary/40 hover:shadow-md transition-all"
                  >
                    <div
                      data-holmes-home-card-image
                      className="aspect-square rounded-lg bg-aurora-surface-hover mb-2 overflow-hidden"
                    >
                      <ProductImage
                        src={prod.image_url}
                        baseUrl={process.env.NEXT_PUBLIC_APP_URL}
                        className="w-full h-full"
                        objectFit="contain"
                        thumbnail
                        fallback={
                          <span
                            data-holmes-home-card-fallback
                            className="w-full h-full flex items-center justify-center text-aurora-muted text-2xl"
                          >
                            -
                          </span>
                        }
                      />
                    </div>
                    <div
                      data-holmes-home-card-title
                      className="font-semibold text-sm truncate"
                    >
                      {prod.name}
                    </div>
                    {prod.price != null && Number(prod.price) > 0 && (
                      <div
                        data-holmes-home-card-price
                        className="text-sm font-bold text-aurora-primary mt-0.5"
                      >
                        {symbol}
                        {Number(prod.price).toFixed(2)}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
            {sec.cards && sec.cards.length > 0 && (
              <div
                data-holmes-home-section-grid
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {sec.cards.map((card, j) => (
                  <Link
                    key={j}
                    href={card.linkUrl || "/catalogue"}
                    data-holmes-home-card
                    className="block p-4 rounded-xl bg-aurora-surface border border-aurora-border hover:border-aurora-primary/40 hover:shadow-md transition-all"
                  >
                    <div
                      data-holmes-home-card-image
                      className="aspect-square rounded-lg bg-aurora-surface-hover mb-2 overflow-hidden"
                    >
                      <ProductImage
                        src={card.imageUrl}
                        className="w-full h-full"
                        objectFit="contain"
                        thumbnail
                        fallback={
                          <span
                            data-holmes-home-card-fallback
                            className="w-full h-full flex items-center justify-center text-aurora-muted text-sm text-center px-2"
                          >
                            {card.title}
                          </span>
                        }
                      />
                    </div>
                    <div
                      data-holmes-home-card-title
                      className="font-semibold text-sm truncate"
                    >
                      {card.title}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </AdaptiveFeed>
  );
}
