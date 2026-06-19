import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ContactUs = () => {
  const sectionRef = useRef(null);
  const footerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const sec = sectionRef.current;
      if (sec) {
        gsap.fromTo('.contact-title-art',
          { opacity: 0, y: 50, filter: "blur(10px)" },
          {
            opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: sec, start: "top 75%" }
          }
        );
        
        gsap.fromTo('.social-bento-card',
          { opacity: 0, scale: 0.5, y: 100, rotationX: 45, transformPerspective: 1000 },
          {
            opacity: 1, scale: 1, y: 0, rotationX: 0, 
            duration: 1.5, stagger: 0.15, ease: "expo.out",
            scrollTrigger: { trigger: ".bento-container", start: "top 80%" }
          }
        );
      }
    });

    // Advanced 3D Hover Effect
    const handleMouseMove = (e, index) => {
      const card = cardsRef.current[index];
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      gsap.to(card, {
        rotationX,
        rotationY,
        scale: 1.05,
        transformPerspective: 1000,
        ease: "power2.out",
        duration: 0.4
      });
      
      // Move internal deco element
      const deco = card.querySelector('.bento-deco');
      if (deco) {
          gsap.to(deco, {
              x: (x - centerX) * 0.1,
              y: (y - centerY) * 0.1,
              duration: 0.4,
              ease: "power2.out"
          });
      }
    };

    const handleMouseLeave = (index) => {
      const card = cardsRef.current[index];
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        ease: "power3.out",
        duration: 0.8
      });
      
      const deco = card.querySelector('.bento-deco');
      if (deco) {
          gsap.to(deco, { x: 0, y: 0, duration: 0.8, ease: "power3.out" });
      }
    };

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      card.addEventListener('mousemove', (e) => handleMouseMove(e, index));
      card.addEventListener('mouseleave', () => handleMouseLeave(index));
    });

    return () => {
      ctx.revert();
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        card.removeEventListener('mousemove', (e) => handleMouseMove(e, index));
        card.removeEventListener('mouseleave', () => handleMouseLeave(index));
      });
    };
  }, []);

  return (
    <>
      <div id="page4" className="contact-section-art" ref={sectionRef}>
        <div className="contact-container-art">
          <div className="contact-header-art">
            <h2 className="contact-title-art">Follow Us</h2>
            <p className="contact-subtitle-art">Join our global network of builders and creators.</p>
          </div>

          <div className="bento-container">
            {/* LinkedIn Card */}
            <a 
              href="https://www.linkedin.com/company/msfttechcommunity" 
              target="_blank" 
              rel="noreferrer" 
              className="social-bento-card bento-linkedin"
              ref={el => cardsRef.current[0] = el}
            >
              <div className="bento-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <span className="bento-text">LinkedIn</span>
              <div className="bento-deco bento-deco-1"></div>
            </a>

            {/* Instagram Card */}
            <a 
              href="https://www.instagram.com/microsoftlearnstudentcommunity?igsh=NHFxMDU1bnJndXZw&utm_source=qr" 
              target="_blank" 
              rel="noreferrer" 
              className="social-bento-card bento-insta"
              ref={el => cardsRef.current[1] = el}
            >
              <div className="bento-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>
              <span className="bento-text">Instagram</span>
              <div className="bento-deco bento-deco-2"></div>
            </a>
            
            {/* WhatsApp Card */}
            <a 
              href="https://chat.whatsapp.com/LibHu9zhM7EBxWpYYK2tZY" 
              target="_blank" 
              rel="noreferrer" 
              className="social-bento-card bento-whatsapp"
              ref={el => cardsRef.current[2] = el}
            >
              <div className="bento-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <span className="bento-text">WhatsApp</span>
              <div className="bento-deco bento-deco-3"></div>
            </a>

          </div>
        </div>
      </div>

      <footer id="footer" className="tiwis-footer" ref={footerRef}>
        <div className="tiwis-footer-inner">
          <div className="tiwis-top-section">
            <div className="tiwis-action-box">
              <p className="tiwis-question" style={{ color: '#fff', fontWeight: '500', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                Join the revolution.<br />
                Connect, innovate, and <br />
                build the future.
              </p>
              <div className="tiwis-buttons">
                <a href="https://chat.whatsapp.com/LibHu9zhM7EBxWpYYK2tZY" target="_blank" rel="noreferrer" className="tiwis-btn tiwis-btn-pill">JOIN COMMUNITY</a>
              </div>
            </div>
          </div>
          <div className="tiwis-bottom-section">
            <h2 className="tiwis-main-title">MTC</h2>
            <div className="tiwis-info-links">
              <div className="tiwis-contact">
                <a href="https://chat.whatsapp.com/LibHu9zhM7EBxWpYYK2tZY">WHATSAPP</a>
                <a href="https://www.linkedin.com/company/msfttechcommunity">LINKEDIN</a>
                <a href="https://www.instagram.com/microsoftlearnstudentcommunity?igsh=NHFxMDU1bnJndXZw&utm_source=qr">INSTAGRAM</a>
              </div>
              <div className="tiwis-credits">
                <span>© 2026 MICROSOFT TECHNICAL COMMUNITY</span>
                <span>AMITY UNIVERSITY NOIDA</span>
                <span className="tiwis-credit-madeby">MADE BY MTC TEAM</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ContactUs;
