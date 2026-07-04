import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const DEFAULT_SPORT_SCHEDULE = {
  Saturday: { muscle: 'Core', name: 'Planks & Hanging Leg Raises', completed: false },
  Sunday: { muscle: 'Rest', name: 'Active Recovery & Stretching', completed: false },
  Monday: { muscle: 'Chest', name: 'Barbell Bench Press & Flyes', completed: false },
  Tuesday: { muscle: 'Back', name: 'Deadlifts & Lat Pulldowns', completed: false },
  Wednesday: { muscle: 'Shoulders', name: 'Overhead Press & Lateral Raises', completed: false },
  Thursday: { muscle: 'Arms', name: 'Bicep Curls & Tricep Pushdowns', completed: false },
  Friday: { muscle: 'Legs', name: 'Squats & Bulgarian Split Squats', completed: false }
};

const DEFAULT_ENTERTAINMENT_SCHEDULE = {
  Saturday: null, Sunday: null, Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null
};

const DEFAULT_LEARNING_SCHEDULE = {
  Saturday: null, Sunday: null, Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null
};

const DEFAULT_WATCHLIST = [];

const DEFAULT_HABITS_SCHEDULE = {
  Saturday: null, Sunday: null, Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null
};

const DEFAULT_USER_STATS = {
  xp: 120,
  level: 1,
  streak: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  unlockedAchievements: []
};

export const ACHIEVEMENTS = [
  { id: 'first_step', title: 'First Evolution', description: 'Complete your first daily evolution task.', xpAward: 50, icon: '🚀' },
  { id: 'beast_mode', title: 'Beast Mode', description: 'Complete all 6 training sessions in a week.', xpAward: 200, icon: '💪' },
  { id: 'cinephile', title: 'Cinephile', description: 'Watch 3 movies this week.', xpAward: 100, icon: '🎬' },
  { id: 'hardcore_gamer', title: 'Hardcore Gamer', description: 'Log 3 gaming sessions this week.', xpAward: 100, icon: '🎮' },
  { id: 'deep_work', title: 'Deep Focus', description: 'Log 2 hours (120 minutes) of cumulative learning.', xpAward: 150, icon: '🧠' },
  { id: 'week_warrior', title: 'Consistency King', description: 'Maintain a daily evolution streak of 7 days.', xpAward: 300, icon: '🔥' },
  { id: 'level_five', title: 'Ultimate Ascendant', description: 'Reach Level 5 in HA Life Evolution.', xpAward: 500, icon: '👑' }
];

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

export const AppProvider = ({ children }) => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '' : 'https://ha-evolution.onrender.com');
  const [sportSchedule, setSportSchedule] = useState(DEFAULT_SPORT_SCHEDULE);
  const [entertainmentSchedule, setEntertainmentSchedule] = useState(DEFAULT_ENTERTAINMENT_SCHEDULE);
  const [watchlist, setWatchlist] = useState(DEFAULT_WATCHLIST);
  const [learningSchedule, setLearningSchedule] = useState(DEFAULT_LEARNING_SCHEDULE);
  const [habitsSchedule, setHabitsSchedule] = useState(DEFAULT_HABITS_SCHEDULE);
  const [userStats, setUserStats] = useState(DEFAULT_USER_STATS);

  const [loading, setLoading] = useState(true);
  const [levelUpData, setLevelUpData] = useState(null);
  const [recentAchievement, setRecentAchievement] = useState(null);

  // Fetch all data from MongoDB on startup
  useEffect(() => {
    const fetchAllData = async () => {
      const fetchResource = async (url, setter, label) => {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data) {
              if (label === 'stats') {
                setter(data);
              } else if (Object.keys(data).length > 0) {
                setter(data);
              }
            }
          } else {
            console.warn(`Backend returned non-ok status for ${label}:`, res.status);
          }
        } catch (err) {
          console.warn(`Failed to retrieve ${label} from backend:`, err);
        }
      };

      try {
        await Promise.all([
          fetchResource(API_BASE + '/api/sport', setSportSchedule, 'sport'),
          fetchResource(API_BASE + '/api/entertainment', setEntertainmentSchedule, 'entertainment'),
          fetchResource(API_BASE + '/api/watchlist', setWatchlist, 'watchlist'),
          fetchResource(API_BASE + '/api/learning', setLearningSchedule, 'learning'),
          fetchResource(API_BASE + '/api/stats', setUserStats, 'stats'),
          fetchResource(API_BASE + '/api/habits', setHabitsSchedule, 'habits')
        ]);
      } catch (err) {
        console.error("Global startup fetching error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Handle daily history snapshots and Saturday weekly resets
  useEffect(() => {
    if (loading) return;

    const runDailyAndWeeklyChecks = async () => {
      const todayDateStr = getLocalDateString();
      const lastActive = userStats.lastActiveDate;

      if (lastActive && lastActive !== todayDateStr) {
        console.log(`Detecting new day transition from ${lastActive} to ${todayDateStr}`);

        // 1. Save yesterday's snapshot to history
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterdayDateStr = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth()+1).padStart(2,'0')}-${String(yesterdayDate.getDate()).padStart(2,'0')}`;
        const yesterdayDayName = getDayNameOfDate(yesterdayDateStr);

        try {
          // Check if history already exists for yesterday
          const histCheck = await fetch(`${API_BASE}/api/history/${yesterdayDateStr}`);
          let existingRecord = null;
          if (histCheck.ok) {
            existingRecord = await histCheck.json();
          }
          
          if (!existingRecord) {
            // Compile yesterday's data
            const sportItem = sportSchedule[yesterdayDayName] || { muscle: null, name: null, completed: false };
            const entItem = entertainmentSchedule[yesterdayDayName] || { title: null, type: null, genre: null, completed: false };
            const learnItem = learningSchedule[yesterdayDayName] || { subject: null, objective: null, hours: 0, minutes: 0, completed: false };
            const habitItem = habitsSchedule[yesterdayDayName] || { surah: null, onePlusActivity: null, completed: false };

            const historyPayload = {
              dayName: yesterdayDayName,
              sport: {
                muscle: sportItem.muscle,
                name: sportItem.name,
                completed: sportItem.completed
              },
              entertainment: {
                title: entItem.title,
                type: entItem.type,
                genre: entItem.genre,
                completed: entItem.completed
              },
              learning: {
                subject: learnItem.subject,
                objective: learnItem.objective,
                hours: learnItem.hours,
                minutes: learnItem.minutes,
                completed: learnItem.completed
              },
              habits: {
                surah: habitItem.surah,
                onePlusActivity: habitItem.onePlusActivity,
                completed: habitItem.completed
              },
              xpGained: 0
            };

            console.log(`Saving daily snapshot for ${yesterdayDateStr} (${yesterdayDayName})...`);
            await fetch(`${API_BASE}/api/history/${yesterdayDateStr}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(historyPayload)
            });
          }
        } catch (err) {
          console.error("Failed to save yesterday's history snapshot:", err);
        }

        // 2. Saturday Weekly Reset
        const todayDayName = getDayNameOfDate(todayDateStr);
        if (todayDayName === 'Saturday') {
          console.log("Saturday detected! Refreshing completion states...");

          // Reset frontend states locally
          setSportSchedule(prev => {
            const updated = {};
            Object.keys(prev).forEach(d => {
              updated[d] = { ...prev[d], completed: false };
            });
            return updated;
          });

          setEntertainmentSchedule(prev => {
            const updated = {};
            Object.keys(prev).forEach(d => {
              updated[d] = prev[d] ? { ...prev[d], completed: false } : null;
            });
            return updated;
          });

          setLearningSchedule(prev => {
            const updated = {};
            Object.keys(prev).forEach(d => {
              updated[d] = prev[d] ? { ...prev[d], completed: false } : null;
            });
            return updated;
          });

          setHabitsSchedule(prev => {
            const updated = {};
            Object.keys(prev).forEach(d => {
              updated[d] = prev[d] ? { ...prev[d], completed: false } : null;
            });
            return updated;
          });

          // Sync resets with backend
          const resetDAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
          try {
            await Promise.all([
              ...resetDAYS.map(day => {
                const sport = sportSchedule[day];
                if (sport) {
                  return fetch(`${API_BASE}/api/sport/${day}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...sport, completed: false })
                  });
                }
                return Promise.resolve();
              }),
              ...resetDAYS.map(day => {
                const ent = entertainmentSchedule[day];
                if (ent) {
                  return fetch(`${API_BASE}/api/entertainment/${day}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...ent, completed: false })
                  });
                }
                return Promise.resolve();
              }),
              ...resetDAYS.map(day => {
                const learn = learningSchedule[day];
                if (learn) {
                  return fetch(`${API_BASE}/api/learning/${day}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...learn, completed: false })
                  });
                }
                return Promise.resolve();
              }),
              ...resetDAYS.map(day => {
                const habit = habitsSchedule[day];
                if (habit) {
                  return fetch(`${API_BASE}/api/habits/${day}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...habit, completed: false })
                  });
                }
                return Promise.resolve();
              })
            ]);
            console.log("Weekly completions database reset complete.");
          } catch (err) {
            console.error("Failed to sync weekly resets with database:", err);
          }
        }

        // 3. Update lastActiveDate in userStats
        const updatedStats = { ...userStats, lastActiveDate: todayDateStr };
        setUserStats(updatedStats);

        try {
          await fetch(`${API_BASE}/api/stats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedStats)
          });
          console.log(`Updated lastActiveDate to ${todayDateStr}`);
        } catch (err) {
          console.error("Failed to update userStats date:", err);
        }
      }
    };

    runDailyAndWeeklyChecks();
  }, [loading]);

  // Sync userStats automatically whenever stats are updated (post-load)
  useEffect(() => {
    if (loading) return;

    const syncStats = async () => {
      try {
        await fetch(API_BASE + '/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userStats)
        });
      } catch (err) {
        console.error("Failed to sync user stats with database:", err);
      }
    };

    syncStats();
  }, [userStats, loading]);

  // XP progression and Level up checking
  const addXP = (amount) => {
    setUserStats(prev => {
      const newXp = prev.xp + amount;
      const currentLevel = prev.level;
      const xpNeeded = currentLevel * 300;
      
      if (newXp >= xpNeeded) {
        const excessXp = newXp - xpNeeded;
        const nextLevel = currentLevel + 1;
        
        setLevelUpData({ oldLevel: currentLevel, newLevel: nextLevel });
        
        let updatedAchievements = [...prev.unlockedAchievements];
        if (nextLevel >= 5 && !updatedAchievements.includes('level_five')) {
          updatedAchievements.push('level_five');
          const ach = ACHIEVEMENTS.find(a => a.id === 'level_five');
          setTimeout(() => {
            setRecentAchievement(ach);
            addXP(ach.xpAward);
          }, 3000);
        }

        return {
          ...prev,
          xp: excessXp,
          level: nextLevel,
          unlockedAchievements: updatedAchievements
        };
      }
      
      return { ...prev, xp: newXp };
    });

    triggerAchievementCheck('first_step');
  };

  const triggerAchievementCheck = (id) => {
    setUserStats(prev => {
      if (prev.unlockedAchievements.includes(id)) return prev;
      
      const ach = ACHIEVEMENTS.find(a => a.id === id);
      if (!ach) return prev;

      setRecentAchievement(ach);
      
      setTimeout(() => {
        addXP(ach.xpAward);
      }, 500);

      return {
        ...prev,
        unlockedAchievements: [...prev.unlockedAchievements, id]
      };
    });
  };

  // Sport Planner Actions
  const updateSportWorkout = async (day, muscle, name) => {
    const updatedWorkout = { ...sportSchedule[day], muscle, name };
    setSportSchedule(prev => ({
      ...prev,
      [day]: updatedWorkout
    }));

    try {
      await fetch(`${API_BASE}/api/sport/${day}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWorkout)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSportWorkoutCompleted = async (day) => {
    const item = sportSchedule[day];
    const nextCompleted = !item.completed;
    const updatedWorkout = { ...item, completed: nextCompleted };

    setSportSchedule(prev => ({
      ...prev,
      [day]: updatedWorkout
    }));
    
    if (nextCompleted) {
      setTimeout(() => addXP(100), 50);
      
      const totalCompleted = Object.values({ ...sportSchedule, [day]: updatedWorkout })
        .filter(w => w.completed && w.muscle !== 'Rest').length;
      if (totalCompleted >= 6) {
        setTimeout(() => triggerAchievementCheck('beast_mode'), 1000);
      }
    }

    try {
      await fetch(`${API_BASE}/api/sport/${day}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWorkout)
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Entertainment Planner Actions
  const updateEntertainment = async (day, data) => {
    setEntertainmentSchedule(prev => ({
      ...prev,
      [day]: data
    }));

    try {
      await fetch(`${API_BASE}/api/entertainment/${day}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data === null ? { title: null } : data)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleEntertainmentCompleted = async (day) => {
    const item = entertainmentSchedule[day];
    if (!item) return;
    const nextCompleted = !item.completed;
    const updatedItem = { ...item, completed: nextCompleted };

    setEntertainmentSchedule(prev => ({
      ...prev,
      [day]: updatedItem
    }));

    if (nextCompleted) {
      setTimeout(() => addXP(30), 50);
      
      const scheduleWithUpdate = { ...entertainmentSchedule, [day]: updatedItem };
      const completedMovies = Object.values(scheduleWithUpdate)
        .filter(e => e && e.completed && e.type === 'movie').length;
      const completedGames = Object.values(scheduleWithUpdate)
        .filter(e => e && e.completed && e.type === 'game').length;
      
      if (completedMovies >= 3) {
        setTimeout(() => triggerAchievementCheck('cinephile'), 1000);
      }
      if (completedGames >= 3) {
        setTimeout(() => triggerAchievementCheck('hardcore_gamer'), 1000);
      }
    }

    try {
      await fetch(`${API_BASE}/api/entertainment/${day}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addToWatchlist = async (item) => {
    const newItem = { ...item, id: Date.now() };
    setWatchlist(prev => [...prev, newItem]);

    try {
      await fetch(API_BASE + '/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromWatchlist = async (id) => {
    setWatchlist(prev => prev.filter(w => w.id !== id));

    try {
      await fetch(`${API_BASE}/api/watchlist/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Learning Planner Actions
  const updateLearning = async (day, data) => {
    setLearningSchedule(prev => ({
      ...prev,
      [day]: data
    }));

    try {
      await fetch(`${API_BASE}/api/learning/${day}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data === null ? { subject: null } : data)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLearningCompleted = async (day) => {
    const item = learningSchedule[day];
    if (!item) return;
    const nextCompleted = !item.completed;
    const updatedItem = { ...item, completed: nextCompleted };

    setLearningSchedule(prev => ({
      ...prev,
      [day]: updatedItem
    }));

    if (nextCompleted) {
      setTimeout(() => addXP(80), 50);
    }

    try {
      await fetch(`${API_BASE}/api/learning/${day}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addLearningMinutes = async (day, minutes) => {
    const item = learningSchedule[day] || { subject: 'Self Learning', objective: 'Deep Focus', hours: 0, completed: false };
    const newMinutes = (item.minutes || 0) + minutes;
    const additionalHours = parseFloat((minutes / 60).toFixed(2));
    const newHours = parseFloat(((item.hours || 0) + additionalHours).toFixed(2));
    const updatedItem = { ...item, minutes: newMinutes, hours: newHours };

    setLearningSchedule(prev => ({
      ...prev,
      [day]: updatedItem
    }));

    // Trigger XP allocation
    setTimeout(() => addXP(minutes), 50);

    const allLearning = { ...learningSchedule, [day]: updatedItem };
    const cumulativeMinutes = Object.values(allLearning).reduce((acc, curr) => acc + (curr?.minutes || 0), 0);
    if (cumulativeMinutes >= 120) {
      setTimeout(() => triggerAchievementCheck('deep_work'), 1000);
    }

    try {
      await fetch(`${API_BASE}/api/learning/${day}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Quran & Habits Actions
  const updateHabitsWorkout = async (day, surah, onePlusActivity) => {
    const updatedHabit = { surah, onePlusActivity, completed: habitsSchedule[day]?.completed || false };
    setHabitsSchedule(prev => ({
      ...prev,
      [day]: updatedHabit
    }));

    try {
      await fetch(`${API_BASE}/api/habits/${day}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedHabit)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleHabitCompleted = async (day) => {
    const item = habitsSchedule[day];
    if (!item) return;
    const nextCompleted = !item.completed;
    const updatedHabit = { ...item, completed: nextCompleted };

    setHabitsSchedule(prev => ({
      ...prev,
      [day]: updatedHabit
    }));

    if (nextCompleted) {
      // Award XP (50 XP for Quran Surah + OnePlus completion)
      setTimeout(() => addXP(50), 50);
    }

    try {
      await fetch(`${API_BASE}/api/habits/${day}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedHabit)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const resetWeeklyData = async () => {
    const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    setSportSchedule(DEFAULT_SPORT_SCHEDULE);
    setEntertainmentSchedule(DEFAULT_ENTERTAINMENT_SCHEDULE);
    setLearningSchedule(DEFAULT_LEARNING_SCHEDULE);
    setHabitsSchedule(DEFAULT_HABITS_SCHEDULE);
    setUserStats(prev => ({
      ...prev,
      streak: prev.streak + 1
    }));
    
    // Trigger reset sequences on the backend
    try {
      await Promise.all([
        ...DAYS.map(day => fetch(`${API_BASE}/api/sport/${day}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...DEFAULT_SPORT_SCHEDULE[day], completed: false })
        })),
        ...DAYS.map(day => fetch(`${API_BASE}/api/entertainment/${day}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: null })
        })),
        ...DAYS.map(day => fetch(`${API_BASE}/api/learning/${day}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject: null })
        })),
        ...DAYS.map(day => fetch(`${API_BASE}/api/habits/${day}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ surah: null })
        }))
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppContext.Provider value={{
      sportSchedule,
      updateSportWorkout,
      toggleSportWorkoutCompleted,
      entertainmentSchedule,
      updateEntertainment,
      toggleEntertainmentCompleted,
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      learningSchedule,
      updateLearning,
      toggleLearningCompleted,
      addLearningMinutes,
      habitsSchedule,
      updateHabitsWorkout,
      toggleHabitCompleted,
      userStats,
      addXP,
      triggerAchievementCheck,
      resetWeeklyData,
      levelUpData,
      setLevelUpData,
      recentAchievement,
      setRecentAchievement,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};
