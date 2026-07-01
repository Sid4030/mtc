import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Leaderboard.css';

gsap.registerPlugin(ScrollTrigger);

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/public/leaderboard');
      if (res.ok) {
        const data = await res.json();
        // Only update if data actually changed to prevent React re-rendering lag
        setLeaderboardData((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
          return data;
        });
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    // Poll every 5 seconds
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading && leaderboardData.length > 0 && containerRef.current) {
      // Only animate the outer frame to prevent lag. 
      // Do NOT animate hundreds of rows individually.
      let ctx = gsap.context(() => {
        gsap.fromTo('.mythical-scoreboard-frame', 
          { y: 50, opacity: 0, scale: 0.95 },
          { 
            y: 0, opacity: 1, scale: 1, 
            duration: 0.8, 
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
            }
          }
        );
      }, containerRef);

      return () => ctx.revert();
    }
  }, [loading]); // Only run on initial load

  return (
    <section className="leaderboard-section" id="leaderboard" ref={containerRef}>
      
      {/* Background ambient elements */}
      <div className="lb-bg-elements">
        <div className="lb-diamond lb-d1"></div>
        <div className="lb-diamond lb-d2"></div>
        <div className="lb-glow"></div>
      </div>

      <div className="leaderboard-content">
        <div className="leaderboard-header">
          <h2 className="lb-title">GLOBAL <span className="lb-accent">LEADERBOARD</span></h2>
          <div className="lb-live-indicator">
            <span className="live-dot"></span> LIVE UPDATES
          </div>
        </div>

        {loading ? (
          <div className="lb-loading">
            <div className="spinner"></div>
            <p>Loading Casino Records...</p>
          </div>
        ) : (
          <div className="mythical-scoreboard-frame">
            <div className="scoreboard-inner">
              <div className="scoreboard-table-header">
                <div className="col-rank">RANK</div>
                <div className="col-name">PARTICIPANT</div>
                <div className="col-session">S1</div>
                <div className="col-session">S2</div>
                <div className="col-session">S3</div>
                <div className="col-session">S4</div>
                <div className="col-session">S5</div>
                <div className="col-session">S6</div>
                <div className="col-session">S7</div>
                <div className="col-session">S8</div>
                <div className="col-score">TOTAL</div>
              </div>
              
              <div className="scoreboard-scroll-area">
                {leaderboardData.map((player, index) => {
                  const rank = index + 1;
                  let rankClass = "rank-normal";
                  if (rank === 1) rankClass = "rank-1-row";
                  else if (rank === 2) rankClass = "rank-2-row";
                  else if (rank === 3) rankClass = "rank-3-row";

                  return (
                    <div key={player.email} className={`scoreboard-row ${rankClass}`}>
                      <div className="col-rank">
                        <span className={`rank-num ${rank <= 2 ? 'shining-number' : ''}`}>{rank}</span>
                      </div>
                      <div className="col-name">
                        <div className="avatar">{player.name.charAt(0).toUpperCase()}</div>
                        <span className="player-name">{player.name}</span>
                      </div>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <div key={s} className="col-session">
                          {player.sessionMarks ? player.sessionMarks[`session_${s}`] : '-'}
                        </div>
                      ))}
                      <div className="col-score">
                        <span key={player.totalMarks} className="score-val slot-spin">{player.totalMarks}</span>
                        <span className="score-pts">PTS</span>
                      </div>
                    </div>
                  );
                })}
                
                {leaderboardData.length === 0 && (
                  <div className="lb-empty">
                    <p>No ranks established yet. The casino awaits!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Leaderboard;
