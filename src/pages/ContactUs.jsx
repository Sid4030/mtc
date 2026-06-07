import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const ContactUs = () => {
  const sectionRef = useRef(null);
  const footerRef = useRef(null);
  const formRef = useRef(null);
  const btnRef = useRef(null);
  const [btnText, setBtnText] = useState(
    <>
      <span>Send Message</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    </>
  );

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
    btnX.set((e.clientX - centerX) * 0.4); 
    btnY.set((e.clientY - centerY) * 0.4);
  };
  
  const handleMagneticLeave = () => {
    btnX.set(0);
    btnY.set(0);
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      const sec = sectionRef.current;
      if (sec) {
        gsap.fromTo('.contact-title',
          { opacity: 0, y: 80, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: sec, start: "top 80%", toggleActions: "play none none none" }
          }
        );
        gsap.fromTo('.contact-info-item',
          { opacity: 0, x: -50 },
          {
            opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: "power3.out",
            scrollTrigger: { trigger: sec, start: "top 80%", toggleActions: "play none none none" }
          }
        );
        if (formRef.current) {
          gsap.fromTo(formRef.current,
            { opacity: 0, y: 50, rotationY: 10 },
            {
              opacity: 1, y: 0, rotationY: 0, duration: 1, ease: "power3.out",
              scrollTrigger: { trigger: sec, start: "top 80%", toggleActions: "play none none none" }
            }
          );
        }
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!btnRef.current || !formRef.current) return;

    gsap.to(btnRef.current, {
      scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.inOut",
      onComplete: () => {
        setBtnText(<span>Message Sent! ✓</span>);
        btnRef.current.style.background = '#7fba00';

        setTimeout(() => {
          formRef.current.reset();
          setBtnText(
            <>
              <span>Send Message</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </>
          );
          btnRef.current.style.background = '';
        }, 3000);
      }
    });
  };

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    const nav = document.getElementById('mainNav');
    if (!section) return;
    const navHeight = nav ? nav.offsetHeight : 0;
    const sectionTop = section.offsetTop - navHeight;
    window.scrollTo({ top: sectionTop, behavior: 'smooth' });
  };

  return (
    <>
      <div id="page4" className="contact-section" ref={sectionRef}>
        <div className="contact-container">
          <div className="contact-header">
            <h2 className="contact-title">GET IN TOUCH</h2>
            <p className="contact-subtitle">Let's Build Something Amazing Together</p>
          </div>

          <div className="contact-content">
            <div className="contact-left">
              <div className="contact-info">
                <h3 className="contact-info-title">Contact Information</h3>

                <div className="contact-info-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h4>Email</h4>
                    <a href="mailto:mlsa@amity.edu">mlsa@amity.edu</a>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="contact-details">
                    <h4>Location</h4>
                    <p>Amity University<br />Noida, Uttar Pradesh</p>
                  </div>
                </div>

                
              </div>

              <div className="contact-social">
                <h4>Follow Us</h4>
                <div className="contact-social-icons">
                  <a href="#" className="contact-social-icon" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                  <a href="#" className="contact-social-icon" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                  <a href="#" className="contact-social-icon" aria-label="GitHub">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </a>
                  <a href="#" className="contact-social-icon" aria-label="YouTube">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-right">
              <form className="contact-form" id="contactForm" ref={formRef} onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" name="subject" required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="6" required></textarea>
                </div>
                <motion.button 
                  type="submit" 
                  className="contact-submit-btn glass-magnetic" 
                  ref={btnRef}
                  style={{ x: springBtnX, y: springBtnY }}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                >
                  {btnText}
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <footer id="footer" className="tiwis-footer" ref={footerRef}>
        <div className="tiwis-footer-inner">
          
          <div className="tiwis-top-section">
            <div className="tiwis-action-box">
              <p className="tiwis-question">
                An idea, a project,<br />
                or simply need to challenge<br />
                the status quo?
              </p>
              <div className="tiwis-buttons">
                <a href="#contactForm" className="tiwis-btn tiwis-btn-outline">SAY HELLO</a>
                <a href="#page1" className="tiwis-btn tiwis-btn-pill">LET'S START</a>
              </div>
            </div>
          </div>

          <div className="tiwis-bottom-section">
            <h2 className="tiwis-main-title">MTC</h2>
            
            <div className="tiwis-info-links">
              <div className="tiwis-contact">
                <a href="mailto:contact@microsoftcommunity.amity.edu">HELLO@MLSA.COM</a>
                <a href="#">LINKEDIN</a>
                <a href="#">TWITTER</a>
              </div>
              <div className="tiwis-credits">
                <span>© 2025 MICROSOFT TECHNICAL COMMUNITY</span>
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