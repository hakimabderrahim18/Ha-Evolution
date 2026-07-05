import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiAward, FiZap, FiCheck, FiArrowRight } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import confetti from 'canvas-confetti';

const QUOTES = [
  "Optimize the machine. Upgrade the hardware. Refine the software.",
  "Consistency is the engine of the self-evolution loop.",
  "Discipline beats talent when talent fails to train.",
  "Your potential is limitless; evolve beyond constraints.",
  "The only way to predict the future is to build it."
];

export default function Dashboard() {
  const {
    sportSchedule,
    toggleSportWorkoutCompleted,
    entertainmentSchedule,
    toggleEntertainmentCompleted,
    learningSchedule,
    toggleLearningCompleted,
    habitsSchedule,
    toggleHabitCompleted,
    youtubeSchedule,
    toggleYoutubeCompleted,
    userStats,
    addXP,
    loading
  } = useContext(AppContext);

  const [quote, setQuote] = useState('');
  const [greeting, setGreeting] = useState('Ascendant');

  useEffect(() => {
    // Pick random quote
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    // Pick greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-[#0B1220] font-space">
        <div className="w-12 h-12 rounded-full border-t-2 border-primary animate-spin" />
        <span className="text-xs tracking-[4px] text-primary/80 uppercase animate-pulse">CONNECTING COGNITIVE MATRIX...</span>
      </div>
    );
  }

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayName = daysOfWeek[new Date().getDay()];

  // Active items for today
  const todayWorkout = sportSchedule[todayDayName];
  const todayPlay = entertainmentSchedule[todayDayName];
  const todayLearn = learningSchedule[todayDayName];
  const todayHabit = habitsSchedule?.[todayDayName];
  const todayYoutube = youtubeSchedule?.[todayDayName];

  // Calculate percentages
  const completedWorkoutsCount = Object.values(sportSchedule).filter(w => w.completed).length;
  const completedPlayCount = Object.values(entertainmentSchedule).filter(p => p && p.completed).length;
  const completedLearnCount = Object.values(learningSchedule).filter(l => l && l.completed).length;
  const completedHabitsCount = Object.values(habitsSchedule || {}).filter(h => h && h.completed).length;
  const completedYoutubeCount = Object.values(youtubeSchedule || {}).filter(y => y && y.completed).length;

  const totalTasks = 7;
  const workoutPercent = Math.round((completedWorkoutsCount / totalTasks) * 100);
  const playPercent = Math.round((completedPlayCount / totalTasks) * 100);
  const learnPercent = Math.round((completedLearnCount / totalTasks) * 100);
  const habitsPercent = Math.round((completedHabitsCount / totalTasks) * 100);
  const youtubePercent = Math.round((completedYoutubeCount / totalTasks) * 100);

  const handleCompleteConfetti = (type, day) => {
    // Trigger confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FFD54A', '#7C4DFF', '#22C55E', '#FFFFFF']
    });

    if (type === 'sport') toggleSportWorkoutCompleted(day);
    if (type === 'play') toggleEntertainmentCompleted(day);
    if (type === 'learn') toggleLearningCompleted(day);
    if (type === 'habits') toggleHabitCompleted(day);
    if (type === 'youtube') toggleYoutubeCompleted(day);
  };

  const nextLevelXp = userStats.level * 300;
  const xpPercentage = Math.round((userStats.xp / nextLevelXp) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="pb-32 pt-6 max-w-6xl mx-auto px-4 md:px-8 font-poppins"
    >
      {/* Hero Greeting Panel */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-space text-3xl md:text-5xl font-extrabold tracking-tight"
          >
            {greeting}, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,213,74,0.2)]">EVOLVER</span>
          </motion.h2>
          <p className="text-white/40 text-xs md:text-sm tracking-widest uppercase font-space mt-1">
            HA SYSTEM STATUS: ACTIVE // CURRENT DATE: {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>

        {/* Streak & XP Summary Card */}
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 glass px-4 py-2 rounded-2xl border-white/5 shadow-lg">
            <FiZap className="w-5 h-5 text-primary fill-primary animate-pulse" />
            <div className="font-space">
              <span className="text-[10px] text-white/40 block leading-none uppercase">Streak</span>
              <span className="text-lg font-bold text-white">{userStats.streak} Days</span>
            </div>
          </div>

          <div className="flex items-center gap-2 glass px-4 py-2 rounded-2xl border-white/5 shadow-lg">
            <FiAward className="w-5 h-5 text-accent" />
            <div className="font-space">
              <span className="text-[10px] text-white/40 block leading-none uppercase">Evolution Level</span>
              <span className="text-lg font-bold text-accent">Rank {userStats.level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Banner */}
      <GlassCard className="mb-10 py-4 px-6 border-primary/20 bg-gradient-to-r from-primary/5 via-accent/5 to-transparent relative" tilt={false}>
        <div className="flex items-center gap-4">
          <span className="text-2xl">💡</span>
          <p className="font-space text-sm text-white/90 italic font-medium leading-relaxed">
            "{quote}"
          </p>
        </div>
      </GlassCard>

      {/* Level XP Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-end font-space text-xs mb-2">
          <span className="text-white/60">XP PROGRESSION</span>
          <span className="text-primary font-bold">{userStats.xp} / {nextLevelXp} XP ({xpPercentage}%)</span>
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 relative p-[1px]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-accent via-primary to-[#FF8A00] shadow-[0_0_10px_rgba(124,77,255,0.4)]"
          />
        </div>
      </div>

      {/* Statistics Overview Ring Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
        {/* Fitness Progress Ring */}
        <GlassCard className="flex flex-col items-center justify-center p-6 text-center border-accent/20" glow={true} glowColor="accent">
          <h3 className="font-space text-xs font-bold text-accent tracking-[2px] uppercase mb-4">FITNESS MATRIX</h3>
          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              {/* Outer track */}
              <circle cx="72" cy="72" r="54" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
              {/* Active track */}
              <motion.circle
                cx="72"
                cy="72"
                r="54"
                stroke="#7C4DFF"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={339.29}
                initial={{ strokeDashoffset: 339.29 }}
                animate={{ strokeDashoffset: 339.29 - (339.29 * (workoutPercent || 0)) / 100 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-space font-extrabold text-white">{workoutPercent}%</span>
              <span className="text-[10px] text-white/40 block tracking-wider uppercase mt-0.5">COMPLETED</span>
            </div>
          </div>
          <p className="text-white/60 text-xs">
            {completedWorkoutsCount} of 7 routines logged this week
          </p>
        </GlassCard>

        {/* Learning Consistency Ring */}
        <GlassCard className="flex flex-col items-center justify-center p-6 text-center border-primary/20" glow={true} glowColor="primary">
          <h3 className="font-space text-xs font-bold text-primary tracking-[2px] uppercase mb-4">LEARNING INDEX</h3>
          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r="54" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
              <motion.circle
                cx="72"
                cy="72"
                r="54"
                stroke="#FFD54A"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={339.29}
                initial={{ strokeDashoffset: 339.29 }}
                animate={{ strokeDashoffset: 339.29 - (339.29 * (learnPercent || 0)) / 100 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-space font-extrabold text-white">{learnPercent}%</span>
              <span className="text-[10px] text-white/40 block tracking-wider uppercase mt-0.5">CONSISTENCY</span>
            </div>
          </div>
          <p className="text-white/60 text-xs">
            {completedLearnCount} of 7 study sessions achieved
          </p>
        </GlassCard>

        {/* Entertainment Balance Ring */}
        <GlassCard className="flex flex-col items-center justify-center p-6 text-center border-emerald-500/20" glow={true} glowColor="success">
          <h3 className="font-space text-xs font-bold text-success tracking-[2px] uppercase mb-4">ENTERTAINMENT SYNC</h3>
          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r="54" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
              <motion.circle
                cx="72"
                cy="72"
                r="54"
                stroke="#22C55E"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={339.29}
                initial={{ strokeDashoffset: 339.29 }}
                animate={{ strokeDashoffset: 339.29 - (339.29 * (playPercent || 0)) / 100 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-space font-extrabold text-white">{playPercent}%</span>
              <span className="text-[10px] text-white/40 block tracking-wider uppercase mt-0.5">COMPLETED</span>
            </div>
          </div>
          <p className="text-white/60 text-xs">
            {completedPlayCount} of 7 gaming/movie slots filled
          </p>
        </GlassCard>

        {/* Habits Progress Ring */}
        <GlassCard className="flex flex-col items-center justify-center p-6 text-center border-cyan-500/20" glow={true} glowColor="accent">
          <h3 className="font-space text-xs font-bold text-cyan-400 tracking-[2px] uppercase mb-4">QURAN & HABITS</h3>
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
                animate={{ strokeDashoffset: 339.29 - (339.29 * (habitsPercent || 0)) / 100 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-space font-extrabold text-white">{habitsPercent}%</span>
              <span className="text-[10px] text-white/40 block tracking-wider uppercase mt-0.5">COMPLETED</span>
            </div>
          </div>
          <p className="text-white/60 text-xs">
            {completedHabitsCount} of 7 daily habits achieved
          </p>
        </GlassCard>

        {/* Youtube Progress Ring */}
        <GlassCard className="flex flex-col items-center justify-center p-6 text-center border-red-500/20" glow={true} glowColor="error">
          <h3 className="font-space text-xs font-bold text-red-500 tracking-[2px] uppercase mb-4">YOUTUBE STUDY</h3>
          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r="54" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
              <motion.circle
                cx="72"
                cy="72"
                r="54"
                stroke="#EF4444"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={339.29}
                initial={{ strokeDashoffset: 339.29 }}
                animate={{ strokeDashoffset: 339.29 - (339.29 * (youtubePercent || 0)) / 100 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-space font-extrabold text-white">{youtubePercent}%</span>
              <span className="text-[10px] text-white/40 block tracking-wider uppercase mt-0.5">COMPLETED</span>
            </div>
          </div>
          <p className="text-white/60 text-xs">
            {completedYoutubeCount} of 7 daily study logs achieved
          </p>
        </GlassCard>

        {/* Youtube Card */}
        <GlassCard className="border-red-500/15 flex flex-col justify-between h-[220px]" tilt={true}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-space font-bold text-red-400 tracking-widest uppercase bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">YOUTUBE</span>
              {todayYoutube?.completed && <span className="text-success text-xs font-space font-bold flex items-center gap-1">✓ COMPLETED</span>}
            </div>
            {todayYoutube && todayYoutube.title ? (
              <>
                <h4 className="font-space text-lg font-bold mb-1 text-white truncate">{todayYoutube.title}</h4>
                <p className="text-white/60 text-xs">Channel: <strong className="text-red-400">{todayYoutube.channel}</strong></p>
              </>
            ) : (
              <>
                <h4 className="font-space text-xl font-bold mb-1 text-white">Unscheduled</h4>
                <p className="text-white/60 text-xs">No study video set for today. Head to the YouTube tab to schedule one!</p>
              </>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] text-white/40 font-space uppercase">Target: Study</span>
            {todayYoutube ? (
              todayYoutube.completed ? (
                <span className="text-xs text-white/40 italic">Study log complete!</span>
              ) : (
                <button
                  onClick={() => handleCompleteConfetti('youtube', todayDayName)}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white font-space font-bold text-xs hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FiCheck className="w-3.5 h-3.5" /> MARK DONE
                </button>
              )
            ) : (
              <span className="text-xs text-white/40 italic">Empty focus</span>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Today's Tasks Heading */}
      <h3 className="font-space text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
        <FiTrendingUp className="text-primary w-5 h-5" /> Today's Evolution Focus <span className="text-white/30 text-sm">({todayDayName})</span>
      </h3>

      {/* Today's 3D Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Fitness Card */}
        <GlassCard className="border-accent/15 flex flex-col justify-between h-[220px]" tilt={true}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-space font-bold text-accent tracking-widest uppercase bg-accent/10 px-3 py-1 rounded-full border border-accent/20">FITNESS</span>
              {todayWorkout?.completed && <span className="text-success text-xs font-space font-bold flex items-center gap-1">✓ COMPLETED</span>}
            </div>
            <h4 className="font-space text-xl font-bold mb-1 text-white">{todayWorkout?.muscle || 'Rest Day'}</h4>
            <p className="text-white/60 text-xs line-clamp-2">{todayWorkout?.name || 'Recovery routines and light stretching'}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] text-white/40 font-space uppercase">Target: Workout</span>
            {todayWorkout?.completed ? (
              <span className="text-xs text-white/40 italic">Great job today!</span>
            ) : (
              <button
                onClick={() => handleCompleteConfetti('sport', todayDayName)}
                className="px-4 py-2 rounded-xl bg-accent text-white font-space font-bold text-xs hover:shadow-[0_0_15px_rgba(124,77,255,0.4)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FiCheck className="w-3.5 h-3.5" /> MARK DONE
              </button>
            )}
          </div>
        </GlassCard>

        {/* Entertainment Card */}
        <GlassCard className="border-emerald-500/15 flex flex-col justify-between h-[220px]" tilt={true}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-space font-bold text-success tracking-widest uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">ENTERTAINMENT</span>
              {todayPlay?.completed && <span className="text-success text-xs font-space font-bold flex items-center gap-1">✓ COMPLETED</span>}
            </div>
            {todayPlay ? (
              <>
                <h4 className="font-space text-xl font-bold mb-1 text-white truncate">{todayPlay.title}</h4>
                <p className="text-white/60 text-xs">
                  Type: <span className="capitalize">{todayPlay.type}</span> | Genre: {todayPlay.genre}
                </p>
                <p className="text-white/60 text-xs mt-1">Duration: {todayPlay.duration} min | Rating: {'★'.repeat(todayPlay.rating)}</p>
              </>
            ) : (
              <>
                <h4 className="font-space text-xl font-bold mb-1 text-white">Unscheduled</h4>
                <p className="text-white/60 text-xs">No gaming or movie session set for today. Go to the Play tab to add one!</p>
              </>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] text-white/40 font-space uppercase">Target: Balance</span>
            {todayPlay ? (
              todayPlay.completed ? (
                <span className="text-xs text-white/40 italic">Slot completed!</span>
              ) : (
                <button
                  onClick={() => handleCompleteConfetti('play', todayDayName)}
                  className="px-4 py-2 rounded-xl bg-success text-white font-space font-bold text-xs hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FiCheck className="w-3.5 h-3.5" /> MARK DONE
                </button>
              )
            ) : (
              <span className="text-xs text-white/40 italic">Empty schedule</span>
            )}
          </div>
        </GlassCard>

        {/* Learning Card */}
        <GlassCard className="border-primary/15 flex flex-col justify-between h-[220px]" tilt={true}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-space font-bold text-primary tracking-widest uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">LEARNING</span>
              {todayLearn?.completed && <span className="text-success text-xs font-space font-bold flex items-center gap-1">✓ COMPLETED</span>}
            </div>
            {todayLearn ? (
              <>
                <h4 className="font-space text-xl font-bold mb-1 text-white truncate">{todayLearn.subject}</h4>
                <p className="text-white/60 text-xs line-clamp-2">Objective: {todayLearn.objective}</p>
                {todayLearn.hours > 0 && (
                  <p className="text-primary text-xs font-bold font-space mt-1">Logged: {todayLearn.hours} hours</p>
                )}
              </>
            ) : (
              <>
                <h4 className="font-space text-xl font-bold mb-1 text-white">No Class Set</h4>
                <p className="text-white/60 text-xs">No learning routine set for today. Open the Learning tab to configure a subject!</p>
              </>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] text-white/40 font-space uppercase">Target: Growth</span>
            {todayLearn ? (
              todayLearn.completed ? (
                <span className="text-xs text-white/40 italic">Knowledge acquired!</span>
              ) : (
                <button
                  onClick={() => handleCompleteConfetti('learn', todayDayName)}
                  className="px-4 py-2 rounded-xl bg-primary text-[#0B1220] font-space font-bold text-xs hover:shadow-[0_0_15px_rgba(255,213,74,0.4)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FiCheck className="w-3.5 h-3.5" /> MARK DONE
                </button>
              )
            ) : (
              <span className="text-xs text-white/40 italic">Empty subject</span>
            )}
          </div>
        </GlassCard>

        {/* Habits Card */}
        <GlassCard className="border-cyan-500/15 flex flex-col justify-between h-[220px]" tilt={true}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-space font-bold text-cyan-400 tracking-widest uppercase bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">HABITS</span>
              {todayHabit?.completed && <span className="text-success text-xs font-space font-bold flex items-center gap-1">✓ COMPLETED</span>}
            </div>
            {todayHabit ? (
              <>
                <h4 className="font-space text-lg font-bold mb-1 text-white truncate">{todayHabit.surah}</h4>
                <p className="text-white/60 text-xs line-clamp-2">OnePlus: {todayHabit.onePlusActivity}</p>
              </>
            ) : (
              <>
                <h4 className="font-space text-xl font-bold mb-1 text-white">Unscheduled</h4>
                <p className="text-white/60 text-xs">No daily habits schedule loaded. Head to the Habits tab to assign!</p>
              </>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] text-white/40 font-space uppercase">Target: Habits</span>
            {todayHabit ? (
              todayHabit.completed ? (
                <span className="text-xs text-white/40 italic">Daily habits complete!</span>
              ) : (
                <button
                  onClick={() => handleCompleteConfetti('habits', todayDayName)}
                  className="px-4 py-2 rounded-xl bg-cyan-400 text-[#0B1220] font-space font-bold text-xs hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FiCheck className="w-3.5 h-3.5" /> MARK DONE
                </button>
              )
            ) : (
              <span className="text-xs text-white/40 italic">Empty focus</span>
            )}
          </div>
        </GlassCard>

        {/* Youtube Card */}
        <GlassCard className="border-red-500/15 flex flex-col justify-between h-[220px]" tilt={true}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-space font-bold text-red-400 tracking-widest uppercase bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">YOUTUBE</span>
              {todayYoutube?.completed && <span className="text-success text-xs font-space font-bold flex items-center gap-1">✓ COMPLETED</span>}
            </div>
            {todayYoutube && todayYoutube.title ? (
              <>
                <h4 className="font-space text-lg font-bold mb-1 text-white truncate">{todayYoutube.title}</h4>
                <p className="text-white/60 text-xs">Channel: <strong className="text-red-400">{todayYoutube.channel}</strong></p>
              </>
            ) : (
              <>
                <h4 className="font-space text-xl font-bold mb-1 text-white">Unscheduled</h4>
                <p className="text-white/60 text-xs">No study video set for today. Head to the YouTube tab to schedule one!</p>
              </>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] text-white/40 font-space uppercase">Target: Study</span>
            {todayYoutube ? (
              todayYoutube.completed ? (
                <span className="text-xs text-white/40 italic">Study log complete!</span>
              ) : (
                <button
                  onClick={() => handleCompleteConfetti('youtube', todayDayName)}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white font-space font-bold text-xs hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FiCheck className="w-3.5 h-3.5" /> MARK DONE
                </button>
              )
            ) : (
              <span className="text-xs text-white/40 italic">Empty focus</span>
            )}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}