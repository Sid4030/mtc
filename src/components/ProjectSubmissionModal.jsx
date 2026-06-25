import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectSubmissionModal = ({ isOpen, onClose, session, onProjectSubmitSuccess }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedEmail = localStorage.getItem('trackerEmail');
      if (savedEmail) setEmail(savedEmail);
      setSuccess(false);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/projects/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          sessionId: session.sessionId,
          pdfUrl
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit project');

      setSuccess(true);
      setTimeout(() => {
          if(onProjectSubmitSuccess) onProjectSubmitSuccess();
          onClose();
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
          style={{ background: '#111', border: '1px solid #333', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '500px', position: 'relative' }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={24} />
          </button>

          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '10px', fontFamily: "'DM Sans', sans-serif" }}>
            Submit Final Project
          </h2>
          <p style={{ color: '#888', marginBottom: '20px' }}>
            Submit your final project link for {session?.sessionName}. It will be reviewed by the admin.
          </p>

          {error && <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff6b6b', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}
          {success && <div style={{ background: 'rgba(0,255,0,0.1)', color: '#7ff6bc', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>Project submitted successfully!</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', color: '#ccc', marginBottom: '5px', fontSize: '0.9rem' }}>Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#1d1c1c', border: '1px solid #444', color: '#fff' }} placeholder="Your full name" />
            </div>
            <div>
              <label style={{ display: 'block', color: '#ccc', marginBottom: '5px', fontSize: '0.9rem' }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#1d1c1c', border: '1px solid #444', color: '#fff' }} placeholder="Your registered email" />
            </div>
            <div>
              <label style={{ display: 'block', color: '#ccc', marginBottom: '5px', fontSize: '0.9rem' }}>PDF URL</label>
              <input type="url" value={pdfUrl} onChange={e => setPdfUrl(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#1d1c1c', border: '1px solid #444', color: '#fff' }} placeholder="https://..." />
            </div>

            <button type="submit" disabled={loading || success} className="mythical-hero-btn" style={{ width: '100%', padding: '14px', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Submit Project'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectSubmissionModal;
