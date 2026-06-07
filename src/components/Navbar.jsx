import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navRef = useRef(null);
  const navMenuRef = useRef(null);
  const closeMenuBtnRef = useRef(null);
  const [menuActive, setMenuActive] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const words = ["Microsoft", "Tech", "Community"];

  // Magnetic button physics
  const springConfig = { stiffness: 400, damping: 25 };
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const springBtnX = useSpring(btnX, springConfig);
  const springBtnY = useSpring(btnY, springConfig);

  const handleMagneticMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    btnX.set((e.clientX - centerX) * 0.3);
    btnY.set((e.clientY - centerY) * 0.3);
  };

  const handleMagneticLeave = () => {
    btnX.set(0);
    btnY.set(0);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle("scrolled", window.scrollY > 80);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openMenu = () => {
    setMenuActive(true);
    document.body.style.overflow = "hidden";
    if (window.lenis) window.lenis.stop();

    const overlay = navMenuRef.current;
    if (!overlay) return;
    const items = overlay.querySelectorAll(".nav-menu-link-clean");

    const tl = gsap.timeline();
    tl.fromTo(overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" }
    );
    tl.fromTo(items,
      { opacity: 0, y: 30, skewY: 2 },
      { opacity: 1, y: 0, skewY: 0, duration: 0.5, stagger: 0.06, ease: "back.out(1.2)" },
      "-=0.15"
    );
    tl.fromTo(closeMenuBtnRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: "power2.out" },
      "-=0.3"
    );
  };

  const closeMenuHandler = () => {
    const overlay = navMenuRef.current;
    if (!overlay) return;
    const items = overlay.querySelectorAll(".nav-menu-link-clean");

    const tl = gsap.timeline({
      onComplete: () => {
        setMenuActive(false);
        document.body.style.overflow = "";
        if (window.lenis) window.lenis.start();
      },
    });
    tl.to(items, { opacity: 0, y: -15, duration: 0.25, stagger: 0.03, ease: "power2.in" });
    tl.to(closeMenuBtnRef.current, { opacity: 0, duration: 0.15 }, "-=0.15");
    tl.to(overlay, { opacity: 0, duration: 0.25, ease: "power2.in" }, "-=0.1");
  };

  const scrollToSection = (sectionId, e) => {
    if (e) e.preventDefault();

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          const navH = navRef.current?.offsetHeight || 0;
          window.scrollTo({ top: section.offsetTop - navH, behavior: "smooth" });
        }
      }, 500);
      if (menuActive) closeMenuHandler();
      return;
    }

    const section = document.getElementById(sectionId);
    if (!section) return;

    if (menuActive) {
      closeMenuHandler();
      setTimeout(() => {
        const navH = navRef.current?.offsetHeight || 0;
        window.scrollTo({ top: section.offsetTop - navH, behavior: "smooth" });
      }, 350);
    } else {
      const navH = navRef.current?.offsetHeight || 0;
      window.scrollBy({ top: section.getBoundingClientRect().top - navH, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && menuActive) closeMenuHandler();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuActive]);

  const menuLinks = [
    { name: "Home", id: "page1", num: "01", sub: "Back to the start" },
    { name: "Ambassadors", id: "page-msa", num: "02", sub: "The MSA program" },
    { name: "Team", id: "page2", num: "03", sub: "Meet the people" },
    { name: "Bootcamp Info", id: "/Bootcamp-info", num: "04", sub: "Azure AI Series", isRoute: true },
    { name: "Register", id: "/Bootcamp", num: "05", sub: "Join the event", isRoute: true },
    { name: "Connect", id: "page4", num: "06", sub: "Get in touch" },
  ];

  return (
    <>
      <nav className={`msft-nav ${menuActive ? "menu-open" : ""}`} id="mainNav" ref={navRef}>
        <div className="msft-nav-left">
          <div className="msft-nav-logo">
            <div className="msft-navbar-logo-grid" aria-label="Microsoft logo">
              <div className="msft-navbar-logo-square red"></div>
              <div className="msft-navbar-logo-square green"></div>
              <div className="msft-navbar-logo-square blue"></div>
              <div className="msft-navbar-logo-square yellow"></div>
            </div>
          </div>

          <button
            className="nav-brand-container"
            onClick={(e) => scrollToSection("page1", e)}
            aria-label="Microsoft Tech Community — back to top"
          >
            <div className="nav-brand-cycler" style={{ position: "relative", overflow: "hidden", height: "1.2rem", minWidth: "320px", display: "flex", alignItems: "center" }}>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: "backOut" }}
                  className="nav-brand-word"
                  style={{ position: "absolute" }}
                >
                  {words[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </button>
        </div>

        <div className="msft-nav-right">
          <motion.button
            className="msft-menu-btn glass-magnetic"
            style={{ x: springBtnX, y: springBtnY }}
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
            onClick={menuActive ? closeMenuHandler : openMenu}
            aria-label={menuActive ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuActive}
          >
            <span className="menu-btn-label">{menuActive ? "Close" : "Menu"}</span>
            <div className="menu-icon">
              <motion.div
                className="bar bar-top"
                initial={false}
                animate={menuActive ? "open" : "closed"}
                variants={{
                  closed: { y: 0, rotateZ: 0 },
                  open: { y: 7, rotateZ: 45 },
                }}
                transition={{ type: "spring", stiffness: 700, damping: 26 }}
              />
              <motion.div
                className="bar bar-bottom"
                initial={false}
                animate={menuActive ? "open" : "closed"}
                variants={{
                  closed: { y: 0, rotateZ: 0 },
                  open: { y: -7, rotateZ: -45 },
                }}
                transition={{ type: "spring", stiffness: 700, damping: 26 }}
              />
            </div>
          </motion.button>
        </div>
      </nav>

      {/* Navigation Overlay */}
      <div
        className={`nav-menu-overlay ${menuActive ? "active" : ""}`}
        id="navMenu"
        ref={navMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Close button */}
        <button
          className="nav-menu-close-text"
          id="closeMenu"
          ref={closeMenuBtnRef}
          onClick={closeMenuHandler}
          aria-label="Close menu"
        >
          ✕ CLOSE
        </button>

        <div className="nav-menu-content-clean">
          <div className="nav-menu-left-col">

            <nav className="nav-menu-items-clean" aria-label="Main navigation">
              {menuLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.isRoute ? link.id : `#${link.id}`}
                  className="nav-menu-link-clean"
                  onClick={(e) => {
                    e.preventDefault();
                    if (link.isRoute) {
                      closeMenuHandler();
                      setTimeout(() => navigate(link.id), 400);
                    } else {
                      scrollToSection(link.id, e);
                    }
                  }}
                >
                  <span className="nav-link-num">{link.num}</span>
                  <span className="nav-link-content">
                    <span className="link-text">{link.name}</span>
                    <span className="link-sub">{link.sub}</span>
                  </span>
                </a>
              ))}
            </nav>
          </div>

          <div className="nav-menu-right-col">
            <div className="nav-menu-socials-clean">
              <p className="nav-socials-label">Get in touch</p>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="nav-social-link">LinkedIn</a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="nav-social-link">Instagram</a>
              <a href="mailto:mlsa@amity.edu" className="nav-social-link">mlsa@amity.edu</a>
            </div>

            <div className="nav-menu-footer">
              <p>© 2026 Microsoft Tech Community</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
