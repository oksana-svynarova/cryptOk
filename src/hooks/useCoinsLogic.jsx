import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

const useCoinsLogic = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap', asc: false });
  const [filterName, setFilterName] = useState('');
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [visibleCoinsCount, setVisibleCoinsCount] = useState(10);

  const sortHeaders = [
    { label: 'Name', key: 'name' },
    { label: 'Price', key: 'current_price' },
    { label: 'Cng (24H)', key: 'price_change_percentage_24h' },
    { label: 'Volume', key: 'total_volume' },
    { label: 'Market Cap', key: 'market_cap' },
  ];

  const WATCHLIST_SORT_KEY = 'watchlistSortConfig';

  const [watchlistSortConfig, setWatchlistSortConfig] = useState(() => {
    const savedConfig = localStorage.getItem(WATCHLIST_SORT_KEY);
    return savedConfig ? JSON.parse(savedConfig) : { key: null, asc: true };
  });

  useEffect(() => {
    const savedData = localStorage.getItem('coinsData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setCoins(parsed.coins);
      setSortConfig(parsed.sortConfig);
      setLoading(false);
    } else {
      const URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1';
      const fetchCoins = async () => {
        try {
          const response = await axios.get(URL);
          setCoins(response.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchCoins();
    }
  }, []);

  useEffect(() => {
    if (coins.length > 0) {
      const sortState = {
        coins, sortConfig,
      };
      localStorage.setItem('coinsData', JSON.stringify(sortState));
    }
  }, [coins, sortConfig]);


  const performSorting = useCallback((arrayToSort, config) => {
    const { key, asc } = config;
    if (!key || arrayToSort.length === 0) return arrayToSort;
      return [...arrayToSort].sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
          if (typeof valA === 'string') {
            return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
          }
        return asc ? valA - valB : valB - valA;
      });
  }, []);

  const sortCoins = useCallback((key) => {
    const isSameKey = sortConfig.key === key;
    const newSortConfig = {
      key, asc: isSameKey ? !sortConfig.asc : true
    };
    setCoins(prevCoins => performSorting(prevCoins, newSortConfig));
    setSortConfig(newSortConfig);
  }, [sortConfig, performSorting]);

  const sortWatchlistCoins = useCallback((key) => {
        setWatchlistSortConfig(prevConfig => {
            const newAsc = prevConfig.key === key ? !prevConfig.asc : true;
            return { key, asc: newAsc };
        });
    }, []);

  const setWatchlistData = useCallback((newWatchlistArray) => {
    setWatchlist(newWatchlistArray);
  }, []);

  useEffect(() => {
    localStorage.setItem(WATCHLIST_SORT_KEY, JSON.stringify(watchlistSortConfig));
  }, [watchlistSortConfig]);

  const toggleWatchlist = useCallback((coin) => {
    setWatchlist((prev) => {
      if (prev.find(c => c.id === coin.id)) {
        return prev.filter(c => c.id !== coin.id);
      } else {
        return [...prev, coin];
      }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const filteredCoins = useMemo(() => {
    return filterName.trim() === ''
      ? coins
      : coins.filter((coin) =>
        coin.name.toLowerCase().includes(filterName.toLowerCase()));
  }, [coins, filterName]);

  const visibleCoins = useMemo(() => {
    return filteredCoins.slice(0, visibleCoinsCount);
  }, [filteredCoins, visibleCoinsCount]);

  return {
    coins: visibleCoins,
    allCoins: filteredCoins,
    loading,
    sortHeaders,
    sortConfig,
    sortCoins,
    performSorting,
    filterName,
    setFilterName,
    watchlist,
    toggleWatchlist,
    setWatchlistData,
    watchlistSortConfig,
    sortWatchlistCoins,
    setVisibleCoinsCount,
  };
};

export default useCoinsLogic;