import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BootcampAd from "../components/BootcampAd";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    // Elegant Awwwards-Style Intro Animation
    if (window.__mcmsft_intro_shown === true) {
      setIntroFinished(true);
      document.body.classList.add('_intro-done');
      return;
    }

    let ctx = gsap.context(() => {
      window.__mcmsft_intro_shown = "playing";
      document.body.classList.add('_loading-mc');

      const squares = [
        { id: "#msftsq-red", from: { x: -470, y: -320, rotate: 146, scale: 0.48, opacity: 0 }, mid: { x: 30, y: -46, rotate: 15, scale: 1.08 } },
        { id: "#msftsq-green", from: { x: 500, y: -310, rotate: 212, scale: 0.49, opacity: 0 }, mid: { x: -24, y: -11, rotate: 10, scale: 1.15 } },
        { id: "#msftsq-blue", from: { x: -410, y: 320, rotate: -111, scale: 0.57, opacity: 0 }, mid: { x: 20, y: 24, rotate: -24, scale: 1.11 } },
        { id: "#msftsq-yellow", from: { x: 440, y: 290, rotate: -95, scale: 0.65, opacity: 0 }, mid: { x: -41, y: 42, rotate: -8, scale: 1.11 } },
      ];

      let tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      const els = squares.map((sq) => document.querySelector(sq.id));
      els.forEach((el, idx) => {
        if (!el) return;
        gsap.set(el, { ...squares[idx].from, force3D: true, willChange: "transform,opacity" });
      });

      squares.forEach((sq, idx) => {
        tl.to(sq.id, {
          ...sq.mid,
          opacity: 1,
          duration: 0.9,
          ease: idx % 2 ? "power4.out" : "back.out(1.4)"
        }, idx * 0.16 + 0.24)
          .to(sq.id, {
            x: 0, y: 0, rotate: 0, scale: 1,
            duration: 0.32,
            ease: "back.out(2)"
          }, idx * 0.18 + 1.0)
          .to(sq.id, {
            opacity: .6,
            duration: 0.05,
            repeat: 1, yoyo: true,
            ease: "power2.inOut"
          }, idx * 0.16 + 1.28);
      });

      tl.addLabel("blink", "+=0.28")
        .to(".msftlogo-square", { opacity: 0.07, scale: .92, duration: 0.08, stagger: 0.037, ease: "power2.in" }, "blink")
        .to(".msftlogo-square", { opacity: 1, scale: 1, duration: 0.10, stagger: 0.055, ease: "power1.out" }, "blink+=0.12")
        .addLabel("logoHold", "+=0.44")
        .to("#msftLogoGrid", { scaleY: 0.79, scaleX: 0.96, y: 26, duration: 0.31, ease: "power2.out" }, "logoHold")
        .to("#msftLogoGrid", {}, "logoHold+=0.22")
        .to("#msftLogoGrid", { scaleY: 1.14, scaleX: 1.09, y: -window.innerHeight * 0.86, opacity: 0, duration: 1.04, ease: "power3.in" }, "logoHold+=0.32")
        // Step 1: Cross-fade the overlay from white to the dark page color
        .addLabel("colorShift", "logoHold+=1.1")
        .to("#mcmsft_intro_fade", {
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut",
          onStart: () => { window.__mcmsft_intro_fading = true; }
        }, "colorShift")
        // Step 2: Fade out the white intro underneath
        .to("#mcmsft_intro", {
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut"
        }, "colorShift+=0.2")
        // Step 3: Smoothly fade out the dark overlay to reveal the page
        .addLabel("fadeOut", "colorShift+=0.5")
        .to("#mcmsft_intro_fade", {
          opacity: 0,
          duration: 1.2,
          ease: "power2.inOut",
          onStart: () => document.body.classList.remove('_loading-mc'),
          onComplete: () => {
            window.__mcmsft_intro_shown = true;
            setIntroFinished(true);
            document.body.classList.add('_intro-done');
          }
        }, "fadeOut");
    });

    return () => {
      if (window.__mcmsft_intro_shown === "playing") {
        window.__mcmsft_intro_shown = false;
        document.body.classList.remove('_loading-mc');
      }
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (!introFinished) return;

    let ctx = gsap.context(() => {
      // Background mode toggle
      ScrollTrigger.create({
        trigger: "#page2",
        start: "top 65%",
        end: "top 40%",
        onEnter: () => document.body.classList.add('globe-background-mode'),
        onLeaveBack: () => document.body.classList.remove('globe-background-mode')
      });

      // Hero parallax on scroll
      gsap.to(".hero-grid-modern", {
        scrollTrigger: {
          trigger: "#page1",
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        opacity: 0,
        y: -150,
        ease: "power2.inOut"
      });

      // Modern Typography Reveal
      gsap.fromTo(".hero-line",
        { y: "120%", rotate: 3, opacity: 0 },
        {
          y: "0%",
          rotate: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1.4,
          ease: "expo.out",
          delay: 0.4
        }
      );

      gsap.fromTo(".hero-accent-block",
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 0.8, delay: 1.2, ease: "power3.out" }
      );

      gsap.fromTo(".hero-modern-sub, .modern-scroll",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 1.4,
          ease: "power3.out"
        }
      );
    });

    return () => ctx.revert();
  }, [introFinished]);

  return (
    <>
      {!introFinished && (
        <>
          <div id="mcmsft_intro" style={{ background: '#fff' }}>
            <div className="mcmsft_deco"></div>
            <div className="mcmsft_logo_wrapper" id="msftLogoWrapper">
              <div className="msftlogo-grid" id="msftLogoGrid">
                <div className="msftlogo-square red" id="msftsq-red"></div>
                <div className="msftlogo-square green" id="msftsq-green"></div>
                <div className="msftlogo-square blue" id="msftsq-blue"></div>
                <div className="msftlogo-square yellow" id="msftsq-yellow"></div>
              </div>
            </div>
          </div>
          {/* Dark overlay: transitions from transparent -> opaque (matching page bg) -> transparent */}
          <div id="mcmsft_intro_fade" style={{ position: 'fixed', inset: 0, background: '#050505', opacity: 0, pointerEvents: 'none', zIndex: 10011 }}></div>
        </>
      )}

      <div id="page1">
        <BootcampAd introFinished={introFinished} />
        <div className="hero-grid-modern">
          <div className="hero-grid-left">
            <h1 className="hero-huge-title">
              <span className="hero-line-wrap"><span className="hero-line">Microsoft</span></span>
              <span className="hero-line-wrap"><span className="hero-line" style={{ color: '#00a4ef' }}>Tech</span></span>
              <span className="hero-line-wrap"><span className="hero-line">Community</span></span>
            </h1>
          </div>
          <div className="hero-grid-right">
            <div className="hero-accent-block"></div>
            <p className="hero-modern-sub">Empowering the next generation of innovators with tools to learn, lead, and empower.</p>
            <div className="scroll-indicator modern-scroll">
              <div className="mouse">
                <div className="wheel"></div>
              </div>
              <p>Scroll to explore</p>
            </div>
          </div>
        </div>
        <span style={{ display: 'none' }} aria-hidden="true">Microsoft Tech Community</span>
      </div>
    </>
  );
};

export default Home;
