import { Bet, PlaceBetInput } from "../types";

const bets: Bet[] = [];

export function listBets(): Bet[] {
  return [...bets];
}

export function createBet(input: PlaceBetInput): Bet {
  const bet: Bet = {
    id: `bet-${Date.now()}`,
    ...input,
    cost: input.price * input.size,
    status: "FILLED",
    createdAt: new Date().toISOString(),
  };
  bets.unshift(bet);
  return bet;
}
