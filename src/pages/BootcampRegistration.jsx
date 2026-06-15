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
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', contactNumber: '', collegeType: '', enrollmentNo: '',
    collegeName: '', courseName: '', specialisation: '', year: '',
    linkedinUrl: '', githubUrl: '', motivation: ''
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  useEffect(() => {
    if (showSuccess && modalRef.current) {
      gsap.fromTo(modalRef.current, 
        { scale: 0.8, opacity: 0, y: 50 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" }
      );
    }
  }, [showSuccess]);

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
            setShowSuccess(true);
          }
        });
        if (hoverAdRef.current) {
          gsap.to(hoverAdRef.current, { opacity: 0, duration: 0.4 });
        }
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
            <rect x="85%" y="15%" width="60" height="60" fill="none" stroke="rgba(122, 247, 247, 0.15)" strokeWidth="2" transform="rotate(15)" />
            <path d="M 400 400 L 450 450 M 450 400 L 400 450" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
          </svg>
        </div>

        {/* Success Modal Overlay */}
        {showSuccess && (
          <div className="success-modal-overlay">
            <div className="success-modal-box" ref={modalRef}>
              <div className="success-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h2 className="success-title">Thank You!</h2>
              <p className="success-message">
                Your application has been successfully submitted! A copy of your details has been sent to your email.
                <br/><br/>
                <strong>Note:</strong> If you don't see the email in your inbox, please make sure to check your <strong>Spam or Junk</strong> folder.
              </p>
              <p className="success-message highlight">
                Please join our official WhatsApp group to receive all event updates, links, and announcements.
              </p>
              <div className="success-actions">
                <a href="https://chat.whatsapp.com/LpzfCa69X0T01YaWdjYrlT?s=sh&p=i&ilr=0&amv=2" target="_blank" rel="noreferrer" className="whatsapp-btn">
                  Join WhatsApp Group
                </a>
                <button onClick={() => navigate("/")} className="return-home-btn">
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Registration Board */}
        {!showSuccess && (
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
                <label>Full Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
              </div>

              <div className="bootcamp-reg-input-group">
                <label>Email Address <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
              </div>

              <div className="bootcamp-reg-input-group">
                <label>Contact Number (WhatsApp) <span className="text-red-500">*</span></label>
                <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="+91 9876543210" required />
              </div>

              <div className="bootcamp-reg-input-group">
                <label>College <span className="text-red-500">*</span></label>
                <select name="collegeType" value={formData.collegeType} onChange={handleChange} required>
                  <option value="" disabled>Select College</option>
                  <option value="Amity">Amity University</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {formData.collegeType === 'Amity' && (
                <div className="bootcamp-reg-input-group">
                  <label>Enrollment No. <span className="text-red-500">*</span></label>
                  <input type="text" name="enrollmentNo" value={formData.enrollmentNo} onChange={handleChange} placeholder="A123456789" required />
                </div>
              )}

              {formData.collegeType === 'Other' && (
                <div className="bootcamp-reg-input-group">
                  <label>College Name <span className="text-red-500">*</span></label>
                  <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} placeholder="Tech University" required />
                </div>
              )}

              <div className="bootcamp-reg-input-group">
                <label>Course Name <span className="text-red-500">*</span></label>
                <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} placeholder="e.g. BTech, BCA" required />
              </div>

              <div className="bootcamp-reg-input-group">
                <label>Specialisation <span className="text-red-500">*</span></label>
                <input type="text" name="specialisation" value={formData.specialisation} onChange={handleChange} placeholder="e.g. CSE, Data Science" required />
              </div>

              <div className="bootcamp-reg-input-group">
                <label>Year of Study <span className="text-red-500">*</span></label>
                <select name="year" value={formData.year} onChange={handleChange} required>
                  <option value="" disabled>Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div className="bootcamp-reg-input-group">
                <label>LinkedIn URL <span className="text-red-500">*</span></label>
                <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/username" required />
              </div>

              <div className="bootcamp-reg-input-group">
                <label>Github URL <span className="text-gray-500 text-sm font-normal ml-2">(Optional)</span></label>
                <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="https://github.com/username" />
              </div>

              <div className="bootcamp-reg-input-group">
                <label>Motivation to Join <span className="text-gray-500 text-sm font-normal ml-2">(Optional)</span></label>
                <textarea name="motivation" value={formData.motivation} onChange={handleChange} placeholder="Why do you want to join this bootcamp?" rows="3" style={{width: '100%', padding: '12px', background: '#F4F4F0', border: '3px solid #1D1C1C', borderRadius: '8px', color: '#1D1C1C', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', outline: 'none', resize: 'vertical'}}></textarea>
              </div>

              <button type="submit" className="bootcamp-reg-submit bw-btn" disabled={loading}>
                {loading ? "Processing..." : "Submit Application"}
              </button>
            </form>
          </div>
        )}

        {/* Floating Info Ad Board (Static on mobile) */}
        {!showSuccess && (
          <div className="reg-hover-ad" ref={hoverAdRef} onClick={() => navigate('/Bootcamp-info')}>
            <div className="hover-ad-badge">INFO</div>
            <p>Want to know about this event?</p>
            <button className="hover-ad-btn">Click Here</button>
          </div>
        )}
      </div>

    </div>
  );
};

export default BootcampRegistration;
