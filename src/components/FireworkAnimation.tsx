import { useEffect, useRef } from "react";

const FireworkAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cw = window.innerWidth;
    let ch = window.innerHeight;
    let fireworks: Firework[] = [];
    let particles: Particle[] = [];
    let hue = 120;
    let timerTotal = 80;
    let timerTick = 0;
    let limiterTotal = 5;
    let limiterTick = 0;
    let mousedown = false;
    let mx = 0;
    let my = 0;
    let animationFrameId: number;

    canvas.width = cw;
    canvas.height = ch;

    const random = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const calculateDistance = (
      p1x: number,
      p1y: number,
      p2x: number,
      p2y: number
    ) => {
      const xDistance = p1x - p2x;
      const yDistance = p1y - p2y;
      return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    };

    class Firework {
      x: number;
      y: number;
      sx: number;
      sy: number;
      tx: number;
      ty: number;
      distanceToTarget: number;
      distanceTraveled: number;
      coordinates: [number, number][];
      coordinateCount: number;
      angle: number;
      speed: number;
      acceleration: number;
      brightness: number;
      targetRadius: number;

      constructor(sx: number, sy: number, tx: number, ty: number) {
        this.x = sx;
        this.y = sy;
        this.sx = sx;
        this.sy = sy;
        this.tx = tx;
        this.ty = ty;
        this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
        this.distanceTraveled = 0;
        this.coordinates = [];
        this.coordinateCount = 3;
        while (this.coordinateCount--) {
          this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.atan2(ty - sy, tx - sx);
        this.speed = 2;
        this.acceleration = 1.05;
        this.brightness = random(50, 70);
        this.targetRadius = 1;
      }

      update(index: number) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        if (this.targetRadius < 8) {
          this.targetRadius += 0.3;
        } else {
          this.targetRadius = 1;
        }

        this.speed *= this.acceleration;

        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;
        this.distanceTraveled = calculateDistance(
          this.sx,
          this.sy,
          this.x + vx,
          this.y + vy
        );

        if (this.distanceTraveled >= this.distanceToTarget) {
          createParticles(this.tx, this.ty);
          fireworks.splice(index, 1);
        } else {
          this.x += vx;
          this.y += vy;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(
          this.coordinates[this.coordinates.length - 1][0],
          this.coordinates[this.coordinates.length - 1][1]
        );
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = "hsl(" + hue + ", 100%, " + this.brightness + "%)";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    class Particle {
      x: number;
      y: number;
      coordinates: [number, number][];
      coordinateCount: number;
      angle: number;
      speed: number;
      friction: number;
      gravity: number;
      hue: number;
      brightness: number;
      alpha: number;
      decay: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.coordinates = [];
        this.coordinateCount = 5;
        while (this.coordinateCount--) {
          this.coordinates.push([this.x, this.y]);
        }
        this.angle = random(0, Math.PI * 2);
        this.speed = random(1, 10);
        this.friction = 0.95;
        this.gravity = 1;
        this.hue = random(hue - 50, hue + 50);
        this.brightness = random(50, 80);
        this.alpha = 1;
        this.decay = random(0.015, 0.03);
      }

      update(index: number) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;

        if (this.alpha <= this.decay) {
          particles.splice(index, 1);
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(
          this.coordinates[this.coordinates.length - 1][0],
          this.coordinates[this.coordinates.length - 1][1]
        );
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle =
          "hsla(" +
          this.hue +
          ", 100%, " +
          this.brightness +
          "%, " +
          this.alpha +
          ")";
        ctx.stroke();
      }
    }

    const createParticles = (x: number, y: number) => {
      let particleCount = 30;
      while (particleCount--) {
        particles.push(new Particle(x, y));
      }
    };

    const loop = () => {
      animationFrameId = requestAnimationFrame(loop);

      hue = random(0, 360);

      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = "lighter";

      let i = fireworks.length;
      while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
      }

      let j = particles.length;
      while (j--) {
        particles[j].draw();
        particles[j].update(j);
      }

      if (timerTick >= timerTotal) {
        if (!mousedown) {
          fireworks.push(
            new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2))
          );
          timerTick = 0;
        }
      } else {
        timerTick++;
      }

      if (limiterTick >= limiterTotal) {
        if (mousedown) {
          fireworks.push(new Firework(cw / 2, ch, mx, my));
          limiterTick = 0;
        }
      } else {
        limiterTick++;
      }
    };

    const handleResize = () => {
      cw = window.innerWidth;
      ch = window.innerHeight;
      canvas.width = cw;
      canvas.height = ch;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX; // Use clientX/Y for viewport coordinates (match fixed canvas)
      my = e.clientY;
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Don't prevent default to allow clicking underlying elements
      mousedown = true;
    };

    const handleMouseUp = (e: MouseEvent) => {
      mousedown = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    loop();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 50, // Overlay on top of content
      }}
    />
  );
};

export default FireworkAnimation;
