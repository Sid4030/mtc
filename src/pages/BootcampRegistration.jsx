import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import './BootcampRegistration.css';

const BootcampRegistration = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const boardRef = useRef(null);
  const hoverAdRef = useRef(null);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', university: '', year: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Perfect Looping Kinetic Typography
      gsap.to('.kinetic-text-row.right .kinetic-inner', {
        xPercent: -50,
        ease: "none",
        duration: 15,
        repeat: -1
      });
      gsap.to('.kinetic-text-row.left .kinetic-inner', {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1
      });

      // Form entrance animation
      gsap.fromTo(boardRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 0.2 }
      );

      // Hover Ad floating animation
      gsap.to(hoverAdRef.current, {
        y: "-=20",
        rotation: -2,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok) {
        gsap.to(boardRef.current, {
          scale: 0.9, opacity: 0, duration: 0.4, onComplete: () => {
            alert("Registration Successful! Welcome to the Bootcamp.");
            navigate("/");
          }
        });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert("Failed to register. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const TextContent = "CREATE INNOVATE BUILD CREATE INNOVATE BUILD ";
  const TextContentMid = "THINK BEYOND LIMITS THINK BEYOND LIMITS ";

  return (
    <div className="bootcamp-reg-page bw-theme" ref={containerRef}>
      
      {/* Seamless Looping Kinetic Typography */}
      <div className="kinetic-text-container">
        <div className="kinetic-text-row right">
          <div className="kinetic-inner">
            <span>{TextContent}</span><span>{TextContent}</span>
          </div>
        </div>
        
        {/* Middle Row with Background */}
        <div className="kinetic-text-row left bg-row">
          <div className="kinetic-inner">
            <span>{TextContentMid}</span><span>{TextContentMid}</span>
          </div>
        </div>
        
        <div className="kinetic-text-row right">
          <div className="kinetic-inner">
            <span>{TextContent}</span><span>{TextContent}</span>
          </div>
        </div>
      </div>

      <div className="bootcamp-reg-content-wrapper">
        {/* Floating Background Shapes for form area */}
        <div style={{ position: 'absolute', top: '-10%', left: '-20%', width: '140%', height: '120%', zIndex: -1, pointerEvents: 'none' }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 100 Q 150 50 200 150 T 300 100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
            <circle cx="10%" cy="80%" r="40" fill="none" stroke="rgba(253, 116, 253, 0.15)" strokeWidth="2" strokeDasharray="5 5" />
            <rect x="85%" y="15%" width="60" height="60" fill="none" stroke="rgba(122, 247, 247, 0.15)" strokeWidth="2" transform="rotate(15, 85%, 15%)" />
            <path d="M 400 400 L 450 450 M 450 400 L 400 450" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
          </svg>
        </div>

        {/* Main Registration Board */}
        <div className="bootcamp-reg-board" ref={boardRef}>
          <div className="bootcamp-reg-badge">JOIN THE CLOUD</div>
          
          <h1 className="bootcamp-reg-title" ref={titleRef}>
            Bootcamp <br/> <span className="highlight-text sketch-text">Registration</span>
          </h1>
          
          <p className="bootcamp-reg-subtitle">
            Secure your spot in the Microsoft Tech Community. No credit card needed.
          </p>

          <form className="bootcamp-reg-form" ref={formRef} onSubmit={handleSubmit}>
            <div className="bootcamp-reg-input-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
            </div>

            <div className="bootcamp-reg-input-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
            </div>

            <div className="bootcamp-reg-input-group">
              <label>University / College</label>
              <input type="text" name="university" value={formData.university} onChange={handleChange} placeholder="Tech University" required />
            </div>

            <div className="bootcamp-reg-input-group">
              <label>Year of Study</label>
              <select name="year" value={formData.year} onChange={handleChange} required>
                <option value="" disabled>Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <button type="submit" className="bootcamp-reg-submit bw-btn" disabled={loading}>
              {loading ? "Processing..." : "Submit Application"}
            </button>
          </form>
        </div>

        {/* Floating Info Ad Board (Static on mobile) */}
        <div className="reg-hover-ad" ref={hoverAdRef} onClick={() => navigate('/Bootcamp-info')}>
          <div className="hover-ad-badge">INFO</div>
          <p>Want to know about this event?</p>
          <button className="hover-ad-btn">Click Here</button>
        </div>
      </div>

    </div>
  );
};

export default BootcampRegistration;
