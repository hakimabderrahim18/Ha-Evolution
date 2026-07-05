import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import GlassCard from './GlassCard';
import confetti from 'canvas-confetti';

export default function YoutubeStudy() {
  const { todayHistory, youtubeSchedule, toggleYoutubeCompleted } = useContext(AppContext);

  const todayDayName = todayHistory?.dayName || 'Saturday';
  const todayTask = youtubeSchedule?.[todayDayName];

  const handleToggleCompleted = () => {
    if (!todayTask?.title) return;
    
    const nextComp = !todayTask.completed;
    if (nextComp) {
      confetti({
        particleCount: 50,
        spread: 40,
        colors: ['#EF4444', '#FCA5A5', '#FFFFFF']
      });
    }
    toggleYoutubeCompleted(todayDayName);
  };

  return (
    <GlassCard className="border-red-500/10 flex flex-col justify-between p-6 h-full" tilt={true}>
      <div>
        <span className="text-[10px] font-space font-bold text-red-400 tracking-widest uppercase bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 block w-max mb-4">
          YOUTUBE STUDY
        </span>
        <h4 className="font-space text-sm md:text-base font-bold text-white mb-4">Daily Video Task (+30 XP)</h4>

        {todayTask && todayTask.title ? (
          <div className="flex flex-col gap-4">
            <div className="bg-[#121A2C]/40 border border-white/5 p-3 rounded-xl">
              <span className="block text-[9px] font-space text-white/40 uppercase mb-1">Today's Focus Video</span>
              <h5 className="font-space text-sm font-bold text-white truncate">{todayTask.title}</h5>
              <span className="text-[10px] text-red-400 font-semibold uppercase font-space">Channel: {todayTask.channel}</span>
            </div>

            <button
              onClick={handleToggleCompleted}
              className={`w-full py-3 rounded-xl font-space font-bold text-xs border transition-all duration-300 cursor-pointer ${
                todayTask.completed
                  ? 'bg-red-500/20 border-red-500/30 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                  : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/10'
              }`}
            >
              {todayTask.completed ? '✓ VIDEO STUDY COMPLETED' : 'MARK VIDEO DONE'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <span className="text-3xl mb-2">🎥</span>
            <p className="text-white/40 text-xs italic mb-4">No video programmed for {todayDayName}.</p>
            <NavLink
              to="/youtube"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-space font-bold text-[10px] uppercase transition-all tracking-wider cursor-pointer"
            >
              PROGRAM WEEK
            </NavLink>
          </div>
        )}
      </div>
      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-left">
        <span className="text-[10px] text-white/40 font-space uppercase">Target:</span>
        <span className="text-xs text-red-400 font-space font-bold bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/15">
          Weekly Study Plan
        </span>
      </div>
    </GlassCard>
  );
}
