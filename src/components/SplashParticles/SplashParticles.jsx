import { useCallback, useState, useEffect, useRef, useMemo } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

function SplashParticles() {
  const [particleColor, setParticleColor] = useState("#ffffff");
  const observerRef = useRef(null);

   const updateColor = () => {
    const root = document.documentElement;

    const color = getComputedStyle(root)
      .getPropertyValue("--text-color-main")
      .trim();

    if (color) setParticleColor(color);
  };

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    updateColor();

    observerRef.current = new MutationObserver(() => {
      updateColor();
    });

    observerRef.current.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observerRef.current.disconnect();
  }, []);

  const particleOptions = useMemo(() => ({
    background: { color: "transparent" },
    fullScreen: { enable: false },
    particles: {
      number: { value: 120 },
      size: { value: 3 },
      move: { enable: true, speed: 0.6 },
      opacity: {
        value: 0.7,
        animation: { enable: true, speed: 0.5, minimumValue: 0.3 }
      },
      color: { value: particleColor },
      links: { enable: false }
    },
    detectRetina: true
  }), [particleColor]);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particleOptions}
    />
  );
}

export default SplashParticles;