import { useNavigate } from "react-router-dom";
import { ArrowRising } from "../../assets/icons/ArrowRising";
import { ArrowFalling } from "../../assets/icons/ArrowFalling";
import "./CoinItem.css"

function CoinItem({ coin, isInWatchlist, onToggleWatchlist }) {
  const changeClass = coin.price_change_percentage_24h >= 0 ? "rising" : "falling";
  const navigate = useNavigate();

  const formatVolume = (value) => {
    const numberValue = Number(value);
    if (isNaN(numberValue) || numberValue <= 0) return "0.00 $";

    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)}B $`;
    }
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M $`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(2)}K $`;
    }
    return `${value.toFixed(2)} $`;
  };

  return (
    <li className={`coin flex-container ${changeClass}`}
      onClick={() => navigate(`/coin/${coin.symbol}`, { state: { coin } })}
    >
      <button className={`watchlist-btn ${isInWatchlist ? "active" : ""}`}
        title={`${isInWatchlist ? "Delete from" : "Add to"} Watchlist`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleWatchlist();
        }}>
        <svg className="icon watchlist-btn__icon" viewBox="0 0 24 20" width="24" height="20">
          <path d="M7.60748 2L2 7.45455L12.0935 18L22 7.45455L16.5794 2L12.0935 6.36364L7.60748 2Z" fill="transparent" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </button>
      <div className="coin__id">
        <img src={coin.image} alt={coin.name} className="coin__logo" />
        <h4 className="coin__name-wrapper">
          <span className="coin__name">{coin.name}</span>
          <span className="coin__symbol">{coin.symbol.toUpperCase()}</span>
        </h4>
      </div>
      <p className="coin__price">{
        (coin.current_price > 0 && coin.current_price < 0.0001)
        ? coin.current_price?.toExponential(3)
        : coin.current_price?.toFixed(2)
        ?? "0.00"
      } $</p>
      <p className="coin__change">
        {coin.price_change_percentage_24h?.toFixed(2) ?? "0.00"}%
        {changeClass === "rising" ? (
          <ArrowRising className="change__icon" width={9} height={11} />
        ) : (
          <ArrowFalling className="change__icon" width={9} height={10} />
        )}
        <span className="change__term">24H</span>
      </p>
      <p className="coin__vol">VOL {formatVolume(coin.total_volume)}</p>
      <p className="coin__cap">CAP {(coin.market_cap / 1_000_000_000).toFixed(2)}B $</p>
      <button className="chart-btn" title="Open more info"
        onClick={(e) => {
            e.stopPropagation();
            navigate(`/coin/${coin.symbol}`, { state: { coin } });
        }}>
        <svg className="icon chart-btn__icon" width="24" height="18" viewBox="0 0 24 18">
          <path d="M-8.26528e-07 9L22 9M22 9L14.3 1M22 9L14.3 17" fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </button>
    </li>
  )
}

export default CoinItem;