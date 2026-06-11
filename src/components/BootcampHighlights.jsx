import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './BootcampHighlights.css';

gsap.registerPlugin(ScrollTrigger);

const BootcampHighlights = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.hl-card');
      
      cards.forEach((card, i) => {
        gsap.fromTo(card, 
          { y: 60, opacity: 0, rotateX: -15 },
          { 
            y: 0, opacity: 1, rotateX: 0, 
            duration: 1, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
      
      gsap.fromTo('.hl-icon', 
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 1.5, ease: "elastic.out(1, 0.3)", scrollTrigger: {
          trigger: '.hl-icon', start: "top 85%"
        }}
      );

      gsap.fromTo('.hl-partner-box',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: {
            trigger: '.hl-partner-box', start: "top 90%"
        }}
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="bootcamp-highlights-section" ref={sectionRef}>
      <div className="hl-container">
        
        <div className="hl-grid">
          <div className="hl-card">
            <h2 className="hl-title">
              <span className="hl-gradient-green">8 MENTORSHIP</span>
              <br/>
              <span className="hl-outline">SESSIONS</span>
            </h2>
            <p className="hl-desc">
              Direct guidance from industry experts to shape your technical journey. Participate in live, interactive sessions where you'll learn the core concepts of Azure AI directly from the pros.
            </p>
          </div>

          <div className="hl-card">
            <h2 className="hl-title">
              <span>BUILD</span>
              <br/>
              <span className="hl-gradient-orange">9 PROJECTS</span>
              <br/>
              <span className="hl-small">(8 MINI + 1 MEGA)</span>
            </h2>
            <p className="hl-desc">
              Which can upgrade your skills while working with this bootcamp. Get hands-on experience by building real-world AI applications that you can instantly add to your portfolio.
            </p>
          </div>

          <div className="hl-card">
            <h2 className="hl-title">
              <span className="hl-icon">✦</span>
              <span className="hl-gradient-purple">BEGINNER</span>
              <br/>
              <span>FRIENDLY</span>
            </h2>
            <p className="hl-desc">
              No prior AI experience required. We provide step-by-step guidance from setting up your free student subscription to deploying your first cloud application.
            </p>
          </div>

          <div className="hl-card">
            <h2 className="hl-title">
              <span>WIN</span>
              <br/>
              <span className="hl-gradient-pink">INTERNSHIPS</span>
              <br/>
              <span>&amp; GOODIES</span>
            </h2>
            <p className="hl-desc">
              Top performers in the capstone project stand a chance to earn exclusive internships and premium Microsoft Tech Community swags to celebrate their achievements.
            </p>
          </div>
        </div>

        <div className="hl-partner-box">
          <p className="hl-partner-label">INDUSTRY PARTNER:</p>
          <h2 className="hl-partner-title">
            <span className="hl-gradient-blue">KAPIDHWAJ</span>
            <br/>
            <span className="hl-outline">INNOVATIONS</span>
          </h2>
          <p className="hl-desc text-center">
            Empowering the next generation of developers with cutting-edge industry insights and opportunities.
          </p>
        </div>

      </div>
    </section>
  );
};

export default BootcampHighlights;
