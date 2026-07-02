import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiPlay, FiPause, FiRotateCcw, FiAward, FiClock, FiPlus } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import confetti from 'canvas-confetti';

const SUBJECT_TEMPLATES = [
  { subject: 'Computer Science', objective: 'React Hooks & State Optimization' },
  { subject: 'Human Nutrition', objective: 'Macronutrient calculation and protein absorption' },
  { subject: 'Foreign Languages', objective: 'Vocabulary expansion and audio practice' },
  { subject: 'Artificial Intelligence', objective: 'Neural Networks & Deep Learning architectures' },
  { subject: 'Digital Design', objective: 'Futuristic layout principles and typography' }
];

export default function LearningPlanner() {
  const {
    learningSchedule,
    updateLearning,
    toggleLearningCompleted,
    addLearningMinutes,
    loading
  } = useContext(AppContext);

  const [activeDay, setActiveDay] = useState('Monday');
  const [subject, setSubject] = useState('');
  const [objective, setObjective] = useState('');

  // Pomodoro Timer States
  const [timerSeconds, setTimerSeconds] = useState(1500); // 25 minutes default
  const [timerActive, setTimerActive] = useState(false);
  const [presetMinutes, setPresetMinutes] = useState(25);
  const [selectedTimerDay, setSelectedTimerDay] = useState('Monday');

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-[#0B1220] font-space">
        <div className="w-12 h-12 rounded-full border-t-2 border-primary animate-spin" />
        <span className="text-xs tracking-[4px] text-primary/80 uppercase animate-pulse">UPGRADING NEURAL SYNAPSES...</span>
      </div>
    );
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Update form values based on activeDay select
  useEffect(() => {
    const existing = learningSchedule[activeDay];
    setSubject(existing?.subject || '');
    setObjective(existing?.objective || '');
  }, [activeDay, learningSchedule]);

  // Pomodoro Timer Ticking
  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const handleSaveSubject = () => {
    if (!subject.trim()) return;
    updateLearning(activeDay, {
      subject,
      objective: objective || 'General Study session',
      hours: learningSchedule[activeDay]?.hours || 0,
      completed: learningSchedule[activeDay]?.completed || false
    });
    confetti({
      particleCount: 40,
      spread: 30,
      colors: ['#7C4DFF', '#FFFFFF']
    });
  };

  const handleTimerComplete = () => {
    // Add cumulative minutes
    addLearningMinutes(selectedTimerDay, presetMinutes);

    // Audio chime synthesis
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const now = ctx.currentTime;
        // Harmonic alarm chime
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.1, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.5);
        });
      }
    } catch (e) {
      console.warn(e);
    }

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.8 },
      colors: ['#FFD54A', '#7C4DFF']
    });

    alert(`Study session finished! You earned ${presetMinutes} XP!`);
    setTimerSeconds(presetMinutes * 60);
  };

  const toggleTimer = () => setTimerActive(!timerActive);

  const resetTimer = () => {
    setTimerActive(false);
    setTimerSeconds(presetMinutes * 60);
  };

  const changePreset = (mins) => {
    setPresetMinutes(mins);
    setTimerActive(false);
    setTimerSeconds(mins * 60);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const applyTemplate = (tpl) => {
    setSubject(tpl.subject);
    setObjective(tpl.objective);
  };

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
          LEARNING <span className="bg-gradient-to-r from-primary to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,213,74,0.2)]">PLANNER</span>
        </h2>
        <p className="text-white/40 text-xs md:text-sm tracking-wider uppercase font-space mt-1">
          Surpass your cognitive limits. One subject per day. Grow your knowledge tree.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Setup Subject & growing Knowledge Tree */}
        <div className="lg:col-span-6 flex flex-col gap-8">
          
          {/* Configure Panel */}
          <GlassCard className="border-primary/10">
            <h3 className="font-space text-sm font-bold tracking-[2px] uppercase text-white/80 mb-5 flex items-center gap-2">
              <span>🧠</span> Program Daily Subject
            </h3>

            {/* Select Day */}
            <div className="mb-4">
              <label className="block text-[10px] font-space text-white/50 mb-1.5 uppercase">Evolution Day</label>
              <select
                value={activeDay}
                onChange={(e) => setActiveDay(e.target.value)}
                className="w-full bg-[#121A2C]/80 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
              >
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Subject Form */}
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="block text-[10px] font-space text-white/50 mb-1.5 uppercase">Subject Title</label>
                <input
                  type="text"
                  placeholder="e.g. Artificial Intelligence"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#121A2C]/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-space text-white/50 mb-1.5 uppercase">Study Objective</label>
                <textarea
                  placeholder="e.g. Master neural network backpropagation equations"
                  value={objective}
                  rows={2}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full bg-[#121A2C]/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveSubject}
              className="w-full py-3 rounded-xl bg-primary text-[#0B1220] font-space font-bold text-xs hover:shadow-[0_0_20px_rgba(255,213,74,0.4)] active:scale-95 transition-all cursor-pointer mb-5"
            >
              SAVE LEARNING FOCUS
            </button>

            {/* Quick templates */}
            <div className="border-t border-white/5 pt-4">
              <span className="block text-[10px] font-space text-white/40 uppercase mb-2">Preset subjects</span>
              <div className="flex flex-wrap gap-1.5">
                {SUBJECT_TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    onClick={() => applyTemplate(tpl)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-[10px] text-white/80 font-space transition-all cursor-pointer"
                  >
                    {tpl.subject}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* SVG Knowledge Tree */}
          <GlassCard className="border-white/5 flex flex-col items-center justify-center p-6 text-center">
            <h3 className="font-space text-sm font-bold tracking-[2px] uppercase text-white/80 mb-2">
              KNOWLEDGE EVOLUTION TREE
            </h3>
            <p className="text-[10px] text-white/40 mb-6 uppercase tracking-wider">
              Branches light up as weekly learning goals are completed
            </p>

            {/* SVG Tree Container */}
            <div className="w-full max-w-sm h-72 relative">
              <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Trunk */}
                <path d="M96 200 C98 180 97 150 100 135 C103 150 102 180 104 200 Z" fill="#2E3C5D" />

                {/* Branches mapping to Days */}
                {/* Monday - Bottom Left */}
                <path
                  d="M100 155 C90 145 70 145 60 150"
                  stroke={learningSchedule.Monday?.completed ? '#FFD54A' : '#2E3C5D'}
                  strokeWidth="3"
                  strokeDasharray={learningSchedule.Monday ? '0' : '3'}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
                {learningSchedule.Monday?.completed && <circle cx="60" cy="150" r="4" fill="#FFD54A" className="animate-pulse" />}

                {/* Tuesday - Bottom Right */}
                <path
                  d="M100 150 C110 140 130 140 140 145"
                  stroke={learningSchedule.Tuesday?.completed ? '#FFD54A' : '#2E3C5D'}
                  strokeWidth="3"
                  strokeDasharray={learningSchedule.Tuesday ? '0' : '3'}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
                {learningSchedule.Tuesday?.completed && <circle cx="140" cy="145" r="4" fill="#FFD54A" className="animate-pulse" />}

                {/* Wednesday - Mid Left */}
                <path
                  d="M100 130 C85 120 70 115 50 120"
                  stroke={learningSchedule.Wednesday?.completed ? '#FFD54A' : '#2E3C5D'}
                  strokeWidth="2.5"
                  strokeDasharray={learningSchedule.Wednesday ? '0' : '3'}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
                {learningSchedule.Wednesday?.completed && <circle cx="50" cy="120" r="4" fill="#FFD54A" className="animate-pulse" />}

                {/* Thursday - Mid Right */}
                <path
                  d="M100 125 C115 115 130 110 150 115"
                  stroke={learningSchedule.Thursday?.completed ? '#FFD54A' : '#2E3C5D'}
                  strokeWidth="2.5"
                  strokeDasharray={learningSchedule.Thursday ? '0' : '3'}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
                {learningSchedule.Thursday?.completed && <circle cx="150" cy="115" r="4" fill="#FFD54A" className="animate-pulse" />}

                {/* Friday - Top Left */}
                <path
                  d="M100 100 C90 85 75 75 60 70"
                  stroke={learningSchedule.Friday?.completed ? '#FFD54A' : '#2E3C5D'}
                  strokeWidth="2"
                  strokeDasharray={learningSchedule.Friday ? '0' : '3'}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
                {learningSchedule.Friday?.completed && <circle cx="60" cy="70" r="4" fill="#FFD54A" className="animate-pulse" />}

                {/* Saturday - Top Right */}
                <path
                  d="M100 95 C110 80 125 70 140 65"
                  stroke={learningSchedule.Saturday?.completed ? '#FFD54A' : '#2E3C5D'}
                  strokeWidth="2"
                  strokeDasharray={learningSchedule.Saturday ? '0' : '3'}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
                {learningSchedule.Saturday?.completed && <circle cx="140" cy="65" r="4" fill="#FFD54A" className="animate-pulse" />}

                {/* Sunday - Direct Top */}
                <path
                  d="M100 80 C100 60 100 40 100 30"
                  stroke={learningSchedule.Sunday?.completed ? '#FFD54A' : '#2E3C5D'}
                  strokeWidth="2"
                  strokeDasharray={learningSchedule.Sunday ? '0' : '3'}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
                {learningSchedule.Sunday?.completed && <circle cx="100" cy="30" r="4" fill="#FFD54A" className="animate-pulse" />}
              </svg>
            </div>

            <div className="flex gap-4 justify-center items-center mt-2 text-[10px] tracking-wider font-space text-white/40">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#2E3C5D]" /> IDLE</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#2E3C5D] border border-dashed border-white/40" /> PLANNED</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,213,74,0.8)]" /> MASTURED</span>
            </div>
          </GlassCard>
        </div>

        {/* Right column: Weekly list & Pomodoro study timer */}
        <div className="lg:col-span-6 flex flex-col gap-8">
          
          {/* Pomodoro Study Timer */}
          <GlassCard className="border-accent/15 bg-gradient-to-tr from-accent/5 via-transparent to-transparent text-center p-8">
            <h3 className="font-space text-sm font-bold tracking-[2px] uppercase text-white/80 mb-2 flex justify-center items-center gap-2">
              <FiClock className="text-accent animate-pulse" /> FOCUS CHRONOMETER
            </h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-6">
              Study to accumulate minutes and generate XP progression
            </p>

            {/* Preset selectors */}
            <div className="flex justify-center gap-2 mb-6">
              {[25, 50, 15, 1].map((mins) => (
                <button
                  key={mins}
                  onClick={() => changePreset(mins)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-space font-bold border transition-all cursor-pointer ${
                    presetMinutes === mins
                      ? 'bg-accent/20 border-accent/50 text-[#B39DFF]'
                      : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {mins === 1 ? '1 Min Test' : `${mins} Min`}
                </button>
              ))}
            </div>

            {/* Timer digits display */}
            <div className="font-space text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-[0_0_20px_rgba(124,77,255,0.35)] select-none">
              {formatTime(timerSeconds)}
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <button
                onClick={toggleTimer}
                className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shadow-[0_0_15px_rgba(124,77,255,0.4)]"
              >
                {timerActive ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5 ml-0.5" />}
              </button>
              
              <button
                onClick={resetTimer}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white/80 flex items-center justify-center transition-colors cursor-pointer border border-white/10"
              >
                <FiRotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Assign Timer reward on complete */}
            <div className="border-t border-white/5 pt-4 flex items-center justify-between">
              <span className="text-[10px] font-space text-white/40 uppercase">Deposit Minutes to</span>
              <select
                value={selectedTimerDay}
                onChange={(e) => setSelectedTimerDay(e.target.value)}
                className="bg-transparent text-xs font-space font-bold text-[#B39DFF] focus:outline-none cursor-pointer"
              >
                {days.map(d => <option key={d} value={d} className="bg-[#0B1220]">{d}</option>)}
              </select>
            </div>
          </GlassCard>

          {/* Weekly Subject List */}
          <div>
            <h3 className="font-space text-lg font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>📅</span> Weekly Learning Schedule
            </h3>
            
            <div className="flex flex-col gap-3">
              {days.map((day) => {
                const item = learningSchedule[day];
                return (
                  <div
                    key={day}
                    className={`glass p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all duration-300 ${
                      item?.completed ? 'border-primary/30 bg-primary/5' : 'border-white/5'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-space text-xs font-bold text-white/90">{day}</span>
                        {item && (
                          <span className="text-[9px] font-space font-semibold text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded leading-none border border-primary/20">
                            Subject: {item.subject}
                          </span>
                        )}
                      </div>
                      
                      {item ? (
                        <>
                          <p className="text-white/80 text-xs font-medium truncate">{item.objective}</p>
                          {item.hours > 0 && (
                            <p className="text-[10px] text-primary font-space font-bold">Total Studied: {item.hours} hours</p>
                          )}
                        </>
                      ) : (
                        <p className="text-white/30 text-xs italic">Unprogrammed slot</p>
                      )}
                    </div>

                    {item && (
                      <button
                        onClick={() => toggleLearningCompleted(day)}
                        className={`p-2 rounded-xl border text-xs font-space font-bold transition-all cursor-pointer shrink-0 ${
                          item.completed
                            ? 'bg-success/20 border-success/30 text-success'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {item.completed ? 'PASSED' : 'PASS'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
