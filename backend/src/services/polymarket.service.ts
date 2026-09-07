import { Market } from "../types";
import { normalizeMarket } from "./normalize";

const GAMMA_BASE = "https://gamma-api.polymarket.com";

async function gammaGet(path: string, params: Record<string, string | number | boolean | undefined>) {
  const url = new URL(GAMMA_BASE + path);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Gamma API ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function searchMarkets(query: string, limit = 20): Promise<Market[]> {
  const data = await gammaGet("/public-search", { q: query, limit_per_type: limit });
  const events = Array.isArray(data.events) ? data.events : [];
  const markets: Market[] = [];
  for (const event of events) {
    for (const raw of event.markets ?? []) {
      markets.push(normalizeMarket(raw));
    }
  }
  return markets;
}

export async function listMarkets(opts: { limit?: number; closed?: boolean } = {}): Promise<Market[]> {
  const data = await gammaGet("/markets", {
    limit: opts.limit ?? 20,
    closed: opts.closed ?? false,
    order: "volume24hr",
    ascending: false,
  });
  const raw = Array.isArray(data) ? data : [];
  return raw.map(normalizeMarket);
}

export async function getMarketBySlug(slug: string): Promise<Market | null> {
  const data = await gammaGet("/markets", { slug });
  const raw = Array.isArray(data) ? data[0] : null;
  if (raw) return normalizeMarket(raw);

  const matches = await searchMarkets(slug);
  if (matches.length === 0) return null;
  const needle = slug.toLowerCase();
  return matches.find((m) => m.slug.toLowerCase().includes(needle)) ?? matches[0];
}
