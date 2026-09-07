import { Router } from "express";
import { getRecommendation } from "../services/ai.service";
import { getMarketBySlug } from "../services/polymarket.service";

export const aiRouter = Router();

aiRouter.post("/recommend", async (req, res) => {
  try {
    const { marketSlug } = req.body ?? {};
    if (typeof marketSlug !== "string" || !marketSlug) {
      return res.status(400).json({ error: "marketSlug is required" });
    }

    const market = await getMarketBySlug(marketSlug);
    if (!market) {
      return res.status(404).json({ error: "Market not found" });
    }
    if (market.outcomes.length === 0) {
      return res.status(400).json({ error: "Market has no outcomes to recommend" });
    }

    const recommendation = await getRecommendation(market);
    res.json({ recommendation });
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});
