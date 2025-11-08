import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef} from 'react';
import useCoinsLogic from '../../hooks/useCoinsLogic';
import './Header.css'

const setActive = ({isActive}) => `menu__link ${isActive ? 'active-link' : ''}`;

function Header() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { allCoins } = useCoinsLogic();
  const coins = allCoins;
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const rootElement = document.documentElement;
    rootElement.classList.remove('dark', 'light');
    rootElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const preventScroll = (e) => {
      if (menuOpen) e.preventDefault();
    };
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('wheel', preventScroll, { passive: false });
      window.removeEventListener('touchmove', preventScroll, { passive: false });
      window.removeEventListener('resize', handleResize);
    };
  }, [menuOpen]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const input = searchInputRef.current;

    input.setCustomValidity('');
    input.reportValidity();

    const lowerQuery = query.trim().toLowerCase();
    if (!lowerQuery) return;

    if (!coins || coins.length === 0) {
      input.setCustomValidity('Coin data is currently loading. Please wait!');
      input.reportValidity();
      return;
    }

    const foundCoin = coins.find(
      (coin) =>
        coin.symbol.toLowerCase() === lowerQuery ||
         coin.name.toLowerCase() === lowerQuery
    );

    if (foundCoin) {
      input.setCustomValidity('');
      input.reportValidity();

      navigate(`/coin/${foundCoin.id}`, { state: { coin: foundCoin } });
      setQuery('');
      setMenuOpen(false);
    } else {
      input.setCustomValidity('Coin not found. Try again!');
      input.reportValidity();
    }
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <header className="header flex-container">
      <h1 className="logo">
        <Link to="/" className="logo__link">CryptOK</Link>
      </h1>
      <nav className="nav">
        <ul className={`menu ${menuOpen ? 'open' : ''}`}>
          <li className="menu__item">
            <NavLink to='/coins' className={setActive} onClick={() => setMenuOpen(false)}><span>Coins</span></NavLink>
          </li>
          <li className="menu__item">
            <NavLink to='/watchlist' className={setActive} onClick={() => setMenuOpen(false)}><span>Watchlist</span></NavLink>
          </li>
          <li className="menu__item">
            <NavLink to='/news' className={setActive} onClick={() => setMenuOpen(false)}><span>News</span></NavLink>
          </li>
          <li>
            <form className="search-form search-form_mobile" onSubmit={handleSearch}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for coins"
                className="input search-input"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (searchInputRef.current) {
                    searchInputRef.current.setCustomValidity('');
                  }
                }}
                required/>
              <button className="search-btn" title="Search for coins" type="submit">
                <svg className="icon search-btn__icon" width="22" height="24">
                  <use href="/sprite.svg#search"></use>
                </svg>
              </button>
            </form>
          </li>
          <li>
            <button className="btn btn-sign-mobile">Sign in</button>
          </li>
        </ul>
        <button
          className={`burger ${menuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          >
        </button>
      </nav>
      <div className="header__btn-wrapper">
        <form className="search-form search-form_desktop" onSubmit={handleSearch}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for coins"
            className="input search-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (searchInputRef.current) {
                searchInputRef.current.setCustomValidity('');
              }
            }}
            required/>
          <button className="search-btn" title="Search for coins" type="submit">
            <svg className="icon search-btn__icon" width="22" height="24">
              <use href="/sprite.svg#search"></use>
            </svg>
          </button>
        </form>
        <button className="theme-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
          <svg className="icon theme-btn__icon" width="22" height="22">
            <use href={`/sprite.svg#${theme}-theme`}></use>
          </svg>
        </button>
        <button className="btn btn-sign-desktop">Sign in</button>
      </div>
    </header>
  )
}

export default Header;