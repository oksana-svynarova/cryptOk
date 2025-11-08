import CoinItem from "../CoinItem/CoinItem";
import "./CoinsList.css";

function CoinsList({ coins, loading, watchlist, onToggleWatchlist }) {
   return (
    <ul className="coins-list">
      {loading ? (
        <li className="loading-item">Loading coins...</li>
      ) : coins.length === 0 ? (
        <li className="filter-item">Whoops! Nothing found.</li>
      ) : (
        coins.map((coin) => (
          <CoinItem key={coin.id} coin={coin}
          isInWatchlist={watchlist.some(c => c.id === coin.id)}
          onToggleWatchlist={() => onToggleWatchlist(coin)}
          />
        ))
      )}
    </ul>
  )
}

export default CoinsList;