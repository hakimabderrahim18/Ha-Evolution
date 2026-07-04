import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiHeart, FiBookOpen, FiActivity, FiPlus } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import confetti from 'canvas-confetti';

const SURAH_PRESETS = [
  'Surah Al-Kahf',
  'Surah Al-Mulk',
  'Surah Yaseen',
  'Surah Ar-Rahman',
  'Surah Al-Waqiah',
  'Surah Al-Baqarah',
  'Surah Sajdah'
];

const ONE_PLUS_PRESETS = [
  'Dhikr 100x (SubhanAllah/Alhamdulillah/AllahuAkbar)',
  'Send blessings (Salawat) 100x',
  'Give charity (Sadaqah)',
  'Feed birds or stray animals',
  'Help someone in need / family member',
  'Read 1 Islamic article/hadith',
  'Morning/Evening Adhkar'
];

export default function HabitsPlanner() {
  const { habitsSchedule, updateHabitsWorkout, toggleHabitCompleted, loading } = useContext(AppContext);
  const [activeDay, setActiveDay] = useState('Saturday');
  const [surah, setSurah] = useState('');
  const [onePlus, setOnePlus] = useState('');

  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    if (habitsSchedule && habitsSchedule[activeDay]) {
      setSurah(habitsSchedule[activeDay].surah || '');
      setOnePlus(habitsSchedule[activeDay].onePlusActivity || '');
    } else {
      setSurah('');
      setOnePlus('');
    }
  }, [activeDay, habitsSchedule]);

  const handleSave = () => {
    if (!surah.trim() && !onePlus.trim()) return;
    updateHabitsWorkout(activeDay, surah || 'General Reading', onePlus || 'One Plus Activity');
    confetti({
      particleCount: 50,
      spread: 40,
      colors: ['#00E5FF', '#FFFFFF']
    });
  };

  const handleComplete = (day) => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00E5FF', '#FFD54A', '#22C55E']
    });
    toggleHabitCompleted(day);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-[#0B1220] font-space">
        <div className="w-12 h-12 rounded-full border-t-2 border-cyan-400 animate-spin" />
        <span className="text-xs tracking-[4px] text-cyan-400/80 uppercase animate-pulse">CONNECTING HABITS MATRIX...</span>
      </div>
    );
  }

  // Calculate stats
  const completedCount = Object.values(habitsSchedule || {}).filter(h => h && h.completed).length;
  const completionPercent = Math.round((completedCount / 7) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="pb-32 pt-6 max-w-6xl mx-auto px-4 md:px-8 font-poppins"
    >
      <div className="mb-8">
        <h2 className="font-space text-3xl md:text-5xl font-extrabold tracking-tight">
          QURAN & <span className="bg-gradient-to-r from-cyan-400 to-[#00E5FF] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,229,255,0.2)]">HABITS</span>
        </h2>
        <p className="text-white/40 text-xs md:text-sm tracking-wider uppercase font-space mt-1">
          Surah reading and daily OnePlus positive activities tracker. Earn 50 XP daily.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Settings Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <GlassCard className="border-cyan-500/10">
            <h3 className="font-space text-sm font-bold tracking-[2px] uppercase text-white/80 mb-5 flex items-center gap-2">
              <span>📖</span> Program Day Target
            </h3>

            {/* Select Day */}
            <div className="mb-4">
              <label className="block text-[10px] font-space text-white/50 mb-1.5 uppercase">Schedule Day</label>
              <select
                value={activeDay}
                onChange={(e) => setActiveDay(e.target.value)}
                className="w-full bg-[#121A2C]/80 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="block text-[10px] font-space text-white/50 mb-1.5 uppercase">Daily Surah</label>
                <input
                  type="text"
                  placeholder="e.g. Surah Al-Mulk"
                  value={surah}
                  onChange={(e) => setSurah(e.target.value)}
                  className="w-full bg-[#121A2C]/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-space text-white/50 mb-1.5 uppercase">OnePlus Activity</label>
                <input
                  type="text"
                  placeholder="e.g. Dhikr 100x / Give charity"
                  value={onePlus}
                  onChange={(e) => setOnePlus(e.target.value)}
                  className="w-full bg-[#121A2C]/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              className="w-full py-3 rounded-xl bg-cyan-400 text-[#0B1220] font-space font-bold text-xs hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] active:scale-95 transition-all cursor-pointer mb-5"
            >
              SAVE HABIT FOCUS
            </button>

            {/* Presets */}
            <div className="border-t border-white/5 pt-4">
              <span className="block text-[10px] font-space text-white/40 uppercase mb-2">Surah Presets</span>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {SURAH_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setSurah(p)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-[9px] text-white/80 font-space transition-all cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <span className="block text-[10px] font-space text-white/40 uppercase mb-2">OnePlus Presets</span>
              <div className="flex flex-col gap-1.5">
                {ONE_PLUS_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setOnePlus(p)}
                    className="w-full text-left px-2.5 py-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-[9px] text-white/80 font-space transition-all cursor-pointer truncate"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Habit Badge */}
          <GlassCard className="border-white/5 text-center flex flex-col items-center justify-center p-6">
            <h3 className="font-space text-sm font-bold tracking-[2px] uppercase text-white/80 mb-6">
              WEEKLY HABIT SYNC
            </h3>

            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="54" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                <motion.circle
                  cx="72"
                  cy="72"
                  r="54"
                  stroke="#00E5FF"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={339.29}
                  initial={{ strokeDashoffset: 339.29 }}
                  animate={{ strokeDashoffset: 339.29 - (339.29 * (completionPercent || 0)) / 100 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center flex flex-col items-center">
                <FiHeart className="w-6 h-6 text-cyan-400 fill-cyan-400/20 mb-0.5 animate-pulse" />
                <span className="text-xl font-space font-extrabold text-white">{completionPercent}%</span>
              </div>
            </div>
            <p className="text-white/60 text-xs mt-2">
              {completedCount} of 7 daily habits checked off
            </p>
          </GlassCard>
        </div>

        {/* Right: Weekly timeline list */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <h3 className="font-space text-lg font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
            <span>📅</span> Weekly Habit Timeline
          </h3>

          <div className="flex flex-col gap-3">
            {days.map((day) => {
              const item = habitsSchedule?.[day];
              return (
                <div
                  key={day}
                  className={`glass p-5 rounded-2xl border flex items-center justify-between gap-6 transition-all duration-300 ${
                    item?.completed ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-white/5'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-space text-sm font-bold text-white">{day}</span>
                      {item?.completed && (
                        <span className="text-[9px] font-space font-bold tracking-widest text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
                          SUCCESS
                        </span>
                      )}
                    </div>

                    {item ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="flex items-start gap-1.5">
                          <FiBookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="text-white/80 font-medium truncate" title={item.surah}>
                            {item.surah || 'Quran reading'}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <FiActivity className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="text-white/80 font-medium truncate" title={item.onePlusActivity}>
                            {item.onePlusActivity || 'Habit activity'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-white/20 text-xs italic">Unprogrammed Daily slot</p>
                    )}
                  </div>

                  {item && (
                    <button
                      onClick={() => handleComplete(day)}
                      className={`px-3 py-2 rounded-xl text-xs font-space font-bold border transition-all cursor-pointer ${
                        item.completed
                          ? 'bg-cyan-400/20 border-cyan-400/30 text-cyan-400'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {item.completed ? 'CHECKED' : 'CHECK'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
