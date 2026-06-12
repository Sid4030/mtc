import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import './BootcampRegistration.css'; // Importing the exact same CSS used for the main website

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(sessionStorage.getItem('adminToken') || '');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Add noindex meta tag
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex, nofollow';
      document.head.appendChild(meta);
    } else {
      meta.content = 'noindex, nofollow';
    }
    return () => {
      if (meta) document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    if (token) {
      fetchRegistrations();
    }
  }, [token]);

  // Auto-logout after 5 minutes of inactivity
  useEffect(() => {
    if (!token) return;
    
    let timeoutId;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
        setError('Session expired due to inactivity.');
      }, 5 * 60 * 1000); // 5 minutes
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [token]);

  // Entrance Animation
  useEffect(() => {
    gsap.fromTo(".admin-fade-in", 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1, ease: "power4.out", stagger: 0.1 }
    );
  }, [token]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/registrations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          handleLogout();
          throw new Error('Session expired or invalid token');
        }
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setRegistrations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        sessionStorage.setItem('adminToken', data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setRegistrations([]);
    sessionStorage.removeItem('adminToken');
  };

  const exportToCSV = () => {
    if (registrations.length === 0) return;
    const headers = [
      'Name', 'Email', 'Contact Number', 'College Type', 'Enrollment No / College Name',
      'Course', 'Specialisation', 'Year', 'LinkedIn', 'GitHub', 'Motivation', 'Registration Date'
    ];
    const rows = registrations.map(reg => [
      `"${reg.name || ''}"`,
      `"${reg.email || ''}"`,
      `"${reg.contactNumber || ''}"`,
      `"${reg.collegeType || ''}"`,
      `"${reg.enrollmentNo || reg.collegeName || ''}"`,
      `"${reg.courseName || ''}"`,
      `"${reg.specialisation || ''}"`,
      `"${reg.year || ''}"`,
      `"${reg.linkedinUrl || ''}"`,
      `"${reg.githubUrl || ''}"`,
      `"${(reg.motivation || '').replace(/"/g, '""')}"`,
      `"${new Date(reg.registrationDate).toLocaleString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bootcamp_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!token) {
    return (
      <div className="bootcamp-reg-page bw-theme">
        <div className="bootcamp-reg-content-wrapper" style={{ maxWidth: '450px' }}>
          {/* Floating Background Shapes */}
          <div style={{ position: 'absolute', top: '-10%', left: '-20%', width: '140%', height: '120%', zIndex: -1, pointerEvents: 'none' }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <path d="M 50 100 Q 150 50 200 150 T 300 100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              <circle cx="10%" cy="80%" r="40" fill="none" stroke="rgba(253, 116, 253, 0.15)" strokeWidth="2" strokeDasharray="5 5" />
            </svg>
          </div>

          <div className="bootcamp-reg-board admin-fade-in">
            <div className="bootcamp-reg-badge" style={{ background: 'linear-gradient(45deg, #f25022, #ffb900)' }}>RESTRICTED</div>
            
            <h1 className="bootcamp-reg-title" style={{ fontSize: 'clamp(2rem, 8vw, 2.5rem)' }}>
              Admin <br/> <span className="highlight-text sketch-text">Login</span>
            </h1>
            
            <p className="bootcamp-reg-subtitle" style={{ marginBottom: '2rem' }}>
              High-level clearance required.
            </p>

            {error && <div className="bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm p-3 mb-4">{error}</div>}

            <form className="bootcamp-reg-form" onSubmit={handleLogin}>
              <div className="bootcamp-reg-input-group">
                <label>Master Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter system password"
                  autoComplete="new-password"
                  required
                />
              </div>
              
              <button type="submit" className="bootcamp-reg-submit bw-btn" disabled={loading}>
                {loading ? 'Authenticating...' : 'Access Portal'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bootcamp-reg-page bw-theme" style={{ alignItems: 'flex-start', overflowY: 'auto' }}>
      <div className="bootcamp-reg-content-wrapper" style={{ maxWidth: '1300px', width: '100%', padding: '0' }}>
        
        <div className="bootcamp-reg-board admin-fade-in" style={{ padding: 'clamp(1rem, 3vw, 2.5rem)' }}>
          <div className="bootcamp-reg-badge" style={{ background: 'linear-gradient(45deg, #7fba00, #a1eb00)', color: '#050505' }}>LIVE DATA</div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b border-white/10 pb-6">
            <div>
              <h1 className="bootcamp-reg-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', marginBottom: '0.5rem' }}>
                <span className="highlight-text sketch-text">Registrations</span> <br className="md:hidden" /> Dashboard
              </h1>
              <p className="bootcamp-reg-subtitle" style={{ margin: 0 }}>
                Total Verified Signups: <strong className="text-white text-lg">{registrations.length}</strong>
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button onClick={exportToCSV} className="bootcamp-reg-submit bw-btn" style={{ margin: 0, padding: '12px 24px', fontSize: '0.9rem', background: 'linear-gradient(45deg, #7fba00, #a1eb00)' }}>
                Export CSV
              </button>
              <button onClick={handleLogout} className="return-home-btn" style={{ margin: 0, padding: '12px 24px' }}>
                End Session
              </button>
            </div>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm p-4 mb-6">{error}</div>}

          <div className="overflow-x-auto rounded-xl border border-white/10" style={{ background: 'rgba(5, 5, 5, 0.6)' }}>
            <table className="w-full text-left border-collapse text-white font-['DM_Sans',sans-serif]">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Candidate Info</th>
                  <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">College & Course</th>
                  <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Links</th>
                  <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Motivation</th>
                  <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading && registrations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-16 text-center text-gray-400">Loading secure data...</td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-16 text-center text-gray-400">No registrations found yet.</td>
                  </tr>
                ) : (
                  registrations.map((reg) => (
                    <tr key={reg._id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-5 py-4">
                        <div className="text-base font-bold text-white">{reg.name}</div>
                        <div className="text-sm text-gray-400 mt-1">{reg.email}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{reg.contactNumber}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-semibold text-gray-200">
                          {reg.collegeType === 'Amity' ? 'Amity University' : reg.collegeName}
                        </div>
                        {reg.enrollmentNo && <div className="text-xs text-gray-500 mt-1">ID: {reg.enrollmentNo}</div>}
                        <div className="text-xs text-gray-400 mt-1">
                          <span className="text-[#00a4ef] font-semibold">{reg.courseName}</span> • {reg.specialisation} <br/>
                          (Year {reg.year})
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <a href={reg.linkedinUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#00a4ef] hover:underline bg-[#00a4ef]/10 px-3 py-1 rounded-full inline-block w-max">
                            LinkedIn ↗
                          </a>
                          {reg.githubUrl && (
                            <a href={reg.githubUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-gray-300 hover:underline bg-white/10 px-3 py-1 rounded-full inline-block w-max">
                              GitHub ↗
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <div className="text-sm text-gray-400 max-w-xs leading-relaxed line-clamp-3" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {reg.motivation}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                        {new Date(reg.registrationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
