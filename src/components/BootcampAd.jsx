import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./BootcampAd.css";

gsap.registerPlugin(ScrollTrigger);

const BootcampAd = () => {
  const adRef = useRef(null);
  const leftPeekRef = useRef(null);
  const rightPeekRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [branchStep, setBranchStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const mm = gsap.matchMedia();
    
    // Desktop: roaming/floating animation
    mm.add("(min-width: 768px)", () => {
      gsap.to(adRef.current, {
        y: "-=30",
        x: "+=20",
        rotation: 3,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    });
    
    // Mobile: Peeking animation from the right door
    mm.add("(max-width: 767px)", () => {
      if (!isHovered) {
        gsap.to(adRef.current, { x: "65%", rotation: -4, duration: 0.5, ease: "back.out(1.5)" });
        gsap.to(adRef.current, { x: "60%", duration: 1.5, yoyo: true, repeat: -1, ease: "sine.inOut", overwrite: "auto", delay: 0.5 });
      } else {
        gsap.to(adRef.current, { x: "0%", rotation: 0, duration: 0.5, ease: "back.out(1.2)", overwrite: "auto" });
      }
    });

    // Peeking Tabs Logic on Scroll
    const hideTrigger = ScrollTrigger.create({
      trigger: "#page2",
      start: "top 80%", 
      onEnter: () => {
        // Hide Main Ad
        gsap.to(adRef.current, { x: "150%", duration: 0.4, ease: "power3.in", overwrite: "auto" });
        // Show Left & Right Peeks
        gsap.to([leftPeekRef.current, rightPeekRef.current], { x: "0%", opacity: 1, duration: 0.6, ease: "back.out(1.2)", stagger: 0.1 });
        // Start their gentle peek animation
        gsap.to(leftPeekRef.current, { x: "-60%", duration: 1.5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 0.6 });
        gsap.to(rightPeekRef.current, { x: "60%", duration: 1.5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 0.6 });
      },
      onLeaveBack: () => {
        // Show Main Ad
        gsap.to(adRef.current, { x: window.innerWidth < 768 ? (isHovered ? "0%" : "60%") : "0%", duration: 0.6, ease: "back.out(1.2)", overwrite: "auto" });
        // Hide Peeks
        gsap.to([leftPeekRef.current, rightPeekRef.current], { x: (i) => i === 0 ? "-150%" : "150%", opacity: 0, duration: 0.4, ease: "power3.in" });
      }
    });

    return () => {
      mm.revert();
      hideTrigger.kill();
    };
  }, [isHovered]);

  useEffect(() => {
    if (branchStep === 1) {
      gsap.fromTo(".bootcamp-branch-1", { scaleY: 0 }, { scaleY: 1, transformOrigin: "bottom", duration: 0.4, ease: "power2.out" });
      gsap.fromTo(".bootcamp-btn-2", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, delay: 0.3, ease: "back.out(1.5)" });
    } else if (branchStep === 2) {
      gsap.fromTo(".bootcamp-branch-2", { scaleY: 0 }, { scaleY: 1, transformOrigin: "bottom", duration: 0.4, ease: "power2.out" });
      gsap.fromTo(".bootcamp-btn-3", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, delay: 0.3, ease: "back.out(1.5)" });
    }
  }, [branchStep]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div 
        className="bootcamp-ad-container" 
        ref={adRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsHovered(!isHovered)}
      >
        <div className="bootcamp-ad-card">
          <svg className="bootcamp-ad-svg-1" width="45" height="45" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0L61.2257 38.7743L100 50L61.2257 61.2257L50 100L38.7743 61.2257L0 50L38.7743 38.7743L50 0Z" fill="#FFF48D" stroke="#1D1C1C" strokeWidth="5" strokeLinejoin="round"/>
          </svg>

          <div className="bootcamp-ad-badge">NEW</div>
          <h3 className="bootcamp-ad-title">Bootcamp Event</h3>
          <p className="bootcamp-ad-desc">Join our latest bootcamp and level up your skills!</p>
          
          <div className="bootcamp-branch-container">
            {branchStep >= 2 && (
              <div className="bootcamp-branch-level">
                <button 
                  className="bootcamp-ad-btn bootcamp-btn-3 bootcamp-aura-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/Bootcamp-info"); // Plain navigation, no full screen teleport
                  }}
                >
                  Click me
                </button>
                <div className="bootcamp-branch-line bootcamp-branch-2"></div>
              </div>
            )}

            {branchStep >= 1 && (
              <div className="bootcamp-branch-level">
                <button 
                  className="bootcamp-ad-btn bootcamp-btn-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (branchStep === 1) setBranchStep(2);
                  }}
                >
                  Do you wanna know about this event
                </button>
                <div className="bootcamp-branch-line bootcamp-branch-1"></div>
              </div>
            )}

            <button 
              className="bootcamp-ad-btn mythical-gradient-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (branchStep === 0) setBranchStep(1);
                else navigate("/Bootcamp");
              }}
            >
              Register Now
            </button>
          </div>
          
          <svg className="bootcamp-ad-svg-2" width="35" height="35" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill="#7AF7F7" stroke="#1D1C1C" strokeWidth="6"/>
            <path d="M30 50L45 65L70 35" stroke="#1D1C1C" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Peeking Tabs on Scroll */}
      <div className="bootcamp-peek-tab left-peek" ref={leftPeekRef} onClick={scrollToTop}>
        <div className="peek-content">A Bootcamp event going on</div>
      </div>
      <div className="bootcamp-peek-tab right-peek" ref={rightPeekRef} onClick={scrollToTop}>
        <div className="peek-content">A Bootcamp event going on</div>
      </div>
    </>
  );
};

export default BootcampAd;
