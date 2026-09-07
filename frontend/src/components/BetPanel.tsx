import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Market, BetSide } from "../types";

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

  useEffect(() => {
    setTokenId(market?.outcomes[0]?.tokenId ?? "");
  }, [market?.slug]);

  if (!market) {
    return (
      <div className="bet-panel empty-state">
        <p>Select a market to view its details and place a bet.</p>
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
    <div className="bet-panel">
      <h2>{market.question}</h2>
      <p className="market-meta">
        Liquidity ${market.liquidity.toLocaleString()} · Volume ${market.volume.toLocaleString()}
        {market.closed && <span className="badge-closed"> · Market closed</span>}
      </p>

      <form onSubmit={handleSubmit} className="bet-form">
        <label>Outcome</label>
        <div className="outcome-select">
          {market.outcomes.map((o) => (
            <button
              type="button"
              key={o.tokenId || o.name}
              className={o.tokenId === tokenId ? "outcome-btn selected" : "outcome-btn"}
              onClick={() => setTokenId(o.tokenId)}
            >
              {o.name} — {(o.price * 100).toFixed(1)}%
            </button>
          ))}
        </div>

        <label>Side</label>
        <div className="side-select">
          <button
            type="button"
            className={side === "BUY" ? "side-btn buy selected" : "side-btn buy"}
            onClick={() => setSide("BUY")}
          >
            Buy
          </button>
          <button
            type="button"
            className={side === "SELL" ? "side-btn sell selected" : "side-btn sell"}
            onClick={() => setSide("SELL")}
          >
            Sell
          </button>
        </div>

        <label htmlFor="size">Size (shares, minimum {market.minOrderSize})</label>
        <input
          id="size"
          type="number"
          min={market.minOrderSize}
          step="any"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
        />

        <p className="estimated-cost">
          Estimated Cost: <strong>${estimatedCost.toFixed(2)}</strong>
        </p>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="place-bet-btn" disabled={placing || market.closed}>
          {placing ? "Placing bet..." : "Place a bet"}
        </button>
      </form>
    </div>
  );
}
