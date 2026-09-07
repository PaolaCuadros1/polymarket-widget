import type { Bet } from "../types";

interface Props {
  bets: Bet[];
}

export function BetHistory({ bets }: Props) {
  if (bets.length === 0) {
    return <p className="empty-state">You haven't placed any bets yet.</p>;
  }

  return (
    <ul className="bet-history">
      {bets.map((bet) => (
        <li key={bet.id} className="bet-row">
          <div>
            <p className="bet-question">{bet.question}</p>
            <span className="market-meta">
              {bet.side} {bet.outcomeName} · {bet.size} shares @ ${bet.price.toFixed(3)}
            </span>
          </div>
          <div className="bet-row-right">
            <strong>${bet.cost.toFixed(2)}</strong>
            <span className="badge-filled">{bet.status}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
