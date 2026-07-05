import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';
import PrayersMatrix from '../components/PrayersMatrix';
import HygieneTracker from '../components/HygieneTracker';
import YoutubeStudy from '../components/YoutubeStudy';

export default function DailyRituals() {
  const { todayHistory, loading } = useContext(AppContext);
  const todayDayName = todayHistory?.dayName || 'Saturday';

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-[#0B1220] font-space">
        <div className="w-12 h-12 rounded-full border-t-2 border-primary animate-spin" />
        <span className="text-xs tracking-[4px] text-primary/80 uppercase animate-pulse">CONNECTING COGNITIVE MATRIX...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="pb-32 pt-6 max-w-6xl mx-auto px-4 md:px-8 font-poppins"
    >
      {/* Page Title */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="font-space text-3xl md:text-5xl font-extrabold tracking-tight">
            DAILY <span className="bg-gradient-to-r from-success via-emerald-400 to-[#FF8A00] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,197,94,0.15)]">RITUALS</span>
          </h2>
          <p className="text-white/40 text-xs md:text-sm tracking-wider uppercase font-space mt-1">
            Program and control your core habits, video tasks, and prayers matrix.
          </p>
        </div>
      </div>

      {/* Responsive Rituals Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PrayersMatrix />
        <HygieneTracker />
        <YoutubeStudy />
      </div>
    </motion.div>
  );
}
