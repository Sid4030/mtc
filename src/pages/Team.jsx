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
    name: "Abhishek Agrawal",
    role: "President",
    bio: "Passionate about cloud computing, artificial intelligence, and building impactful technology solutions. As President of the Microsoft Technical Community and a Microsoft Student Ambassador, I lead initiatives that empower students to explore emerging technologies, develop practical skills, and grow through hands-on workshops, technical events, and collaborative projects.",
    linkedin: "www.linkedin.com/in/abhishek-agrawal-dev",
    img: getImage("Abhishek.jpeg")
  },
  {
    name: "Meher Bamrah",
    role: "Vice-President",
    bio: "“ਜਿਵੇਂ ਸੂਰਜਮੁਖੀ ਸੂਰਜ ਵੱਲ ਮੁੜਦਾ ਹੈ, ਤਿਵੇਂ ਮਨ ਵਾਹਿਗੁਰੂ ਵੱਲ ਮੁੜਨਾ ਚਾਹੀਦਾ ਹੈ।”\nJust like a sunflower turns toward the sun, the mind should turn toward the Divine. 🌻\n\nAlways curious about how things work and how they can be built better. Mostly found exploring AI/ML, research, design, and leadership, building impactful projects and working with teams to create meaningful innovation.",
    linkedin: "https://www.linkedin.com/in/meherbamrah/",
    github: "https://github.com/MeherBamrah",
    img: getImage("Meher.jpeg")
  },
  {
    name: "Sanya",
    role: "General Secretary ",
    bio: "General Secretary of the Microsoft Tech Community.",
    img: ""
  },
  {
    name: "Kamakshi Bagga",
    role: "Treasurer",
    bio: "“Like the sun that rises each day without fail, true growth comes from bringing light wherever you go.” ☀️\n\nDriven by curiosity, leadership, and a passion for continuous growth, I enjoy exploring new ideas, solving meaningful challenges, and turning vision into action. Passionate about AI/ML, Agentic AI, research, and emerging technologies, I am fascinated by the potential of intelligent systems to create real-world impact. With a strong belief in innovation, collaboration, and lifelong learning, I strive to transform ideas into meaningful solutions, inspire those around me, and contribute to initiatives that drive positive change. Always embracing new opportunities and working to leave every place brighter than I found it. ✨",
    img: getImage("Kamakshi.jpeg")
  },
  {
    name: "Suhani Sharma",
    role: "Design Lead",
    bio: "Aspiring developer passionate about web development, UI/UX design, and exploring AI/ML. Enjoys creating clean, user-friendly interfaces and continuously learning modern technologies to build innovative solutions.",
    linkedin: "https://www.linkedin.com/in/suhani-sharma-04a546272",
    github: "https://github.com/SuhaniSharma1309",
    img: getImage("Suhani.jpg")
  },
  {
    name: "Shanvi",
    role: "Design Co-lead",
    bio: "Creative designer passionate about exploring new ideas and learning new things. Enjoy designing posters and social media graphics, experimenting with different styles, and turning ideas into engaging visuals that connect with people.",
    linkedin: "https://www.linkedin.com/in/shanvi-singh-961605377?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    github: "https://github.com/Shanvi-singh001",
    img: getImage("Shanvi.jpg")
  },
  {
    name: "Jivyansh Raghuvanshi",
    role: "Content Lead",
    bio: "Turning curiosity to Code and Content. Exploring AI through deep learning and computer vision while contributing to the club as Content Team Lead and sharing ideas that make tech more accessible.",
    linkedin: "linkedin.com/in/jivanshraghuvanshi",
    github: "https://github.com/Jivi1512",
    img: getImage("Jivyansh.jpg")
  },
  {
    name: "Anushka",
    role: "Content Co-lead",
    bio: "I'm passionate about AI and machine learning, enjoy building small projects, and love exploring new technologies. I also enjoy swimming, driving, reading",
    linkedin: "http://linkedin.com/in/anushka-marwaha-0ba88933b",
    github: "https://github.com/anushkamarwaha",
    img: getImage("Anushka.jpg")
  },
  {
    name: "Saisha",
    role: "AI Lead",
    bio: "I am a pre-final year computer science student passionate about Machine Learning, Cloud and Generative AI. I enjoy building practical projects, exploring emerging technologies, and continuously learning to create meaningful, real-world solutions.",
    linkedin: "https://www.linkedin.com/in/saisha-goel",
    github: "https://github.com/saishagoel27",
    img: getImage("Saisha.jpg")
  },
  {
    name: "Zia",
    role: "Web Dev Lead",
    bio: "Hi, I'm Zia Kalra, a third-year BCA (Honours and Research) student with a keen interest in web development and a passion for creating clean, interactive, and impactful digital solutions. I enjoy exploring new technologies, working on collaborative projects, and continuously improving my skills in frontend development and problem-solving. I'm excited to be a part of this community, contribute to meaningful initiatives, and learn alongside an amazing team.",
    linkdin: "https://www.linkedin.com/in/zia-kalra",
    github : "https://github.com/Zia-Kalra",
    img: getImage("Zia.jpeg")
  },
  {
    name: "Shaksham",
    role: "Social Media Lead",
    bio: "Builder who enjoys creating smart tech and beautiful visuals. I explore AI, full-stack development, and modern tools while also crafting cinematic edits blending technology and creativity to turn ideas into engaging digital experiences.",
    linkedin: "https://tinyurl.com/58hm3h2y",
    github: "https://github.com/saksham3366",
    img: getImage("Saksham.jpg")
  },
  {
    name: "Soumyapriya",
    role: "Marketing Lead",
    bio: "I am Soumyapriya Datta, and I have an inclination towards AI and possess additional skills like java programming, frontend web development, along with hobbies like music and art.",
    linkedin: "https://www.linkedin.com/in/soumya-priya-datta-437a66345?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    github: "https://github.com/Soumyapriyadatta",
    img: getImage("Soumyapriya.jpg")
  },
  {
    name: "Ojaswi Singh",
    role: "Operations Manager",
    bio: "Core member specializing in creative design and event promotion. I develop engaging posters and visual content that help highlight club activities and strengthen the club's outreach and presence.",
    linkedin: "https://www.linkedin.com/in/ojaswi-singh-74701836a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    img: getImage("Ojaswi.jpg")
  },
  { name: "Anam", role: "Core Member", bio: "Hi, I'm Anam Singh, a final-year B.Tech student at Amity University and an active member of the Microsoft Technical Community for the past two years. Being a part of this community has played a significant role in my growth, helping me develop both technical and professional skills through various events, workshops, and collaborative initiatives. Alongside my ongoing internship and placement preparations, the exposure, mentorship, and learning opportunities provided by the community have strengthened my confidence and broadened my perspective. I am passionate about software development, continuous learning, and contributing to a culture of innovation and knowledge sharing.", img: getImage("Anam.jpeg"), linkedin:"https://www.linkedin.com/in/anam-singh-142182231?utm_source=share_via&utm_content=profile&utm_medium=member_android", github: "https://github.com/anamhere" },
  { name: "Aurindom", role: "Core Member", bio: "I enjoy programming and developing web applications and have a natural interest in problem solving, learning new technologies, and contributing to innovative projects as part of the club’s web development team.", linkedin: "https://www.linkedin.com/in/aurindom-ghosh-460747210/", github: "https://github.com/Aurindom971", img: getImage("Aurindom.jpg") },
  { name: "Ojaswi Sharma", role: "Core Member", bio: "Tech enthusiast with interests in web development, AI, and DevOps. Core member at MTC, contributing to tech events and building a collaborative developer community fueled by curiosity and caffeine.", linkedin: "https://www.linkedin.com/in/ojasvi-sharma-452880253", github: "https://github.com/sharmaojasvi21", img: getImage("Ojasvi2.jpg") },
  { name: "Radhika", role: "Core Member", bio: "I’m a curious and fast learner with a strong interest in AI and ML. As a core member of the social media team, I contribute innovative and creative ideas while continuously exploring new skills and opportunities to grow.", img: getImage("Radhika.jpg") },
  { name: "Rishabh", role: "Core Member", bio: "I’m passionate about both software and hardware, exploring how technology works from code to circuits. As an active club member, I contribute to the social and marketing teams, helping promote initiatives and engage the community.", linkedin: "https://www.linkedin.com/in/rishabh-ambawata-9b300a384?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app", github: "https://github.com/RishabhXD67", img: getImage("Rishabh.jpg") },
  { name: "Shahee Bhambani", role: "Core Member", bio: "Creative designer and social media contributor at Microsoft Technical Community, crafting posters, reels, and digital content.\nEnthusiastic about web development, design, and combining creativity with technology to promote innovation and technical learning.", linkedin: "https://www.linkedin.com/in/shahee-bhambani-52a1b3362?utm_source=share_via&utm_content=profile&utm_medium=member_android", github: "https://github.com/shaheebhambani", img: getImage("Shahee.jpg") },
  { name: "Shashank Upadhyay", role: "Core Member", bio: "I'm a B.Tech CSE (Data Science) student exploring on language and technology through Natural Language Processing and Computational Linguistics. I love working on data-driven projects that solve real-world problems. When I'm out of student mode, you can usually find me learning a new language (currently tackling French!), teaching German, or stargazing with my telescope.", linkedin: "https://www.linkedin.com/in/shashankshyamupadhyay", github: "https://github.com/shashankshyamupadhyay", img: getImage("ShashankUpadhyay.jpeg") },
  { name: "Shaurya Mishra", role: "Core Member", bio: "Tech enthusiast passionate about web development, data science, and building impactful projects. Always eager to learn new technologies, collaborate with peers, and contribute to the club by helping members with design, marketing, and promoting projects while collaborating on innovative technical ideas.", linkedin: "https://www.linkedin.com/in/shaurya-mishra-3a878b39a?utm_source=share_via&utm_content=profile&utm_medium=member_android", github: "https://github.com/ShauryaMishra001", img: getImage("Shaurya.jpg") },
  { name: "Siddhant", role: "Core Member", bio: "I am a web developer nowadays due to ai we forget the simplest things which recently i got embarrassed about but ofc i wont stop because at the end we have to learn from our mistakes and since web dev would soon be dead seeing AIs work will be focusing in Ai and cybersecurity more. rest i am the web dev memeber and the most chill guy in the team maybe 🤷‍♂️ And one thing \"etni tension nahi le sakta jo ho gyi dekhi jiaegyi\" ~ Siddhant choudhary.", linkedin: "https://www.linkedin.com/in/siddhant-choudhary-635244224?utm_source=share_via&utm_content=profile&utm_medium=member_android", img: getImage("Siddhant.jpg") },
  { name: "Sonakshi", role: "Core Member", bio: "I am passionate about technology, problem-solving, and continuous learning. As a member of the Microsoft Technical Community, I actively engage in collaborative projects and technical initiatives that help me explore diverse areas of computer science. I enjoy building skills across different domains and applying my knowledge to solve real-world challenges.", linkedin: "https://www.linkedin.com/in/sonakshi-kumar-1a6a102a2/", github: "https://github.com/sonakshikumar", img: getImage("Sonakshi.jpg") },
  { name: "Vikas", role: "Core Member", bio: "I am a rising sophomore pursuing a Bachelor of Technology (B.Tech) degree at Amity University, Noida. With a strong passion for technology and computers, I have always been inclined toward exploring the technical side of the digital world. Alongside my academic journey, I am a professional video editor with nearly a decade of experience in the creative industry. Over the years, I have developed expertise in visual storytelling, content creation, and post production, combining creativity with technical skills to deliver engaging and impactful media content.", linkedin: "https://www.linkedin.com/in/vikash-singh-47a8a2314?utm_source=share_via&utm_content=profile&utm_medium=member_ios", github: "https://github.com/vikks-ae", img: getImage("Vikas.jpeg") },
  { name: "Vyomini", role: "Core Member", bio: "Tech enthusiast passionate about learning and building. A curious mind who enjoys reading books, writing poetry, and exploring new ideas. Always hustling to grow, create impact, and collaborate through the Microsoft Technical Community.", linkedin: "https://www.linkedin.com/in/vyomini-tiwari-a73017384?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", github: "https://github.com/vyominiiiiiiii", img: getImage("Vyomini.jpg") },
  { name: "Garv", role: "Core Member", bio: "Driven individual with strong leadership developed through sports and teamwork. Skilled in C++, Python, Java, and MySQL, with the ability to adapt quickly to challenges and contribute innovative solutions to dynamic teams and organizations.", linkedin: "https://www.linkedin.com/in/garvgoyal03/", github: "https://github.com/Garv787", img: getImage("Garv.jpg") },
  { 
    name: "Krish", 
    role: "Core Member", 
    bio: "Hi, I’m Krish Garg, a Computer Science student who loves exploring new ideas and turning them into reality through technology. I’m someone who enjoys learning, taking on challenges, and constantly pushing myself to grow both personally and professionally.\n\nI have a strong interest in technology, problem-solving, and innovation. Whether it’s working on projects, learning new skills, or collaborating with others, I enjoy opportunities that help me expand my knowledge and gain new experiences. I believe that every challenge is a chance to learn something valuable and every experience contributes to becoming a better version of myself.\n\nBeyond academics, I value curiosity, creativity, and continuous improvement. My goal is to keep learning, keep building, and make a meaningful impact wherever I can.", 
    linkedin: "https://www.linkedin.com/in/krish-garg-8ba67926a?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    github: "https://github.com/web0905",
    img: getImage("Krish.jpg"),
    objectPosition: "50% 0%"
  },
  { name: "Mandeep", role: "Core Member", bio: "Web Development team member with strong interest in backend and full-stack development. Skilled in React, Flask, and Supabase. Passionate about building efficient, scalable applications and continuously improving problem-solving skills through hands-on projects.", linkedin: "https://in.linkedin.com/in/mandeep-undefined-5888202a1", github: "https://share.google/45enANSUPfe3BHEzj", img: getImage("Mandeep.jpg") },
  { name: "Prathamesh Dwivedi", role: "Core Member", bio: "Core Member at Microsoft Tech Community.", img: getImage("Prathamesh.jpg") }
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
                  <img src={member.img} alt={member.name} loading="lazy" decoding="async" style={member.objectPosition ? { objectPosition: member.objectPosition } : {}} />
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
                        <img src={selectedMember.img} alt={selectedMember.name} style={selectedMember.objectPosition ? { objectPosition: selectedMember.objectPosition } : {}} />
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