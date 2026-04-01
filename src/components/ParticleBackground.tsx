import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
}

const COLORS = [
  { h: 0, s: 85, l: 55 },
  { h: 15, s: 90, l: 55 },
  { h: 35, s: 95, l: 55 },
  { h: 45, s: 95, l: 55 },
  { h: 50, s: 90, l: 60 },
];

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];
    const count = 80;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < count; i++) {
      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        color: `${c.h}, ${c.s}%, ${c.l}%`,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time++;

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const twinkle = Math.sin(time * p.twinkleSpeed + p.twinklePhase) * 0.3 + 0.7;
        const currentOpacity = p.opacity * twinkle;

        // Glow effect
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `hsla(${p.color}, ${currentOpacity})`);
        gradient.addColorStop(1, `hsla(${p.color}, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.color}, ${currentOpacity})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(30, 90%, 55%, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};

export default ParticleBackground;
