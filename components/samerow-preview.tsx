'use client';

import {useEffect, useRef, useState} from 'react';

const duration = 100;

export default function SameRowPreview() {
  const preview = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [position, setPosition] = useState(38);
  const [offset, setOffset] = useState(27);

  useEffect(() => {
    if (!preview.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(preview.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timer = window.setInterval(() => {
      if (reducedMotion.matches || document.hidden || document.documentElement.dataset.motion === 'paused') return;
      setPosition(current => current + offset >= duration ? 0 : current + 1);
    }, 500);
    return () => window.clearInterval(timer);
  }, [inView, offset]);

  return (
    <div className="sync-demo" ref={preview}>
      <span>PLAYBACK TIMING / LOCAL DEMO</span>
      <div className="sync-track">
        <span>You</span>
        <progress aria-label="Your playback progress" value={position} max={duration} />
      </div>
      <div className="sync-track">
        <span>Friend</span>
        <progress aria-label="Friend’s playback progress" value={position + offset} max={duration} />
      </div>
      <div className="sync-bottom">
        <span aria-live="polite">{offset ? `${offset} ticks apart.` : 'In the same moment.'}</span>
        <button type="button" onClick={() => setOffset(0)}>Bring us together ↔</button>
      </div>
    </div>
  );
}
