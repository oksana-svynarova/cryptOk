import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import useCoinsLogic from "../../hooks/useCoinsLogic";
import CoinChart from "../../components/CoinChart/CoinChart";
import './CoinPage.css';

function CoinPage() {
  const { id } = useParams();
  const location = useLocation();
  const { coins, loading } = useCoinsLogic();
  const [coin, setCoin] = useState(location.state?.coin || null);

   useEffect(() => {
    if (!coin && coins.length > 0) {
      const found = coins.find((c) => c.id === id);
      if (found) setCoin(found);
    }
  }, [coin, coins, id]);

  if (loading || !coin) {
    return <p className="loading-chart">Loading...</p>;
  }

  const formatVolume = (value) => {
    const numberValue = Number(value);
    if (isNaN(numberValue) || numberValue <= 0) return '0.00';

    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(2)}K`;
    }
    return `${value.toFixed(2)}`;
  };

 const changeClass = coin.price_change_percentage_24h >= 0 ? 'rising' : 'falling';
 const changeClassAtn = coin.ath_change_percentage >= 0 ? 'rising' : 'falling';

  return (
    <section className="section coin-page">
      <h2 className="section__title">
        {coin.name}<span className="coin__symbol">{coin.symbol.toUpperCase()}</span>
        <span className="coin__rank">Rank: {coin.market_cap_rank}</span>
      </h2>
      <div className="coin-info">
        <div className="coin-info_main">
          <div className="coin-img">
            <img src={coin.image.large || coin.image} alt={coin.name} />
          </div>
          <div>
            <h3 className="coin-info__title">{coin.symbol.toUpperCase()} Price</h3>
            <p className="coin-info__value--price">
              <span className="coin__icon">$ </span>
              {
                (coin.current_price > 0 && coin.current_price < 0.0001)
                ? coin.current_price?.toExponential(3)
                : coin.current_price?.toFixed(2)
                ?? '0.00'
              }
            </p>
            <p className={`coin-${changeClass}`}>
              <svg className="change-icon" width="9" height="11">
                <use href={`/sprite.svg#arrow-${changeClass}`}></use>
              </svg>
              {Math.abs(coin.price_change_percentage_24h?.toFixed(2)) ?? '0.00'}%
              <span className="change-amount">({coin.price_change_24h?.toFixed(2)} $)</span>
            </p>
          </div>
        </div>
        <div className="coin-info_addition">
          <div>
            <h3 className="coin-info__title">Market Cap</h3>
            <p className="coin-info__value">
              <span className="coin__icon">$ </span>{(coin.market_cap / 1_000_000_000).toFixed(2)}B
            </p>
          </div>
          <div>
            <h3 className="coin-info__title">Volume</h3>
            <p className="coin-info__value">
              <span className="coin__icon">$ </span>
              {formatVolume(coin.total_volume)}
            </p>
          </div>
          <div>
            <h3 className="coin-info__title">Circulating Supply</h3>
            <p className="coin-info__value">
              <span className="coin__icon">{coin.symbol.toUpperCase()} </span>
              {formatVolume(coin.circulating_supply)}
            </p>
          </div>
          <div>
            <h3 className="coin-info__title">All Time High</h3>
            <p className="coin-info__value">
              <span className="coin__icon">$ </span>
              {
                (coin.ath > 0 && coin.ath < 0.0001)
                ? coin.ath?.toExponential(3)
                : coin.ath?.toFixed(2)
                ?? '0.00'
              }
            </p>
            <p className={`coin-${changeClassAtn}`}>
              <svg className="change-icon" width="9" height="11">
                <use href={`/sprite.svg#arrow-${changeClassAtn}`}></use>
              </svg>
              {Math.abs(coin.ath_change_percentage?.toFixed(2)) ?? '0.00'}%
            </p>
          </div>
        </div>
      </div>
      <div className="coin-chart">
        <h2 className="coin-chart__title">{coin.symbol.toUpperCase()} Chart</h2>
        <CoinChart coinId={coin.symbol.toUpperCase()} />
      </div>
    </section>
  )
}

export default CoinPage;