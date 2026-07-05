import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import GlassCard from './GlassCard';
import confetti from 'canvas-confetti';

export default function PrayersMatrix() {
  const { todayHistory, toggleTodayPrayer } = useContext(AppContext);

  const prayersList = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const completedCount = Object.values(todayHistory?.prayers || {}).filter(Boolean).length;

  const handlePrayerClick = (prayerName) => {
    confetti({
      particleCount: 40,
      spread: 30,
      colors: ['#22C55E', '#A7F3D0', '#FFFFFF']
    });
    toggleTodayPrayer(prayerName);
  };

  return (
    <GlassCard className="border-emerald-500/10 flex flex-col justify-between p-6 h-full" tilt={true}>
      <div>
        <span className="text-[10px] font-space font-bold text-success tracking-widest uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 block w-max mb-4">
          PRAYERS MATRIX
        </span>
        <h4 className="font-space text-sm md:text-base font-bold text-white mb-4">5 Daily Prayers (+10 XP each)</h4>
        
        {/* Responsive grid wrapping for small displays */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {prayersList.map((p) => {
            const completed = todayHistory?.prayers?.[p] || false;
            return (
              <button
                key={p}
                onClick={() => handlePrayerClick(p)}
                className={`h-16 rounded-xl flex flex-col items-center justify-center border font-space text-[10px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  completed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-success shadow-[0_0_12px_rgba(34,197,94,0.25)] scale-[1.02]'
                    : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:border-white/10'
                }`}
              >
                <span className="text-sm mb-1">🕌</span>
                {p}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-left">
        <span className="text-[10px] text-white/40 font-space uppercase">Status:</span>
        <span className="text-xs text-success font-space font-bold bg-success/10 px-2 py-0.5 rounded-md border border-emerald-500/15">
          {completedCount} / 5 Done
        </span>
      </div>
    </GlassCard>
  );
}
