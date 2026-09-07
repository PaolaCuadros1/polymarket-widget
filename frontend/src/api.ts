import mockData from './mocks/mock-data.json';
import type { Bet, BetSide, Market } from './types';

const MOCK_DELAY_MS = 300;

const markets = mockData.markets as Market[];
const bets = [...mockData.bets] as Bet[];

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));
}

export async function fetchMarkets(query: string): Promise<{ markets: Market[] }> {
  const term = query.trim().toLowerCase();
  const filtered = term
    ? markets.filter(
        (market) =>
          market.question.toLowerCase().includes(term) ||
          market.category.toLowerCase().includes(term)
      )
    : markets;
  return delay({ markets: filtered });
}

export async function fetchMarket(slug: string): Promise<{ market: Market }> {
  const market = markets.find((m) => m.slug === slug);
  if (!market) {
    throw new Error(`Market not found: ${slug}`);
  }
  return delay({ market });
}

export async function fetchBets(): Promise<{ bets: Bet[] }> {
  return delay({ bets });
}

export async function placeBet(params: {
  marketSlug: string;
  tokenId: string;
  side: BetSide;
  size: number;
}): Promise<{ bet: Bet }> {
  const market = markets.find((m) => m.slug === params.marketSlug);
  const outcome = market?.outcomes.find((o) => o.tokenId === params.tokenId);
  if (!market || !outcome) {
    throw new Error('Invalid market or token');
  }

  const bet: Bet = {
    id: `bet-${Date.now()}`,
    marketSlug: params.marketSlug,
    tokenId: params.tokenId,
    question: market.question,
    outcomeName: outcome.name,
    side: params.side,
    size: params.size,
    price: outcome.price,
    cost: outcome.price * params.size,
    status: 'FILLED',
    createdAt: new Date().toISOString(),
  };
  bets.unshift(bet);
  return delay({ bet });
}
