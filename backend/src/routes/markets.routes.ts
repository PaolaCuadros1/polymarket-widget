import { Router } from "express";
import { getMarketBySlug, listMarkets, searchMarkets } from "../services/polymarket.service";

export const marketsRouter = Router();

marketsRouter.get("/", async (req, res) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const markets = q ? await searchMarkets(q) : await listMarkets({ limit: 20 });
    res.json({ markets });
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});

marketsRouter.get("/:slug", async (req, res) => {
  try {
    const market = await getMarketBySlug(req.params.slug);
    if (!market) return res.status(404).json({ error: "Market not found" });
    res.json({ market });
  } catch (err) {
    res.status(502).json({ error: (err as Error).message });
  }
});
