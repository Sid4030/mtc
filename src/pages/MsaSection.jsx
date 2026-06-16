import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Counter from "../components/Counter";
import "./MsaSection.css";

gsap.registerPlugin(ScrollTrigger);

const MsaSection = () => {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Title Reveal
            gsap.fromTo(".msa-title-word",
                { y: 100, opacity: 0, rotateZ: 5 },
                {
                    y: 0, opacity: 1, rotateZ: 0,
                    duration: 1.2, stagger: 0.1, ease: "power4.out",
                    scrollTrigger: { trigger: ".msa-header", start: "top 80%" }
                }
            );

            // Shape Cards GSAP Assembly Animation
            const cards = gsap.utils.toArray(".shape-card");
            
            // Complex Entrance
            gsap.fromTo(cards,
                { 
                    y: (i) => i % 2 === 0 ? 150 : -150, 
                    x: (i) => i % 2 === 0 ? -100 : 100,
                    opacity: 0, 
                    scale: 0.8,
                    rotation: (i) => i * 15
                },
                {
                    y: 0, x: 0, opacity: 1, scale: 1, rotation: 0,
                    duration: 1.8,
                    stagger: 0.2,
                    ease: "elastic.out(1, 0.7)",
                    scrollTrigger: { trigger: ".msa-shapes-container", start: "top 70%" }
                }
            );

            // Parallax glow
            gsap.to(".msa-glow-orb", {
                yPercent: 50,
                scale: 1.3,
                rotation: 45,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5,
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Interactive Hover effect on cards
    const handleCardHover = (e) => {
        gsap.to(e.currentTarget, { 
            scale: 1.05, 
            y: -10,
            z: 50,
            rotationX: 2,
            rotationY: 2,
            boxShadow: "0 40px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 164, 239, 0.2)",
            duration: 0.5, 
            ease: "power3.out" 
        });
    };
    const handleCardLeave = (e) => {
        gsap.to(e.currentTarget, { 
            scale: 1, 
            y: 0,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            duration: 0.5, 
            ease: "power3.out" 
        });
    };

    return (
        <section id="page-msa" className="msa-section-art" ref={sectionRef}>
            <div className="msa-glow-orb"></div>
            <div className="msa-container" ref={containerRef}>
                <div className="msa-header">
                    <p className="msa-badge-art">Student Program</p>
                    <h2 className="msa-title-art">
                        <span className="title-overflow"><span className="msa-title-word">Microsoft</span></span>
                        <span className="title-overflow"><span className="msa-title-word text-gradient">Student</span></span>
                        <span className="title-overflow"><span className="msa-title-word">Ambassadors</span></span>
                    </h2>
                    <p className="msa-description-art">
                        Empowering students globally to learn, lead, and impact their local communities through technology.
                    </p>
                </div>

                <div className="msa-shapes-container">
                    {/* Shape 1: Rectangle */}
                    <div 
                        className="shape-card shape-glass shape-rect" 
                        style={{ '--border-color': '#00a4ef' }}
                        onMouseEnter={handleCardHover} onMouseLeave={handleCardLeave}
                    >
                        <div className="shape-content">
                            <h3>Learn & Grow</h3>
                            <p>Access to Microsoft technologies, training, and certifications.</p>
                        </div>
                        <div className="deco-shape deco-ui-window bottom-left">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                                <rect x="2" y="4" width="20" height="16" />
                                <rect x="2" y="4" width="20" height="6" fill="currentColor" />
                                <rect x="16" y="5" width="4" height="4" fill="#1a1a1a" />
                            </svg>
                        </div>
                    </div>

                    {/* Shape 2: Circle */}
                    <div 
                        className="shape-card shape-glass shape-circle"
                        style={{ '--border-color': '#ffb900' }}
                        onMouseEnter={handleCardHover} onMouseLeave={handleCardLeave}
                    >
                        <div className="shape-content">
                            <h3>Global Network</h3>
                            <p>Connect with a worldwide ecosystem of students.</p>
                        </div>
                        <div className="deco-shape deco-ui-copilot top-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                                <rect x="4" y="2" width="16" height="20" />
                                <rect x="2" y="4" width="20" height="16" />
                                <rect x="10" y="8" width="4" height="8" fill="currentColor" />
                            </svg>
                        </div>
                    </div>

                    {/* Shape 3: U-shape */}
                    <div 
                        className="shape-card shape-glass shape-u"
                        style={{ '--border-color': '#f25022' }}
                        onMouseEnter={handleCardHover} onMouseLeave={handleCardLeave}
                    >
                        <div className="shape-content">
                            <h3>Career Ops</h3>
                            <p>Exclusive pathways to internships and mentorship.</p>
                        </div>
                        <div className="deco-shape deco-ui-terminal bottom-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                                <polyline points="4 6 10 12 4 18"/>
                                <rect x="12" y="16" width="8" height="4" fill="currentColor" stroke="none" />
                            </svg>
                        </div>
                    </div>

                    {/* Shape 4: Leaf */}
                    <div 
                        className="shape-card shape-glass shape-leaf"
                        style={{ '--border-color': '#7fba00' }}
                        onMouseEnter={handleCardHover} onMouseLeave={handleCardLeave}
                    >
                        <div className="shape-content">
                            <h3>Innovation</h3>
                            <p>Lead impactful community projects and build solutions.</p>
                        </div>
                        <div className="deco-shape deco-ui-cursor top-left">
                            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
                                <polygon points="4 2 11 22 14 14 22 11 4 2"/>
                            </svg>
                        </div>
                        <div className="deco-shape deco-ui-code bottom-right">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                                <polyline points="14 18 20 12 14 6"/>
                                <polyline points="10 6 4 12 10 18"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="msa-stats-art">
                    <div className="stat-block">
                        <span className="stat-num"><Counter end={500} suffix="+" /></span>
                        <span className="stat-text" style={{ color: '#00a4ef' }}>Ambassadors</span>
                    </div>
                    <div className="stat-block">
                        <span className="stat-num"><Counter end={100} suffix="+" /></span>
                        <span className="stat-text" style={{ color: '#ffb900' }}>Countries</span>
                    </div>
                    <div className="stat-block">
                        <span className="stat-num"><Counter end={50} suffix="K+" /></span>
                        <span className="stat-text" style={{ color: '#7fba00' }}>Global Reach</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MsaSection;
