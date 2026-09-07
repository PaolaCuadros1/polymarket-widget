import { useEffect, useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { MarketList } from './components/MarketList';
import { BetPanel } from './components/BetPanel';
import { BetHistory } from './components/BetHistory';
import { fetchBets, fetchMarket, fetchMarkets, placeBet } from './api';
import type { Bet, BetSide, Market } from './types';

function App() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loadingMarkets, setLoadingMarkets] = useState(true);
  const [marketsError, setMarketsError] = useState<string | null>(null);

  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  const [bets, setBets] = useState<Bet[]>([]);
  const [placing, setPlacing] = useState(false);
  const [betError, setBetError] = useState<string | null>(null);

  useEffect(() => {
    loadMarkets("");
    fetchBets()
      .then((res) => setBets(res.bets))
      .catch(() => { });
  }, []);

  async function loadMarkets(query: string) {
    setLoadingMarkets(true);
    setMarketsError(null);
    try {
      const res = await fetchMarkets(query);
      setMarkets(res.markets);
    } catch (err) {
      setMarketsError((err as Error).message);
    } finally {
      setLoadingMarkets(false);
    }
  }

  async function handleSelectMarket(market: Market) {
    setBetError(null);
    setSelectedMarket(market);
    try {
      const res = await fetchMarket(market.slug);
      setSelectedMarket(res.market);
    } catch {
      // keep the version we already have from the list
    }
  }

  async function handlePlaceBet(tokenId: string, side: BetSide, size: number) {
    if (!selectedMarket) return;
    setPlacing(true);
    setBetError(null);
    try {
      const res = await placeBet({ marketSlug: selectedMarket.slug, tokenId, side, size });
      setBets((prev) => [res.bet, ...prev]);
    } catch (err) {
      setBetError((err as Error).message);
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[1126px] flex-col border-x border-border bg-canvas px-6 pb-10 text-ink">
      <header className="pt-8 pb-2">
        <h1 className="text-[28px] font-semibold tracking-tight">Polymarket Widget</h1>
        <p className="mt-1 text-[15px] text-ink-soft">
          Live market data powered by the Gamma API · Simulated trading with no real funds
        </p>
      </header>

      <main className="mt-4 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-xl border border-border bg-surface p-4">
          <SearchBar onSearch={loadMarkets} loading={loadingMarkets} />
          {marketsError && <p className="text-[13px] text-sell">{marketsError}</p>}
          {loadingMarkets ? (
            <p className="py-3 text-sm text-ink-soft">Loading markets...</p>
          ) : (
            <MarketList
              markets={markets}
              selectedSlug={selectedMarket?.slug ?? null}
              onSelect={handleSelectMarket}
            />
          )}
        </section>

        <section className="rounded-xl border border-border bg-surface p-4">
          <BetPanel
            market={selectedMarket}
            placing={placing}
            error={betError}
            onPlaceBet={handlePlaceBet}
          />
          <h3 className="mb-2 text-lg font-semibold">Betting History</h3>
          <BetHistory bets={bets} />
        </section>
      </main>
    </div>
  )
}

export default App
