import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import Navbar from "./components/Navbar";
import Globe from "./components/Globe";
import Home from "./pages/Home";
import Team from "./pages/Team";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import MsaSection from "./pages/MsaSection";
import BootcampRegistration from "./pages/BootcampRegistration";
import BootcampInfo from "./pages/BootcampInfo";


gsap.registerPlugin(ScrollTrigger);

// Helper to handle scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const MainPage = () => {
  return (
    <div className="main-sections">
      <Home />
      <MsaSection />
      <Team />
      <AboutUs />
      <ContactUs />
    </div>

  );
};

const GlobalOverlays = () => {
  const { pathname } = useLocation();
  const hideGlobe = pathname.startsWith('/Bootcamp');
  
  return (
    <>
      <Navbar />
      {!hideGlobe && <Globe />}
    </>
  );
};

function App() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      lerp: prefersReducedMotion ? 0.18 : 0.12, // Keep scrolling responsive while respecting user preference
      wheelMultiplier: 1.0, // Standard scroll speed
      smoothWheel: !prefersReducedMotion,
      syncTouch: false, // Don't force smooth scroll on mobile touch
    });

    lenis.on("scroll", ScrollTrigger.update);
    window.lenis = lenis;

    const lenisTickerFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(lenisTickerFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(lenisTickerFn);
      delete window.lenis;
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <GlobalOverlays />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/Bootcamp" element={<BootcampRegistration />} />
          <Route path="/Bootcamp-info" element={<BootcampInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
