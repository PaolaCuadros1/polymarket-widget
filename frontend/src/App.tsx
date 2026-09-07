import { useEffect, useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { MarketList } from './components/MarketList';
import { BetPanel } from './components/BetPanel';
import { BetHistory } from './components/BetHistory';
import { fetchBets, fetchMarket, fetchMarkets, placeBet } from './api';
import type { Bet, BetSide, Market } from './types';
import './App.css'

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
    <div className="app-shell">
      <header className="app-header">
        <h1>Polymarket Widget</h1>
        <p className="subtitle">
          Live market data powered by the Gamma API · Simulated trading with no real funds
        </p>
      </header>

      <main className="app-main">
        <section className="markets-column">
          <SearchBar onSearch={loadMarkets} loading={loadingMarkets} />
          {marketsError && <p className="form-error">{marketsError}</p>}
          {loadingMarkets ? (
            <p className="empty-state">Loading markets...</p>
          ) : (
            <MarketList
              markets={markets}
              selectedSlug={selectedMarket?.slug ?? null}
              onSelect={handleSelectMarket}
            />
          )}
        </section>

        <section className="bet-column">
          <BetPanel
            market={selectedMarket}
            placing={placing}
            error={betError}
            onPlaceBet={handlePlaceBet}
          />
          <h3>Betting History</h3>
          <BetHistory bets={bets} />
        </section>
      </main>
    </div>
  )
}

export default App
