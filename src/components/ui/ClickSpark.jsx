import React, { useRef, useEffect, useCallback } from 'react';

const ClickSpark = ({
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  children,
  className = "",
}) => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const draw = useCallback((timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeSparks = false;

    sparksRef.current.forEach((group) => {
      const elapsed = timestamp - group.startTime;
      if (elapsed >= duration) return;

      activeSparks = true;
      const progress = elapsed / duration;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentRadius = easeOut * sparkRadius;
      const opacity = 1 - progress;

      group.particles.forEach((p) => {
        const x = group.x + Math.cos(p.angle) * currentRadius;
        const y = group.y + Math.sin(p.angle) * currentRadius;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(p.angle);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(sparkSize, 0);
        
        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.globalAlpha = opacity;
        ctx.stroke();
        
        ctx.restore();
      });
    });

    sparksRef.current = sparksRef.current.filter(g => timestamp - g.startTime < duration);

    if (activeSparks) {
      requestAnimationFrame(draw);
    }
  }, [duration, sparkColor, sparkRadius, sparkSize]);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const particles = Array.from({ length: sparkCount }).map((_, i) => ({
      angle: (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.5,
    }));

    sparksRef.current.push({
      x,
      y,
      startTime: performance.now(),
      particles
    });

    requestAnimationFrame(draw);
  };

  return (
    <div className={`relative ${className}`} onClick={handleClick}>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 99999 }}
      />
      {children}
    </div>
  );
};

export default ClickSpark;
