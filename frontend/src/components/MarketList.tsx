import type { Market } from '../types';

interface Props {
  markets: Market[];
  selectedSlug: string | null;
  onSelect: (market: Market) => void;
}

export function MarketList({ markets, selectedSlug, onSelect }: Props) {
  if (markets.length === 0) {
    return <p className="empty-state">No markets found.</p>;
  }

  return (
    <ul className="market-list">
      {markets.map((market) => (
        <li key={market.slug}>
          <button
            type="button"
            className={`market-card${market.slug === selectedSlug ? ' selected' : ''}`}
            onClick={() => onSelect(market)}
          >
            <span className="market-category">{market.category}</span>
            <span className="market-question">{market.question}</span>
            <span className="market-outcomes">
              {market.outcomes.map((outcome) => (
                <span key={outcome.tokenId} className="market-outcome">
                  {outcome.name} · {(outcome.price * 100).toFixed(0)}%
                </span>
              ))}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
