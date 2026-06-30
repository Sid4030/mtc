import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './BootcampInfo.css';
import BootcampHighlights from '../components/BootcampHighlights';
import BootcampTeam from '../components/BootcampTeam';
import BadgeVerificationModal from '../components/BadgeVerificationModal';
import ProjectSubmissionModal from '../components/ProjectSubmissionModal';
import Leaderboard from '../components/Leaderboard';

import kapidhwajLogo from '../assets/kapidhwaj_logo.png';

gsap.registerPlugin(ScrollTrigger);

const bootcampSessions = [
  { num: "1", title: "Intro to Azure AI", service: "Azure Portal + Student Sub", project: "My Azure AI Dashboard", desc: "Activate your free student subscription and deploy a free Azure AI multi-service resource. Build a live dashboard to track your AI endpoint status." },
  { num: "2", title: "Language AI", service: "Azure AI Language", project: "Sentiment Analyser App", desc: "Extract sentiment, key phrases, and entities using the REST API. Build a web form that assigns an AI-powered sentiment badge to any review." },
  { num: "3", title: "Vision AI", service: "Azure AI Vision", project: "Smart Image Tagger", desc: "Auto-generate captions, object tags, and extract text (OCR). Upload images via a drag-and-drop web app." },
  { num: "4", title: "Speech AI", service: "Azure AI Speech", project: "Voice Notes App", desc: "Real-time transcription and voice generation. Speak your notes and have them read back with a generated voice in the browser." },
  { num: "5", title: "Azure OpenAI", service: "Azure OpenAI S0", project: "Smart FAQ Bot", desc: "Master system prompts and chain-of-thought in the Azure AI Foundry playground. Build a bot with scoped FAQ responses." },
  { num: "6", title: "RAG Apps", service: "Azure AI Search + OpenAI", project: "Ask My Docs", desc: "Index documents and query them with natural language. Build a grounded chatbot that references uploaded PDFs without hallucinations." },
  { num: "7", title: "AI Agents", service: "Copilot Studio", project: "Teams Helpdesk Bot", desc: "Build a no-code AI agent with custom topics and knowledge base connections. Deploy directly to Microsoft Teams.", expandedDesc: "\"Community Helpdesk Bot\" — A Teams bot that answers FAQs about your community (event dates, how to join, resources). Connected to a shared FAQ doc. Published and live in Teams by end of session." },
  { num: "8", title: "Deploy & Ship", service: "Static Web Apps + Functions", project: "Full AI Web App", desc: "Put it all together with a serverless AI backend and frontend hosting. Deploy a combined portfolio app with a live public URL.", expandedDesc: "\"Your AI Portfolio App\" — A personal AI showcase web app with 3 tabs: (1) Review Analyser (Session 2), (2) Image Tagger (Session 3), (3) Ask My Docs (Session 6). Fully deployed with a live Azure URL. This is their shareable proof of work." },
  { num: "🏆", title: "Capstone Project", service: "3+ Azure AI Services", project: "Azure AI Mini Product", desc: "Submit a real-world tool using at least 3 services. Get featured on the Tech Community page and receive LinkedIn shoutouts!", expandedDesc: <><p>Submit a real-world tool using at least 3 services. Get featured on the Tech Community page and receive LinkedIn shoutouts!</p><p style={{marginTop: '1rem'}}><strong>Examples:</strong></p><ul style={{listStyleType: 'none', paddingLeft: 0, marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}><li>• 🏥 <em>Health Query Bot</em> — takes symptoms as voice input (Speech AI), analyses urgency (Language AI), and answers from a medical FAQ doc (RAG + OpenAI)</li><li>• 📚 <em>Smart Study Assistant</em> — scans lecture notes via OCR (Vision AI), summarises them (OpenAI), and answers student questions (RAG)</li><li>• 🎙️ <em>Meeting Intelligence Tool</em> — transcribes a meeting (Speech AI), extracts action items and sentiment (Language AI), generates a summary (OpenAI)</li></ul></> }
];

const BootcampInfo = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [expandedCard, setExpandedCard] = useState(null);
  const [cardBounds, setCardBounds] = useState(null);
  const [contentVisible, setContentVisible] = useState(false);
  const overlayRef = useRef(null);
  const expandedCardRef = useRef(null);

  // New states for badges integration
  const [dbSessions, setDbSessions] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [userProgress, setUserProgress] = useState(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);


  // Fetch session configs on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('trackerEmail');
    if (savedEmail) setUserEmail(savedEmail);

    fetch('/api/badges/sessions')
      .then(res => res.json())
      .then(data => setDbSessions(data))
      .catch(err => console.error("Error fetching sessions:", err));
  }, []);

  const fetchProgress = async (email, cardNum) => {
    try {
      const res = await fetch(`/api/badges/progress/${email}/session_${cardNum}`);
      if (res.ok) {
        const data = await res.json();
        const wasIncomplete = userProgress ? !userProgress.allModulesCompleted : true;
        setUserProgress(data);
        

      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (expandedCard && userEmail && expandedCard.num !== '🏆') {
      fetchProgress(userEmail, expandedCard.num);
    }
  }, [expandedCard, userEmail]);

  const handleVerifySuccess = (email) => {
    setUserEmail(email);
    if (expandedCard) fetchProgress(email, expandedCard.num);
  };

  const handleCardClick = (session, index, event) => {
    if (expandedCard) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setCardBounds(rect);
    setExpandedCard({ ...session, index });
  };

  const closeExpandedCard = () => {
    if (!expandedCardRef.current || !cardBounds) return;
    setContentVisible(false);
    gsap.to(expandedCardRef.current, {
      top: cardBounds.top,
      left: cardBounds.left,
      width: cardBounds.width,
      height: cardBounds.height,
      duration: 0.4,
      ease: "power3.inOut",
      onComplete: () => {
        setExpandedCard(null);
        setCardBounds(null);
      }
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power3.inOut"
    });
  };

  useEffect(() => {
    if (expandedCard && expandedCardRef.current && cardBounds) {
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
      
      // Set initial state matching exactly the clicked card's bounds
      gsap.set(expandedCardRef.current, {
        position: 'fixed',
        top: cardBounds.top,
        left: cardBounds.left,
        width: cardBounds.width,
        height: cardBounds.height,
        zIndex: 10001,
        margin: 0,
        xPercent: 0,
        yPercent: 0
      });

      // Calculate destination bounds (centered)
      const isMobile = window.innerWidth <= 768;
      const destWidth = isMobile ? window.innerWidth * 0.9 : window.innerWidth * 0.6;
      const destHeight = isMobile ? window.innerHeight * 0.8 : window.innerHeight * 0.7;
      const destTop = (window.innerHeight - destHeight) / 2;
      const destLeft = (window.innerWidth - destWidth) / 2;

      // Animate to center bounds
      gsap.to(expandedCardRef.current, {
        top: destTop,
        left: destLeft,
        width: destWidth,
        height: destHeight,
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => setContentVisible(true)
      });

      gsap.fromTo(overlayRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.5, ease: "power3.inOut" }
      );
    } else {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }
    
    // Cleanup if component unmounts while modal is open
    return () => { 
      document.body.style.overflow = ''; 
      if (window.lenis) window.lenis.start();
    };
  }, [expandedCard]);

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

  // True Sinusoidal Wave Component (Highly Optimized)
  const SinusoidalWave = ({ gradient, speed, amplitude, frequency, height, yOffset, opacity = 1 }) => {
    const period = (2 * Math.PI) / frequency;
    // Render an extra period on both sides to allow seamless CSS scrolling
    const startX = -period;
    const endX = 1440 + period;
    
    const { d, duration, translateTo } = React.useMemo(() => {
      const points = [];
      for (let x = startX; x <= endX; x += 10) {
        const y = Math.sin(x * frequency) * amplitude + yOffset;
        points.push(`${x},${y}`);
      }
      const pathData = `M${startX},${height} L${startX},${points[0].split(',')[1]} ` + points.map(p => `L${p}`).join(' ') + ` L${endX},${height} Z`;
      
      const dur = (2 * Math.PI) / Math.abs(speed) / 60;
      const transTo = speed > 0 ? -period : period;
      
      return { d: pathData, duration: dur, translateTo: transTo };
    }, [speed, amplitude, frequency, height, yOffset, period, startX, endX]);

    return (
      <path 
        fill={`url(#${gradient})`} 
        stroke="#1d1c1c" 
        strokeWidth="8" 
        className="wave-path" 
        opacity={opacity} 
        d={d}
        style={{
          '--translate-to': `${translateTo}px`,
          animation: `waveScrollAnim ${duration}s linear infinite`,
          willChange: 'transform'
        }}
      />
    );
  };

  return (
    <div className="bootcamp-info-page" ref={containerRef}>
      <Helmet>
        <title>Bootcamp Info | Microsoft Tech Community</title>
        <meta name="description" content="Join the ultimate 8-session Azure AI Bootcamp hosted by Microsoft Tech Community. Push your technical boundaries, build 9 real AI projects, and win internships. Explore Azure AI, Copilot Studio, and more." />
        <meta name="keywords" content="Bootcamp Info, Azure AI, Bootcamp, Microsoft Tech Community, Kapidhwaj Innovations, AI Projects, Machine Learning, Copilot Studio, MLSA, Free AI Bootcamp" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Bootcamp Info | Microsoft Tech Community" />
        <meta property="og:description" content="Discover the ultimate hands-on Azure AI series. Build real AI products, master generative AI, and win internships." />
        <meta property="og:image" content="https://techcommunity.microsoft.com/msteams_16.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bootcamp Info | Microsoft Tech Community" />
        <meta name="twitter:description" content="Discover the ultimate hands-on Azure AI series. Build real AI products, master generative AI, and win internships." />
        <meta name="twitter:image" content="https://techcommunity.microsoft.com/msteams_16.png" />
      </Helmet>
      
      {/* 2D Blueprint Background (Optimized) */}
      <div className="sketch-blueprint-bg">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* High density sketchy grid */}
            <pattern id="sketch-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" strokeDasharray="4, 6" />
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
        {/* Optimized CSS Glowing Nodes */}
        <div className="hero-glow-nodes">
          <div className="glow-node node-1"></div>
          <div className="glow-node node-2"></div>
          <div className="glow-node node-3"></div>
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

      {/* Kinetic Typography Highlights Section */}
      <BootcampHighlights />

      <BootcampTeam />

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
              <h2>01. 8 LIVE SESSIONS</h2>
              <p>Join Microsoft MVPs and Student Ambassadors for 8 interactive sessions covering Azure AI fundamentals, Copilot Studio, and more.</p>
            </div>
          </div>
          <div className="info-card card-2">
            <div className="card-image bg-2"></div>
            <div className="card-content">
              <h2>02. 9 REAL PROJECTS</h2>
              <p>Build 8 mini-projects and 1 mega Capstone project to add to your resume. Get hands-on experience with real-world AI use cases.</p>
            </div>
          </div>
          <div className="info-card card-3">
            <div className="card-image bg-3"></div>
            <div className="card-content">
              <h2>03. WIN INTERNSHIPS</h2>
              <p>Top performers will be rewarded with internships at Kapidhwaj Innovations and exclusive Microsoft Tech Community swag kits.</p>
            </div>
          </div>
        </div>
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
        <div style={{ position: 'relative', zIndex: 20, marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <h2 className="timeline-section-title" style={{ margin: 0 }}>THE ROADMAP</h2>
          <button 
            className="mythical-hero-btn" 
            onClick={() => {
              document.getElementById('leaderboard')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ padding: '10px 24px', fontSize: '1rem', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #1a0f2e, #0f0518)', color: '#fd74fd', boxShadow: '0 0 15px rgba(253, 116, 253, 0.4)', borderRadius: '30px' }}
          >
            VIEW LEADERBOARD ↓
          </button>
        </div>
        <div className="timeline-container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="timeline-central-line"></div>
          
          {bootcampSessions.map((session, index) => {
            const isCapstone = index === bootcampSessions.length - 1;
            return (
            <div key={index} className={`timeline-card-wrapper ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-point" style={isCapstone ? { background: 'linear-gradient(45deg, #ff9a9e, #fd74fd)', border: 'none', boxShadow: '0 0 20px rgba(253, 116, 253, 0.6)' } : {}}>{session.num}</div>
              <div 
                className={`timeline-card ${isCapstone ? 'capstone-card' : ''}`} 
                onClick={(e) => handleCardClick(session, index, e)}
                style={{ opacity: expandedCard?.index === index ? 0 : 1, cursor: 'pointer' }}
              >
                <div className="tl-card-header">
                  <h3>{session.title}</h3>
                  <span className="tl-badge">{session.service}</span>
                </div>
                <div className="tl-card-body">
                  <h4>Tour: <span>{session.project}</span></h4>
                  <p>{session.desc}</p>
                </div>
              </div>
            </div>
          )})}
        </div>
        
        <div className="timeline-footer" style={{ position: 'relative', zIndex: 10 }}>
          <button className="info-huge-register-btn mythical-hero-btn" onClick={() => navigate('/Bootcamp')}>JOIN THE BOOTCAMP</button>
        </div>
      </section>

      
      {/* Expanded Roadmap Card Overlay */}
      {expandedCard && (
        <div className="expanded-card-backdrop" ref={overlayRef} onClick={closeExpandedCard} style={{ position: 'fixed', inset: 0, background: 'rgba(10, 10, 10, 0.95)', zIndex: 10000, opacity: 0 }}>
          <div className="timeline-card expanded" ref={expandedCardRef} onClick={e => e.stopPropagation()} data-lenis-prevent="true" style={{ background: '#fff', border: '4px solid #1d1c1c', borderRadius: '16px', boxShadow: '8px 8px 0 #1d1c1c', padding: contentVisible ? '3rem' : '2rem', position: 'fixed', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            
            {contentVisible ? (
              <div style={{ opacity: 1, transition: 'opacity 0.3s ease', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <button onClick={closeExpandedCard} style={{ position: 'absolute', top: '15px', right: '15px', background: '#1d1c1c', color: '#fff', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', transition: 'all 0.2s ease', zIndex: 10 }}>X</button>
                <div className="tl-badge" style={{ alignSelf: 'flex-start', marginBottom: '1rem', fontSize: '1rem' }}>{expandedCard.service}</div>
                <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#1d1c1c', textTransform: 'uppercase', marginBottom: '1.5rem' }}>{expandedCard.title}</h2>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.4rem', color: '#1d1c1c', fontWeight: 800, marginBottom: '1rem' }}>About Session</h4>
                  <p style={{ color: '#444', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>Dive deep into {expandedCard.title} and discover how to leverage {expandedCard.service} effectively. We will walk through the core concepts, discuss best practices, and lay the foundation for your project.</p>
                  
                  <h4 style={{ fontSize: '1.4rem', color: '#1d1c1c', fontWeight: 800, marginBottom: '1rem' }}>About Project</h4>
                  <div style={{ color: '#444', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>{expandedCard.expandedDesc || expandedCard.desc}</div>

                  {expandedCard.num !== '🏆' && (
                    <div style={{ marginTop: '30px' }}>
                      <h4 style={{ fontSize: '1.4rem', color: '#1d1c1c', fontWeight: 800, marginBottom: '15px' }}>Modules & Validation</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {(() => {
                          const sessionDb = dbSessions.find(s => s.sessionId === `session_${expandedCard.num}`);
                          if (!sessionDb) return <p style={{ color: '#444' }}>Loading modules...</p>;
                          
                          const isAllComplete = userProgress?.allModulesCompleted;
                          
                          return (
                            <>
                              {sessionDb.modules.map(mod => {
                                const isVerified = userProgress?.verifiedModules?.includes(mod.moduleId);
                                return (
                                  <div key={mod.moduleId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f5f5f5', padding: '15px', borderRadius: '8px', border: '1px solid #e0e0e0', flexWrap: 'wrap', gap: '10px' }}>
                                    <div>
                                      <strong style={{ 
                                        color: '#1d1c1c', 
                                        display: 'block', 
                                        fontSize: '1.1rem',
                                        filter: (expandedCard.num !== '1' && expandedCard.num !== 1 && expandedCard.num !== '2' && expandedCard.num !== 2 && expandedCard.num !== '3' && expandedCard.num !== 3 && expandedCard.num !== '4' && expandedCard.num !== 4 && expandedCard.num !== '🏆') ? 'blur(5px)' : 'none',
                                        userSelect: (expandedCard.num !== '1' && expandedCard.num !== 1 && expandedCard.num !== '2' && expandedCard.num !== 2 && expandedCard.num !== '3' && expandedCard.num !== 3 && expandedCard.num !== '4' && expandedCard.num !== 4 && expandedCard.num !== '🏆') ? 'none' : 'auto'
                                      }}>
                                        {mod.moduleName}
                                      </strong>
                                      <span style={{ fontSize: '0.9rem', color: '#666' }}>Requires MS Learn Badge</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                      {mod.moduleUrl && (
                                        <a href={mod.moduleUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                          <button 
                                            style={{ 
                                              background: '#ffffff', 
                                              color: '#1d1c1c', 
                                              padding: '8px 16px', 
                                              borderRadius: '6px', 
                                              border: '2px solid #1d1c1c', 
                                              cursor: 'pointer', 
                                              fontWeight: '900', 
                                              fontFamily: "'DM Sans', sans-serif",
                                              textTransform: 'uppercase',
                                              fontSize: '0.85rem',
                                              boxShadow: '4px 4px 0px #1d1c1c',
                                              transition: 'all 0.1s ease',
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '6px'
                                            }}
                                            onMouseOver={(e) => { e.currentTarget.style.transform = 'translate(2px, 2px)'; e.currentTarget.style.boxShadow = '2px 2px 0px #1d1c1c'; }}
                                            onMouseOut={(e) => { e.currentTarget.style.transform = 'translate(0px, 0px)'; e.currentTarget.style.boxShadow = '4px 4px 0px #1d1c1c'; }}
                                          >
                                            Go to Module 
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                              <line x1="7" y1="17" x2="17" y2="7"></line>
                                              <polyline points="7 7 17 7 17 17"></polyline>
                                            </svg>
                                          </button>
                                        </a>
                                      )}
                                      {isVerified ? (
                                        <div style={{ display: 'flex', alignItems: 'center', color: '#2ea043', fontWeight: 'bold' }}>
                                          <svg className="animated-tick" viewBox="0 0 24 24" fill="none" stroke="#2ea043" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px', marginRight: '6px' }}>
                                            <path className="tick-path" d="M20 6L9 17l-5-5" style={{ strokeDasharray: 50, strokeDashoffset: 50, animation: 'drawTick 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards' }} />
                                          </svg>
                                          Verified
                                        </div>
                                      ) : (
                                          <button 
                                            onClick={() => { setActiveModule(mod); setIsVerifyModalOpen(true); }} 
                                            disabled={expandedCard.num !== '1' && expandedCard.num !== 1 && expandedCard.num !== '2' && expandedCard.num !== 2 && expandedCard.num !== '3' && expandedCard.num !== 3 && expandedCard.num !== '4' && expandedCard.num !== 4 && expandedCard.num !== '🏆'}
                                            style={{ 
                                              background: (expandedCard.num !== '1' && expandedCard.num !== 1 && expandedCard.num !== '2' && expandedCard.num !== 2 && expandedCard.num !== '3' && expandedCard.num !== 3 && expandedCard.num !== '4' && expandedCard.num !== 4 && expandedCard.num !== '🏆') ? '#ccc' : '#1d1c1c', 
                                              color: (expandedCard.num !== '1' && expandedCard.num !== 1 && expandedCard.num !== '2' && expandedCard.num !== 2 && expandedCard.num !== '3' && expandedCard.num !== 3 && expandedCard.num !== '4' && expandedCard.num !== 4 && expandedCard.num !== '🏆') ? '#666' : '#fff', 
                                              padding: '8px 16px', 
                                              borderRadius: '6px', 
                                              border: 'none', 
                                              cursor: (expandedCard.num !== '1' && expandedCard.num !== 1 && expandedCard.num !== '2' && expandedCard.num !== 2 && expandedCard.num !== '3' && expandedCard.num !== 3 && expandedCard.num !== '4' && expandedCard.num !== 4 && expandedCard.num !== '🏆') ? 'not-allowed' : 'pointer', 
                                              fontWeight: 'bold' 
                                            }}
                                          >
                                            Verify Badge
                                          </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                              
                              <div style={{ marginTop: '20px', borderTop: '2px dashed #ccc', paddingTop: '20px' }}>
                                <h4 style={{ fontSize: '1.4rem', color: '#1d1c1c', fontWeight: 800, marginBottom: '10px' }}>Final Project</h4>
                                <p style={{ color: '#444', marginBottom: '15px' }}>Complete all modules to unlock the final project submission.</p>
                                {expandedCard.num === '1' || expandedCard.num === 1 || expandedCard.num === '2' || expandedCard.num === 2 || expandedCard.num === '3' || expandedCard.num === 3 || expandedCard.num === '4' || expandedCard.num === 4 || expandedCard.num === '🏆' ? (
                                  <button 
                                    onClick={() => setIsProjectModalOpen(true)}
                                    className="mythical-hero-btn"
                                    style={{ 
                                      width: '100%', padding: '16px', fontSize: '1.2rem', 
                                      background: undefined, 
                                      color: '#fff',
                                      cursor: 'pointer',
                                      border: 'none', borderRadius: '8px', fontWeight: 'bold',
                                      boxShadow: '0 0 20px rgba(253, 116, 253, 0.4)'
                                    }}
                                  >
                                    Submit Final Project
                                  </button>
                                ) : (
                                  <button 
                                    disabled
                                    className="mythical-hero-btn"
                                    style={{ 
                                      width: '100%', padding: '16px', fontSize: '1.2rem', 
                                      background: '#ccc', 
                                      color: '#666',
                                      cursor: 'not-allowed',
                                      border: 'none', borderRadius: '8px', fontWeight: 'bold',
                                      boxShadow: 'none'
                                    }}
                                  >
                                    🔒 Submit Final Project (Locked)
                                  </button>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
                
                <div style={{ marginTop: 'auto', paddingTop: '2rem', paddingBottom: '1rem', borderTop: '2px solid rgba(0,0,0,0.1)' }}>
                  {expandedCard.num === '1' || expandedCard.num === 1 ? (
                    <a href="https://stdntpartners-my.sharepoint.com/:v:/g/personal/abhishek_agrawal_studentambassadors_com/IQB7k6zL8l98QLhb0SY4r9h6AYYHQhH3cbl_rVkSgzsn-GA?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=Pv892S" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <button className="mythical-hero-btn" style={{ padding: '16px 32px', width: '100%', fontSize: '1.2rem', border: 'none', cursor: 'pointer', color: '#ffffff', background: 'linear-gradient(135deg, #d83b01, #a32a00)' }}>
                        🎥 Session Recording
                      </button>
                    </a>
                  ) : expandedCard.num === '2' || expandedCard.num === 2 ? (
                    <a href="https://stdntpartners-my.sharepoint.com/:v:/g/personal/abhishek_agrawal_studentambassadors_com/IQAtLOrrSUrSQKmdV8_-3r1bAW_8tdVe5vUSQuPkbF5w9pg?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=Gsd99I" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <button className="mythical-hero-btn" style={{ padding: '16px 32px', width: '100%', fontSize: '1.2rem', border: 'none', cursor: 'pointer', color: '#ffffff', background: 'linear-gradient(135deg, #d83b01, #a32a00)' }}>
                        🎥 Session Recording
                      </button>
                    </a>
                  ) : expandedCard.num === '3' || expandedCard.num === 3 ? (
                    <a href="https://stdntpartners-my.sharepoint.com/:v:/g/personal/abhishek_agrawal_studentambassadors_com/IQDtqFLVveBlQIOF7SIDftbbATk76HPOcRFJM3RNjsisG7E?e=KemO46&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <button className="mythical-hero-btn" style={{ padding: '16px 32px', width: '100%', fontSize: '1.2rem', border: 'none', cursor: 'pointer', color: '#ffffff', background: 'linear-gradient(135deg, #d83b01, #a32a00)' }}>
                        🎥 Session Recording
                      </button>
                    </a>
                  ) : expandedCard.num === '4' || expandedCard.num === 4 ? (
                    <a href="https://teams.microsoft.com/meet/2175882559256?p=0nSmBwH2qPyhJslvDm" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <button className="mythical-hero-btn" style={{ padding: '16px 32px', width: '100%', fontSize: '1.2rem', border: 'none', cursor: 'pointer', color: '#ffffff', background: 'linear-gradient(135deg, #464eb8, #5b5fc7)' }}>
                        📞 Join Teams Meeting
                      </button>
                    </a>
                  ) : (
                    <button disabled className="mythical-hero-btn" style={{ padding: '16px 32px', width: '100%', fontSize: '1.2rem', border: 'none', cursor: 'not-allowed', color: '#8b949e', background: '#30363d', boxShadow: 'none' }}>
                      🔒 Teams Link Locked
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ opacity: 1 }}>
                <div className="tl-card-header">
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.8rem', fontWeight: 900, color: '#1d1c1c', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{expandedCard.title}</h3>
                  <span className="tl-badge">{expandedCard.service}</span>
                </div>
                <div className="tl-card-body">
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1d1c1c', marginBottom: '0.5rem' }}>Mini Project: <span style={{ color: '#fd74fd' }}>{expandedCard.project}</span></h4>
                  <p style={{ color: '#444', fontSize: '1rem', lineHeight: 1.5 }}>{expandedCard.desc}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Leaderboard Section (Commented out for now) */}
      <Leaderboard />

      {/* Modals and Overlays */}
      <BadgeVerificationModal 
        isOpen={isVerifyModalOpen} 
        onClose={() => setIsVerifyModalOpen(false)} 
        module={activeModule}
        session={dbSessions.find(s => s.sessionId === `session_${expandedCard?.num}`)}
        onVerifySuccess={handleVerifySuccess}
      />
      <ProjectSubmissionModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        session={dbSessions.find(s => s.sessionId === `session_${expandedCard?.num}`)}
      />


    </div>
  );
};

export default BootcampInfo;
