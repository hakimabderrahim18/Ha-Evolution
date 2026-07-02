import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LevelUpOverlay({ levelData, onDismiss }) {
  useEffect(() => {
    if (!levelData) return;

    // Web Audio Synthesized chime for Level Up
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const now = ctx.currentTime;
        
        // Synth arpeggio sequence
        const freqs = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          
          gain.gain.setValueAtTime(0.12, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.5);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.6);
        });
      }
    } catch (e) {
      console.warn("Web Audio API not allowed or supported yet:", e);
    }
  }, [levelData]);

  if (!levelData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-background/95 backdrop-blur-xl">
        {/* Glowing Rings background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            className="w-96 h-96 rounded-full border border-primary/40 absolute"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 3], opacity: [0.2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
            className="w-96 h-96 rounded-full border border-accent/40 absolute"
          />
        </div>

        {/* Level Up Content Card */}
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 120 }}
          className="relative max-w-md w-full mx-4 glass border-primary/30 p-8 text-center rounded-3xl shadow-[0_0_50px_rgba(255,213,74,0.3)] z-10"
        >
          {/* Crown badge */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent mx-auto mb-6 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(255,213,74,0.5)]">
            👑
          </div>

          <h2 className="font-space text-4xl font-extrabold tracking-wide mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-accent uppercase">
            Level Ascended!
          </h2>
          
          <p className="text-white/60 text-sm font-space tracking-[4px] uppercase mb-8">
            Evolution State Enhanced
          </p>

          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-xs text-white/40 font-space tracking-wider uppercase mb-1">Previous</div>
              <div className="text-4xl font-space font-bold text-white/60">{levelData.oldLevel}</div>
            </div>
            
            <div className="text-3xl text-primary font-bold">→</div>
            
            <div className="text-center">
              <div className="text-xs text-primary/80 font-space tracking-wider uppercase mb-1">Current</div>
              <div className="text-5xl font-space font-extrabold text-primary drop-shadow-[0_0_15px_rgba(255,213,74,0.6)]">
                {levelData.newLevel}
              </div>
            </div>
          </div>

          <p className="text-white/80 text-sm mb-8 max-w-xs mx-auto italic">
            "Your capacity to absorb knowledge, train your body, and balance your mind has advanced."
          </p>

          {/* Action button */}
          <button
            onClick={onDismiss}
            className="w-full py-4 rounded-2xl font-space font-bold tracking-[2px] bg-gradient-to-r from-primary to-[#FFA726] text-[#0B1220] hover:shadow-[0_0_30px_rgba(255,213,74,0.5)] active:scale-95 transition-all duration-300 cursor-pointer"
          >
            CONTINUE EVOLUTION
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
