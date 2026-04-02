'use client';
import { useEffect, useRef } from 'react';

const ICONS = [
  // Mod target
  `<svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#6E2C2C" stroke="#1C1C1C" stroke-width="1.5"/><circle cx="24" cy="24" r="15" fill="#F4F1EA" stroke="#1C1C1C" stroke-width="1.5"/><circle cx="24" cy="24" r="8" fill="#0E1A2B" stroke="#1C1C1C" stroke-width="1.5"/></svg>`,
  // Vinyl record
  `<svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="21" fill="#1C1C1C" stroke="#1C1C1C" stroke-width="1"/><circle cx="22" cy="22" r="15" fill="#242424" stroke="#333" stroke-width="0.5"/><circle cx="22" cy="22" r="10" fill="#2E2E2E" stroke="#333" stroke-width="0.5"/><circle cx="22" cy="22" r="6" fill="#6E2C2C" stroke="#1C1C1C" stroke-width="1"/><circle cx="22" cy="22" r="2" fill="#1C1C1C"/></svg>`,
  // Musical note
  `<svg width="32" height="44" viewBox="0 0 32 44"><ellipse cx="10" cy="37" rx="9" ry="6" fill="#0E1A2B" stroke="#1C1C1C" stroke-width="1.5" transform="rotate(-15 10 37)"/><rect x="18" y="5" width="3.5" height="32" fill="#0E1A2B" stroke="#1C1C1C" stroke-width="0.5"/><path d="M21.5 5 Q32 1 32 13 Q32 20 21.5 19 Z" fill="#0E1A2B" stroke="#1C1C1C" stroke-width="1"/></svg>`,
  // Rose
  `<svg width="40" height="48" viewBox="0 0 40 48"><line x1="20" y1="28" x2="20" y2="47" stroke="#2D5016" stroke-width="2.5"/><path d="M20 38 Q8 32 10 42 Q14 42 20 38Z" fill="#3A6B1A" stroke="#1C1C1C" stroke-width="1"/><circle cx="20" cy="18" r="17" fill="#A62020" stroke="#1C1C1C" stroke-width="1.5"/><circle cx="20" cy="14" r="11" fill="#C53030" stroke="#1C1C1C" stroke-width="1"/><circle cx="20" cy="11" r="6" fill="#E04545" stroke="#1C1C1C" stroke-width="1"/><circle cx="20" cy="9" r="3" fill="#C53030"/></svg>`,
  // Lightning bolt
  `<svg width="28" height="46" viewBox="0 0 28 46"><polygon points="18,0 4,26 13,23 10,46 24,20 15,23" fill="#D4A017" stroke="#1C1C1C" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  // Union Jack
  `<svg width="46" height="30" viewBox="0 0 46 30"><rect width="46" height="30" fill="#0E1A2B" rx="2"/><line x1="0" y1="0" x2="46" y2="30" stroke="white" stroke-width="9"/><line x1="46" y1="0" x2="0" y2="30" stroke="white" stroke-width="9"/><line x1="0" y1="0" x2="46" y2="30" stroke="#6E2C2C" stroke-width="5"/><line x1="46" y1="0" x2="0" y2="30" stroke="#6E2C2C" stroke-width="5"/><rect x="19" y="0" width="8" height="30" fill="white"/><rect x="0" y="11" width="46" height="8" fill="white"/><rect x="21" y="0" width="4" height="30" fill="#6E2C2C"/><rect x="0" y="13" width="46" height="4" fill="#6E2C2C"/><rect width="46" height="30" fill="none" stroke="#1C1C1C" stroke-width="1.5" rx="2"/></svg>`,
  // Anchor
  `<svg width="38" height="48" viewBox="0 0 38 48"><circle cx="19" cy="6" r="5" fill="none" stroke="#0E1A2B" stroke-width="3"/><line x1="19" y1="11" x2="19" y2="44" stroke="#0E1A2B" stroke-width="3"/><line x1="6" y1="20" x2="32" y2="20" stroke="#0E1A2B" stroke-width="3" stroke-linecap="round"/><path d="M6 38 Q2 30 2 36 Q2 48 19 48 Q36 48 36 36 Q36 30 32 38" fill="none" stroke="#0E1A2B" stroke-width="3" stroke-linecap="round"/><circle cx="19" cy="6" r="5" fill="none" stroke="#6B705C" stroke-width="1.5"/><line x1="19" y1="11" x2="19" y2="44" stroke="#6B705C" stroke-width="1.5"/><line x1="6" y1="20" x2="32" y2="20" stroke="#6B705C" stroke-width="1.5" stroke-linecap="round"/><path d="M6 38 Q2 30 2 36 Q2 48 19 48 Q36 48 36 36 Q36 30 32 38" fill="none" stroke="#6B705C" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  // Star
  `<svg width="36" height="36" viewBox="0 0 36 36"><polygon points="18,2 22,13 34,13 24,21 28,33 18,25 8,33 12,21 2,13 14,13" fill="#6B705C" stroke="#1C1C1C" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  // Scissors
  `<svg width="36" height="44" viewBox="0 0 36 44"><circle cx="9" cy="34" r="8" fill="none" stroke="#1C1C1C" stroke-width="2.5"/><circle cx="27" cy="34" r="8" fill="none" stroke="#1C1C1C" stroke-width="2.5"/><circle cx="9" cy="34" r="8" fill="none" stroke="#9A948A" stroke-width="1.5"/><circle cx="27" cy="34" r="8" fill="none" stroke="#9A948A" stroke-width="1.5"/><line x1="9" y1="26" x2="18" y2="8" stroke="#1C1C1C" stroke-width="3" stroke-linecap="round"/><line x1="27" y1="26" x2="18" y2="8" stroke="#1C1C1C" stroke-width="3" stroke-linecap="round"/><line x1="9" y1="26" x2="18" y2="8" stroke="#9A948A" stroke-width="1.5" stroke-linecap="round"/><line x1="27" y1="26" x2="18" y2="8" stroke="#9A948A" stroke-width="1.5" stroke-linecap="round"/><circle cx="18" cy="17" r="2.5" fill="#1C1C1C"/></svg>`,
  // Coffee cup
  `<svg width="38" height="42" viewBox="0 0 38 42"><ellipse cx="19" cy="38" rx="18" ry="4" fill="#D6CFC4" stroke="#1C1C1C" stroke-width="1.5"/><path d="M6 14 L9 34 H29 L32 14 Z" fill="#D6CFC4" stroke="#1C1C1C" stroke-width="1.5"/><path d="M32 18 Q42 18 42 25 Q42 32 32 30" fill="none" stroke="#1C1C1C" stroke-width="2.5" stroke-linecap="round"/><path d="M14 10 Q12 6 14 2" fill="none" stroke="#9A948A" stroke-width="1.5" stroke-linecap="round"/><path d="M19 10 Q17 5 19 1" fill="none" stroke="#9A948A" stroke-width="1.5" stroke-linecap="round"/><path d="M24 10 Q22 6 24 2" fill="none" stroke="#9A948A" stroke-width="1.5" stroke-linecap="round"/><ellipse cx="19" cy="14" rx="13" ry="3" fill="#C8BFB3" stroke="#1C1C1C" stroke-width="1.5"/></svg>`,
];

interface Particle {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  w: number;
  h: number;
}

export default function FloatingTattoos() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles: Particle[] = [];
    const speed = 1.2;

    ICONS.forEach((svgMarkup) => {
      const div = document.createElement('div');
      div.innerHTML = svgMarkup;
      div.style.cssText = 'position:fixed;pointer-events:none;opacity:0.18;z-index:1;';
      container.appendChild(div);

      // Get dimensions from the SVG element
      const svg = div.firstElementChild as SVGElement;
      const w = parseInt(svg.getAttribute('width') || '40');
      const h = parseInt(svg.getAttribute('height') || '40');

      // Random start position
      const x = Math.random() * (window.innerWidth - w);
      const y = Math.random() * (window.innerHeight - h);

      // Random velocity with consistent speed
      const angle = Math.random() * Math.PI * 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      const rotSpeed = (Math.random() - 0.5) * 0.3;
      const rotation = Math.random() * 360;

      div.style.left = x + 'px';
      div.style.top = y + 'px';
      div.style.transform = `rotate(${rotation}deg)`;

      particles.push({ el: div, x, y, vx, vy, rotation, rotSpeed, w, h });
    });

    function animate() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        if (p.x <= 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        else if (p.x + p.w >= vw) { p.x = vw - p.w; p.vx = -Math.abs(p.vx); }

        if (p.y <= 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        else if (p.y + p.h >= vh) { p.y = vh - p.h; p.vy = -Math.abs(p.vy); }

        p.el.style.left = p.x + 'px';
        p.el.style.top = p.y + 'px';
        p.el.style.transform = `rotate(${p.rotation}deg)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      particles.forEach((p) => p.el.remove());
    };
  }, []);

  return <div ref={containerRef} aria-hidden="true" />;
}
