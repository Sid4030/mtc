import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

// Minimalist Icons
const ExportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

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
    if (token && registrations.length > 0) {
      gsap.fromTo(".admin-fade-in", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.05 }
      );
    }
  }, [token, registrations]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/admin/registrations`, {
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
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/admin/login`, {
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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-['DM_Sans',sans-serif] text-white relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-md w-full bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl relative z-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto mb-6 shadow-lg shadow-blue-500/30">
              <UserIcon />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Admin Portal</h1>
            <p className="text-white/50 text-sm font-medium">Secure access to MTC Dashboard</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-8 text-center backdrop-blur-md">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Master Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-white/20"
                placeholder="Enter password"
                autoComplete="new-password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold py-4 px-4 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 mt-4 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] font-['DM_Sans',sans-serif] text-white pb-24 relative selection:bg-blue-500/30">
      {/* Abstract Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-1/4 w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-1/4 w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Glassmorphic Navbar */}
      <div className="sticky top-0 z-50 bg-[#050505]/60 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20">
                A
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight leading-none text-white">MTC Admin</h1>
                <span className="text-xs text-blue-400 font-medium tracking-wider uppercase mt-1 block">Live Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </div>
                <span className="text-sm text-white/80 font-medium">{registrations.length} Verified Signups</span>
              </div>
              
              <button 
                onClick={exportToCSV} 
                className="flex items-center gap-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
              >
                <ExportIcon /> <span className="hidden sm:inline">Export CSV</span>
              </button>
              
              <div className="w-px h-8 bg-white/10 mx-1 hidden sm:block"></div>
              
              <button 
                onClick={handleLogout} 
                className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-4 sm:h-auto sm:py-2.5 gap-2 text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                title="Secure Logout"
              >
                <LogoutIcon />
                <span className="hidden sm:inline font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-8 backdrop-blur-md flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="opacity-50 hover:opacity-100">×</button>
          </div>
        )}

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Registration Data</h2>
            <p className="text-white/50 text-sm mt-2">Manage and review bootcamp applicants.</p>
          </div>
          {/* Mobile counter */}
          <div className="sm:hidden flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 w-full justify-center">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-sm text-white/80 font-medium">Total: {registrations.length}</span>
          </div>
        </div>

        {/* Dynamic Glassmorphic Data Cards */}
        <div className="grid grid-cols-1 gap-5">
          {loading && registrations.length === 0 ? (
            <div className="text-center py-32 border border-white/5 rounded-3xl bg-white/[0.02] backdrop-blur-sm">
              <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/50 font-medium animate-pulse">Decrypting secure records...</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-32 border border-white/5 rounded-3xl bg-white/[0.02] backdrop-blur-sm">
              <div className="text-5xl mb-4 opacity-20">📭</div>
              <h3 className="text-xl font-bold text-white mb-2">No Registrations Yet</h3>
              <p className="text-white/40">Data will appear here once users start signing up.</p>
            </div>
          ) : (
            registrations.map((reg) => (
              <div key={reg._id} className="admin-fade-in group relative bg-white/[0.03] rounded-2xl border border-white/[0.05] p-6 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 overflow-hidden">
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8">
                  
                  {/* Column 1: Identity */}
                  <div className="flex items-start gap-5 md:w-[35%]">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-inner">
                      {reg.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 pt-1">
                      <h3 className="font-bold text-white text-lg truncate flex items-center gap-2">
                        {reg.name}
                      </h3>
                      <a href={`mailto:${reg.email}`} className="text-blue-400 text-sm mt-1 truncate block hover:underline">{reg.email}</a>
                      <p className="text-white/40 text-xs mt-1.5 font-mono tracking-wider">{reg.contactNumber}</p>
                    </div>
                  </div>

                  {/* Column 2: Education & Tags */}
                  <div className="md:w-[35%] flex flex-col justify-center border-t border-white/5 md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-8">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${reg.collegeType === 'Amity' ? 'bg-orange-500' : 'bg-purple-500'}`}></span>
                      <p className="text-sm font-bold text-white/90">
                        {reg.collegeType === 'Amity' ? 'Amity University' : reg.collegeName}
                      </p>
                    </div>
                    
                    <p className="text-sm text-white/60 font-medium">
                      {reg.courseName} <span className="text-white/20 mx-1.5">|</span> {reg.specialisation}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-white/5 text-white/80 border border-white/5">
                        Year {reg.year}
                      </span>
                      {reg.enrollmentNo && (
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          {reg.enrollmentNo}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Column 3: Links & Motivation */}
                  <div className="md:w-[30%] flex flex-col border-t border-white/5 md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-8">
                    <div className="flex gap-4 mb-4">
                      {reg.linkedinUrl && (
                        <a href={reg.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-bold text-white/70 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10">
                          <LinkIcon /> LinkedIn
                        </a>
                      )}
                      {reg.githubUrl && (
                        <a href={reg.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-bold text-white/70 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10">
                          <LinkIcon /> GitHub
                        </a>
                      )}
                    </div>

                    {reg.motivation ? (
                      <div className="flex-1 text-sm text-white/50 italic line-clamp-2 leading-relaxed">
                        "{reg.motivation}"
                      </div>
                    ) : (
                      <div className="flex-1 text-sm text-white/30 italic">No motivation provided.</div>
                    )}
                    
                    <div className="mt-4 flex items-center justify-end">
                      <div className="text-xs text-white/30 font-bold tracking-widest uppercase">
                        {new Date(reg.registrationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
