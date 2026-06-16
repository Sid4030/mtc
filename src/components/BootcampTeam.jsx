import React from 'react';

// Import all assets dynamically to get their paths easily
const images = import.meta.glob('../assets/*.{jpg,jpeg,png,JPG,PNG}', {
  eager: true,
  import: 'default'
});

const getImage = (filename) => {
  return images[`../assets/${filename}`] || null;
};

const bootcampTeam = [
  { name: "Anushka Marwaha", img: getImage("Anushka.jpg") },
  { name: "Aurindom Ghosh", img: getImage("Aurindom.jpg") },
  { name: "Kamakshi Bagga", img: getImage("Kamakshi.jpeg") },
  { name: "Ojaswi Singh", img: getImage("Ojaswi.jpg") },
  { name: "Saksham Sharma", img: getImage("Saksham.jpg") },
  { name: "Shahee Bhambani", img: getImage("Shahee.jpg") },
  { name: "Siddhant Choudhary", img: getImage("Siddhant.jpg") },
  { name: "Shourya Mishra", img: getImage("Shaurya.jpg") },
  { name: "Sonakshi Kumar", img: getImage("Sonakshi.jpg") },
  { name: "Radhika Srivastava", img: getImage("Radhika.jpg") },
  { name: "Shanvi Singh", img: getImage("Shanvi.jpg") }
];

const FallbackAvatar = ({ name }) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map(w => w[0])
    .join("");
  return (
    <div style={{
      width: '100%', height: '100%', 
      background: 'linear-gradient(135deg, #111, #222)',
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '3.5rem', fontWeight: 900,
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: '2px',
      borderBottom: '1px solid rgba(255,255,255,0.05)'
    }}>
      {initials}
    </div>
  );
};

const BootcampTeam = () => {
  return (
    <section className="bootcamp-team-section" style={{ padding: '8rem 2rem', background: '#050505', color: '#fff', position: 'relative', zIndex: 10 }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '5rem', textAlign: 'center' }}>
        <h4 style={{ color: '#7af7f7', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem' }}>The Minds Behind It</h4>
        <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, textTransform: 'uppercase', color: '#fff', letterSpacing: '0.02em', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>Meet The Team</h2>
        <div style={{ width: '60px', height: '4px', background: '#fd74fd', margin: '2rem auto 0', borderRadius: '2px' }}></div>
      </div>

      <div className="bootcamp-team-grid">
        {bootcampTeam.map((member, index) => (
          <div key={index} style={{
            background: '#0a0a0a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '0px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
            transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.borderColor = 'rgba(122, 247, 247, 0.3)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.9), 0 0 20px rgba(122,247,247,0.1)';
            e.currentTarget.querySelector('img')?.setAttribute('style', 'width: 100%; height: 100%; object-fit: cover; object-position: center 15%; background: transparent; transform: scale(1.05); transition: all 0.5s ease;');
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8)';
            e.currentTarget.querySelector('img')?.setAttribute('style', 'width: 100%; height: 100%; object-fit: cover; object-position: center 15%; background: transparent; transform: scale(1); transition: all 0.5s ease;');
          }}
          >
            <div style={{ overflow: 'hidden', width: '100%', aspectRatio: '1 / 1', background: '#111' }}>
              {member.img ? (
                <img 
                  src={member.img} 
                  alt={member.name} 
                  style={{ 
                    width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%',
                    background: 'transparent',
                    transition: 'all 0.5s ease',
                    display: 'block'
                  }} 
                />
              ) : (
                <FallbackAvatar name={member.name} />
              )}
            </div>
            
            <div style={{ padding: '1rem 0.5rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
              <h3 style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', fontWeight: 700, margin: '0 0 0.4rem 0', color: '#fff', fontFamily: "'DM Sans', sans-serif", wordBreak: 'break-word' }}>{member.name}</h3>
              <p style={{ fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)', color: '#7af7f7', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Core Member</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BootcampTeam;
