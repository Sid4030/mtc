import React, { useState, useEffect, useRef } from 'react';
import { animate } from "framer-motion";

const Counter = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const controls = animate(0, end, {
      duration: duration,
      onUpdate(value) {
        setCount(Math.floor(value));
      },
      ease: "easeOut"
    });

    return () => controls.stop();
  }, [started, end, duration]);

  return <span ref={nodeRef}>{count}{suffix}</span>;
};

export default Counter;
