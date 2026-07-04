import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiActivity, FiTv, FiBook, FiCheck, FiChevronLeft, FiChevronRight, FiEdit2 } from 'react-icons/fi';
import { FaGamepad } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';

export default function UnifiedCalendar() {
    const { sportSchedule, entertainmentSchedule, learningSchedule, habitsSchedule, toggleSportWorkoutCompleted, toggleEntertainmentCompleted, toggleLearningCompleted, toggleHabitCompleted, loading } = useContext(AppContext);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-[#0B1220] font-space">
        <div className="w-12 h-12 rounded-full border-t-2 border-white animate-spin" />
        <span className="text-xs tracking-[4px] text-white/80 uppercase animate-pulse">COMPILING CALENDAR DATAFRAME...</span>
      </div>
    );
  }
  const [viewMode, setViewMode] = useState('week'); // day, week, month
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);

  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getPillsForDay = (day) => {
    const pills = [];
    const sport = sportSchedule[day];
    const play = entertainmentSchedule[day];
    const learn = learningSchedule[day];
    const habit = habitsSchedule?.[day];

    if (sport) pills.push({ type: 'sport', label: `💪 ${sport.muscle}`, completed: sport.completed });
    if (play) pills.push({ type: 'play', label: `${play.type === 'movie' ? '🎬' : '🎮'} ${play.title}`, completed: play.completed });
    if (learn) pills.push({ type: 'learn', label: `🧠 ${learn.subject}`, completed: learn.completed });
    if (habit) pills.push({ type: 'habit', label: `📖 ${habit.surah}`, completed: habit.completed });

    return pills;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="pb-32 pt-6 max-w-6xl mx-auto px-4 md:px-8 font-poppins"
    >
      {/* Title Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="font-space text-3xl md:text-5xl font-extrabold tracking-tight">
            UNIFIED <span className="bg-gradient-to-r from-accent via-primary to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(124,77,255,0.2)]">CALENDAR</span>
          </h2>
          <p className="text-white/40 text-xs md:text-sm tracking-wider uppercase font-space mt-1">
            Synthesized timeline of all growth tracks, entertainment logs, and workouts.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 font-space text-xs">
          {['day', 'week', 'month'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-xl font-bold uppercase transition-all cursor-pointer ${
                viewMode === mode
                  ? 'bg-accent text-white shadow-glow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Board Viewport */}
      <AnimatePresence mode="wait">
        {viewMode === 'day' && (
          <motion.div
            key="day"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6"
          >
            {days.map((day) => {
              const pills = getPillsForDay(day);
              return (
                <GlassCard
                  key={day}
                  onClick={() => setSelectedDayDetail(day)}
                  className="cursor-pointer hover:border-white/20 transition-all p-5 h-64 flex flex-col justify-between border-white/5"
                  tilt={false}
                >
                  <div>
                    <h3 className="font-space font-bold text-sm text-white/90 mb-3 border-b border-white/5 pb-2">
                      {day}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {pills.length > 0 ? (
                        pills.map((p, i) => (
                          <div
                            key={i}
                            className={`px-2 py-1.5 rounded-lg text-[10px] font-space font-bold border truncate ${
                              p.completed
                                ? 'bg-success/10 border-success/30 text-success line-through opacity-60'
                                : p.type === 'sport'
                                ? 'bg-accent/15 border-accent/20 text-[#B39DFF]'
                                : p.type === 'play'
                                ? 'bg-emerald-500/15 border-emerald-500/20 text-[#52E289]'
                                : 'bg-primary/15 border-primary/20 text-primary'
                            }`}
                          >
                            {p.label}
                          </div>
                        ))
                      ) : (
                        <div className="text-white/25 text-[10px] italic">No items scheduled</div>
                      )}
                    </div>
                  </div>
                  <span className="text-[9px] font-space text-white/40 block mt-4 uppercase">Click to inspect</span>
                </GlassCard>
              );
            })}
          </motion.div>
        )}

        {viewMode === 'week' && (
          <motion.div
            key="week"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-4"
          >
            {days.map((day) => {
              const sport = sportSchedule[day];
              const play = entertainmentSchedule[day];
              const learn = learningSchedule[day];

              return (
                <div
                  key={day}
                  className="glass rounded-2xl p-5 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 transition-colors"
                >
                  {/* Day Label */}
                  <div className="md:w-32 shrink-0">
                    <h3 className="font-space font-bold text-base text-white">{day}</h3>
                    <span className="text-[10px] text-white/40 font-space tracking-wider uppercase">Weekly sync</span>
                  </div>

                  {/* Program Rows */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Fitness Column */}
                    <div className={`p-3 rounded-xl border ${sport ? 'bg-accent/5 border-accent/15' : 'border-dashed border-white/5 bg-white/[0.01]'}`}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[9px] font-space font-bold text-[#B39DFF] tracking-wider uppercase">Fitness</span>
                        {sport?.completed && <span className="text-[9px] font-space text-success font-semibold">COMPLETED</span>}
                      </div>
                      {sport ? (
                        <>
                          <h4 className="text-xs font-semibold text-white/90 truncate">{sport.name}</h4>
                          <p className="text-[9px] text-[#B39DFF] font-bold font-space mt-0.5">{sport.muscle}</p>
                        </>
                      ) : (
                        <p className="text-[10px] text-white/20 italic">No workout scheduled</p>
                      )}
                    </div>

                    {/* Entertainment Column */}
                    <div className={`p-3 rounded-xl border ${play ? 'bg-emerald-500/5 border-emerald-500/15' : 'border-dashed border-white/5 bg-white/[0.01]'}`}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[9px] font-space font-bold text-[#52E289] tracking-wider uppercase">Entertainment</span>
                        {play?.completed && <span className="text-[9px] font-space text-success font-semibold">COMPLETED</span>}
                      </div>
                      {play ? (
                        <>
                          <h4 className="text-xs font-semibold text-white/90 truncate">{play.title}</h4>
                          <p className="text-[9px] text-[#52E289] font-bold font-space mt-0.5 capitalize">{play.type} ({play.genre})</p>
                        </>
                      ) : (
                        <p className="text-[10px] text-white/20 italic">No entertainment set</p>
                      )}
                    </div>

                    {/* Learning Column */}
                    <div className={`p-3 rounded-xl border ${learn ? 'bg-primary/5 border-primary/15' : 'border-dashed border-white/5 bg-white/[0.01]'}`}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[9px] font-space font-bold text-primary tracking-wider uppercase">Learning</span>
                        {learn?.completed && <span className="text-[9px] font-space text-success font-semibold">COMPLETED</span>}
                      </div>
                      {learn ? (
                        <>
                          <h4 className="text-xs font-semibold text-white/90 truncate">{learn.subject}</h4>
                          <p className="text-[9px] text-primary/90 font-semibold line-clamp-1 mt-0.5">{learn.objective}</p>
                        </>
                      ) : (
                        <p className="text-[10px] text-white/20 italic">No studies configured</p>
                      )}
                    </div>

                    {/* Habits Column */}
                    <div className={`p-3 rounded-xl border ${habitsSchedule?.[day] ? 'bg-cyan-500/5 border-cyan-500/15' : 'border-dashed border-white/5 bg-white/[0.01]'}`}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[9px] font-space font-bold text-cyan-400 tracking-wider uppercase">Habits</span>
                        {habitsSchedule?.[day]?.completed && <span className="text-[9px] font-space text-success font-semibold">COMPLETED</span>}
                      </div>
                      {habitsSchedule?.[day] ? (
                        <>
                          <h4 className="text-xs font-semibold text-white/90 truncate">{habitsSchedule[day].surah}</h4>
                          <p className="text-[9px] text-cyan-400/90 font-semibold line-clamp-1 mt-0.5">{habitsSchedule[day].onePlusActivity}</p>
                        </>
                      ) : (
                        <p className="text-[10px] text-white/20 italic">No habits configured</p>
                      )}
                    </div>
                  </div>

                  {/* Inspect Details button */}
                  <div className="shrink-0 flex items-center justify-end">
                    <button
                      onClick={() => setSelectedDayDetail(day)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-space text-xs font-bold transition-all border border-white/10 cursor-pointer"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {viewMode === 'month' && (
          <motion.div
            key="month"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass rounded-3xl p-6 border-white/5 relative overflow-hidden"
          >
            {/* Header controls inside Monthly Card */}
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <span className="font-space text-sm font-bold tracking-wider text-white">JUNE 2026</span>
              <div className="flex gap-2">
                <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 transition-colors cursor-pointer"><FiChevronLeft /></button>
                <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 transition-colors cursor-pointer"><FiChevronRight /></button>
              </div>
            </div>

            {/* Calendar Grid 7x5 */}
            <div className="grid grid-cols-7 gap-2.5 text-center font-space text-xs mb-2 text-white/40 font-semibold">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(h => <div key={h}>{h}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {/* Dummy cells for matching alignment */}
              <div className="aspect-square bg-transparent rounded-2xl border border-transparent p-2 text-white/10 text-[10px] select-none text-left">25</div>
              <div className="aspect-square bg-transparent rounded-2xl border border-transparent p-2 text-white/10 text-[10px] select-none text-left">26</div>
              <div className="aspect-square bg-transparent rounded-2xl border border-transparent p-2 text-white/10 text-[10px] select-none text-left">27</div>
              <div className="aspect-square bg-transparent rounded-2xl border border-transparent p-2 text-white/10 text-[10px] select-none text-left">28</div>
              <div className="aspect-square bg-transparent rounded-2xl border border-transparent p-2 text-white/10 text-[10px] select-none text-left">29</div>
              <div className="aspect-square bg-transparent rounded-2xl border border-transparent p-2 text-white/10 text-[10px] select-none text-left">30</div>
              <div className="aspect-square bg-transparent rounded-2xl border border-transparent p-2 text-white/10 text-[10px] select-none text-left">31</div>

              {/* Real Active June Days */}
              {Array.from({ length: 30 }).map((_, index) => {
                const dayNum = index + 1;
                // Cycle weekdays to assign mock details for other weeks, but real sync details on current week
                const dayIndex = index % 7;
                const weekdayName = days[dayIndex];
                const pills = getPillsForDay(weekdayName);

                // Highlight today (say June 30, which is Tuesday based on current time meta)
                const isToday = dayNum === 30;

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDayDetail(weekdayName)}
                    className={`aspect-square rounded-2xl border p-2 text-left flex flex-col justify-between cursor-pointer hover:border-white/20 transition-all ${
                      isToday
                        ? 'border-primary/50 bg-primary/5 shadow-[0_0_12px_rgba(255,213,74,0.1)]'
                        : 'border-white/5 bg-[#121A2C]/20'
                    }`}
                  >
                    <span className={`text-[10px] font-bold font-space ${isToday ? 'text-primary' : 'text-white/50'}`}>
                      {dayNum} {isToday && '•'}
                    </span>

                    {/* Small dot node indicators */}
                    <div className="flex gap-1 flex-wrap mt-2">
                      {pills.map((p, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            p.completed
                              ? 'bg-success'
                              : p.type === 'sport'
                              ? 'bg-accent'
                              : p.type === 'play'
                              ? 'bg-emerald-500'
                              : 'bg-primary'
                          }`}
                          title={p.label}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inspect Day Modal */}
      {selectedDayDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/80 backdrop-blur-md px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass max-w-lg w-full p-6 rounded-3xl border-white/10 shadow-2xl relative"
          >
            <h3 className="font-space text-lg font-bold text-white mb-6 uppercase tracking-wider">
              Calendar Inspector // {selectedDayDetail}
            </h3>

            {/* List of elements inside this day */}
            <div className="flex flex-col gap-4 mb-6">
              
              {/* Fitness */}
              <div className="p-4 rounded-2xl border border-white/5 bg-[#121A2C]/30 flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/25 flex items-center justify-center text-lg text-accent shrink-0">
                    <FiActivity />
                  </div>
                  <div>
                    <span className="text-[9px] font-space font-bold text-white/40 uppercase">Fitness Track</span>
                    {sportSchedule[selectedDayDetail] ? (
                      <>
                        <h4 className="font-space text-sm font-bold text-white mt-0.5">{sportSchedule[selectedDayDetail].muscle}</h4>
                        <p className="text-white/60 text-xs">{sportSchedule[selectedDayDetail].name}</p>
                      </>
                    ) : (
                      <p className="text-white/40 text-xs italic mt-0.5">Nothing scheduled</p>
                    )}
                  </div>
                </div>
                {sportSchedule[selectedDayDetail] && (
                  <button
                    onClick={() => toggleSportWorkoutCompleted(selectedDayDetail)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-space font-bold border transition-colors cursor-pointer shrink-0 ${
                      sportSchedule[selectedDayDetail].completed
                        ? 'bg-success/20 border-success/30 text-success'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {sportSchedule[selectedDayDetail].completed ? 'COMPLETED' : 'COMPLETE'}
                  </button>
                )}
              </div>

              {/* Entertainment */}
              <div className="p-4 rounded-2xl border border-white/5 bg-[#121A2C]/30 flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/25 flex items-center justify-center text-lg text-[#52E289] shrink-0">
                    {entertainmentSchedule[selectedDayDetail]?.type === 'game' ? <FaGamepad /> : <FiTv />}
                  </div>
                  <div>
                    <span className="text-[9px] font-space font-bold text-white/40 uppercase">Entertainment Balance</span>
                    {entertainmentSchedule[selectedDayDetail] ? (
                      <>
                        <h4 className="font-space text-sm font-bold text-white mt-0.5">{entertainmentSchedule[selectedDayDetail].title}</h4>
                        <p className="text-white/60 text-xs capitalize">{entertainmentSchedule[selectedDayDetail].type} // {entertainmentSchedule[selectedDayDetail].genre}</p>
                      </>
                    ) : (
                      <p className="text-white/40 text-xs italic mt-0.5">Nothing scheduled</p>
                    )}
                  </div>
                </div>
                {entertainmentSchedule[selectedDayDetail] && (
                  <button
                    onClick={() => toggleEntertainmentCompleted(selectedDayDetail)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-space font-bold border transition-colors cursor-pointer shrink-0 ${
                      entertainmentSchedule[selectedDayDetail].completed
                        ? 'bg-success/20 border-success/30 text-success'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {entertainmentSchedule[selectedDayDetail].completed ? 'COMPLETED' : 'COMPLETE'}
                  </button>
                )}
              </div>

              {/* Learning */}
              <div className="p-4 rounded-2xl border border-white/5 bg-[#121A2C]/30 flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-lg text-primary shrink-0">
                    <FiBook />
                  </div>
                  <div>
                    <span className="text-[9px] font-space font-bold text-white/40 uppercase">Learning Focus</span>
                    {learningSchedule[selectedDayDetail] ? (
                      <>
                        <h4 className="font-space text-sm font-bold text-white mt-0.5">{learningSchedule[selectedDayDetail].subject}</h4>
                        <p className="text-white/60 text-xs">{learningSchedule[selectedDayDetail].objective}</p>
                      </>
                    ) : (
                      <p className="text-white/40 text-xs italic mt-0.5">Nothing scheduled</p>
                    )}
                  </div>
                </div>
                {learningSchedule[selectedDayDetail] && (
                  <button
                    onClick={() => toggleLearningCompleted(selectedDayDetail)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-space font-bold border transition-colors cursor-pointer shrink-0 ${
                      learningSchedule[selectedDayDetail].completed
                        ? 'bg-success/20 border-success/30 text-success'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {learningSchedule[selectedDayDetail].completed ? 'COMPLETED' : 'COMPLETE'}
                  </button>
                )}
              </div>

              {/* Habits */}
              <div className="p-4 rounded-2xl border border-white/5 bg-[#121A2C]/30 flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/20 flex items-center justify-center text-lg text-cyan-400 shrink-0">
                    <FiBookOpen />
                  </div>
                  <div>
                    <span className="text-[9px] font-space font-bold text-white/40 uppercase">Daily Habits</span>
                    {habitsSchedule?.[selectedDayDetail] ? (
                      <>
                        <h4 className="font-space text-sm font-bold text-white mt-0.5">{habitsSchedule[selectedDayDetail].surah}</h4>
                        <p className="text-white/60 text-xs">OnePlus: {habitsSchedule[selectedDayDetail].onePlusActivity}</p>
                      </>
                    ) : (
                      <p className="text-white/40 text-xs italic mt-0.5">Nothing scheduled</p>
                    )}
                  </div>
                </div>
                {habitsSchedule?.[selectedDayDetail] && (
                  <button
                    onClick={() => toggleHabitCompleted(selectedDayDetail)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-space font-bold border transition-colors cursor-pointer shrink-0 ${
                      habitsSchedule[selectedDayDetail].completed
                        ? 'bg-success/20 border-success/30 text-success'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {habitsSchedule[selectedDayDetail].completed ? 'COMPLETED' : 'COMPLETE'}
                  </button>
                )}
              </div>

            </div>

            <div className="flex justify-end font-space">
              <button
                onClick={() => setSelectedDayDetail(null)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                CLOSE BOARD
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
