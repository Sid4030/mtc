import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Counter from "../components/Counter";
import "./MsaSection.css";

gsap.registerPlugin(ScrollTrigger);

const MsaSection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Simple fade-in for each block as it enters the viewport
            gsap.utils.toArray(".msa-block").forEach((block) => {
                gsap.fromTo(block,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: block,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            // Background text parallax
            gsap.to(".msa-bg-text", {
                xPercent: -15,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 2,
                }
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="page-msa" className="msa-section-v2" ref={sectionRef}>
            <div className="msa-bg-text">AMBASSADOR IMPACT</div>

            <div className="msa-flow-layout">

                {/* Header */}
                <div className="msa-block msa-block-header">
                    <p className="msa-pre-title">Student Program</p>
                    <h2 className="msa-massive-title">
                        MICROSOFT STUDENT <br/> AMBASSADORS
                    </h2>
                    <div className="msa-accent-line"></div>
                </div>

                {/* Features — all visible in a 2-col grid */}
                <div className="msa-block msa-block-features">
                    <div className="msa-feature-row">
                        <div className="msa-feature-card">
                            <span className="msa-card-num">01</span>
                            <h3>Learn & Grow</h3>
                            <p>Access to Microsoft technologies, training, and certifications to advance your technical skillset.</p>
                        </div>
                        <div className="msa-feature-card card-accent">
                            <span className="msa-card-num">02</span>
                            <h3>Global Network</h3>
                            <p>Connect with a worldwide ecosystem of students and professionals pushing technical boundaries.</p>
                        </div>
                    </div>
                </div>

                <div className="msa-block msa-block-features">
                    <div className="msa-feature-row">
                        <div className="msa-feature-card">
                            <span className="msa-card-num">03</span>
                            <h3>Career Ops</h3>
                            <p>Exclusive pathways to internships, mentorship, and industry-standard job readiness.</p>
                        </div>
                        <div className="msa-feature-card card-accent">
                            <span className="msa-card-num">04</span>
                            <h3>Innovation</h3>
                            <p>Lead impactful community projects and build solutions that define the tomorrow of tech.</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="msa-block msa-block-stats">
                    <div className="msa-stats-grid">
                        <div className="msa-stat-item">
                            <p>Ambassadors</p>
                            <div className="msa-stat-val"><Counter end={500} suffix="+" /></div>
                        </div>
                        <div className="msa-stat-item">
                            <p>Countries</p>
                            <div className="msa-stat-val"><Counter end={100} suffix="+" /></div>
                        </div>
                        <div className="msa-stat-item">
                            <p>Global Reach</p>
                            <div className="msa-stat-val"><Counter end={50} suffix="K+" /></div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default MsaSection;
