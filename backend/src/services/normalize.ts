import { Market, MarketOutcome } from "../types";

function parseMaybeJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** Gamma API returns raw market rows with inconsistent typing (numbers as strings,
 * arrays as JSON-encoded strings). This normalizes a raw row into our Market shape. */
export function normalizeMarket(raw: any): Market {
  const names = parseMaybeJsonArray(raw.outcomes);
  const prices = parseMaybeJsonArray(raw.outcomePrices);
  const tokenIds = parseMaybeJsonArray(raw.clobTokenIds);

  const outcomes: MarketOutcome[] = names.map((name, i) => ({
    name,
    price: Number(prices[i] ?? 0),
    tokenId: tokenIds[i] ?? "",
  }));

  return {
    id: String(raw.id),
    conditionId: raw.conditionId ?? "",
    slug: raw.slug ?? "",
    question: raw.question ?? "",
    description: raw.description ?? "",
    image: raw.image ?? raw.icon ?? null,
    active: Boolean(raw.active),
    closed: Boolean(raw.closed),
    liquidity: Number(raw.liquidity ?? raw.liquidityNum ?? 0),
    volume: Number(raw.volume ?? raw.volumeNum ?? 0),
    minTickSize: Number(raw.orderPriceMinTickSize ?? 0.01),
    minOrderSize: Number(raw.orderMinSize ?? 1),
    outcomes,
  };
}
