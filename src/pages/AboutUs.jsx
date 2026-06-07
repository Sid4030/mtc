import React, { useMemo, useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AboutUs.css';

gsap.registerPlugin(ScrollTrigger);

// Pull gallery assets from both current app and mlsa reference project.
const imageModules = {
  ...import.meta.glob('../assets/about_us_auto_scroll/*.{png,PNG,jpg,JPG,jpeg,JPEG,svg,SVG,webp,WEBP}'),
  ...import.meta.glob('../../mlsa/src/assets/about_us_auto_scroll/*.{png,PNG,jpg,JPG,jpeg,JPEG,svg,SVG,webp,WEBP}')
};

const About = () => {
  const containerRef = useRef(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const MAX_GALLERY_IMAGES = 8;

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(".about-content",
        { y: 150, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.4, 
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Defer heavy gallery imports to keep initial render responsive.
    let cancelled = false;
    const loadImages = async () => {
      const modules = Object.entries(imageModules)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(0, MAX_GALLERY_IMAGES);
      const paths = await Promise.all(
        modules.map(async ([, mod]) => {
          const res = await mod();
          return res.default;
        })
      );
      if (!cancelled) setGalleryImages(paths);
    };

    const run = () => loadImages();
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(run, { timeout: 1800 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timer = setTimeout(run, 900);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // Split images into two columns
  const { leftColumnImages, rightColumnImages } = useMemo(() => {
    if (galleryImages.length === 0) return { leftColumnImages: [], rightColumnImages: [] };
    const half = Math.ceil(galleryImages.length / 2);
    return {
      leftColumnImages: galleryImages.slice(0, half),
      rightColumnImages: galleryImages.slice(half)
    };
  }, [galleryImages]);

  return (
    <div id="page3" className="about-container" ref={containerRef}>
      {/* Background decoration elements */}
      <div className="glow-element glow-1"></div>
      <div className="glow-element glow-2"></div>

      <div className="about-content">
        <div className="about-image-section">
          <div className="gallery-dual-column">
            {galleryImages.length > 0 ? (
              <>
                {/* Left Track Scroller */}
                <div className="gallery-column left-column">
                  <div className="scrolling-track">
                    {leftColumnImages.map((src, idx) => (
                      <img
                        key={`left-${idx}`}
                        src={src}
                        alt="Gallery left"
                        className="gallery-img"
                        width="400"
                        height="333"
                        loading={idx === 0 ? "eager" : "lazy"}
                        fetchpriority={idx === 0 ? "high" : "auto"}
                        decoding="async"
                      />
                    ))}
                    {leftColumnImages.map((src, idx) => (
                      <img
                        key={`left-dup-${idx}`}
                        src={src}
                        alt="Gallery left dup"
                        className="gallery-img"
                        width="400"
                        height="333"
                        loading="lazy"
                        decoding="async"
                      />
                    ))}
                  </div>
                </div>

                {/* Right Track Scroller */}
                <div className="gallery-column right-column">
                  <div className="scrolling-track">
                    {rightColumnImages.map((src, idx) => (
                      <img
                        key={`right-${idx}`}
                        src={src}
                        alt="Gallery right"
                        className="gallery-img"
                        width="400"
                        height="333"
                        loading={idx === 0 ? "eager" : "lazy"}
                        fetchpriority={idx === 0 ? "high" : "auto"}
                        decoding="async"
                      />
                    ))}
                    {rightColumnImages.map((src, idx) => (
                      <img
                        key={`right-dup-${idx}`}
                        src={src}
                        alt="Gallery right dup"
                        className="gallery-img"
                        width="400"
                        height="333"
                        loading="lazy"
                        decoding="async"
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="gallery-placeholder" style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.02)' }}></div>
            )}
            <div className="gallery-overlay"></div>
          </div>
        </div>

        <div className="about-text-section">
          <h1 className="about-title">MICROSOFT TECH COMMUNITY</h1>
          <p className="about-subtitle">CURIOSITY . INNOVATION . COMMUNITY</p>

          <p className="about-description">
            The Microsoft Tech Community (MTC) is a student-led initiative built around the Microsoft Student Ambassadors (MSA) program, designed to bring together learners passionate about technology, innovation, and collaboration. These communities exist at the university or regional level, where ambassadors and core members organize workshops, hackathons, study groups, and hands-on projects to spread knowledge of Microsoft technologies like Azure, AI, and Power Platform.
            <br /><br />
            The MTC provides a supportive environment for students to learn by doing, connect with industry professionals, and collaborate on real-world challenges. By participating, members not only upskill in cutting-edge tech but also build leadership, teamwork, and communication skills, making the community a gateway to both personal growth and career opportunities in the global tech ecosystem.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;