import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTv, FiStar, FiPlus, FiTrash, FiShuffle, FiCheck } from 'react-icons/fi';
import { FaGamepad } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import confetti from 'canvas-confetti';

const GENRES = ['Sci-Fi', 'Action', 'RPG', 'Adventure', 'Thriller', 'Animation', 'Horror', 'Indie', 'Strategy'];

const REC_LIST = [
  { title: 'Blade Runner 2049', type: 'movie', genre: 'Sci-Fi', duration: '164' },
  { title: 'Elden Ring: Shadow of the Erdtree', type: 'game', genre: 'RPG', duration: '40' },
  { title: 'Interstellar', type: 'movie', genre: 'Sci-Fi', duration: '169' },
  { title: 'Cyberpunk 2077', type: 'game', genre: 'RPG', duration: '50' },
  { title: 'Hades II', type: 'game', genre: 'Indie', duration: '40' },
  { title: 'Tenet', type: 'movie', genre: 'Action', duration: '150' },
  { title: 'Dune: Part Two', type: 'movie', genre: 'Sci-Fi', duration: '166' },
  { title: 'Portal 2', type: 'game', genre: 'Indie', duration: '10' },
  { title: 'Ghost in the Shell', type: 'movie', genre: 'Animation', duration: '83' },
  { title: 'NieR: Automata', type: 'game', genre: 'RPG', duration: '35' }
];

export default function MoviesGamingPlanner() {
  const {
    entertainmentSchedule,
    updateEntertainment,
    toggleEntertainmentCompleted,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    loading
  } = useContext(AppContext);

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [activeTab, setActiveTab] = useState('movie'); // movie or game
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [genre, setGenre] = useState('Sci-Fi');
  const [rating, setRating] = useState(5);

  const [recRolling, setRecRolling] = useState(false);
  const [rolledRec, setRolledRec] = useState(null);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-[#0B1220] font-space">
        <div className="w-12 h-12 rounded-full border-t-2 border-emerald-500 animate-spin" />
        <span className="text-xs tracking-[4px] text-emerald-500/80 uppercase animate-pulse">CONNECTING MEDIA NODE...</span>
      </div>
    );
  }

  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleSaveToSchedule = (dayToSave) => {
    if (!title.trim()) return;
    updateEntertainment(dayToSave || selectedDay, {
      title,
      type: activeTab,
      duration: duration || '120',
      genre,
      rating,
      completed: false
    });
    // Reset fields
    setTitle('');
    setDuration('');
    
    confetti({
      particleCount: 50,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#22C55E', '#FFFFFF']
    });
  };

  const handleRollRecommendation = () => {
    setRecRolling(true);
    setRolledRec(null);
    let count = 0;
    const interval = setInterval(() => {
      const temp = REC_LIST[Math.floor(Math.random() * REC_LIST.length)];
      setRolledRec(temp);
      count++;
      if (count > 12) {
        clearInterval(interval);
        setRecRolling(false);
      }
    }, 120);
  };

  const handleApplyRecommendation = () => {
    if (!rolledRec) return;
    setTitle(rolledRec.title);
    setActiveTab(rolledRec.type);
    setGenre(rolledRec.genre);
    setDuration(rolledRec.duration);
    setRolledRec(null);
  };

  const handleAddWatchlist = () => {
    if (!title.trim()) return;
    addToWatchlist({
      title,
      type: activeTab,
      genre,
      duration: duration || '120',
      rating
    });
    setTitle('');
    setDuration('');
  };

  const handleApplyFromWatchlist = (item, day) => {
    updateEntertainment(day, {
      ...item,
      completed: false
    });
    confetti({
      particleCount: 40,
      spread: 40,
      colors: ['#7C4DFF', '#FFFFFF']
    });
  };

  const handleCompleteClick = (day) => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#22C55E', '#FFD54A']
    });
    toggleEntertainmentCompleted(day);
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
          MOVIES & <span className="bg-gradient-to-r from-emerald-400 to-primary bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,197,94,0.2)]">GAMING</span>
        </h2>
        <p className="text-white/40 text-xs md:text-sm tracking-wider uppercase font-space mt-1">
          Plan one movie or one game per day to preserve mental balance. Win XP rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Side: Adding & Recommend Widgets */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Main Input Form */}
          <GlassCard className="border-emerald-500/10">
            <h3 className="font-space text-sm font-bold tracking-[2px] uppercase text-white/80 mb-5 flex items-center gap-2">
              <span>🎟️</span> Program Entry
            </h3>

            {/* Toggle Movie/Game Day */}
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('movie')}
                className={`flex-1 py-3 rounded-2xl font-space font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  activeTab === 'movie'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-[#52E289] shadow-[0_0_12px_rgba(34,197,94,0.25)]'
                    : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <FiTv className="w-4 h-4" /> MOVIE DAY
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('game')}
                className={`flex-1 py-3 rounded-2xl font-space font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  activeTab === 'game'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-[#52E289] shadow-[0_0_12px_rgba(34,197,94,0.25)]'
                    : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <FaGamepad className="w-4 h-4" /> GAMING DAY
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="block text-[10px] font-space text-white/50 mb-1.5 uppercase">Title / Name</label>
                <input
                  type="text"
                  placeholder={activeTab === 'movie' ? 'e.g. Interstellar' : 'e.g. Elden Ring'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#121A2C]/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-space text-white/50 mb-1.5 uppercase">Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-[#121A2C]/80 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-space text-white/50 mb-1.5 uppercase">Duration (mins/hrs)</label>
                  <input
                    type="number"
                    placeholder={activeTab === 'movie' ? '120 min' : '40 hrs'}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-[#121A2C]/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-space text-white/50 mb-1.5 uppercase">Rating Importance</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="cursor-pointer"
                    >
                      <FiStar
                        className={`w-5 h-5 ${
                          star <= rating ? 'text-primary fill-primary' : 'text-white/20'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 font-space">
              <button
                onClick={handleAddWatchlist}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-colors cursor-pointer"
              >
                + WATCHLIST
              </button>
              
              <button
                onClick={() => handleSaveToSchedule()}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all cursor-pointer"
              >
                ADD TO SCHEDULE
              </button>
            </div>
            
            {/* Quick target selector */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-space text-white/40 uppercase">Selected Day Slot</span>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="bg-transparent text-xs font-space font-bold text-[#52E289] focus:outline-none"
              >
                {days.map(d => <option key={d} value={d} className="bg-[#0B1220]">{d}</option>)}
              </select>
            </div>
          </GlassCard>

          {/* Daily Recommendation Scanner Widget */}
          <GlassCard className="border-primary/10 bg-gradient-to-br from-primary/5 via-transparent to-transparent text-center p-6">
            <h3 className="font-space text-sm font-bold tracking-[2px] uppercase text-white/80 mb-4">
              CYBER RECOMMENDATIONS
            </h3>
            
            <div className="h-20 flex items-center justify-center glass rounded-2xl border-white/5 mb-6 relative overflow-hidden">
              {recRolling ? (
                <div className="text-white/40 text-xs font-space tracking-widest uppercase animate-pulse">
                  SCANNING ARCHIVE...
                </div>
              ) : rolledRec ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-space"
                >
                  <div className="text-xs text-primary/80 font-bold tracking-wider uppercase mb-0.5">
                    {rolledRec.type === 'movie' ? '🎬 MOVIE' : '🎮 GAME'} RECOMMENDED
                  </div>
                  <div className="text-sm font-bold text-white line-clamp-1">{rolledRec.title}</div>
                  <div className="text-[10px] text-white/40">Genre: {rolledRec.genre} // {rolledRec.duration} min</div>
                </motion.div>
              ) : (
                <div className="text-white/30 text-xs font-space">
                  Initialize query sequence
                </div>
              )}
            </div>

            {rolledRec ? (
              <div className="flex gap-2 justify-center font-space">
                <button
                  onClick={() => setRolledRec(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/50 hover:text-white cursor-pointer"
                >
                  DISCARD
                </button>
                <button
                  onClick={handleApplyRecommendation}
                  className="px-4 py-2 rounded-xl bg-primary text-[#0B1220] font-bold text-xs cursor-pointer flex items-center gap-1"
                >
                  <FiCheck className="w-3.5 h-3.5" /> USE PROFILE
                </button>
              </div>
            ) : (
              <button
                onClick={handleRollRecommendation}
                disabled={recRolling}
                className="px-5 py-2.5 rounded-xl bg-[#FFD54A] text-[#0B1220] font-space font-bold text-xs hover:shadow-[0_0_15px_rgba(255,213,74,0.4)] active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <FiShuffle className="w-4 h-4" /> GENERATE OPTION
              </button>
            )}
          </GlassCard>
        </div>

        {/* Right Side: Weekly planner board & Watchlist */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Weekly Board */}
          <div>
            <h3 className="font-space text-lg font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>📅</span> Weekly Entertainment Board
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {days.map((day) => {
                const item = entertainmentSchedule[day];
                return (
                  <div
                    key={day}
                    className={`glass p-5 rounded-2xl border transition-all duration-300 ${
                      item?.completed
                        ? 'border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_20px_rgba(34,197,94,0.05)]'
                        : 'border-white/5 hover:border-white/12'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-space text-sm font-bold text-white/90">{day}</span>
                      {item && (
                        <span className={`text-[9px] font-space font-bold tracking-wider px-2 py-0.5 rounded border ${
                          item.type === 'movie'
                            ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                            : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                        }`}>
                          {item.type === 'movie' ? '🎬 MOVIE' : '🎮 GAME'}
                        </span>
                      )}
                    </div>

                    {item ? (
                      <div className="flex flex-col justify-between h-24">
                        <div>
                          <h4 className="font-space text-base font-bold text-white truncate leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-white/50 text-[10px]">
                            Genre: {item.genre} | Duration: {item.duration}m
                          </p>
                          <div className="flex gap-0.5 mt-1">
                            {Array.from({ length: item.rating }).map((_, i) => (
                              <FiStar key={i} className="w-3 h-3 text-primary fill-primary" />
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                          <button
                            onClick={() => updateEntertainment(day, null)}
                            className="text-[10px] font-space font-semibold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          >
                            REMOVE
                          </button>
                          
                          {!item.completed ? (
                            <button
                              onClick={() => handleCompleteClick(day)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-space text-[9px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <FiCheck className="w-3 h-3" /> COMPLETE
                            </button>
                          ) : (
                            <span className="text-[10px] font-space text-success font-semibold italic">Completed</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="h-24 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                        <span className="text-white/30 text-xs italic">Unprogrammed Slot</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Watchlist Section */}
          <GlassCard className="border-white/5 bg-gradient-to-br from-white/[0.01] to-transparent">
            <h3 className="font-space text-base font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>📋</span> Media Watchlist & backlog
            </h3>

            {watchlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                {watchlist.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-white/5 bg-[#121A2C]/40 flex justify-between items-center group relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-space font-bold px-1.5 py-0.5 rounded leading-none ${
                          item.type === 'movie' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {item.type === 'movie' ? 'M' : 'G'}
                        </span>
                        <span className="text-xs font-space font-bold text-white/90 truncate max-w-[120px]">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/50">{item.genre} // {item.duration}m</p>
                    </div>

                    <div className="flex gap-2 items-center z-10">
                      {/* Program directly on a day */}
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleApplyFromWatchlist(item, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="bg-white/5 border border-white/10 text-[9px] font-space text-white/80 rounded px-1.5 py-1 focus:outline-none cursor-pointer"
                      >
                        <option value="">Schedule</option>
                        {days.map(d => <option key={d} value={d} className="bg-[#0B1220]">{d}</option>)}
                      </select>

                      <button
                        onClick={() => removeFromWatchlist(item.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                      >
                        <FiTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-20 flex items-center justify-center border border-dashed border-white/10 rounded-xl text-center">
                <span className="text-white/35 text-xs italic">Watchlist is currently empty. Add titles above!</span>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
