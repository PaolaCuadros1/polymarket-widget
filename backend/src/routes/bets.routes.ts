import { Router } from "express";
import { createBet, listBets } from "../services/bets.service";
import { getMarketBySlug } from "../services/polymarket.service";
import { BetSide } from "../types";

export const betsRouter = Router();

betsRouter.get("/", (_req, res) => {
  res.json({ bets: listBets() });
});

betsRouter.post("/", async (req, res) => {
  try {
    const { marketSlug, tokenId, side, size } = req.body ?? {};

    if (typeof marketSlug !== "string" || !marketSlug) {
      return res.status(400).json({ error: "marketSlug is required" });
    }
    if (typeof tokenId !== "string" || !tokenId) {
      return res.status(400).json({ error: "tokenId is required" });
    }
    if (side !== "BUY" && side !== "SELL") {
      return res.status(400).json({ error: "side must be BUY or SELL" });
    }
    const numericSize = Number(size);
    if (!Number.isFinite(numericSize) || numericSize <= 0) {
      return res.status(400).json({ error: "size must be a positive number" });
    }

    const market = await getMarketBySlug(marketSlug);
    if (!market) {
      return res.status(404).json({ error: "Market not found" });
    }

    const outcome = market.outcomes.find((o) => o.tokenId === tokenId);
    if (!outcome) {
      return res.status(400).json({ error: "Invalid outcome for this market" });
    }

    const bet = createBet({
      marketId: market.id,
      marketSlug: market.slug,
      question: market.question,
      outcomeName: outcome.name,
      tokenId,
      side: side as BetSide,
      price: outcome.price,
      size: numericSize,
    });

    res.status(201).json({ bet });
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});
