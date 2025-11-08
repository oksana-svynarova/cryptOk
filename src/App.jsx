import { Routes, Route, useLocation } from 'react-router';

import Home from './pages/Home/Home';
import Watchlist from './pages/Watchlist/Watchlist';
import News from './pages/News/News';
import CoinPage from './pages/CoinPage/CoinPage';
import Coins from './pages/Coins/Coins';

import Header from './layouts/Header/Header';
import Footer from './layouts/Footer/Footer';

function App() {
  const location = useLocation();

  return (
    <div className="container">
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/coins' element={<Coins />} />
        <Route path="/coin/:id" element={<CoinPage key={location.pathname} />} />
        <Route path='/watchlist' element={<Watchlist />} />
        <Route path='/news' element={<News />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;