import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VictoryAnimation = ({ isVisible, onComplete }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        if (onComplete) onComplete();
      }, 4000); // Animation lasts 4 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  // 2D Vector Shapes: Stars, Triangles, Circles
  const shapes = Array.from({ length: 30 }).map((_, i) => {
    const type = i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'rect' : 'poly';
    return { id: i, type };
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'radial-gradient(circle, rgba(253, 116, 253, 0.2) 0%, rgba(0,0,0,0) 70%)'
          }}
        >
          {shapes.map((shape) => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 400; // Explode outwards
            const finalX = Math.cos(angle) * distance;
            const finalY = Math.sin(angle) * distance;

            return (
              <motion.div
                key={shape.id}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                animate={{
                  x: finalX,
                  y: finalY,
                  scale: [0, Math.random() + 1, 0],
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 720 - 360,
                }}
                transition={{
                  duration: 2 + Math.random() * 1.5,
                  ease: "easeOut"
                }}
                style={{ position: 'absolute' }}
              >
                {shape.type === 'circle' && (
                  <svg width="30" height="30" viewBox="0 0 30 30">
                    <circle cx="15" cy="15" r="10" fill="#fd74fd" />
                  </svg>
                )}
                {shape.type === 'rect' && (
                  <svg width="30" height="30" viewBox="0 0 30 30">
                    <rect x="5" y="5" width="20" height="20" fill="#7af7f7" />
                  </svg>
                )}
                {shape.type === 'poly' && (
                  <svg width="30" height="30" viewBox="0 0 30 30">
                    <polygon points="15,0 30,30 0,30" fill="#ffdf00" />
                  </svg>
                )}
              </motion.div>
            );
          })}
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 100 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ fontSize: '4rem', color: '#fff', textShadow: '0 0 20px #fd74fd', fontFamily: "'DM Sans', sans-serif" }}>
              UNLOCKED!
            </h1>
            <p style={{ color: '#7af7f7', fontSize: '1.5rem', marginTop: '10px' }}>
              Final Project is now available
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VictoryAnimation;
