import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward } from 'react-icons/fi';

export default function AchievementToast({ achievement, onDismiss }) {
  useEffect(() => {
    if (!achievement) return;

    // Web Audio Synthesized achievement sound
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch (e) {
      console.warn("Audio not allowed yet:", e);
    }

    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);

    return () => clearTimeout(timer);
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      <div className="fixed top-6 right-6 z-[10000] max-w-sm w-full pointer-events-none">
        <motion.div
          initial={{ x: 100, y: -20, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          exit={{ x: 100, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 15, stiffness: 150 }}
          className="pointer-events-auto glass border-primary/20 p-4 rounded-2xl shadow-[0_10px_30px_rgba(124,77,255,0.25)] flex items-center gap-4 relative overflow-hidden"
        >
          {/* Neon background border pulsing */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 animate-pulse-glow" />

          {/* Achievement Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary/30 to-accent/30 border border-primary/40 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(255,213,74,0.3)] shrink-0">
            {achievement.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-space font-bold tracking-[2px] text-primary uppercase flex items-center gap-1">
              <FiAward className="w-3.5 h-3.5" /> ACHIEVEMENT UNLOCKED
            </div>
            <h4 className="font-space text-sm font-bold text-white truncate mt-0.5">
              {achievement.title}
            </h4>
            <p className="text-white/60 text-xs truncate">
              {achievement.description}
            </p>
          </div>

          <div className="text-center bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl shrink-0">
            <span className="font-space text-[10px] font-bold text-primary block leading-none">+XP</span>
            <span className="font-space text-sm font-extrabold text-white leading-none">{achievement.xpAward}</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
