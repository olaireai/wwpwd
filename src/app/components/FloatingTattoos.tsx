'use client';
import { useEffect, useRef } from 'react';

const ICONS = [
  // ── Original tattoo flash ──────────────────────────────────────
  // Mod target
  `<svg width="52" height="52" viewBox="0 0 52 52"><circle cx="26" cy="26" r="25" fill="#6E2C2C" stroke="#1C1C1C" stroke-width="2"/><circle cx="26" cy="26" r="17" fill="#F4F1EA" stroke="#1C1C1C" stroke-width="2"/><circle cx="26" cy="26" r="9" fill="#0E1A2B" stroke="#1C1C1C" stroke-width="2"/></svg>`,
  // Vinyl record
  `<svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#1C1C1C" stroke="#333" stroke-width="1"/><circle cx="24" cy="24" r="16" fill="#242424" stroke="#444" stroke-width="0.5"/><circle cx="24" cy="24" r="11" fill="#2E2E2E" stroke="#444" stroke-width="0.5"/><circle cx="24" cy="24" r="7" fill="#6E2C2C" stroke="#1C1C1C" stroke-width="1.5"/><circle cx="24" cy="24" r="2.5" fill="#1C1C1C"/></svg>`,
  // Rose
  `<svg width="42" height="54" viewBox="0 0 42 54"><line x1="21" y1="30" x2="21" y2="53" stroke="#2D5016" stroke-width="3"/><path d="M21 42 Q7 35 9 46 Q14 46 21 42Z" fill="#3A6B1A" stroke="#1C1C1C" stroke-width="1"/><circle cx="21" cy="20" r="18" fill="#A62020" stroke="#1C1C1C" stroke-width="2"/><circle cx="21" cy="16" r="12" fill="#C53030" stroke="#1C1C1C" stroke-width="1.5"/><circle cx="21" cy="12" r="7" fill="#E04545" stroke="#1C1C1C" stroke-width="1"/><circle cx="21" cy="10" r="3.5" fill="#C53030"/></svg>`,
  // Lightning bolt
  `<svg width="30" height="50" viewBox="0 0 30 50"><polygon points="20,0 4,28 14,25 11,50 26,22 16,25" fill="#D4A017" stroke="#1C1C1C" stroke-width="2" stroke-linejoin="round"/></svg>`,
  // Union Jack
  `<svg width="54" height="36" viewBox="0 0 54 36"><rect width="54" height="36" fill="#0E1A2B" rx="3"/><line x1="0" y1="0" x2="54" y2="36" stroke="white" stroke-width="11"/><line x1="54" y1="0" x2="0" y2="36" stroke="white" stroke-width="11"/><line x1="0" y1="0" x2="54" y2="36" stroke="#6E2C2C" stroke-width="6"/><line x1="54" y1="0" x2="0" y2="36" stroke="#6E2C2C" stroke-width="6"/><rect x="22" y="0" width="10" height="36" fill="white"/><rect x="0" y="13" width="54" height="10" fill="white"/><rect x="24" y="0" width="6" height="36" fill="#6E2C2C"/><rect x="0" y="15" width="54" height="6" fill="#6E2C2C"/><rect width="54" height="36" fill="none" stroke="#1C1C1C" stroke-width="2" rx="3"/></svg>`,
  // Anchor
  `<svg width="40" height="52" viewBox="0 0 40 52"><circle cx="20" cy="7" r="6" fill="none" stroke="#0E1A2B" stroke-width="3.5"/><line x1="20" y1="13" x2="20" y2="47" stroke="#0E1A2B" stroke-width="3.5"/><line x1="5" y1="22" x2="35" y2="22" stroke="#0E1A2B" stroke-width="3.5" stroke-linecap="round"/><path d="M5 42 Q1 33 1 39 Q1 52 20 52 Q39 52 39 39 Q39 33 35 42" fill="none" stroke="#0E1A2B" stroke-width="3.5" stroke-linecap="round"/><circle cx="20" cy="7" r="6" fill="none" stroke="#6B705C" stroke-width="1.5"/><line x1="20" y1="13" x2="20" y2="47" stroke="#6B705C" stroke-width="1.5"/><line x1="5" y1="22" x2="35" y2="22" stroke="#6B705C" stroke-width="1.5" stroke-linecap="round"/><path d="M5 42 Q1 33 1 39 Q1 52 20 52 Q39 52 39 39 Q39 33 35 42" fill="none" stroke="#6B705C" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  // Star
  `<svg width="40" height="40" viewBox="0 0 40 40"><polygon points="20,2 24,15 38,15 27,24 31,37 20,28 9,37 13,24 2,15 16,15" fill="#6B705C" stroke="#1C1C1C" stroke-width="2" stroke-linejoin="round"/></svg>`,
  // Scissors
  `<svg width="38" height="48" viewBox="0 0 38 48"><circle cx="10" cy="37" r="9" fill="none" stroke="#1C1C1C" stroke-width="3"/><circle cx="28" cy="37" r="9" fill="none" stroke="#1C1C1C" stroke-width="3"/><circle cx="10" cy="37" r="9" fill="none" stroke="#9A948A" stroke-width="1.5"/><circle cx="28" cy="37" r="9" fill="none" stroke="#9A948A" stroke-width="1.5"/><line x1="10" y1="28" x2="19" y2="8" stroke="#1C1C1C" stroke-width="3.5" stroke-linecap="round"/><line x1="28" y1="28" x2="19" y2="8" stroke="#1C1C1C" stroke-width="3.5" stroke-linecap="round"/><line x1="10" y1="28" x2="19" y2="8" stroke="#9A948A" stroke-width="1.5" stroke-linecap="round"/><line x1="28" y1="28" x2="19" y2="8" stroke="#9A948A" stroke-width="1.5" stroke-linecap="round"/><circle cx="19" cy="18" r="3" fill="#1C1C1C"/></svg>`,
  // Coffee cup
  `<svg width="42" height="46" viewBox="0 0 42 46"><ellipse cx="21" cy="42" rx="19" ry="4" fill="#D6CFC4" stroke="#1C1C1C" stroke-width="2"/><path d="M7 15 L10 38 H32 L35 15 Z" fill="#D6CFC4" stroke="#1C1C1C" stroke-width="2"/><path d="M35 19 Q46 19 46 27 Q46 35 35 33" fill="none" stroke="#1C1C1C" stroke-width="3" stroke-linecap="round"/><path d="M15 11 Q13 6 15 2" fill="none" stroke="#9A948A" stroke-width="2" stroke-linecap="round"/><path d="M21 11 Q19 5 21 1" fill="none" stroke="#9A948A" stroke-width="2" stroke-linecap="round"/><path d="M27 11 Q25 6 27 2" fill="none" stroke="#9A948A" stroke-width="2" stroke-linecap="round"/><ellipse cx="21" cy="15" rx="14" ry="4" fill="#C8BFB3" stroke="#1C1C1C" stroke-width="2"/></svg>`,
  // Musical note
  `<svg width="34" height="48" viewBox="0 0 34 48"><ellipse cx="11" cy="40" rx="10" ry="7" fill="#0E1A2B" stroke="#1C1C1C" stroke-width="2" transform="rotate(-15 11 40)"/><rect x="20" y="5" width="4" height="35" fill="#0E1A2B" stroke="#1C1C1C" stroke-width="0.5"/><path d="M24 5 Q34 1 34 14 Q34 21 24 20 Z" fill="#0E1A2B" stroke="#1C1C1C" stroke-width="1.5"/></svg>`,

  // ── NEW: Club / gig culture ────────────────────────────────────
  // Polaroid photograph — faded image, white border, thick bottom
  `<svg width="54" height="64" viewBox="0 0 54 64"><rect width="54" height="64" fill="#F5F0E8" rx="2" stroke="#1C1C1C" stroke-width="1.5"/><rect x="5" y="5" width="44" height="38" fill="#C4B49A" rx="1"/><rect x="5" y="5" width="44" height="38" fill="none" stroke="#B0A090" stroke-width="0.5" rx="1"/><line x1="5" y1="18" x2="49" y2="18" stroke="#B0A090" stroke-width="0.5" opacity="0.5"/><line x1="5" y1="30" x2="49" y2="30" stroke="#B0A090" stroke-width="0.5" opacity="0.5"/><ellipse cx="20" cy="22" rx="7" ry="8" fill="#9A8878" opacity="0.6"/><rect x="8" y="47" width="28" height="3" fill="#C0B8A8" rx="1"/><rect x="8" y="52" width="18" height="2" fill="#C0B8A8" rx="1"/></svg>`,

  // Gig poster — vertical, bold stripes, star, lines for text
  `<svg width="44" height="66" viewBox="0 0 44 66"><rect width="44" height="66" fill="#0E1A2B" rx="3" stroke="#1C1C1C" stroke-width="1.5"/><rect x="0" y="0" width="44" height="16" fill="#6E2C2C" rx="3"/><rect x="0" y="13" width="44" height="3" fill="#6E2C2C"/><polygon points="22,3 24,9 31,9 25,13 27,19 22,15 17,19 19,13 13,9 20,9" fill="#D4A017" stroke="#1C1C1C" stroke-width="0.5"/><rect x="5" y="22" width="34" height="3" fill="#F4F1EA" rx="1" opacity="0.9"/><rect x="8" y="28" width="28" height="2" fill="#9A948A" rx="1" opacity="0.7"/><rect x="5" y="34" width="34" height="2" fill="#F4F1EA" rx="1" opacity="0.6"/><rect x="8" y="39" width="22" height="2" fill="#9A948A" rx="1" opacity="0.5"/><rect x="3" y="46" width="38" height="8" fill="#6E2C2C" rx="2" stroke="#D4A017" stroke-width="1"/><rect x="6" y="48" width="32" height="2" fill="#D4A017" rx="1" opacity="0.8"/><rect x="9" y="51" width="24" height="1.5" fill="#D4A017" rx="1" opacity="0.6"/><rect x="5" y="58" width="34" height="2" fill="#9A948A" rx="1" opacity="0.5"/><rect x="10" y="62" width="24" height="1.5" fill="#9A948A" rx="1" opacity="0.4"/></svg>`,

  // Cassette tape
  `<svg width="64" height="42" viewBox="0 0 64 42"><rect width="64" height="42" fill="#2A2A2A" rx="4" stroke="#1C1C1C" stroke-width="1.5"/><rect x="3" y="3" width="58" height="36" fill="#1C1C1C" rx="3"/><rect x="10" y="6" width="44" height="18" fill="#3A3A3A" rx="2"/><circle cx="20" cy="26" r="7" fill="#1C1C1C" stroke="#555" stroke-width="1.5"/><circle cx="44" cy="26" r="7" fill="#1C1C1C" stroke="#555" stroke-width="1.5"/><circle cx="20" cy="26" r="3" fill="#6E2C2C" stroke="#333" stroke-width="1"/><circle cx="44" cy="26" r="3" fill="#6E2C2C" stroke="#333" stroke-width="1"/><path d="M27 26 L37 26" stroke="#555" stroke-width="1.5"/><rect x="13" y="8" width="38" height="14" fill="#D4A017" rx="1" opacity="0.15"/><rect x="15" y="9" width="34" height="2" fill="#9A948A" rx="1" opacity="0.5"/><rect x="18" y="12" width="28" height="1.5" fill="#9A948A" rx="1" opacity="0.4"/><rect x="20" y="15" width="24" height="1.5" fill="#9A948A" rx="1" opacity="0.3"/><rect x="29" y="34" width="6" height="4" fill="#555" rx="1"/></svg>`,

  // Ticket stub — concert ticket with serrated edge
  `<svg width="74" height="32" viewBox="0 0 74 32"><rect width="74" height="32" fill="#F4F1EA" rx="3" stroke="#1C1C1C" stroke-width="1.5"/><line x1="52" y1="0" x2="52" y2="32" stroke="#1C1C1C" stroke-width="1" stroke-dasharray="3,2"/><rect x="2" y="4" width="46" height="24" fill="#0E1A2B" rx="2"/><rect x="4" y="6" width="42" height="8" fill="#6E2C2C" rx="1"/><rect x="6" y="7" width="38" height="2" fill="#D4A017" rx="1" opacity="0.9"/><rect x="6" y="10" width="30" height="1.5" fill="#D4A017" rx="1" opacity="0.6"/><rect x="4" y="17" width="42" height="2" fill="#9A948A" rx="1" opacity="0.5"/><rect x="4" y="21" width="30" height="1.5" fill="#9A948A" rx="1" opacity="0.4"/><rect x="56" y="6" width="14" height="20" fill="#6E2C2C" rx="2"/><rect x="58" y="8" width="10" height="2" fill="#D4A017" rx="1" opacity="0.8"/><rect x="59" y="12" width="8" height="1.5" fill="#9A948A" rx="1" opacity="0.6"/><rect x="59" y="20" width="8" height="1.5" fill="#9A948A" rx="1" opacity="0.4"/></svg>`,

  // Enamel pin badge — circular, mod-style
  `<svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="#0E1A2B" stroke="#D4A017" stroke-width="3"/><circle cx="24" cy="24" r="18" fill="#0E1A2B" stroke="#D4A017" stroke-width="1"/><circle cx="24" cy="24" r="13" fill="#6E2C2C" stroke="#D4A017" stroke-width="1"/><rect x="10" y="22" width="28" height="4" fill="#F4F1EA" rx="1"/><rect x="10" y="22" width="28" height="2" fill="#D4A017" rx="1" opacity="0.8"/><circle cx="24" cy="24" r="4" fill="#0E1A2B" stroke="#D4A017" stroke-width="1"/><line x1="24" y1="1" x2="24" y2="6" stroke="#D4A017" stroke-width="1.5"/><circle cx="24" cy="2" r="1.5" fill="#D4A017"/></svg>`,

  // Fishtail parka — iconic mod coat silhouette
  `<svg width="50" height="64" viewBox="0 0 50 64"><path d="M16 8 Q10 10 6 18 L3 42 Q3 46 7 46 L10 46 L10 40 L14 40 L14 46 L25 46 L25 46 L36 46 L36 40 L40 40 L40 46 L43 46 Q47 46 47 42 L44 18 Q40 10 34 8 Z" fill="#3A4A2A" stroke="#1C1C1C" stroke-width="1.5"/><path d="M14 46 L10 64 L25 56 L40 64 L36 46 Z" fill="#2D3A1E" stroke="#1C1C1C" stroke-width="1.5"/><path d="M18 8 Q25 4 32 8" fill="none" stroke="#1C1C1C" stroke-width="2" stroke-linecap="round"/><ellipse cx="25" cy="7" rx="9" ry="5" fill="#3A4A2A" stroke="#1C1C1C" stroke-width="1.5"/><circle cx="25" cy="7" rx="5" ry="4" fill="none" stroke="#4A5A3A" stroke-width="1"/><line x1="10" y1="22" x2="40" y2="22" stroke="#4A5A3A" stroke-width="1" opacity="0.5"/><rect x="20" y="28" width="10" height="6" fill="#2D3A1E" rx="1" stroke="#4A5A3A" stroke-width="1"/></svg>`,

  // Vespa scooter — side view silhouette
  `<svg width="68" height="46" viewBox="0 0 68 46"><circle cx="13" cy="36" r="9" fill="none" stroke="#1C1C1C" stroke-width="2.5"/><circle cx="13" cy="36" r="9" fill="none" stroke="#6B705C" stroke-width="1.5"/><circle cx="13" cy="36" r="4" fill="#1C1C1C"/><circle cx="55" cy="36" r="9" fill="none" stroke="#1C1C1C" stroke-width="2.5"/><circle cx="55" cy="36" r="9" fill="none" stroke="#6B705C" stroke-width="1.5"/><circle cx="55" cy="36" r="4" fill="#1C1C1C"/><path d="M13 27 Q13 10 22 8 L38 8 Q50 8 55 14 L62 22 Q65 26 64 27 L55 27 Q50 15 42 15 L28 15 Q22 15 22 27 Z" fill="#6E2C2C" stroke="#1C1C1C" stroke-width="2"/><path d="M38 8 L42 2 L52 2 L55 8" fill="#6E2C2C" stroke="#1C1C1C" stroke-width="1.5"/><rect x="42" y="1" width="10" height="3" fill="#D4A017" rx="1"/><path d="M22 27 L13 27" stroke="#1C1C1C" stroke-width="2"/><rect x="6" y="25" width="8" height="4" fill="#3A3A3A" rx="1" stroke="#1C1C1C" stroke-width="1"/><circle cx="34" cy="12" r="3" fill="#D4A017" stroke="#1C1C1C" stroke-width="1"/></svg>`,

  // Rickenbacker guitar — distinctive body outline
  `<svg width="30" height="72" viewBox="0 0 30 72"><rect x="12" y="0" width="6" height="28" fill="#8B4513" stroke="#1C1C1C" stroke-width="1.5" rx="1"/><rect x="10" y="2" width="10" height="4" fill="#6B3410" stroke="#1C1C1C" stroke-width="1"/><line x1="9" y1="6" x2="9" y2="26" stroke="#D4A017" stroke-width="0.5"/><line x1="12" y1="6" x2="12" y2="26" stroke="#D4A017" stroke-width="0.5"/><line x1="15" y1="6" x2="15" y2="26" stroke="#D4A017" stroke-width="0.5"/><line x1="18" y1="6" x2="18" y2="26" stroke="#D4A017" stroke-width="0.5"/><line x1="21" y1="6" x2="21" y2="26" stroke="#D4A017" stroke-width="0.5"/><path d="M4 30 Q2 34 2 42 Q2 56 8 62 Q12 68 15 70 Q18 68 22 62 Q28 56 28 42 Q28 34 26 30 Q22 26 15 26 Q8 26 4 30 Z" fill="#8B4513" stroke="#1C1C1C" stroke-width="2"/><path d="M8 36 Q6 42 6 48 Q6 55 10 59 Q12 62 15 63 Q18 62 20 59 Q24 55 24 48 Q24 42 22 36 Q19 32 15 32 Q11 32 8 36Z" fill="#6B3410" stroke="#1C1C1C" stroke-width="1"/><circle cx="15" cy="46" r="5" fill="none" stroke="#D4A017" stroke-width="1.5"/><rect x="12" y="38" width="6" height="2" fill="#D4A017" rx="0.5" opacity="0.7"/><rect x="12" y="52" width="6" height="2" fill="#D4A017" rx="0.5" opacity="0.7"/></svg>`,

  // NME / music press front page — worn magazine cut
  `<svg width="50" height="66" viewBox="0 0 50 66"><rect width="50" height="66" fill="#F4F1EA" rx="2" stroke="#1C1C1C" stroke-width="1.5"/><rect x="0" y="0" width="50" height="14" fill="#1C1C1C" rx="2"/><rect x="0" y="12" width="50" height="2" fill="#1C1C1C"/><rect x="3" y="3" width="22" height="8" fill="#6E2C2C" rx="1"/><rect x="5" y="4" width="18" height="2.5" fill="#F4F1EA" rx="0.5"/><rect x="5" y="7.5" width="12" height="1.5" fill="#F4F1EA" rx="0.5" opacity="0.6"/><rect x="27" y="4" width="20" height="6" fill="#D4A017" rx="1" opacity="0.8"/><rect x="3" y="17" width="44" height="28" fill="#C4B49A" rx="1" opacity="0.4"/><ellipse cx="25" cy="31" rx="12" ry="14" fill="#9A8878" opacity="0.5"/><rect x="3" y="48" width="44" height="2.5" fill="#1C1C1C" rx="1" opacity="0.7"/><rect x="3" y="53" width="38" height="2" fill="#9A948A" rx="1" opacity="0.5"/><rect x="3" y="57" width="30" height="1.5" fill="#9A948A" rx="1" opacity="0.4"/><rect x="3" y="61" width="36" height="1.5" fill="#9A948A" rx="1" opacity="0.3"/></svg>`,
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
    const speed = 1.4;

    ICONS.forEach((svgMarkup) => {
      const div = document.createElement('div');
      div.innerHTML = svgMarkup;
      div.style.cssText = 'position:fixed;pointer-events:none;opacity:0.28;z-index:2;will-change:transform;';
      container.appendChild(div);

      const svg = div.firstElementChild as SVGElement;
      const w = parseInt(svg.getAttribute('width') || '48');
      const h = parseInt(svg.getAttribute('height') || '48');

      const x = Math.random() * (window.innerWidth - w);
      const y = Math.random() * (window.innerHeight - h);

      const angle = Math.random() * Math.PI * 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      const rotSpeed = (Math.random() - 0.5) * 0.25;
      const rotation = Math.random() * 360;

      div.style.left = x + 'px';
      div.style.top = y + 'px';
      div.style.transform = `rotate(${rotation}deg)`;

      particles.push({ el: div, x, y, vx, vy, rotation, rotSpeed, w, h });
    });

    let animId: number;

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

      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);
    rafRef.current = animId;

    return () => {
      cancelAnimationFrame(animId);
      particles.forEach((p) => p.el.remove());
    };
  }, []);

  return <div ref={containerRef} aria-hidden="true" />;
}
