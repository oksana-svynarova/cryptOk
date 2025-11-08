import { useState } from 'react';
import useCoinsLogic from '../../hooks/useCoinsLogic';
import CoinsSection from '../../components/CoinsSection/CoinsSection';

function Coins() {
  const {
    coins,
    loading,
    sortHeaders,
    sortConfig,
    sortCoins,
    filterName,
    setFilterName,
    watchlist,
    toggleWatchlist,
    setVisibleCoinsCount,
  } = useCoinsLogic();

  const [showLoadMoreButton, setShowLoadMoreButton] = useState(true);

  return (
    <CoinsSection
      title="Coins"
      coins={coins}
      loading={loading}
      sortHeaders={sortHeaders}
      sortConfig={sortConfig}
      sortCoins={sortCoins}
      filterName={filterName}
      setFilterName={setFilterName}
      watchlist={watchlist}
      onToggleWatchlist={toggleWatchlist}
      showLoadMoreButton={showLoadMoreButton}
      onLoadMore={() => setVisibleCoinsCount(prev => prev + 5)}
      onHideLoadMore={() => setShowLoadMoreButton(false)}
    />
  )
}

export default Coins;