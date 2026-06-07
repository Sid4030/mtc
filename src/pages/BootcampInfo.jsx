import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './BootcampInfo.css';

gsap.registerPlugin(ScrollTrigger);

const bootcampSessions = [
  { num: "1", title: "Intro to Azure AI", service: "Azure Portal + Student Sub", project: "My Azure AI Dashboard", desc: "Activate your free student subscription and deploy a free Azure AI multi-service resource. Build a live dashboard to track your AI endpoint status." },
  { num: "2", title: "Language AI", service: "Azure AI Language", project: "Sentiment Analyser App", desc: "Extract sentiment, key phrases, and entities using the REST API. Build a web form that assigns an AI-powered sentiment badge to any review." },
  { num: "3", title: "Vision AI", service: "Azure AI Vision", project: "Smart Image Tagger", desc: "Auto-generate captions, object tags, and extract text (OCR). Upload images via a drag-and-drop web app." },
  { num: "4", title: "Speech AI", service: "Azure AI Speech", project: "Voice Notes App", desc: "Real-time transcription and voice generation. Speak your notes and have them read back with a generated voice in the browser." },
  { num: "5", title: "Azure OpenAI", service: "Azure OpenAI S0", project: "Smart FAQ Bot", desc: "Master system prompts and chain-of-thought in the Azure AI Foundry playground. Build a bot with scoped FAQ responses." },
  { num: "6", title: "RAG Apps", service: "Azure AI Search + OpenAI", project: "Ask My Docs", desc: "Index documents and query them with natural language. Build a grounded chatbot that references uploaded PDFs without hallucinations." },
  { num: "7", title: "AI Agents", service: "Copilot Studio", project: "Teams Helpdesk Bot", desc: "Build a no-code AI agent with custom topics and knowledge base connections. Deploy directly to Microsoft Teams." },
  { num: "8", title: "Deploy & Ship", service: "Static Web Apps + Functions", project: "Full AI Web App", desc: "Put it all together with a serverless AI backend and frontend hosting. Deploy a combined portfolio app with a live public URL." },
  { num: "🏆", title: "Capstone Project", service: "3+ Azure AI Services", project: "Azure AI Mini Product", desc: "Submit a real-world tool using at least 3 services. Get featured on the Tech Community page and receive LinkedIn shoutouts!" }
];

const BootcampInfo = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      // Teleport Outro Transition
      if (location.state?.teleported) {
        gsap.to('.teleport-outro-overlay', {
          scale: 0,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          delay: 0.1
        });
      }
      
      // Intro Text Animation
      gsap.fromTo('.info-hero-title',
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power4.out", delay: 0.2 }
      );
      
      // Flying Planes Animation
      const planes = document.querySelectorAll('.flying-plane');
      planes.forEach((plane) => {
        gsap.set(plane, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 1.5
        });

        const fly = () => {
          const nextX = Math.random() * window.innerWidth;
          const nextY = Math.random() * window.innerHeight;
          const currentX = gsap.getProperty(plane, "x");
          const currentY = gsap.getProperty(plane, "y");
          const angle = Math.atan2(nextY - currentY, nextX - currentX) * (180 / Math.PI);

          gsap.to(plane, {
            x: nextX,
            y: nextY,
            rotation: angle + 45,
            duration: 4 + Math.random() * 6,
            ease: "sine.inOut",
            onComplete: fly
          });
        };
        fly();
      });

      // Sticky Horizontal Scroll Overhaul
      const cardsContainer = document.querySelector('.info-cards-horizontal-wrapper');
      const cards = gsap.utils.toArray('.info-card');
      
      if (cardsContainer && cards.length > 0) {
        const totalScrollDistance = cardsContainer.scrollWidth - window.innerWidth;
        
        gsap.to(cardsContainer, {
          x: -totalScrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: ".info-cards-container",
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => "+=" + totalScrollDistance
          }
        });
        
        // 2D Pencil Sketch Scribbles Animation (Optimized)
        gsap.to('.sketch-scribble', {
          strokeDashoffset: 0,
          duration: 8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });

        // Draw the background circles continuously
        gsap.utils.toArray('.sketch-circle').forEach((circle, i) => {
          gsap.fromTo(circle, 
            { strokeDashoffset: 1000 },
            { strokeDashoffset: 0, duration: 15 + i * 2, ease: "linear", repeat: -1 }
          );
          gsap.to(circle, {
            rotation: 360,
            transformOrigin: "center center",
            duration: 30 + i * 5,
            ease: "linear",
            repeat: -1
          });
        });
      }

      // Timeline Scroll Animation
      const timelineCards = gsap.utils.toArray('.timeline-card');
      timelineCards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, x: i % 2 === 0 ? -100 : 100, y: 50 },
          {
            opacity: 1, x: 0, y: 0,
            duration: 0.8,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Animate Timeline central line
      gsap.fromTo(".timeline-central-line", 
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: ".info-timeline-section",
            start: "top 50%",
            end: "bottom 80%",
            scrub: 1
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const PlaneSVG = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7AF7F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      <line x1="22" y1="2" x2="11" y2="13"></line>
    </svg>
  );

  // True Sinusoidal Wave Component
  const SinusoidalWave = ({ gradient, speed, amplitude, frequency, height, yOffset, opacity = 1 }) => {
    const pathRef = useRef(null);
    useEffect(() => {
      let frame;
      let time = 0;
      const animate = () => {
        time += speed;
        const points = [];
        for (let x = 0; x <= 1440; x += 20) {
          const y = Math.sin(x * frequency + time) * amplitude + yOffset;
          points.push(`${x},${y}`);
        }
        const d = `M0,${height} L0,${points[0].split(',')[1]} ` + points.map(p => `L${p}`).join(' ') + ` L1440,${height} Z`;
        if (pathRef.current) pathRef.current.setAttribute("d", d);
        frame = requestAnimationFrame(animate);
      };
      animate();
      return () => cancelAnimationFrame(frame);
    }, [speed, amplitude, frequency, height, yOffset]);
    return <path ref={pathRef} fill={`url(#${gradient})`} stroke="#1d1c1c" strokeWidth="8" className="wave-path" opacity={opacity} />;
  };

  return (
    <div className="bootcamp-info-page" ref={containerRef}>
      
      {/* 2D Blueprint Background (Optimized) */}
      <div className="sketch-blueprint-bg">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Lightweight sketchy grid */}
            <pattern id="sketch-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeLinecap="round" strokeDasharray="5, 8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sketch-grid)" />
          
          {/* Scribbles and tech vectors without heavy filters */}
          <g opacity="0.4">
            <path className="sketch-scribble" d="M 10 20 Q 50 10 80 50 T 150 100 T 250 80" fill="none" stroke="#fff" strokeWidth="3" />
            <path className="sketch-scribble" d="M 800 150 Q 850 200 900 120 T 1100 250" fill="none" stroke="#ffdf00" strokeWidth="2" />
            
            {/* Scribbled Circles */}
            <circle className="sketch-circle" cx="15%" cy="30%" r="80" fill="none" stroke="#fd74fd" strokeWidth="2" strokeDasharray="10 15 30 10" strokeDashoffset="1000" />
            <circle className="sketch-circle" cx="15.2%" cy="29.8%" r="82" fill="none" stroke="#fd74fd" strokeWidth="1" strokeDasharray="20 5" strokeDashoffset="1000" />
            
            <circle className="sketch-circle" cx="85%" cy="60%" r="120" fill="none" stroke="#7af7f7" strokeWidth="2" strokeDasharray="5 10" strokeDashoffset="1000" />
            <circle className="sketch-circle" cx="84.5%" cy="60.5%" r="118" fill="none" stroke="#7af7f7" strokeWidth="1" strokeDasharray="15 20" strokeDashoffset="1000" />
            
            {/* Random math/tech annotations */}
            <text x="20%" y="20%" fill="#fff" fontSize="14" fontFamily="'DM Sans', sans-serif" transform="rotate(-5, 200, 200)">f(x) = ∑ A·sin(ωt)</text>
            <text x="75%" y="80%" fill="#fff" fontSize="14" fontFamily="'DM Sans', sans-serif" transform="rotate(10, 800, 800)">// connect nodes</text>
            <text x="80%" y="25%" fill="#ffdf00" fontSize="18" fontFamily="'DM Sans', sans-serif">var ML_MODEL = true;</text>
          </g>
        </svg>
      </div>

      {/* Hero Section */}
      <section className="info-hero-section">
        <div className="planes-container">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`flying-plane plane-${i}`}><PlaneSVG /></div>
          ))}
        </div>

        <div className="info-hero-content">
          <div className="info-badge">Azure AI Free Tier</div>
          <h1 className="info-hero-title">DISCOVER THE ULTIMATE BOOTCAMP</h1>
          <p className="info-hero-subtitle text-light">
            Hosted by the Microsoft Tech Community. An 8-session hands-on series to push your technical boundaries and ship real AI products.
          </p>
          <div className="info-hero-actions">
            <button className="info-scroll-btn" onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}>
              SCROLL TO EXPLORE
            </button>
            <button className="info-register-btn mythical-hero-btn" onClick={() => navigate('/Bootcamp')}>
              REGISTER NOW
            </button>
          </div>
        </div>
      </section>

      {/* Sticky Horizontal Scroll Cards Section */}
      <section className="info-cards-container">
        {/* Floating Sketch Components in Scroll Area */}
        <div className="scroll-bg-components" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" opacity="0.5">
            <path className="sketch-scribble" d="M 300 800 Q 500 500 700 800 T 1000 600" fill="none" stroke="#fd74fd" strokeWidth="4" />
            <circle className="sketch-circle" cx="50%" cy="50%" r="250" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="10 10" />
            <text x="45%" y="45%" fill="#7af7f7" fontSize="24" fontFamily="'DM Sans', sans-serif" opacity="0.3" transform="rotate(-15, 600, 400)">function init() {'{'} </text>
          </svg>
        </div>

        <div className="info-cards-horizontal-wrapper" style={{ zIndex: 1 }}>
          <div className="info-card card-1">
            <div className="card-image bg-1"></div>
            <div className="card-content">
              <h2>01. LEARN & GROW</h2>
              <p>Immerse yourself in cutting-edge Azure AI technologies using free student subscriptions. No credit card needed.</p>
            </div>
          </div>
          <div className="info-card card-2">
            <div className="card-image bg-2"></div>
            <div className="card-content">
              <h2>02. SHIP PRODUCTS</h2>
              <p>Build sentiment analyzers, voice apps, and RAG chatbots. Deploy them instantly with Azure Static Web Apps.</p>
            </div>
          </div>
          <div className="info-card card-3">
            <div className="card-image bg-3"></div>
            <div className="card-content">
              <h2>03. CAPSTONE</h2>
              <p>Complete the 8-session series and submit a real-world tool using at least 3 AI services to get featured globally.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* True Sinusoidal Wave Transition Section */}
      <section className="info-wave-transition">
        <svg viewBox="0 0 1440 400" className="transition-wave-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fd74fd" />
              <stop offset="50%" stopColor="#ff9a9e" />
              <stop offset="100%" stopColor="#fd9140" />
            </linearGradient>
            <linearGradient id="wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#83f582" />
              <stop offset="50%" stopColor="#7ff6bc" />
              <stop offset="100%" stopColor="#7af7f7" />
            </linearGradient>
            <linearGradient id="wave-grad-3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1d1c1c" />
              <stop offset="100%" stopColor="#444" />
            </linearGradient>
          </defs>
          
          <SinusoidalWave gradient="wave-grad-3" speed={0.03} amplitude={60} frequency={0.005} height={450} yOffset={200} opacity={0.3} />
          <SinusoidalWave gradient="wave-grad-1" speed={0.05} amplitude={40} frequency={0.008} height={450} yOffset={230} />
          <SinusoidalWave gradient="wave-grad-2" speed={-0.04} amplitude={50} frequency={0.006} height={450} yOffset={300} />
        </svg>
      </section>

      {/* Inverted DNA Wave Transition Section */}
      <section className="info-wave-transition inverted" style={{ transform: 'rotate(180deg)', zIndex: 9, marginTop: '0px' }}>
        <svg viewBox="0 0 1440 400" className="transition-wave-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave-grad-1b" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fd9140" />
              <stop offset="50%" stopColor="#ff9a9e" />
              <stop offset="100%" stopColor="#fd74fd" />
            </linearGradient>
            <linearGradient id="wave-grad-2b" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7af7f7" />
              <stop offset="50%" stopColor="#7ff6bc" />
              <stop offset="100%" stopColor="#83f582" />
            </linearGradient>
            <linearGradient id="wave-grad-3b" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#444" />
              <stop offset="100%" stopColor="#1d1c1c" />
            </linearGradient>
          </defs>
          
          <SinusoidalWave gradient="wave-grad-3b" speed={0.03} amplitude={60} frequency={0.005} height={450} yOffset={200} opacity={0.3} />
          <SinusoidalWave gradient="wave-grad-1b" speed={0.05} amplitude={40} frequency={0.008} height={450} yOffset={230} />
          <SinusoidalWave gradient="wave-grad-2b" speed={-0.04} amplitude={50} frequency={0.006} height={450} yOffset={300} />
        </svg>
      </section>

      {/* Massive Timeline Section */}
      <section className="info-timeline-section" style={{ paddingTop: '4rem' }}>
        
        {/* Roadmap Background Components */}
        <div className="roadmap-bg-elements">
          <div className="rm-bg-circle rm-c1"></div>
          <div className="rm-bg-circle rm-c2"></div>
          <div className="rm-bg-grid"></div>
        </div>

        {/* Roadmap Title perfectly positioned under waves */}
        <h2 className="timeline-section-title" style={{ position: 'relative', zIndex: 20, marginTop: '20px' }}>THE ROADMAP</h2>
        <div className="timeline-container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="timeline-central-line"></div>
          
          {bootcampSessions.map((session, index) => (
            <div key={index} className={`timeline-card-wrapper ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-point">{session.num}</div>
              <div className="timeline-card">
                <div className="tl-card-header">
                  <h3>{session.title}</h3>
                  <span className="tl-badge">{session.service}</span>
                </div>
                <div className="tl-card-body">
                  <h4>Mini Project: <span>{session.project}</span></h4>
                  <p>{session.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="timeline-footer" style={{ position: 'relative', zIndex: 10 }}>
          <button className="info-huge-register-btn mythical-hero-btn" onClick={() => navigate('/Bootcamp')}>JOIN THE BOOTCAMP</button>
        </div>
      </section>

    </div>
  );
};

export default BootcampInfo;
