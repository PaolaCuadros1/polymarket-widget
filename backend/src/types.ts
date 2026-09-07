export interface MarketOutcome {
  name: string;
  price: number;
  tokenId: string;
}

export interface Market {
  id: string;
  conditionId: string;
  slug: string;
  question: string;
  description: string;
  image: string | null;
  active: boolean;
  closed: boolean;
  liquidity: number;
  volume: number;
  minTickSize: number;
  minOrderSize: number;
  outcomes: MarketOutcome[];
}

export type BetSide = "BUY" | "SELL";

export interface Bet {
  id: string;
  marketId: string;
  marketSlug: string;
  question: string;
  outcomeName: string;
  tokenId: string;
  side: BetSide;
  price: number;
  size: number;
  cost: number;
  status: "FILLED";
  createdAt: string;
}

export interface PlaceBetInput {
  marketId: string;
  marketSlug: string;
  question: string;
  outcomeName: string;
  tokenId: string;
  side: BetSide;
  price: number;
  size: number;
}
