import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
  // Start as 'idle' so the browser paints the element off-screen first.
  // Then we add 'fly-in' after 50 ms — that class *change* is what
  // triggers the CSS animation. Without this delay the animation was
  // already present on the first paint and never fired on mobile.
  const [phase, setPhase] = useState('idle'); // 'idle' | 'fly-in' | 'hold' | 'fade-out'

  useEffect(() => {
    // Tiny delay → browser paints element off-screen, then class change fires animation
    const startTimer = setTimeout(() => setPhase('fly-in'), 50);

    // Phase 1: Fly in from left → center (1.4s + 50ms offset)
    const holdTimer = setTimeout(() => setPhase('hold'), 1450);

    // Phase 2: Hold at center (1.2s pause after landing)
    const fadeTimer = setTimeout(() => setPhase('fade-out'), 2650);

    // Phase 3: Fade out overlay → reveal site (0.6s)
    const doneTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3250);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(holdTimer);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash-overlay ${phase === 'fade-out' ? 'splash-fade-out' : ''}`}>
      {/* Sky gradient background */}
      <div className="splash-bg" />

      {/* Animated clouds */}
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
      <div className="cloud cloud-4" />

      {/* The airplane + banner image */}
      <div className={`splash-plane-wrap ${
        phase === 'fly-in' ? 'fly-in' :
        phase === 'hold' || phase === 'fade-out' ? 'plane-center' : ''
      }`}>
        <img
          src="/tripatee-logo.png"
          alt="Welcome to Tripatee Travels"
          className="splash-plane-img"
        />
      </div>

      {/* Tagline that fades in after the plane lands */}
      <p className={`splash-tagline ${phase !== 'fly-in' ? 'tagline-visible' : ''}`}>
        Your journey begins here ✈️
      </p>
    </div>
  );
};

export default SplashScreen;
