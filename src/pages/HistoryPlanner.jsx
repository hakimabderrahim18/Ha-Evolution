import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiActivity, FiTv, FiBook, FiBookOpen, FiSave, FiCalendar } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import confetti from 'canvas-confetti';

const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDayNameOfDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return daysOfWeek[dateObj.getDay()];
};

export default function HistoryPlanner() {
  const { userStats, addXP } = useContext(AppContext);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '' : 'https://ha-evolution.onrender.com');

  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [historyList, setHistoryList] = useState([]);
  const [loadingRecord, setLoadingRecord] = useState(false);

  // Form states
  const [dayName, setDayName] = useState('Saturday');
  const [sportMuscle, setSportMuscle] = useState('');
  const [sportName, setSportName] = useState('');
  const [sportCompleted, setSportCompleted] = useState(false);

  const [entTitle, setEntTitle] = useState('');
  const [entType, setEntType] = useState('movie');
  const [entGenre, setEntGenre] = useState('');
  const [entCompleted, setEntCompleted] = useState(false);

  const [learnSubject, setLearnSubject] = useState('');
  const [learnObjective, setLearnObjective] = useState('');
  const [learnHours, setLearnHours] = useState(0);
  const [learnMinutes, setLearnMinutes] = useState(0);
  const [learnCompleted, setLearnCompleted] = useState(false);

  const [habitSurah, setHabitSurah] = useState('');
  const [habitOnePlus, setHabitOnePlus] = useState('');
  const [habitCompleted, setHabitCompleted] = useState(false);

  const [ytTitle, setYtTitle] = useState('');
  const [ytCompleted, setYtCompleted] = useState(false);

  const [groomBrushAM, setGroomBrushAM] = useState(false);
  const [groomBrushPM, setGroomBrushPM] = useState(false);
  const [groomSkincare, setGroomSkincare] = useState(false);
  const [groomShower, setGroomShower] = useState(false);
  const [groomFloss, setGroomFloss] = useState(false);

  const [prayFajr, setPrayFajr] = useState(false);
  const [prayDhuhr, setPrayDhuhr] = useState(false);
  const [prayAsr, setPrayAsr] = useState(false);
  const [prayMaghrib, setPrayMaghrib] = useState(false);
  const [prayIsha, setPrayIsha] = useState(false);

  // Fetch all history list on mount
  const fetchHistoryList = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/history`);
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistoryList();
  }, []);

  // Fetch record on date selection change
  useEffect(() => {
    const fetchDateRecord = async () => {
      setLoadingRecord(true);
      // Auto resolve day name
      const resolvedDayName = getDayNameOfDate(selectedDate);
      setDayName(resolvedDayName);

      try {
        const res = await fetch(`${API_BASE}/api/history/${selectedDate}`);
        if (res.ok) {
          const record = await res.json();
          if (record) {
            setSportMuscle(record.sport?.muscle || '');
            setSportName(record.sport?.name || '');
            setSportCompleted(record.sport?.completed || false);

            setEntTitle(record.entertainment?.title || '');
            setEntType(record.entertainment?.type || 'movie');
            setEntGenre(record.entertainment?.genre || '');
            setEntCompleted(record.entertainment?.completed || false);

            setLearnSubject(record.learning?.subject || '');
            setLearnObjective(record.learning?.objective || '');
            setLearnHours(record.learning?.hours || 0);
            setLearnMinutes(record.learning?.minutes || 0);
            setLearnCompleted(record.learning?.completed || false);

            setHabitSurah(record.habits?.surah || '');
            setHabitOnePlus(record.habits?.onePlusActivity || '');
            setHabitCompleted(record.habits?.completed || false);

            setYtTitle(record.youtube?.title || '');
            setYtCompleted(record.youtube?.completed || false);

            setGroomBrushAM(record.grooming?.brushAM || false);
            setGroomBrushPM(record.grooming?.brushPM || false);
            setGroomSkincare(record.grooming?.skincare || false);
            setGroomShower(record.grooming?.shower || false);
            setGroomFloss(record.grooming?.floss || false);

            setPrayFajr(record.prayers?.fajr || false);
            setPrayDhuhr(record.prayers?.dhuhr || false);
            setPrayAsr(record.prayers?.asr || false);
            setPrayMaghrib(record.prayers?.maghrib || false);
            setPrayIsha(record.prayers?.isha || false);
          } else {
            // Reset to empty
            setSportMuscle('');
            setSportName('');
            setSportCompleted(false);
            setEntTitle('');
            setEntType('movie');
            setEntGenre('');
            setEntCompleted(false);
            setLearnSubject('');
            setLearnObjective('');
            setLearnHours(0);
            setLearnMinutes(0);
            setLearnCompleted(false);
            setHabitSurah('');
            setHabitOnePlus('');
            setHabitCompleted(false);

            setYtTitle('');
            setYtCompleted(false);

            setGroomBrushAM(false);
            setGroomBrushPM(false);
            setGroomSkincare(false);
            setGroomShower(false);
            setGroomFloss(false);

            setPrayFajr(false);
            setPrayDhuhr(false);
            setPrayAsr(false);
            setPrayMaghrib(false);
            setPrayIsha(false);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRecord(false);
      }
    };

    fetchDateRecord();
  }, [selectedDate]);

  const handleSave = async () => {
    const payload = {
      dayName,
      sport: {
        muscle: sportMuscle || 'Rest',
        name: sportName || 'Stretching',
        completed: sportCompleted
      },
      entertainment: {
        title: entTitle || null,
        type: entType,
        genre: entGenre || null,
        completed: entCompleted
      },
      learning: {
        subject: learnSubject || null,
        objective: learnObjective || null,
        hours: Number(learnHours),
        minutes: Number(learnMinutes),
        completed: learnCompleted
      },
      habits: {
        surah: habitSurah || null,
        onePlusActivity: habitOnePlus || null,
        completed: habitCompleted
      },
      youtube: {
        title: ytTitle || "",
        completed: ytCompleted
      },
      grooming: {
        brushAM: groomBrushAM,
        brushPM: groomBrushPM,
        skincare: groomSkincare,
        shower: groomShower,
        floss: groomFloss
      },
      prayers: {
        fajr: prayFajr,
        dhuhr: prayDhuhr,
        asr: prayAsr,
        maghrib: prayMaghrib,
        isha: prayIsha
      },
      xpGained: 0
    };

    try {
      const res = await fetch(`${API_BASE}/api/history/${selectedDate}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        confetti({
          particleCount: 80,
          spread: 50,
          colors: ['#7C4DFF', '#FFD54A', '#22C55E', '#00E5FF']
        });
        fetchHistoryList();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="pb-32 pt-6 max-w-6xl mx-auto px-4 md:px-8 font-poppins"
    >
      {/* Title */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="font-space text-3xl md:text-5xl font-extrabold tracking-tight">
            EVOLUTION <span className="bg-gradient-to-r from-accent via-[#FF8A00] to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(124,77,255,0.2)]">HISTORY</span>
          </h2>
          <p className="text-white/40 text-xs md:text-sm tracking-wider uppercase font-space mt-1">
            Retroactively view, edit, and log daily snapshot metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Date Selection & Timeline List */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <GlassCard className="border-white/5">
            <h3 className="font-space text-sm font-bold tracking-[2px] uppercase text-white/80 mb-4 flex items-center gap-2">
              <FiCalendar className="text-accent" /> SELECT TARGET DATE
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#121A2C]/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent cursor-pointer"
            />
            <span className="block text-[10px] font-space text-white/40 uppercase mt-2">
              Target Day: <strong className="text-accent">{dayName}</strong>
            </span>
          </GlassCard>

          <GlassCard className="border-white/5 flex-1 flex flex-col max-h-[400px]">
            <h3 className="font-space text-sm font-bold tracking-[2px] uppercase text-white/80 mb-4 flex items-center gap-2">
              <FiClock className="text-accent" /> HISTORY ARCHIVE
            </h3>
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 custom-scrollbar">
              {historyList.length === 0 ? (
                <p className="text-white/20 text-xs italic text-center py-6">No historical records logged yet.</p>
              ) : (
                historyList.map(h => (
                  <button
                    key={h.date}
                    onClick={() => setSelectedDate(h.date)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                      selectedDate === h.date
                        ? 'border-accent bg-accent/5'
                        : 'border-white/5 bg-[#121A2C]/20 hover:border-white/10'
                    }`}
                  >
                    <div>
                      <span className="font-space text-xs text-white font-bold block">{h.date}</span>
                      <span className="text-[10px] text-white/40 uppercase">{h.dayName}</span>
                    </div>
                    <div className="flex gap-1.5 text-[9px] font-space">
                      {h.sport?.completed && <span className="text-accent">💪</span>}
                      {h.entertainment?.completed && <span className="text-success">🎬</span>}
                      {h.learning?.completed && <span className="text-primary">🧠</span>}
                      {h.habits?.completed && <span className="text-cyan-400">📖</span>}
                    </div>
                  </button>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right: Retroactive Editor */}
        <div className="lg:col-span-8">
          <GlassCard className="border-white/5 relative">
            {loadingRecord && (
              <div className="absolute inset-0 bg-[#0B1220]/80 z-20 flex items-center justify-center rounded-2xl">
                <div className="w-8 h-8 rounded-full border-t-2 border-accent animate-spin" />
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h3 className="font-space text-lg font-bold text-white uppercase tracking-wider">
                Logged metrics for {selectedDate}
              </h3>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-accent text-white font-space font-bold text-xs hover:shadow-[0_0_15px_rgba(124,77,255,0.4)] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FiSave className="w-4 h-4" /> SAVE RECORD
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fitness */}
              <div className="p-4 rounded-xl border border-accent/10 bg-[#121A2C]/20 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-space font-bold text-accent tracking-widest uppercase bg-accent/10 px-2 py-0.5 rounded border border-accent/20 flex items-center gap-1">
                      <FiActivity /> FITNESS
                    </span>
                    <input
                      type="checkbox"
                      checked={sportCompleted}
                      onChange={(e) => setSportCompleted(e.target.checked)}
                      className="w-4 h-4 accent-accent cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <label className="block text-[9px] font-space text-white/40 uppercase mb-1">Muscle Group</label>
                      <input
                        type="text"
                        placeholder="e.g. Chest"
                        value={sportMuscle}
                        onChange={(e) => setSportMuscle(e.target.value)}
                        className="w-full bg-[#121A2C]/80 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-space text-white/40 uppercase mb-1">Workout Detail</label>
                      <input
                        type="text"
                        placeholder="e.g. Bench Press"
                        value={sportName}
                        onChange={(e) => setSportName(e.target.value)}
                        className="w-full bg-[#121A2C]/80 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Entertainment */}
              <div className="p-4 rounded-xl border border-success/10 bg-[#121A2C]/20 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-space font-bold text-success tracking-widest uppercase bg-success/10 px-2 py-0.5 rounded border border-success/20 flex items-center gap-1">
                      <FiTv /> PLAY
                    </span>
                    <input
                      type="checkbox"
                      checked={entCompleted}
                      onChange={(e) => setEntCompleted(e.target.checked)}
                      className="w-4 h-4 accent-success cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-space text-white/40 uppercase mb-1">Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Inception"
                          value={entTitle}
                          onChange={(e) => setEntTitle(e.target.value)}
                          className="w-full bg-[#121A2C]/80 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-success"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-space text-white/40 uppercase mb-1">Type</label>
                        <select
                          value={entType}
                          onChange={(e) => setEntType(e.target.value)}
                          className="w-full bg-[#121A2C]/80 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-success cursor-pointer"
                        >
                          <option value="movie">Movie</option>
                          <option value="game">Game</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-space text-white/40 uppercase mb-1">Genre</label>
                      <input
                        type="text"
                        placeholder="e.g. Sci-Fi"
                        value={entGenre}
                        onChange={(e) => setEntGenre(e.target.value)}
                        className="w-full bg-[#121A2C]/80 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-success"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning */}
              <div className="p-4 rounded-xl border border-primary/10 bg-[#121A2C]/20 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-space font-bold text-primary tracking-widest uppercase bg-primary/10 px-2 py-0.5 rounded border border-primary/20 flex items-center gap-1">
                      <FiBook /> LEARN
                    </span>
                    <input
                      type="checkbox"
                      checked={learnCompleted}
                      onChange={(e) => setLearnCompleted(e.target.checked)}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <label className="block text-[9px] font-space text-white/40 uppercase mb-1">Subject</label>
                      <input
                        type="text"
                        placeholder="e.g. Web Development"
                        value={learnSubject}
                        onChange={(e) => setLearnSubject(e.target.value)}
                        className="w-full bg-[#121A2C]/80 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-space text-white/40 uppercase mb-1">Objective</label>
                      <input
                        type="text"
                        placeholder="e.g. Learn React hooks"
                        value={learnObjective}
                        onChange={(e) => setLearnObjective(e.target.value)}
                        className="w-full bg-[#121A2C]/80 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-space text-white/40 uppercase mb-1">Hours</label>
                        <input
                          type="number"
                          value={learnHours}
                          onChange={(e) => setLearnHours(e.target.value)}
                          className="w-full bg-[#121A2C]/80 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-space text-white/40 uppercase mb-1">Minutes</label>
                        <input
                          type="number"
                          value={learnMinutes}
                          onChange={(e) => setLearnMinutes(e.target.value)}
                          className="w-full bg-[#121A2C]/80 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Habits */}
              <div className="p-4 rounded-xl border border-cyan-500/10 bg-[#121A2C]/20 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-space font-bold text-cyan-400 tracking-widest uppercase bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20 flex items-center gap-1">
                      <FiBookOpen /> HABITS
                    </span>
                    <input
                      type="checkbox"
                      checked={habitCompleted}
                      onChange={(e) => setHabitCompleted(e.target.checked)}
                      className="w-4 h-4 accent-cyan-400 cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <label className="block text-[9px] font-space text-white/40 uppercase mb-1">Daily Surah</label>
                      <input
                        type="text"
                        placeholder="e.g. Surah Al-Mulk"
                        value={habitSurah}
                        onChange={(e) => setHabitSurah(e.target.value)}
                        className="w-full bg-[#121A2C]/80 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-space text-white/40 uppercase mb-1">OnePlus Activity</label>
                      <input
                        type="text"
                        placeholder="e.g. Dhikr 100x"
                        value={habitOnePlus}
                        onChange={(e) => setHabitOnePlus(e.target.value)}
                        className="w-full bg-[#121A2C]/80 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-white/5 my-2 col-span-1 md:col-span-2" />

              {/* Prayers Editor */}
              <div className="p-4 rounded-xl border border-emerald-500/10 bg-[#121A2C]/20 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-space font-bold text-success tracking-widest uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                      🕌 PRAYERS
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { key: 'fajr', state: prayFajr, setter: setPrayFajr },
                      { key: 'dhuhr', state: prayDhuhr, setter: setPrayDhuhr },
                      { key: 'asr', state: prayAsr, setter: setPrayAsr },
                      { key: 'maghrib', state: prayMaghrib, setter: setPrayMaghrib },
                      { key: 'isha', state: prayIsha, setter: setPrayIsha }
                    ].map(p => (
                      <button
                        key={p.key}
                        onClick={() => p.setter(!p.state)}
                        className={`py-2 rounded-lg border font-space text-[9px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                          p.state
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-success shadow-[0_0_10px_rgba(34,197,94,0.15)]'
                            : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                        }`}
                      >
                        {p.key}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grooming Editor */}
              <div className="p-4 rounded-xl border border-[#FF8A00]/10 bg-[#121A2C]/20 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-space font-bold text-[#FF8A00] tracking-widest uppercase bg-[#FF8A00]/10 px-2 py-0.5 rounded border border-[#FF8A00]/20 flex items-center gap-1">
                      🪥 GROOMING
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      { key: 'brushAM', label: 'Morning Brush', state: groomBrushAM, setter: setGroomBrushAM },
                      { key: 'brushPM', label: 'Night Brush', state: groomBrushPM, setter: setGroomBrushPM },
                      { key: 'skincare', label: 'Skincare', state: groomSkincare, setter: setGroomSkincare },
                      { key: 'shower', label: 'Shower', state: groomShower, setter: setGroomShower },
                      { key: 'floss', label: 'Floss', state: groomFloss, setter: setGroomFloss }
                    ].map(g => (
                      <label key={g.key} className="flex items-center justify-between text-[11px] text-white/70 cursor-pointer hover:text-white transition-all">
                        <span>{g.label}</span>
                        <input
                          type="checkbox"
                          checked={g.state}
                          onChange={(e) => g.setter(e.target.checked)}
                          className="w-3.5 h-3.5 accent-[#FF8A00] cursor-pointer"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* YouTube Editor */}
              <div className="p-4 rounded-xl border border-red-500/10 bg-[#121A2C]/20 flex flex-col justify-between col-span-1 md:col-span-2">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-space font-bold text-red-400 tracking-widest uppercase bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 flex items-center gap-1">
                      🎥 YOUTUBE STUDY
                    </span>
                    <input
                      type="checkbox"
                      checked={ytCompleted}
                      onChange={(e) => setYtCompleted(e.target.checked)}
                      className="w-4 h-4 accent-red-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <label className="block text-[9px] font-space text-white/40 uppercase mb-1">Video Title Logged</label>
                      <input
                        type="text"
                        placeholder="e.g. Next.js Under The Hood"
                        value={ytTitle}
                        onChange={(e) => setYtTitle(e.target.value)}
                        className="w-full bg-[#121A2C]/80 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
