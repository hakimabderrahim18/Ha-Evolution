import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import GlassCard from './GlassCard';
import confetti from 'canvas-confetti';

export default function YoutubeStudy() {
  const { todayHistory, updateTodayYoutube } = useContext(AppContext);
  const [ytTitle, setYtTitle] = useState('');

  useEffect(() => {
    if (todayHistory?.youtube?.title !== undefined) {
      setYtTitle(todayHistory.youtube.title || '');
    }
  }, [todayHistory]);

  const handleToggleCompleted = () => {
    const nextComp = !(todayHistory?.youtube?.completed || false);
    if (nextComp) {
      confetti({
        particleCount: 50,
        spread: 40,
        colors: ['#EF4444', '#FCA5A5', '#FFFFFF']
      });
    }
    updateTodayYoutube(ytTitle, nextComp);
  };

  const handleInputBlur = () => {
    updateTodayYoutube(ytTitle, todayHistory?.youtube?.completed || false);
  };

  return (
    <GlassCard className="border-red-500/10 flex flex-col justify-between p-6 h-full" tilt={true}>
      <div>
        <span className="text-[10px] font-space font-bold text-red-400 tracking-widest uppercase bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 block w-max mb-4">
          YOUTUBE STUDY
        </span>
        <h4 className="font-space text-sm md:text-base font-bold text-white mb-4">Daily Video Task (+30 XP)</h4>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[9px] font-space text-white/40 uppercase mb-1.5">Educational Video Title</label>
            <input
              type="text"
              placeholder="e.g. Next.js Architecture / Physics video"
              value={ytTitle}
              onChange={(e) => setYtTitle(e.target.value)}
              onBlur={handleInputBlur}
              className="w-full bg-[#121A2C]/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-400 placeholder:text-white/20"
            />
          </div>

          <button
            onClick={handleToggleCompleted}
            className={`w-full py-3 rounded-xl font-space font-bold text-xs border transition-all duration-300 cursor-pointer ${
              todayHistory?.youtube?.completed
                ? 'bg-red-500/20 border-red-500/30 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/10'
            }`}
          >
            {todayHistory?.youtube?.completed ? '✓ VIDEO STUDY COMPLETED' : 'MARK VIDEO DONE'}
          </button>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-left">
        <span className="text-[10px] text-white/40 font-space uppercase">Target:</span>
        <span className="text-xs text-red-400 font-space font-bold bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/15">
          1 Study Video Logged
        </span>
      </div>
    </GlassCard>
  );
}
