import type { Bet } from "../types";

interface Props {
  bets: Bet[];
}

export function BetHistory({ bets }: Props) {
  if (bets.length === 0) {
    return <p className="py-3 text-sm text-ink-soft">You haven't placed any bets yet.</p>;
  }

  return (
    <ul className="m-0 mt-2 flex max-h-[40vh] list-none flex-col gap-2 overflow-y-auto p-0">
      {bets.map((bet) => (
        <li key={bet.id} className="flex items-center justify-between gap-2.5 rounded-lg border border-border p-2.5">
          <div>
            <p className="mb-1 text-sm font-semibold text-ink">{bet.question}</p>
            <span className="text-xs text-ink-soft">
              {bet.side} {bet.outcomeName} · {bet.size} shares @ ${bet.price.toFixed(3)}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <strong className="font-semibold text-ink">${bet.cost.toFixed(2)}</strong>
            <span className="rounded-full border border-buy px-2 py-0.5 text-[11px] text-buy">{bet.status}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
