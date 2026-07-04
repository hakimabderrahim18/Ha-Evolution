import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiInfo, FiPlus } from 'react-icons/fi';
import { AppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import confetti from 'canvas-confetti';

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Rest'];

const MUSCLE_DESCRIPTIONS = {
  Chest: 'Barbell/Dumbbell Press, Chest Flyes, Dips, Pushups',
  Back: 'Deadlifts, Lat Pulldowns, Bent-over Rows, Pullups',
  Shoulders: 'Overhead Press, Lateral Raises, Front Raises, Rear Delt Flyes',
  Arms: 'Bicep Curls, Tricep Extensions, Hammer Curls, Dips',
  Legs: 'Squats, Romanian Deadlifts, Lunges, Calf Raises',
  Core: 'Planks, Hanging Leg Raises, Ab Rollouts, Crunches',
  Rest: 'Stretching, Yoga, Light Cardio, Complete Rest'
};

export default function SportPlanner() {
  const { sportSchedule, updateSportWorkout, toggleSportWorkoutCompleted, loading } = useContext(AppContext);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-[#0B1220] font-space">
        <div className="w-12 h-12 rounded-full border-t-2 border-accent animate-spin" />
        <span className="text-xs tracking-[4px] text-accent/80 uppercase animate-pulse">SYNCHRONIZING TRAINING LOG...</span>
      </div>
    );
  }
  const [editingDay, setEditingDay] = useState(null);
  const [workoutInput, setWorkoutInput] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('Chest');

  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleDragStart = (e, muscleName) => {
    e.dataTransfer.setData('muscle', muscleName);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, day) => {
    e.preventDefault();
    const muscle = e.dataTransfer.getData('muscle');
    if (muscle && MUSCLE_GROUPS.includes(muscle)) {
      const defaultName = `Daily ${muscle} workout routine`;
      updateSportWorkout(day, muscle, defaultName);
    }
  };

  const handleComplete = (day) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#FFD54A', '#7C4DFF', '#22C55E']
    });
    toggleSportWorkoutCompleted(day);
  };

  const openEditModal = (day) => {
    setEditingDay(day);
    setWorkoutInput(sportSchedule[day]?.name || '');
    setSelectedMuscle(sportSchedule[day]?.muscle || 'Chest');
  };

  const saveWorkoutDetails = () => {
    if (editingDay) {
      updateSportWorkout(editingDay, selectedMuscle, workoutInput || `Daily ${selectedMuscle} workout`);
      setEditingDay(null);
    }
  };

  // Check if muscle is completed somewhere in the week
  const isMuscleCompleted = (muscle) => {
    return Object.values(sportSchedule).some(w => w.muscle === muscle && w.completed);
  };

  const isMuscleScheduled = (muscle) => {
    return Object.values(sportSchedule).some(w => w.muscle === muscle);
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
          SPORT <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(124,77,255,0.2)]">PLANNER</span>
        </h2>
        <p className="text-white/40 text-xs md:text-sm tracking-wider uppercase font-space mt-1">
          Drag muscle groups to program your workout schedule. Complete tasks to earn XP.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Side: Drag Panel & SVG Muscle Map */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Draggable Muscles */}
          <GlassCard className="border-accent/10">
            <h3 className="font-space text-sm font-bold tracking-[2px] uppercase text-white/80 mb-4 flex items-center gap-2">
              <span>🦿</span> Muscle Palette
            </h3>
            <p className="text-white/50 text-xs mb-4">Drag a muscle group onto any weekday to schedule your training:</p>
            <div className="flex flex-wrap gap-2.5">
              {MUSCLE_GROUPS.map((muscle) => (
                <div
                  key={muscle}
                  draggable
                  onDragStart={(e) => handleDragStart(e, muscle)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-space font-bold cursor-grab active:cursor-grabbing transition-all select-none border ${
                    isMuscleCompleted(muscle)
                      ? 'bg-success/20 border-success/30 text-success shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                      : isMuscleScheduled(muscle)
                      ? 'bg-accent/20 border-accent/30 text-[#B39DFF] shadow-[0_0_10px_rgba(124,77,255,0.2)]'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {muscle}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* SVG Muscle Map Visualizer */}
          <GlassCard className="border-primary/10 flex flex-col items-center justify-center p-6 text-center">
            <h3 className="font-space text-sm font-bold tracking-[2px] uppercase text-white/80 mb-6">
              SYSTEM BODY PROFILE
            </h3>

            {/* Front & Back Body Silhouettes */}
            <div className="flex justify-center gap-12 items-center w-full max-w-xs h-72">
              <svg className="w-1/2 h-full" viewBox="0 0 100 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Front Silhouette outline */}
                <path d="M50 15C53 15 56 12 56 8C56 4 53 1 50 1C47 1 44 4 44 8C44 12 47 15 50 15Z" fill="#1B253D" stroke="#374870" />
                {/* Neck */}
                <path d="M47 15H53V22H47V15Z" fill="#1B253D" />
                
                {/* Shoulders */}
                <path
                  d="M32 25C37 23 42 22 50 22C58 22 63 23 68 25C71 27 74 34 74 40H68C68 32 62 28 50 28C38 28 32 32 32 40H26C26 34 29 27 32 25Z"
                  fill={isMuscleCompleted('Shoulders') ? '#22C55E' : isMuscleScheduled('Shoulders') ? '#7C4DFF' : '#1B253D'}
                  className="transition-colors duration-500 cursor-pointer"
                  stroke="#374870"
                />

                {/* Chest */}
                <path
                  d="M34 40C39 39 44 38 50 38C56 38 61 39 66 40C68 45 68 55 64 62C58 64 54 65 50 65C46 65 42 64 36 62C32 55 32 45 34 40Z"
                  fill={isMuscleCompleted('Chest') ? '#22C55E' : isMuscleScheduled('Chest') ? '#7C4DFF' : '#1B253D'}
                  className="transition-colors duration-500 cursor-pointer"
                  stroke="#374870"
                />

                {/* Core / Abs */}
                <path
                  d="M36 65C40 64 45 64 50 64C55 64 60 64 64 65C66 75 64 90 60 102C56 104 53 105 50 105C47 105 44 104 40 102C36 90 34 75 36 65Z"
                  fill={isMuscleCompleted('Core') ? '#22C55E' : isMuscleScheduled('Core') ? '#7C4DFF' : '#1B253D'}
                  className="transition-colors duration-500 cursor-pointer"
                  stroke="#374870"
                />

                {/* Arms (Front) */}
                <path
                  d="M26 40C25 50 22 65 19 80C17 90 15 105 16 115H21C22 105 24 90 26 80L28 62H26V40ZM74 40C75 50 78 65 81 80C83 90 85 105 84 115H79C78 105 76 90 74 80L72 62H74V40Z"
                  fill={isMuscleCompleted('Arms') ? '#22C55E' : isMuscleScheduled('Arms') ? '#7C4DFF' : '#1B253D'}
                  className="transition-colors duration-500 cursor-pointer"
                  stroke="#374870"
                />

                {/* Legs (Front) */}
                <path
                  d="M36 102C38 120 40 145 42 170C43 185 43 205 41 218H47C48 205 48 185 47 170L46 130L49 105H40L36 102ZM64 102C62 120 60 145 58 170C57 185 57 205 59 218H53C52 205 52 185 53 170L54 130L51 105H60L64 102Z"
                  fill={isMuscleCompleted('Legs') ? '#22C55E' : isMuscleScheduled('Legs') ? '#7C4DFF' : '#1B253D'}
                  className="transition-colors duration-500 cursor-pointer"
                  stroke="#374870"
                />
              </svg>

              <svg className="w-1/2 h-full" viewBox="0 0 100 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Back Silhouette */}
                <path d="M50 15C53 15 56 12 56 8C56 4 53 1 50 1C47 1 44 4 44 8C44 12 47 15 50 15Z" fill="#1B253D" stroke="#374870" />
                <path d="M47 15H53V22H47V15Z" fill="#1B253D" />

                {/* Back / Lats */}
                <path
                  d="M32 25C37 23 42 22 50 22C58 22 63 23 68 25C71 27 74 34 74 40L68 45C68 36 62 30 50 30C38 30 32 36 32 45L26 40C26 34 29 27 32 25ZM32 45C34 50 35 60 38 68C42 66 46 65 50 65C54 65 58 66 62 68C65 60 66 50 68 45C61 43 56 42 50 42C44 42 39 43 32 45Z"
                  fill={isMuscleCompleted('Back') ? '#22C55E' : isMuscleScheduled('Back') ? '#7C4DFF' : '#1B253D'}
                  className="transition-colors duration-500 cursor-pointer"
                  stroke="#374870"
                />

                {/* Lower back and Glutes */}
                <path
                  d="M38 68C36 78 35 88 38 102C42 105 46 106 50 106C54 106 58 105 62 102C65 88 64 78 62 68C58 66 54 65 50 65C46 65 42 66 38 68Z"
                  fill={isMuscleCompleted('Core') ? '#22C55E' : isMuscleScheduled('Core') ? '#7C4DFF' : '#1B253D'}
                  className="transition-colors duration-500 cursor-pointer"
                  stroke="#374870"
                />

                {/* Back Legs (Hamstrings/Calves) */}
                <path
                  d="M36 102L40 105H49L46 130L47 170C48 185 48 205 47 218H41C43 205 43 185 42 170C40 145 38 120 36 102ZM64 102L60 105H51L54 130L53 170C52 185 52 205 53 218H59C57 205 57 185 58 170C60 145 62 120 64 102Z"
                  fill={isMuscleCompleted('Legs') ? '#22C55E' : isMuscleScheduled('Legs') ? '#7C4DFF' : '#1B253D'}
                  className="transition-colors duration-500 cursor-pointer"
                  stroke="#374870"
                />
              </svg>
            </div>
            
            <div className="flex gap-4 justify-center items-center mt-4 text-[10px] tracking-wider font-space">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#1B253D] border border-white/10" /> IDLE</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(124,77,255,0.6)]" /> SCHEDULED</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]" /> TRAINED</span>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Weekly Calendar Timeline */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h3 className="font-space text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>📅</span> Weekly Timeline Board
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {days.map((day) => {
              const item = sportSchedule[day];
              return (
                <div
                  key={day}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, day)}
                  className={`glass p-5 rounded-2xl border transition-all duration-300 ${
                    item?.completed
                      ? 'border-success/30 bg-success/5 shadow-[0_0_20px_rgba(34,197,94,0.05)]'
                      : 'border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-space text-sm font-bold text-white/90">{day}</span>
                    {item?.completed && (
                      <span className="text-[10px] font-space font-bold tracking-widest text-success bg-success/15 px-2 py-0.5 rounded border border-success/30">
                        COMPLETED
                      </span>
                    )}
                  </div>

                  {item ? (
                    <div className="flex flex-col justify-between h-28">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-space font-bold text-primary">{item.muscle}</span>
                        </div>
                        <p className="text-white/80 text-xs font-semibold line-clamp-1">{item.name}</p>
                        <p className="text-white/40 text-[10px] mt-1 italic line-clamp-1">
                          {MUSCLE_DESCRIPTIONS[item.muscle]}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                        <button
                          onClick={() => openEditModal(day)}
                          className="text-[10px] font-space font-semibold text-white/50 hover:text-white transition-colors cursor-pointer"
                        >
                          EDIT DETAILS
                        </button>
                        
                        {!item.completed && (
                          <button
                            onClick={() => handleComplete(day)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-success text-white font-space text-[10px] font-bold border border-white/10 hover:border-success transition-all cursor-pointer"
                          >
                            TREAT AS DONE
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/[0.01] text-center p-4">
                      <p className="text-white/30 text-xs mb-2">Empty schedule day</p>
                      <button
                        onClick={() => openEditModal(day)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-space text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <FiPlus className="w-3 h-3" /> CHOOSE MUSCLE
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Edit Workout Modal Overlay */}
      {editingDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/80 backdrop-blur-md px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass max-w-md w-full p-6 rounded-3xl border-white/10 shadow-2xl relative"
          >
            <h3 className="font-space text-lg font-bold text-white mb-6">
              Configure Workout // {editingDay}
            </h3>

            <div className="mb-4">
              <label className="block text-xs font-space text-white/55 mb-2 uppercase">Target Muscle Group</label>
              <div className="grid grid-cols-4 gap-2">
                {MUSCLE_GROUPS.map((muscle) => (
                  <button
                    key={muscle}
                    type="button"
                    onClick={() => setSelectedMuscle(muscle)}
                    className={`py-2 rounded-xl text-xs font-space font-bold border transition-all cursor-pointer ${
                      selectedMuscle === muscle
                        ? 'bg-accent/20 border-accent/60 text-[#B39DFF]'
                        : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {muscle}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-space text-white/55 mb-2 uppercase">Workout Details (Exercises)</label>
              <input
                type="text"
                placeholder={MUSCLE_DESCRIPTIONS[selectedMuscle] || 'Workout routines...'}
                value={workoutInput}
                onChange={(e) => setWorkoutInput(e.target.value)}
                className="w-full bg-[#121A2C]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex gap-3 justify-end font-space">
              <button
                onClick={() => setEditingDay(null)}
                className="px-4 py-2 text-xs font-semibold text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={saveWorkoutDetails}
                className="px-5 py-2.5 rounded-xl bg-accent text-white font-bold text-xs hover:shadow-[0_0_15px_rgba(124,77,255,0.3)] cursor-pointer"
              >
                SAVE SCHEDULE
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
