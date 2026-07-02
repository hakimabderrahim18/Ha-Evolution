import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

export default function CinematicIntro({ onEnter }) {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const backgroundRef = useRef(null);

  useEffect(() => {
    // GSAP Intro Sequence Timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Initial setups
    gsap.set(logoRef.current, { scale: 0.1, rotateY: -360, opacity: 0 });
    gsap.set(titleRef.current, { y: 40, opacity: 0 });
    gsap.set(subtitleRef.current, { letterSpacing: '0px', opacity: 0 });
    gsap.set(buttonRef.current, { scale: 0.8, opacity: 0 });

    tl.to(backgroundRef.current, { duration: 1.5, opacity: 1 })
      .to(logoRef.current, { duration: 2.2, scale: 1, rotateY: 0, opacity: 1, ease: 'back.out(1.2)' }, '-=0.5')
      .to(titleRef.current, { duration: 1, y: 0, opacity: 1 }, '-=1.2')
      .to(subtitleRef.current, { duration: 1.2, letterSpacing: '8px', opacity: 0.8 }, '-=0.8')
      .to(buttonRef.current, { duration: 0.8, scale: 1, opacity: 1, ease: 'elastic.out(1.2, 0.75)' }, '-=0.4');

    // Continuous floating animation
    gsap.to(logoRef.current, {
      y: '+=15',
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

  }, []);

  const handleEnterClick = () => {
    // Outro animation before transition
    const tl = gsap.timeline({
      onComplete: () => {
        onEnter();
      }
    });

    tl.to(logoRef.current, { duration: 0.5, scale: 4, opacity: 0, rotateY: 180, ease: 'power4.in' })
      .to(titleRef.current, { duration: 0.4, scale: 1.5, opacity: 0, filter: 'blur(10px)', ease: 'power4.in' }, '-=0.4')
      .to(subtitleRef.current, { duration: 0.4, y: -20, opacity: 0, ease: 'power4.in' }, '-=0.4')
      .to(buttonRef.current, { duration: 0.3, y: 50, opacity: 0, ease: 'power4.in' }, '-=0.3')
      .to(containerRef.current, { duration: 0.8, backgroundColor: 'rgba(11, 18, 32, 1)', opacity: 0, ease: 'power4.inOut' }, '-=0.5');
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-[#0B1220] flex flex-col items-center justify-center z-[9999] overflow-hidden"
    >
      {/* Cinematic Starfield / Particle Overlay */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,77,255,0.12)_0%,transparent_70%)] pointer-events-none opacity-0"
      />

      {/* Grid line background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Futuristic 3D Logo */}
      <div
        ref={logoRef}
        className="relative w-48 h-48 mb-8 preserve-3d cursor-pointer flex items-center justify-center"
        onClick={handleEnterClick}
      >
        {/* Glow outer ring */}
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_12s_linear_infinite] shadow-[0_0_40px_rgba(255,213,74,0.15)]" />
        <div className="absolute inset-2 rounded-full border border-dashed border-accent/40 animate-[spin_8s_linear_infinite_reverse]" />
        
        {/* Main logo badge */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-accent/80 to-primary/80 flex items-center justify-center shadow-2xl relative">
          <div className="absolute inset-[2px] rounded-full bg-[#0B1220] flex flex-col items-center justify-center">
            <span className="font-space text-5xl font-bold bg-gradient-to-r from-primary to-white bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,213,74,0.6)] select-none">
              HA
            </span>
            <span className="text-[10px] tracking-[4px] font-space text-accent font-bold mt-1">EVOLUTION</span>
          </div>
        </div>
      </div>

      {/* Reveal Text */}
      <div className="text-center z-10 select-none px-4">
        <h1
          ref={titleRef}
          className="font-space text-4xl md:text-6xl font-bold tracking-tight mb-2"
        >
          <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">HA LIFE </span>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,213,74,0.3)]">EVOLUTION</span>
        </h1>
        
        <p
          ref={subtitleRef}
          className="font-space text-xs md:text-sm font-semibold text-accent uppercase tracking-[8px] mb-12"
        >
          Your daily growth simulator
        </p>
      </div>

      {/* Entry Button */}
      <button
        ref={buttonRef}
        onClick={handleEnterClick}
        className="relative z-10 px-8 py-3.5 rounded-full font-space text-sm font-bold tracking-[2px] bg-gradient-to-r from-[#7C4DFF] to-[#FFD54A] text-[#0B1220] hover:scale-105 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,77,255,0.6)] cursor-pointer group"
      >
        <span className="relative z-10 flex items-center gap-2">
          ENTER SYSTEM
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </button>

      {/* Floating UI ambient details */}
      <div className="absolute bottom-6 left-6 font-space text-[10px] text-white/20 tracking-wider hidden sm:block">
        BUILD v1.0.8 // SECURE CORE
      </div>
      <div className="absolute bottom-6 right-6 font-space text-[10px] text-white/20 tracking-wider hidden sm:block">
        SYS.LOC: LOCALSTORAGE
      </div>
    </div>
  );
}
