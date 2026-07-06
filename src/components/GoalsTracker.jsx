import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import GlassCard from './GlassCard';
import { FiCheck, FiTrash2, FiPlus, FiFlag, FiAward } from 'react-icons/fi';
import confetti from 'canvas-confetti';

const CATEGORY_COLORS = {
  Fitness: 'text-accent border-accent/20 bg-accent/5',
  Learning: 'text-primary border-primary/20 bg-primary/5',
  Play: 'text-success border-success/20 bg-success/5',
  Habits: 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5',
  General: 'text-white/60 border-white/10 bg-white/5'
};

export default function GoalsTracker() {
  const { goalsList, addGoal, toggleGoalCompleted, removeGoal } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [xpReward, setXpReward] = useState(150);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addGoal(title, category, Number(xpReward) || 150);
    setTitle('');
    setCategory('General');
    setXpReward(150);
    setShowAddForm(false);
    confetti({
      particleCount: 30,
      spread: 30,
      colors: ['#FFD54A', '#FFFFFF']
    });
  };

  const handleToggleComplete = (id, completed, xp) => {
    if (!completed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD54A', '#7C4DFF', '#00E5FF', '#22C55E']
      });
    }
    toggleGoalCompleted(id);
  };

  // Filter goals
  const activeGoals = (goalsList || []).filter(g => !g.archived);
  const historyGoals = (goalsList || []).filter(g => g.archived);

  // Stats (Active weekly goals only)
  const completedCount = activeGoals.filter(g => g.completed).length;
  const totalCount = activeGoals.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <GlassCard className="border-primary/10 flex flex-col justify-between p-6 h-[480px] relative group" tilt={false}>
      {/* Corner decorative tag */}
      <div className="absolute top-4 right-4 text-white/5 group-hover:text-primary/10 transition-all duration-500 text-5xl pointer-events-none">
        <FiFlag />
      </div>

      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 shrink-0">
          <div>
            <span className="text-[10px] font-space font-bold text-primary tracking-widest uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20 block w-max mb-1">
              QUESTS
            </span>
            <h4 className="font-space text-base font-extrabold text-white">Weekly Goals</h4>
          </div>
          <button
            onClick={() => {
              setActiveTab('active');
              setShowAddForm(!showAddForm);
            }}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-space font-bold"
          >
            <FiPlus className={`transition-transform duration-300 ${showAddForm ? 'rotate-45' : ''}`} /> NEW QUEST
          </button>
        </div>

        {/* Progress row */}
        {totalCount > 0 && activeTab === 'active' && (
          <div className="mb-3 bg-[#121A2C]/60 border border-white/5 p-2.5 rounded-xl shrink-0">
            <div className="flex justify-between items-center text-xs font-space mb-1">
              <span className="text-white/40">COMPLETION RATE</span>
              <span className="text-primary font-bold">{completedCount}/{totalCount} ({progressPercent}%)</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Tab Selectors */}
        <div className="flex gap-2 mb-3 bg-[#121A2C]/40 border border-white/5 p-1 rounded-xl shrink-0">
          <button
            onClick={() => { setActiveTab('active'); setShowAddForm(false); }}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-space font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'active' ? 'bg-primary text-[#0B1220]' : 'text-white/60 hover:text-white'
            }`}
          >
            Active ({activeGoals.length})
          </button>
          <button
            onClick={() => { setActiveTab('history'); setShowAddForm(false); }}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-space font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'history' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            History ({historyGoals.length})
          </button>
        </div>

        {/* Scrollable list or form */}
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {showAddForm ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 py-1">
              <div>
                <label className="block text-[9px] font-space text-white/40 uppercase mb-1">Quest Title</label>
                <input
                  type="text"
                  placeholder="e.g. Run 10km or read 2 articles"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-[#121A2C]/80 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary placeholder:text-white/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-space text-white/40 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#121A2C]/80 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="General">General</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Learning">Learning</option>
                    <option value="Play">Play</option>
                    <option value="Habits">Habits</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-space text-white/40 uppercase mb-1">XP Reward</label>
                  <input
                    type="number"
                    min="50"
                    max="1000"
                    step="50"
                    value={xpReward}
                    onChange={(e) => setXpReward(e.target.value)}
                    required
                    className="w-full bg-[#121A2C]/80 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 text-xs font-space font-bold bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 text-white transition-all cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-space font-bold bg-primary text-[#0B1220] rounded-xl hover:shadow-[0_0_12px_rgba(255,213,74,0.4)] transition-all cursor-pointer"
                >
                  ADD GOAL
                </button>
              </div>
            </form>
          ) : activeTab === 'active' ? (
            activeGoals.length > 0 ? (
              <div className="flex flex-col gap-2">
                {activeGoals.map((goal) => {
                  const colorClass = CATEGORY_COLORS[goal.category] || CATEGORY_COLORS.General;
                  return (
                    <div
                      key={goal._id}
                      className={`flex items-center justify-between p-3 rounded-xl border bg-[#121A2C]/40 transition-all ${
                        goal.completed ? 'border-emerald-500/10 opacity-60' : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate mr-2">
                        <button
                          onClick={() => handleToggleComplete(goal._id, goal.completed, goal.xpReward)}
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                            goal.completed
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                              : 'border-white/20 hover:border-primary text-transparent'
                          }`}
                        >
                          <FiCheck className="w-3.5 h-3.5" />
                        </button>

                        <div className="truncate">
                          <p className={`text-xs font-semibold text-white truncate ${goal.completed ? 'line-through text-white/40' : ''}`}>
                            {goal.title}
                          </p>
                          <span className={`inline-block text-[8px] font-space font-bold px-1.5 py-0.5 rounded border uppercase mt-1 ${colorClass}`}>
                            {goal.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-space font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded flex items-center gap-0.5">
                          <FiAward className="w-3 h-3" /> +{goal.xpReward}
                        </span>
                        <button
                          onClick={() => removeGoal(goal._id)}
                          className="p-1 text-white/20 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                          title="Delete Goal"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <span className="text-3xl mb-2">🎯</span>
                <p className="text-white/40 text-xs italic">No active weekly goals set.</p>
                <p className="text-white/20 text-[10px] uppercase font-space tracking-wider mt-1">Reset happens every Saturday</p>
              </div>
            )
          ) : historyGoals.length > 0 ? (
            <div className="flex flex-col gap-2">
              {historyGoals.map((goal) => {
                const colorClass = CATEGORY_COLORS[goal.category] || CATEGORY_COLORS.General;
                const dateStr = goal.completedAt
                  ? new Date(goal.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                  : 'Achieved';
                return (
                  <div
                    key={goal._id}
                    className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/10 bg-[#121A2C]/20 opacity-80"
                  >
                    <div className="flex items-center gap-3 truncate mr-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 text-[10px] font-bold shrink-0">
                        ✓
                      </span>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-white/50 line-through truncate">{goal.title}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`text-[8px] font-space font-bold px-1.5 py-0.5 rounded border uppercase ${colorClass}`}>
                            {goal.category}
                          </span>
                          <span className="text-[8px] text-white/30 font-space">Completed: {dateStr}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px] font-space font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                        +{goal.xpReward} XP
                      </span>
                      <button
                        onClick={() => removeGoal(goal._id)}
                        className="p-1 text-white/20 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                        title="Delete Goal Archive"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <span className="text-3xl mb-2">📜</span>
              <p className="text-white/40 text-xs italic">No quest history achieved yet.</p>
              <p className="text-white/20 text-[10px] uppercase font-space tracking-wider mt-1">Complete your active goals to build history</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-left shrink-0">
        <span className="text-[10px] text-white/30 font-space uppercase">Target: Weekly resets</span>
        <span className="text-[10px] text-primary font-space font-bold">
          Quest Board
        </span>
      </div>
    </GlassCard>
  );
}
