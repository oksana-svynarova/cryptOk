import CoinsList from '../CoinsList/CoinsList';
import './CoinsSection.css';

const CoinsSection = ({
  title,
  className = "",
  loading,
  coins,
  sortHeaders,
  sortConfig,
  sortCoins,
  filterName,
  setFilterName,
  watchlist,
  onToggleWatchlist,
  showLoadMoreButton = false,
  onLoadMore,
  onHideLoadMore,
  }) => {

  const showCoins = () => {
    const coinsList = document.querySelector('.coins-list');
    if (coinsList) {
      let heightCoinsList = coinsList.clientHeight;
      const newHeight = heightCoinsList + 400;

      coinsList.style.height = newHeight + 'px';

      if (newHeight >= 22500 && onHideLoadMore) {
        onHideLoadMore();
      }
    }

    if (onLoadMore) {
      onLoadMore();
    }
  }

  return (
    <section className={`section list ${className}`}>
      <div className='section__header'>
        <h2 className="section__title">{title}</h2>
        <input
          type="text"
          placeholder="Filter coins by name"
          className="input filter-input"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
      </div>
      <div className='sort-wrapper flex-container'>
        {sortHeaders.map(({ label, key }) =>
          <button
            key={key}
            onClick={() => sortCoins(key)}
            className='btn-sort'>
            {label}
            {sortConfig.key === key && (sortConfig.asc ? ' ↑' : ' ↓')}
          </button>)}
      </div>
      <CoinsList
        coins={coins}
        loading={loading}
        watchlist={watchlist}
        onToggleWatchlist={onToggleWatchlist}
      />
      {showLoadMoreButton && (
        <button className="btn btn-load" onClick={showCoins}>
          Load more
        </button>
      )}
    </section>
  );
};

export default CoinsSection;