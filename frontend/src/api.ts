import type { AiRecommendation, Bet, BetSide, Market } from './types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4200';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchMarkets(query: string): Promise<{ markets: Market[] }> {
  const url = new URL(`${API_BASE}/api/markets`);
  if (query.trim()) url.searchParams.set('q', query.trim());
  const res = await fetch(url.toString());
  return handleResponse(res);
}

export async function fetchMarket(slug: string): Promise<{ market: Market }> {
  const res = await fetch(`${API_BASE}/api/markets/${encodeURIComponent(slug)}`);
  return handleResponse(res);
}

export async function fetchBets(): Promise<{ bets: Bet[] }> {
  const res = await fetch(`${API_BASE}/api/bets`);
  return handleResponse(res);
}

export async function getAiRecommendation(marketSlug: string): Promise<{ recommendation: AiRecommendation }> {
  const res = await fetch(`${API_BASE}/api/ai/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ marketSlug }),
  });
  return handleResponse(res);
}

export async function placeBet(params: {
  marketSlug: string;
  tokenId: string;
  side: BetSide;
  size: number;
}): Promise<{ bet: Bet }> {
  const res = await fetch(`${API_BASE}/api/bets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return handleResponse(res);
}
