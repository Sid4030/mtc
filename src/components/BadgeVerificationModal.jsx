import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BadgeVerificationModal = ({ isOpen, onClose, module, session, onVerifySuccess }) => {
  const [mode, setMode] = useState('submit'); // 'submit' or 'restore'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [badgeUrl, setBadgeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const savedEmail = localStorage.getItem('trackerEmail');
      if (savedEmail) setEmail(savedEmail);
    } else {
      // Reset state on close
      setError('');
      setLoading(false);
      setMode('submit');
      setBadgeUrl('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Normalize email to prevent case-sensitivity mismatches
    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (mode === 'submit') {
        const res = await fetch('/api/badges/submit-badge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email: normalizedEmail,
            sessionId: session.sessionId,
            moduleId: module.moduleId,
            badgeUrl
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || 'Failed to verify badge');

        localStorage.setItem('trackerEmail', normalizedEmail);
        onVerifySuccess(normalizedEmail); // Triggers the parent to refresh progress
        onClose();
      } else {
        // Restore progress mode
        const res = await fetch(`/api/badges/progress/${encodeURIComponent(normalizedEmail)}/${session.sessionId}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Failed to fetch progress');
        
        localStorage.setItem('trackerEmail', normalizedEmail);
        onVerifySuccess(normalizedEmail);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 100000, 
        background: 'rgba(0,0,0,0.8)', display: 'flex', 
        alignItems: 'center', justifyContent: 'center',
        padding: '20px'
      }}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          style={{
            background: '#111', border: '1px solid #333', 
            borderRadius: '16px', padding: '30px', 
            width: '100%', maxWidth: '500px',
            position: 'relative'
          }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={24} />
          </button>

          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '10px', fontFamily: "'DM Sans', sans-serif" }}>
            {mode === 'submit' ? 'Verify MS Learn Badge' : 'Restore Progress'}
          </h2>
          <p style={{ color: '#888', marginBottom: '20px' }}>
            {mode === 'submit' ? `Submit your badge URL for ${module?.moduleName}` : 'Enter your email to sync your previous verifications.'}
          </p>

          {error && (
            <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff6b6b', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {mode === 'submit' && (
              <>
                <div>
                  <label style={{ display: 'block', color: '#ccc', marginBottom: '5px', fontSize: '0.9rem' }}>Module</label>
                  <input type="text" value={module?.moduleName || ''} disabled style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#222', border: '1px solid #444', color: '#aaa', cursor: 'not-allowed' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#ccc', marginBottom: '5px', fontSize: '0.9rem' }}>Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#1d1c1c', border: '1px solid #444', color: '#fff' }} placeholder="Your full name" />
                </div>
              </>
            )}

            <div>
              <label style={{ display: 'block', color: '#ccc', marginBottom: '5px', fontSize: '0.9rem' }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#1d1c1c', border: '1px solid #444', color: '#fff' }} placeholder="Your registered email" />
            </div>

            {mode === 'submit' && (
              <div>
                <label style={{ display: 'block', color: '#ccc', marginBottom: '5px', fontSize: '0.9rem' }}>MS Learn Share URL</label>
                <input type="url" value={badgeUrl} onChange={e => setBadgeUrl(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#1d1c1c', border: '1px solid #444', color: '#fff' }} placeholder="https://learn.microsoft.com/en-us/users/..." />
              </div>
            )}

            <button type="submit" disabled={loading} className="mythical-hero-btn" style={{ width: '100%', padding: '14px', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'submit' ? 'Verify Badge' : 'Restore Progress')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              type="button"
              onClick={() => { setMode(mode === 'submit' ? 'restore' : 'submit'); setError(''); }}
              style={{ background: 'transparent', border: 'none', color: '#7af7f7', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              {mode === 'submit' ? 'Already submitted before? Restore Progress' : 'Need to submit a new badge?'}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BadgeVerificationModal;
