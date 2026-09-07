export interface MarketOutcome {
  tokenId: string;
  name: string;
  price: number;
}

export interface Market {
  id: string;
  slug: string;
  question: string;
  category: string;
  image: string;
  endDate: string;
  volume: number;
  liquidity: number;
  active: boolean;
  closed: boolean;
  minOrderSize: number;
  outcomes: MarketOutcome[];
}

export type BetSide = 'BUY' | 'SELL';

export type BetStatus = 'FILLED' | 'PENDING' | 'CANCELLED';

export interface Bet {
  id: string;
  marketId: string;
  marketSlug: string;
  tokenId: string;
  question: string;
  outcomeName: string;
  side: BetSide;
  size: number;
  price: number;
  cost: number;
  status: BetStatus;
  createdAt: string;
}
