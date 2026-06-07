import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import "./Team.css";

const images = import.meta.glob("../assets/*.{png,jpg,jpeg,JPG,PNG,JPEG}", {
  eager: true,
  import: "default"
});

const getImage = (name) => images[`../assets/${name}`];

// Fallback avatar: shows initials when image file is missing
const FallbackAvatar = ({ name }) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return <div className="member-fallback-avatar">{initials}</div>;
};

const team = [
  {
    name: "Saisha Goel",
    role: "AI Team Lead",
    teamLine: "AI Team, Content Team",
    bio: "I am a pre-final year computer science student passionate about Machine Learning, Cloud and Generative AI. I enjoy building practical projects, exploring emerging technologies, and continuously learning to create meaningful, real-world solutions.",
    linkedin: "https://www.linkedin.com/in/saisha-goel",
    github: "https://github.com/saishagoel27",
    img: getImage("Saisha.jpg")
  },
  {
    name: "Siddhant Choudhary",
    role: "Web Developer",
    teamLine: "Web Development Team",
    bio: "I am a web dev nowadays due to ai we forget the simplest things which recently i got embarrassed about but ofc i wont stop because at the end we have to learn from our mistakes and since web dev would soon be dead seeing AIs work will be focusing in Ai and cybersecurity more rest i am the web dev memeber and the most chill guy in the team maybe 🤷‍♂️ And one thing \"etni tension nahi le sakta jo ho gyi dekhi jiaegyi\" ~ Siddhant choudhary",
    linkedin: "https://www.linkedin.com/in/siddhant-choudhary-635244224?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    img: getImage("Siddhant.jpeg")
  },
  {
    name: "Rishabh Ambawata",
    role: "Social Media ",
    teamLine: "Social and Marketing ",
    bio: "I'm passionate about both software and hardware, exploring how technology works from code to circuits. As an active club member, I contribute to the social and marketing teams, helping promote initiatives and engage the community.",
    linkedin: "https://www.linkedin.com/in/rishabh-ambawata-9b300a384?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    github: "https://github.com/RishabhXD67",
    img: getImage("Rishabh.jpg")
  },
  {
    name: "Garv Goyal",
    role: "Core Member",
    teamLine: "Web Dev, Social Media ",
    bio: "Driven individual with strong leadership developed through sports and teamwork. Skilled in C++, Python, Java, and MySQL, with the ability to adapt quickly to challenges and contribute innovative solutions to dynamic teams and organizations.",
    linkedin: "https://www.linkedin.com/in/garvgoyal03/",
    github: "https://github.com/Garv787",
    img: getImage("Garv.jpg")
  },
  {
    name: "Sonakshi Kumar",
    role: "Web Developer",
    teamLine: "Web Dev",
    bio: "I am passionate about technology, problem-solving, and continuous learning. As a member of the Microsoft Technical Community, I actively engage in collaborative projects and technical initiatives that help me explore diverse areas of computer science. I enjoy building skills across different domains and applying my knowledge to solve real-world challenges.",
    linkedin: "https://www.linkedin.com/in/sonakshi-kumar-1a6a102a2/",
    github: "https://github.com/sonakshikumar",
    img: getImage("Sonakshi.jpg")
  },
  {
    name: "Soumyapriya Datta ",
    role: "Head of Marketing ",
    teamLine: "Marketing and AIML ",
    bio: "I am the head of Marketing at MTC. I guide the team members on pitching strategies and event promotions, along with contributing to core operations and management. I also contribute to projects under the AIML domain.",
    linkedin: "https://www.linkedin.com/in/soumya-priya-datta-437a66345?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    github: "https://github.com/Soumyapriyadatta",
    img: "https://i.pravatar.cc/600?img=5"
  },
  {
    name: "Ojaswi Singh ",
    role: "Core Member",
    teamLine: "Design and Marketing  ",
    bio: "Core member specializing in creative design and event promotion. I develop engaging posters and visual content that help highlight club activities and strengthen the club's outreach and presence.",
    linkedin: "https://www.linkedin.com/in/ojaswi-singh-74701836a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    img: getImage("Ojaswi.jpg")
  },
  {
    name: "Radhika Srivastava ",
    role: "Core team member",
    teamLine: "Social media, ai ",
    bio: "I'm a curious and fast learner with a strong interest in AI and ML. As a core member of the social media team, I contribute innovative and creative ideas while continuously exploring new skills and opportunities to grow.",
    img: getImage("Radhika.jpg")
  },
  {
    name: "Saksham",
    role: "Head Social Media",
    teamLine: "Social Media, Design",
    bio: "Builder who enjoys creating smart tech and beautiful visuals. I explore AI, full-stack development, and modern tools while also crafting cinematic edits blending technology and creativity to turn ideas into engaging digital experiences.",
    linkedin: "https://tinyurl.com/58hm3h2y",
    github: "https://github.com/saksham3366",
    img: getImage("Saksham.jpg")
  },
  {
    name: "Suhani Sharma",
    role: "Design Lead",
    teamLine: "Design, Web Dev",
    bio: "Aspiring developer passionate about web development, UI/UX design, and exploring AI/ML. Enjoys creating clean, user-friendly interfaces and continuously learning modern technologies to build innovative solutions.",
    linkedin: "https://www.linkedin.com/in/suhani-sharma-04a546272",
    github: "https://github.com/SuhaniSharma1309",
    img: getImage("Suhani.jpg")
  },
  {
    name: "Ojasvi Sharma",
    role: "Core Team member ",
    teamLine: "Web Dev and content ",
    bio: "Tech enthusiast with interests in web development, AI, and DevOps.Core member at MTC, contributing to tech events and building a collaborative developer community fueled by curiosity and caffeine.",
    linkedin: "https://www.linkedin.com/in/ojasvi-sharma-452880253",
    github: "https://github.com/sharmaojasvi21",
    img: getImage("Ojasvi2.jpg")
  },
  {
    name: "Aurindom Ghosh",
    role: "Web Development team member",
    teamLine: "Web development ",
    bio: "I enjoy programming and developing web applications and have a natural interest in problem solving, learning new technologies, and contributing to innovative projects as part of the club's web development team.",
    linkedin: "https://www.linkedin.com/in/aurindom-ghosh-460747210/",
    github: "https://github.com/Aurindom971",
    img: getImage("Aurindom.jpg")
  },
  {
    name: "Shanvi Singh",
    role: "Co-Design Lead",
    teamLine: "Design, Marketing  ",
    bio: "Creative designer passionate about exploring new ideas and learning new things. Enjoy designing posters and social media graphics, experimenting with different styles, and turning ideas into engaging visuals that connect with people.",
    linkedin: "https://www.linkedin.com/in/shanvi-singh-961605377?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    github: "https://github.com/Shanvi-singh001",
    img: getImage("Shanvi.jpg")
  },
  {
    name: "Jivansh Raghuvanshi ",
    role: "Content Lead ",
    teamLine: "Content team, AIML team ",
    bio: "Turning curiosity to Code and Content. Exploring AI through deep learning and computer vision while contributing to the club as Content Team Lead and sharing ideas that make tech more accessible.",
    linkedin: "linkedin.com/in/jivanshraghuvanshi",
    github: "https://github.com/Jivi1512",
    img: getImage("Jivyansh.jpg")
  },
  {
    name: "Shaurya Mishra  ",
    role: "Core Member ",
    teamLine: "Design & Marketing Team ",
    bio: "Tech enthusiast passionate about web development, data science, and building impactful projects. Always eager to learn new technologies, collaborate with peers, and contribute to the club by helping members with design, marketing, and promoting projects while collaborating on innovative technical ideas.",
    linkedin: "https://www.linkedin.com/in/shaurya-mishra-3a878b39a?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    github: "https://github.com/ShauryaMishra001",
    img: getImage("Shaurya.jpg")
  },
  {
    name: "Shahee Bhambani",
    role: "Core Member ",
    teamLine: "Design team and Social media team ",
    bio: "Creative designer and social media contributor at Microsoft Technical Community,crafting posters, reels, and digital content.Enthusiastic about web development, design, and combining creativity with technology to promote innovation and technical learning.",
    linkedin: "https://www.linkedin.com/in/shahee-bhambani",
    github: "https://github.com/ShaheeBhambani",
    img: getImage("Shahee.jpg")
  },
  {
    name: "Vyomini Tiwari  ",
    role: "Member of design team and social media team ",
    teamLine: "Member of design team and social media team ",
    bio: "Tech enthusiast passionate about learning and building. A curious mind who enjoys reading books, writing poetry, and exploring new ideas. Always hustling to grow, create impact, and collaborate through the Microsoft Technical Community.",
    linkedin: "https://www.linkedin.com/in/vyomini-tiwari-a73017384?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    github: "https://github.com/vyominiiiiiiii",
    img: getImage("Vyomini.jpg")
  },
  {
    name: "Anushka Marwaha ",
    role: "Active member ",
    teamLine: "Content team, social media team, marketing team",
    bio: "I'm passionate about AI and machine learning, enjoy building small projects, and love exploring new technologies. I also enjoy swimming, driving, reading",
    linkedin: "http://linkedin.com/in/anushka-marwaha-0ba88933b",
    github: "https://github.com/anushkamarwaha",
    img: getImage("Anushka.jpg")
  }
];

function Team() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [navOffset, setNavOffset] = useState(76);
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  const resolveNavOffset = () => {
    const nav = document.querySelector(".msft-nav");
    if (!nav) return 76;
    const rect = nav.getBoundingClientRect();
    return Math.max(Math.round(rect.bottom), 0);
  };

  const openProfile = useCallback((member) => {
    setSelectedMember(member);
  }, []);

  useEffect(() => {
    if (selectedMember) {
      document.body.classList.add('modal-open');
      if (window.lenis) window.lenis.stop();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      if (window.lenis) window.lenis.start();
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('modal-open');
      if (window.lenis) window.lenis.start();
      document.body.style.overflow = '';
    };
  }, [selectedMember]);

  useEffect(() => {
    const onEscape = (e) => {
      if (e.key === "Escape") setSelectedMember(null);
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  useEffect(() => {
    const syncNavOffset = () => setNavOffset(resolveNavOffset());
    syncNavOffset();
    window.addEventListener("resize", syncNavOffset, { passive: true });
    return () => window.removeEventListener("resize", syncNavOffset);
  }, []);

  // Scroll-reveal: auto-reveal member images row by row when scrolling (all devices)
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const members = grid.querySelectorAll(".member");
    if (!members.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-revealed");
          } else {
            entry.target.classList.remove("scroll-revealed");
          }
        });
      },
      {
        root: null,
        rootMargin: "-25% 0px -35% 0px", // Reveal when in middle 40% of viewport (approx 2 rows)
        threshold: 0.15
      }
    );

    members.forEach((m) => observer.observe(m));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="page2" ref={containerRef} className="team-container">

      <div className="team-layout-wrapper">
        <div className="team-title-fixed">
          <h1>Meet <br /> The <br /> Team</h1>
          <p className="team-title-sub">
            Click a member to view their profile.
          </p>
        </div>

        <div className="team-scroll-area">
          <div className="team-grid" ref={gridRef}>
            {team.map((member) => (
              <div
                key={member.name}
                className="member"
                onClick={() => openProfile(member)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openProfile(member);
                  }
                }}
                aria-label={`Open profile for ${member.name}`}
              >
                {member.img ? (
                  <img src={member.img} alt={member.name} loading="lazy" decoding="async" />
                ) : (
                  <FallbackAvatar name={member.name} />
                )}
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {selectedMember && (
              <motion.div
                className="profile-overlay"
                onClick={() => setSelectedMember(null)}
                role="dialog"
                aria-modal="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{ top: 0 }}
              >
                <motion.div
                  className="profile-view"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
                  style={{ top: 0, height: '100vh' }}
                >
                  <button
                    className="close-btn"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMember(null);
                    }}
                    aria-label="Close profile"
                  />

                  <div className="profile-scroll" data-lenis-prevent>
                    <div className="flash-image">
                      {selectedMember.img ? (
                        <img src={selectedMember.img} alt={selectedMember.name} />
                      ) : (
                        <FallbackAvatar name={selectedMember.name} />
                      )}
                    </div>

                    <div className="flash-info">
                      <div className="flash-header">
                        <h2>{selectedMember.name}</h2>
                        <p className="role">{selectedMember.role}</p>
                        {selectedMember.teamLine && <p className="team-line">{selectedMember.teamLine}</p>}
                      </div>

                      <div className="flash-row">
                        <div className="flash-left">
                          {selectedMember.linkedin && (
                            <a
                              href={selectedMember.linkedin}
                              target="_blank"
                              rel="noreferrer"
                            >
                              LinkedIn
                            </a>
                          )}
                          {selectedMember.github && (
                            <a
                              href={selectedMember.github}
                              target="_blank"
                              rel="noreferrer"
                            >
                              GitHub
                            </a>
                          )}
                        </div>

                        <div className="flash-right">
                          <p className="bio-text">{selectedMember.bio}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

    </section>
  );
}

export default Team;