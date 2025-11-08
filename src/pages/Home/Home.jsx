import { useNavigate } from "react-router-dom";
import SplashParticles from "../../components/SplashParticles/SplashParticles";
import CryptoPie from "../../components/CryptoPie/CryptoPie";
import "./Home.css"


function Home() {
  const navigate = useNavigate();

  return (
    <section className="section splash-screen">
      <SplashParticles />
      <h2 className="splash-screen__title">
        Track your favorite coins in a simple way.
      </h2>
      <CryptoPie />
      <button className="splash-screen__btn"
        onClick={() => navigate("/coins")}
        >Start tracking
          <svg className="splash-screen__btn-icon" width="16" height="27" viewBox="0 0 16 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.09058 1.02994L13.0906 13.7358L1.09058 25.0299" stroke="currentColor" strokeWidth="3"/>
          </svg>
        </button>
    </section>
  )
}

export default Home;