import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import GlassCard from './GlassCard';

export default function HygieneTracker() {
  const { todayHistory, toggleTodayGrooming } = useContext(AppContext);

  const groomingTasks = [
    { key: 'brushAM', label: 'Morning Brush 🪥' },
    { key: 'brushPM', label: 'Night Brush 🪥' },
    { key: 'skincare', label: 'Skincare Routine 🧴' },
    { key: 'shower', label: 'Refresh Shower 🚿' },
    { key: 'floss', label: 'Dental Floss 🧵' }
  ];

  const completedCount = Object.values(todayHistory?.grooming || {}).filter(Boolean).length;

  return (
    <GlassCard className="border-[#FF8A00]/10 flex flex-col justify-between p-6 h-full" tilt={true}>
      <div>
        <span className="text-[10px] font-space font-bold text-[#FF8A00] tracking-widest uppercase bg-[#FF8A00]/10 px-3 py-1 rounded-full border border-[#FF8A00]/20 block w-max mb-4">
          GROOMING SYSTEM
        </span>
        <h4 className="font-space text-sm md:text-base font-bold text-white mb-4">Daily Hygiene Rituals (+25 XP)</h4>
        
        {/* Responsive layout list */}
        <div className="flex flex-col gap-2">
          {groomingTasks.map((g) => {
            const completed = todayHistory?.grooming?.[g.key] || false;
            return (
              <button
                key={g.key}
                onClick={() => toggleTodayGrooming(g.key)}
                className={`w-full text-left p-3 rounded-xl border flex items-center justify-between text-xs font-medium transition-all duration-300 cursor-pointer ${
                  completed
                    ? 'bg-[#FF8A00]/10 border-[#FF8A00]/20 text-[#FF8A00] line-through opacity-70'
                    : 'bg-white/5 border-white/5 text-white/80 hover:bg-white/10 hover:border-white/10'
                }`}
              >
                <span>{g.label}</span>
                <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] transition-all ${
                  completed ? 'border-[#FF8A00] bg-[#FF8A00] text-black font-extrabold' : 'border-white/20'
                }`}>
                  {completed && '✓'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-left">
        <span className="text-[10px] text-white/40 font-space uppercase">Progress:</span>
        <span className="text-xs text-[#FF8A00] font-space font-bold bg-[#FF8A00]/10 px-2 py-0.5 rounded-md border border-[#FF8A00]/15">
          {completedCount} / 5 Done
        </span>
      </div>
    </GlassCard>
  );
}
