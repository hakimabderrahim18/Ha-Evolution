import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiActivity, FiTv, FiBookOpen, FiAward, FiCheckCircle } from 'react-icons/fi';
import { AppContext, ACHIEVEMENTS } from '../context/AppContext';
import GlassCard from '../components/GlassCard';

export default function EvolutionAnalytics() {
  const { sportSchedule, entertainmentSchedule, learningSchedule, habitsSchedule, userStats, loading } = useContext(AppContext);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-[#0B1220] font-space">
        <div className="w-12 h-12 rounded-full border-t-2 border-primary animate-spin" />
        <span className="text-xs tracking-[4px] text-primary/80 uppercase animate-pulse">CALCULATING LIFE VELOCITY...</span>
      </div>
    );
  }

  // Math metrics
  const completedWorkouts = Object.values(sportSchedule).filter(w => w.completed).length;
  const completedPlay = Object.values(entertainmentSchedule).filter(p => p && p.completed).length;
  const completedLearn = Object.values(learningSchedule).filter(l => l && l.completed).length;
  const completedHabits = Object.values(habitsSchedule || {}).filter(h => h && h.completed).length;

  const totalCompleted = completedWorkouts + completedPlay + completedLearn + completedHabits;

  // Consistency Score formula: (completed / total planned) * 100
  const totalPlanned = 7 + Object.values(entertainmentSchedule).filter(Boolean).length + 
    Object.values(learningSchedule).filter(Boolean).length + Object.values(habitsSchedule || {}).filter(Boolean).length;
  const consistencyScore = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;

  // Chart data: daily completions count mapping
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dailyCompletions = days.map((day) => {
    let count = 0;
    if (sportSchedule[day]?.completed) count++;
    if (entertainmentSchedule[day]?.completed) count++;
    if (learningSchedule[day]?.completed) count++;
    if (habitsSchedule?.[day]?.completed) count++;
    return count; // returns 0, 1, 2, 3, or 4
  });

  // Calculate coordinates for SVG area chart (width 500, height 150)
  // X steps: Monday = 20, Sunday = 480
  // Y coordinates: 0 completions = 130, 4 completions = 20
  const points = dailyCompletions.map((count, index) => {
    const x = 20 + (index * (460 / 6));
    const y = 130 - (count * (110 / 4));
    return { x, y };
  });

  // Generate SVG path strings
  const linePath = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z`
    : '';

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
          EVOLUTION <span className="bg-gradient-to-r from-accent via-primary to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(124,77,255,0.2)]">ANALYTICS</span>
        </h2>
        <p className="text-white/40 text-xs md:text-sm tracking-wider uppercase font-space mt-1">
          Historical breakdown of neural focus, physical training, and entertainment consistency.
        </p>
      </div>

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <GlassCard className="border-white/5" tilt={false}>
          <div className="text-xs text-white/40 font-space tracking-wider uppercase mb-1">Consistency rating</div>
          <div className="text-4xl font-space font-extrabold text-white">{consistencyScore}%</div>
          <div className="w-full h-1 bg-white/5 rounded-full mt-2.5 overflow-hidden">
            <div className="h-full bg-accent" style={{ width: `${consistencyScore}%` }} />
          </div>
        </GlassCard>

        <GlassCard className="border-accent/10" tilt={false}>
          <div className="text-xs text-accent/80 font-space tracking-wider uppercase mb-1">Fitness Score</div>
          <div className="text-4xl font-space font-extrabold text-[#B39DFF]">{completedWorkouts * 10} pts</div>
          <span className="text-[10px] text-white/40 font-space mt-2 block">{completedWorkouts} routines completed</span>
        </GlassCard>

        <GlassCard className="border-emerald-500/10" tilt={false}>
          <div className="text-xs text-emerald-400/80 font-space tracking-wider uppercase mb-1">Play sync index</div>
          <div className="text-4xl font-space font-extrabold text-[#52E289]">{completedPlay} slots</div>
          <span className="text-[10px] text-white/40 font-space mt-2 block">{completedPlay} movies/games logged</span>
        </GlassCard>

        <GlassCard className="border-primary/10" tilt={false}>
          <div className="text-xs text-primary/80 font-space tracking-wider uppercase mb-1">Study index</div>
          <div className="text-4xl font-space font-extrabold text-primary">{completedLearn * 12} pts</div>
          <span className="text-[10px] text-white/40 font-space mt-2 block">{completedLearn} learning goals met</span>
        </GlassCard>

        <GlassCard className="border-cyan-500/10" tilt={false}>
          <div className="text-xs text-cyan-400/80 font-space tracking-wider uppercase mb-1">Habits Index</div>
          <div className="text-4xl font-space font-extrabold text-cyan-400">{completedHabits * 10} pts</div>
          <span className="text-[10px] text-white/40 font-space mt-2 block">{completedHabits} habits completed</span>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Side: Weekly Evolution Graph */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <GlassCard className="border-white/5">
            <h3 className="font-space text-sm font-bold tracking-[2px] uppercase text-white/80 mb-6 flex items-center gap-2">
              <FiTrendingUp className="text-accent" /> WEEKLY PERFORMANCE ARCHIVE
            </h3>

            {/* Custom SVG Line Area Chart */}
            <div className="w-full h-48 bg-white/[0.01] border border-white/5 rounded-2xl p-4 relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C4DFF" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#7C4DFF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="20" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="20" y1="75" x2="480" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="20" y1="130" x2="480" y2="130" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                {/* Shaded Area */}
                {areaPath && <motion.path
                  d={areaPath}
                  fill="url(#chartGradient)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                />}

                {/* Curved connecting line */}
                {linePath && <motion.path
                  d={linePath}
                  fill="none"
                  stroke="#7C4DFF"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />}

                {/* Nodes */}
                {points.map((p, idx) => (
                  <g key={idx}>
                    <circle cx={p.x} cy={p.y} r="5" fill="#FFD54A" className="cursor-pointer hover:r-7 transition-all" />
                    <circle cx={p.x} cy={p.y} r="8" stroke="#7C4DFF" strokeWidth="1.5" fill="none" className="animate-ping" style={{ animationDuration: '3s' }} />
                  </g>
                ))}
              </svg>
            </div>

            {/* X Axis Labels */}
            <div className="flex justify-between px-6 font-space text-[10px] text-white/40 tracking-wider mt-2.5 font-bold uppercase">
              {days.map(d => <span key={d}>{d.substring(0, 3)}</span>)}
            </div>
          </GlassCard>

          {/* Activity counters details */}
          <GlassCard className="border-white/5 p-6">
            <h3 className="font-space text-sm font-bold tracking-[2px] uppercase text-white/80 mb-4">
              HISTORICAL SYNC COUNTERS
            </h3>
            
            <div className="flex flex-col gap-3 font-space text-xs">
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-white/60">Total Completed Tasks</span>
                <span className="font-bold text-white">{totalCompleted} / {totalPlanned}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-white/60">Total Accumulated XP</span>
                <span className="font-bold text-primary">{userStats.xp} XP</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                <span className="text-white/60">Unlocked Badges</span>
                <span className="font-bold text-accent">{userStats.unlockedAchievements.length} / {ACHIEVEMENTS.length}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-white/60">Surviving Streak</span>
                <span className="font-bold text-success">{userStats.streak} Days</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Achievements Grid */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <GlassCard className="border-white/5">
            <h3 className="font-space text-sm font-bold tracking-[2px] uppercase text-white/80 mb-6 flex items-center gap-2">
              <FiAward className="text-primary" /> EVOLUTIONARY ACHIEVEMENTS
            </h3>

            <div className="flex flex-col gap-4 max-h-[360px] overflow-y-auto pr-1">
              {ACHIEVEMENTS.map((ach) => {
                const isUnlocked = userStats.unlockedAchievements.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-2xl border flex items-center gap-4 transition-all duration-300 ${
                      isUnlocked
                        ? 'bg-primary/5 border-primary/20 shadow-[0_0_15px_rgba(255,213,74,0.06)]'
                        : 'bg-white/[0.01] border-white/5 opacity-40'
                    }`}
                  >
                    {/* Badge Icon */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border ${
                      isUnlocked
                        ? 'bg-primary/20 border-primary/30 shadow-[0_0_10px_rgba(255,213,74,0.25)]'
                        : 'bg-white/5 border-white/5'
                    }`}>
                      {ach.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-space text-xs font-bold text-white uppercase tracking-wider truncate">
                        {ach.title}
                      </h4>
                      <p className="text-[10px] text-white/55 mt-0.5 leading-relaxed">
                        {ach.description}
                      </p>
                    </div>

                    {isUnlocked && (
                      <div className="text-success text-xs font-semibold font-space shrink-0 flex items-center gap-1 bg-success/15 px-2 py-1 rounded-lg border border-success/20">
                        <FiCheckCircle className="w-3.5 h-3.5" /> UNLOCKED
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
