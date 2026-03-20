import React, { useEffect, useRef } from 'react';

const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Star properties
    const numStars = 200;
    const stars: { x: number; y: number; z: number; size: number; alpha: number }[] = [];
    
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * width * 2 - width,
            y: Math.random() * height * 2 - height,
            z: Math.random() * 2, // Parallax depth
            size: Math.random() * 1.5,
            alpha: Math.random()
        });
    }

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
        targetX = (e.clientX - width / 2) * 0.05;
        targetY = (e.clientY - height / 2) * 0.05;
    };

    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;

    const render = () => {
        // Smooth cursor interpolation
        mouseX += (targetX - mouseX) * 0.1;
        mouseY += (targetY - mouseY) * 0.1;

        ctx.clearRect(0, 0, width, height);

        // Optional subtle gradient
        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
        gradient.addColorStop(0, 'rgba(10, 20, 35, 0.9)');
        gradient.addColorStop(1, '#050a12');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        stars.forEach(star => {
            // Parallax offset
            const offsetX = star.x - mouseX * star.z;
            const offsetY = star.y - mouseY * star.z;

            // Wrap around logic
            let drawX = (offsetX % width + width) % width;
            let drawY = (offsetY % height + height) % height;

            // Twinkle effect
            star.alpha += (Math.random() - 0.5) * 0.05;
            if (star.alpha < 0.1) star.alpha = 0.1;
            if (star.alpha > 1) star.alpha = 1;

            ctx.beginPath();
            ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fill();
        });

        animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="starfield"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1, // Behind all UI
        pointerEvents: 'none' // Let clicks pass through
      }}
    />
  );
};

export default Starfield;
