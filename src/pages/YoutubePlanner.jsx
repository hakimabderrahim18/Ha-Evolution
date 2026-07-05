import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiYoutube, FiVideo, FiPlus, FiGrid } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import confetti from 'canvas-confetti';

const CHANNEL_PRESETS = [
  'ByteByteGo',
  'Hussein Nasser',
  'Jack Herrington',
  'Dave Gray',
  'Web Dev Simplified',
  'Fireship',
  'Kevin Powell',
  'The Primeagen',
  'Traversy Media',
  'Theo - t3.gg'
];

const TOPIC_PRESETS = [
  'System Design & Architecture',
  'Database Indexing & Sharding',
  'React Advanced Performance & Hooks',
  'Node.js Microservices',
  'CSS Grid & Advanced Layouts',
  'Docker & Containerization',
  'Git Rebase & Advanced Workflows',
  'Web Security & Auth Basics',
  'TypeScript Design Patterns',
  'TypeScript Performance'
];

export default function YoutubePlanner() {
  const { youtubeSchedule, updateYoutubeSchedule, toggleYoutubeCompleted, loading } = useContext(AppContext);
  const [activeDay, setActiveDay] = useState('Saturday');
  const [channel, setChannel] = useState('');
  const [title, setTitle] = useState('');

  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    if (youtubeSchedule && youtubeSchedule[activeDay]) {
      setChannel(youtubeSchedule[activeDay].channel || '');
      setTitle(youtubeSchedule[activeDay].title || '');
    } else {
      setChannel('');
      setTitle('');
    }
  }, [activeDay, youtubeSchedule]);

  const handleSave = () => {
    if (!title.trim()) return;
    updateYoutubeSchedule(activeDay, {
      title,
      channel: channel || 'Self Study',
      completed: youtubeSchedule[activeDay]?.completed || false
    });
    confetti({
      particleCount: 50,
      spread: 40,
      colors: ['#EF4444', '#FFFFFF']
    });
  };

  const handleComplete = (day) => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#EF4444', '#FFD54A', '#22C55E']
    });
    toggleYoutubeCompleted(day);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-[#0B1220] font-space">
        <div className="w-12 h-12 rounded-full border-t-2 border-red-500 animate-spin" />
        <span className="text-xs tracking-[4px] text-red-500/80 uppercase animate-pulse">CONNECTING YOUTUBE MATRIX...</span>
      </div>
    );
  }

  // Stats
  const completedCount = Object.values(youtubeSchedule || {}).filter(y => y && y.completed).length;
  const completionPercent = Math.round((completedCount / 7) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="pb-32 pt-6 max-w-6xl mx-auto px-4 md:px-8 font-poppins"
    >
      {/* Title */}
      <div className="mb-8">
        <h2 className="font-space text-3xl md:text-5xl font-extrabold tracking-tight">
          YOUTUBE <span className="bg-gradient-to-r from-red-500 to-[#EF4444] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(239,68,68,0.2)]">STUDY</span>
        </h2>
        <p className="text-white/40 text-xs md:text-sm tracking-wider uppercase font-space mt-1">
          Plan, log, and study weekly technical videos. Earn 30 XP daily.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Form */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <GlassCard className="border-red-500/10">
            <h3 className="font-space text-sm font-bold tracking-[2px] uppercase text-white/80 mb-5 flex items-center gap-2">
              <FiYoutube className="text-red-500" /> PROGRAM STUDY OBJECTIVE
            </h3>

            {/* Day Selector Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-2 pr-1 mb-4 custom-scrollbar">
              {days.map(d => (
                <button
                  key={d}
                  onClick={() => setActiveDay(d)}
                  className={`px-3 py-1.5 rounded-lg font-space text-[10px] font-bold uppercase transition-all shrink-0 cursor-pointer ${
                    activeDay === d
                      ? 'bg-red-500 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[9px] font-space text-white/40 uppercase mb-1.5">Channel Presets</label>
                <div className="flex flex-wrap gap-1.5">
                  {CHANNEL_PRESETS.map(c => (
                    <button
                      key={c}
                      onClick={() => setChannel(c)}
                      className="px-2 py-1 rounded bg-[#121A2C]/60 hover:bg-[#121A2C] border border-white/5 text-[9px] text-white/70 hover:text-white transition-all cursor-pointer"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-space text-white/40 uppercase mb-1.5">Study Topic Presets</label>
                <div className="flex flex-wrap gap-1.5">
                  {TOPIC_PRESETS.map(t => (
                    <button
                      key={t}
                      onClick={() => setTitle(t)}
                      className="px-2 py-1 rounded bg-[#121A2C]/60 hover:bg-[#121A2C] border border-white/5 text-[9px] text-white/70 hover:text-white transition-all cursor-pointer"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-space text-white/40 uppercase mb-1.5">Target Channel</label>
                <input
                  type="text"
                  placeholder="e.g. ByteByteGo"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full bg-[#121A2C]/80 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-400 placeholder:text-white/20"
                />
              </div>

              <div>
                <label className="block text-[9px] font-space text-white/40 uppercase mb-1.5">Video Title / Study Topic</label>
                <input
                  type="text"
                  placeholder="e.g. System Design Basics"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#121A2C]/80 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-400 placeholder:text-white/20"
                />
              </div>

              <button
                onClick={handleSave}
                className="mt-2 w-full py-3 rounded-xl bg-red-500 text-white font-space font-bold text-xs hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FiPlus className="w-4 h-4" /> SAVE STUDY TASK
              </button>
            </div>
          </GlassCard>

          {/* Stats card */}
          <GlassCard className="border-red-500/10">
            <h3 className="font-space text-sm font-bold tracking-[2px] uppercase text-white/80 mb-3">WEEK PROGRESS</h3>
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-space font-extrabold text-white">{completedCount} / 7 <span className="text-xs text-white/40">DAYS</span></span>
              <span className="text-xs text-red-400 font-space font-bold">{completionPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-[#EF4444] rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </GlassCard>
        </div>

        {/* Right: Weekly Overview */}
        <div className="lg:col-span-7">
          <div className="flex flex-col gap-4">
            {days.map((day) => {
              const item = youtubeSchedule?.[day];
              return (
                <GlassCard
                  key={day}
                  className={`border-red-500/10 flex items-center justify-between p-4 ${
                    day === activeDay ? 'shadow-[0_0_15px_rgba(239,68,68,0.08)] border-red-500/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 truncate">
                    <div className="w-24 text-left shrink-0">
                      <span className="font-space text-xs text-white/40 uppercase block">DAY</span>
                      <span className="font-space text-xs md:text-sm text-white font-bold">{day}</span>
                    </div>

                    <div className="h-8 w-[1px] bg-white/5 shrink-0" />

                    <div className="truncate">
                      {item && item.title ? (
                        <>
                          <h4 className="font-space text-xs md:text-sm font-bold text-white truncate">{item.title}</h4>
                          <p className="text-white/40 text-[10px] md:text-xs">Channel: <strong className="text-red-400">{item.channel}</strong></p>
                        </>
                      ) : (
                        <p className="text-white/20 text-xs italic">No study session programmed.</p>
                      )}
                    </div>
                  </div>

                  {item && item.title && (
                    <button
                      onClick={() => handleComplete(day)}
                      className={`px-4 py-2 rounded-xl font-space font-bold text-xs border shrink-0 transition-all cursor-pointer ${
                        item.completed
                          ? 'bg-red-500/15 border-red-500/20 text-red-400'
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      {item.completed ? '✓ COMPLETED' : 'COMPLETE'}
                    </button>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
