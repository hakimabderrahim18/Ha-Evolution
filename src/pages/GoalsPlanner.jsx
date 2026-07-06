import React from 'react';
import { motion } from 'framer-motion';
import GoalsTracker from '../components/GoalsTracker';
import GlassCard from '../components/GlassCard';
import { FiAward, FiInfo } from 'react-icons/fi';

export default function GoalsPlanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="pb-32 pt-6 max-w-4xl mx-auto px-4 md:px-8 font-poppins"
    >
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="font-space text-3xl md:text-5xl font-extrabold tracking-tight">
          WEEKLY <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,213,74,0.2)]">GOALS</span>
        </h2>
        <p className="text-white/40 text-xs md:text-sm tracking-wider uppercase font-space mt-1">
          Manage your weekly targets, gain levels, and claim epic XP rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left/Main Column: Goals Checklist Card */}
        <div className="md:col-span-8">
          <GoalsTracker />
        </div>

        {/* Right Column: Tips & Gamification Info */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <GlassCard className="border-primary/10 p-6 flex flex-col gap-4">
            <h3 className="font-space text-sm font-bold tracking-[2px] uppercase text-white/80 flex items-center gap-2">
              <FiAward className="text-primary" /> XP REWARDS
            </h3>
            <p className="text-white/50 text-xs leading-relaxed">
              Completing weekly goals awards you massive chunks of XP (**+150 XP** to **+500 XP**). 
            </p>
            <div className="bg-[#121A2C]/60 border border-white/5 p-3 rounded-xl text-[11px] text-white/60 leading-normal">
              🏆 <strong className="text-white">Pro Tip:</strong> Create clear, bite-sized goals each week. Break bigger goals down into smaller individual quests to earn steady XP!
            </div>
          </GlassCard>

          <GlassCard className="border-accent/10 p-6 flex flex-col gap-3">
            <h3 className="font-space text-sm font-bold tracking-[2px] uppercase text-white/80 flex items-center gap-2">
              <FiInfo className="text-accent" /> RESET RULES
            </h3>
            <ul className="text-white/50 text-xs flex flex-col gap-2 list-disc pl-4 leading-normal">
              <li>Completed goals clear automatically each Saturday morning.</li>
              <li>Uncompleted goals carry over to the next week.</li>
              <li>Goals can be customized with custom rewards dynamically.</li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
