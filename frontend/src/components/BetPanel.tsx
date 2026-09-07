import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Market, BetSide, AiRecommendation } from "../types";
import { getAiRecommendation } from "../api";

interface Props {
  market: Market | null;
  placing: boolean;
  error: string | null;
  onPlaceBet: (tokenId: string, side: BetSide, size: number) => void;
}

export function BetPanel({ market, placing, error, onPlaceBet }: Props) {
  const [tokenId, setTokenId] = useState("");
  const [side, setSide] = useState<BetSide>("BUY");
  const [size, setSize] = useState(10);

  const [recommendation, setRecommendation] = useState<AiRecommendation | null>(null);
  const [askingAi, setAskingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    setTokenId(market?.outcomes[0]?.tokenId ?? "");
    setRecommendation(null);
    setAiError(null);
  }, [market?.slug]);

  async function handleAskAi() {
    if (!market) return;
    setAskingAi(true);
    setAiError(null);
    try {
      const res = await getAiRecommendation(market.slug);
      setRecommendation(res.recommendation);
    } catch (err) {
      setAiError((err as Error).message);
    } finally {
      setAskingAi(false);
    }
  }

  function useRecommendation() {
    if (!recommendation) return;
    setTokenId(recommendation.tokenId);
    setSide(recommendation.side);
  }

  if (!market) {
    return (
      <div className="mb-5 rounded-xl border border-dashed border-border p-6 text-center text-sm text-ink-soft">
        Select a market to view its details and place a bet.
      </div>
    );
  }

  const selectedOutcome = market.outcomes.find((o) => o.tokenId === tokenId);
  const estimatedCost = selectedOutcome ? selectedOutcome.price * size : 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!tokenId || size <= 0) return;
    onPlaceBet(tokenId, side, size);
  }

  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-ink">{market.question}</h2>
      <p className="mt-1 text-xs text-ink-soft">
        Liquidity ${market.liquidity.toLocaleString()} · Volume ${market.volume.toLocaleString()}
        {market.closed && <span className="font-medium text-sell"> · Market closed</span>}
      </p>

      <button
        type="button"
        onClick={handleAskAi}
        disabled={askingAi}
        className="mt-3 cursor-pointer rounded-lg border border-accent bg-accent-soft px-3 py-2 text-sm font-semibold text-accent-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {askingAi ? "Asking AI..." : "Ask AI for a pick"}
      </button>

      {aiError && <p className="mt-2 text-[13px] text-sell">{aiError}</p>}

      {recommendation && (
        <div className="mt-3 rounded-lg border border-accent bg-accent-soft p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-ink">
              {recommendation.side} {recommendation.outcomeName}
            </span>
            <span className="text-xs font-semibold text-accent-ink">
              {(recommendation.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>
          <p className="mt-1.5 text-[13px] text-ink-soft">{recommendation.reasoning}</p>
          <button
            type="button"
            onClick={useRecommendation}
            className="mt-2 cursor-pointer text-[13px] font-semibold text-accent-ink underline"
          >
            Use this pick
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-1.5">
        <label className="mt-2 text-[13px] font-semibold text-ink-soft">Outcome</label>
        <div className="flex flex-wrap gap-2">
          {market.outcomes.map((o) => (
            <button
              type="button"
              key={o.tokenId || o.name}
              onClick={() => setTokenId(o.tokenId)}
              className={`rounded-lg border px-3 py-2 text-sm ${o.tokenId === tokenId
                  ? "border-accent bg-accent-soft text-accent-ink"
                  : "border-border bg-canvas text-ink"
                }`}
            >
              {o.name} — {(o.price * 100).toFixed(1)}%
            </button>
          ))}
        </div>

        <label className="mt-2 text-[13px] font-semibold text-ink-soft">Side</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSide("BUY")}
            className={`rounded-lg border px-3 py-2 text-sm font-medium ${side === "BUY" ? "border-buy bg-buy-soft text-buy" : "border-border bg-canvas text-ink"
              }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setSide("SELL")}
            className={`rounded-lg border px-3 py-2 text-sm font-medium ${side === "SELL" ? "border-sell bg-sell-soft text-sell" : "border-border bg-canvas text-ink"
              }`}
          >
            Sell
          </button>
        </div>

        <label htmlFor="size" className="mt-2 text-[13px] font-semibold text-ink-soft">
          Size (shares, minimum {market.minOrderSize})
        </label>
        <input
          id="size"
          type="number"
          min={market.minOrderSize}
          step="any"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="rounded-lg border border-border bg-canvas px-2.5 py-2 text-[15px] text-ink focus:border-accent focus:outline-none"
        />

        <p className="mt-2 text-sm text-ink">
          Estimated Cost: <strong className="font-semibold">${estimatedCost.toFixed(2)}</strong>
        </p>

        {error && <p className="text-[13px] text-sell">{error}</p>}

        <button
          type="submit"
          disabled={placing || market.closed}
          className="mt-3 rounded-lg bg-accent px-3 py-3 text-[15px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {placing ? "Placing bet..." : "Place a bet"}
        </button>
      </form>
    </div>
  );
}
