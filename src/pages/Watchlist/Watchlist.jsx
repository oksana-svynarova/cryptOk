import { useMemo, useEffect } from 'react';
import useCoinsLogic from '../../hooks/useCoinsLogic';
import CoinsSection from '../../components/CoinsSection/CoinsSection';

function Watchlist() {
  const {
    watchlist: allWatchlistCoins,
    loading,
    sortHeaders,
    performSorting,
    filterName,
    setFilterName,
    toggleWatchlist,
    setWatchlistData,
    watchlistSortConfig,
    sortWatchlistCoins,
  } = useCoinsLogic();

  const sortedWatchlist = useMemo(() => {
    return performSorting(allWatchlistCoins, watchlistSortConfig);
  }, [allWatchlistCoins, watchlistSortConfig, performSorting]);

  const filteredWatchlist = useMemo(() => {
    return filterName.trim() === ''
      ? sortedWatchlist
      : sortedWatchlist.filter((coin) =>
          coin.name.toLowerCase().includes(filterName.toLowerCase()));
  }, [sortedWatchlist, filterName]);

  useEffect(() => {
    if (sortedWatchlist.length === 0) return;
    const isOrderDifferent = sortedWatchlist.some((coin, index) => {
      return allWatchlistCoins[index] && coin.id !== allWatchlistCoins[index].id;
    });
    if (isOrderDifferent) {
      setWatchlistData(sortedWatchlist);
    }
  }, [sortedWatchlist, allWatchlistCoins, setWatchlistData]);

  return (
    <CoinsSection
      title="Watchlist"
      className="watchlist-page"
      coins={filteredWatchlist}
      loading={loading}
      sortHeaders={sortHeaders}
      filterName={filterName}
      setFilterName={setFilterName}
      watchlist={allWatchlistCoins}
      onToggleWatchlist={toggleWatchlist}
      sortConfig={watchlistSortConfig}
      sortCoins={sortWatchlistCoins}
      showLoadMoreButton={false}
    />
  )
}

export default Watchlist;