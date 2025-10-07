'use client';

import { useEffect, useRef } from 'react';

export default function MathBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Animation parameters
    let time = 0;
    const curves: Array<{
      phase: number;
      amplitude: number;
      frequency: number;
      speed: number;
    }> = [];

    // Generate parametric curves
    for (let i = 0; i < 5; i++) {
      curves.push({
        phase: Math.random() * Math.PI * 2,
        amplitude: 50 + Math.random() * 100,
        frequency: 0.5 + Math.random() * 2,
        speed: 0.0005 + Math.random() * 0.001,
      });
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.01;

      curves.forEach((curve, index) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(250, 250, 250, ${0.05 + index * 0.02})`;
        ctx.lineWidth = 1;

        for (let x = 0; x < canvas.width; x += 5) {
          // Parametric equation: y = A * sin(fx + phase + time)
          const y = 
            canvas.height / 2 +
            curve.amplitude * Math.sin(curve.frequency * x * 0.01 + curve.phase + time * curve.speed * 100);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      });

      // Draw geometric shapes
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 100 + Math.sin(time * 0.5) * 20;

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(250, 250, 250, 0.03)';
      ctx.lineWidth = 1;
      
      // Draw rotating polygon
      const sides = 6;
      for (let i = 0; i <= sides; i++) {
        const angle = (i / sides) * Math.PI * 2 + time * 0.3;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: '#0A0A0A' }}
    />
  );
}
