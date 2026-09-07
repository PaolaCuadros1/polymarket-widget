import type { Market } from '../types';

interface Props {
  markets: Market[];
  selectedSlug: string | null;
  onSelect: (market: Market) => void;
}

export function MarketList({ markets, selectedSlug, onSelect }: Props) {
  if (markets.length === 0) {
    return <p className="py-3 text-sm text-ink-soft">No markets found.</p>;
  }

  return (
    <ul className="m-0 flex max-h-[70vh] list-none flex-col gap-2.5 overflow-y-auto p-0">
      {markets.map((market) => {
        console.log('market', market);
        const selected = market.slug === selectedSlug;
        return (
          <li key={market.slug}>
            <button
              type="button"
              onClick={() => onSelect(market)}
              className={`w-full rounded-lg border p-4 text-left transition-colors ${selected ? 'border-accent bg-accent-soft' : 'border-border bg-canvas hover:border-accent'
                }`}
            >
              <div className="flex gap-4">
                <div className="h-24 w-24 flex-none overflow-hidden rounded-lg bg-surface">
                  <img src={market.image} alt={market.question} className="h-full w-full object-cover" />
                </div>
                <div className="flex min-w-0 flex-col gap-1.5 py-0.5">
                  <span className="text-[15px] font-semibold text-ink">{market.question}</span>
                  <span className="text-xs font-semibold text-ink-soft">Status: <span className="text-ink">{market.closed === true ? 'Market closed' : 'Open'}</span></span>
                  <div className="flex flex-col gap-0.5 pl-1">
                    {market.outcomes.map((outcome) => (
                      <span key={outcome.tokenId} className="text-[13px] text-ink-soft">
                        {outcome.name} · {(outcome.price * 100).toFixed(0)}%
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
