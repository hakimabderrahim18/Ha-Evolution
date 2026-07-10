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

const DEFAULT_YOUTUBE_SCHEDULE = {
  Saturday: null, Sunday: null, Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null
};

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
  const [todayHistory, setTodayHistory] = useState(null);
  const [youtubeSchedule, setYoutubeSchedule] = useState(DEFAULT_YOUTUBE_SCHEDULE);
  const [goalsList, setGoalsList] = useState([]);

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
          fetchResource(API_BASE + '/api/goals', setGoalsList, 'goals'),
          fetchResource(API_BASE + '/api/youtube', setYoutubeSchedule, 'youtube'),
          fetchResource(API_BASE + '/api/habits', setHabitsSchedule, 'habits'),
          fetchResource(API_BASE + '/api/history/' + getLocalDateString(), setTodayHistory, 'todayHistory')
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

    const initializeTodayHistory = async (dateStr) => {
    const todayDayName = getDayNameOfDate(dateStr);
    const sport = sportSchedule[todayDayName] || { muscle: 'Rest', name: 'Stretching', completed: false };
    const ent = entertainmentSchedule[todayDayName];
    const learn = learningSchedule[todayDayName];
    const habit = habitsSchedule[todayDayName];
    const yt = youtubeSchedule[todayDayName];

    const payload = {
      dayName: todayDayName,
      sport: {
        muscle: sport.muscle,
        name: sport.name,
        completed: sport.completed
      },
      entertainment: ent ? {
        title: ent.title,
        type: ent.type,
        genre: ent.genre,
        completed: ent.completed
      } : { title: null, type: 'movie', genre: null, completed: false },
      learning: learn ? {
        subject: learn.subject,
        objective: learn.objective,
        hours: learn.hours,
        minutes: learn.minutes,
        completed: learn.completed
      } : { subject: null, objective: null, hours: 0, minutes: 0, completed: false },
      habits: habit ? {
        surah: habit.surah,
        onePlusActivity: habit.onePlusActivity,
        completed: habit.completed
      } : { surah: null, onePlusActivity: null, completed: false },
      youtube: yt ? {
        title: yt.title,
        completed: yt.completed
      } : { title: "", completed: false },
      grooming: { brushAM: false, brushPM: false, skincare: false, shower: false, floss: false },
      prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
      xpGained: 0
    };

    try {
      const res = await fetch(`${API_BASE}/api/history/${dateStr}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setTodayHistory(data);
        console.log(`Initialized today's history record for ${dateStr}`);
      }
    } catch (err) {
      print("Failed to initialize today's history:", err)
    }
  };

  const syncTodayHistoryField = async (field, subValue) => {
    // If todayHistory is not loaded yet, fetch it or do nothing
    let currentHistory = todayHistory;
    const todayDateStr = getLocalDateString();
    if (!currentHistory) {
      try {
        const res = await fetch(`${API_BASE}/api/history/${todayDateStr}`);
        if (res.ok) {
          currentHistory = await res.json();
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (!currentHistory) return;

    const updated = {
      ...currentHistory,
      [field]: subValue
    };
    setTodayHistory(updated);

    try {
      await fetch(`${API_BASE}/api/history/${todayDateStr}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error("Failed to auto-sync today's history:", err);
    }
  };

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
            const youtubeItem = youtubeSchedule[yesterdayDayName] || { title: "", completed: false };

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
              youtube: {
                title: youtubeItem.title,
                completed: youtubeItem.completed
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

          setYoutubeSchedule(prev => {
            const updated = {};
            Object.keys(prev).forEach(d => {
              updated[d] = prev[d] ? { ...prev[d], completed: false } : null;
            });
            return updated;
          });

          // Archive completed weekly goals on Saturday
          const completedGoals = goalsList.filter(g => g.completed && !g.archived);
          Promise.all(completedGoals.map(g => fetch(`${API_BASE}/api/goals/${g._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...g, archived: true, completedAt: new Date() })
          })))
            .then(async () => {
              const res = await fetch(`${API_BASE}/api/goals`);
              if (res.ok) {
                const freshGoals = await res.json();
                setGoalsList(freshGoals);
              }
              console.log("Archived completed weekly goals on Saturday reset.");
            })
            .catch(err => console.error("Failed to archive completed weekly goals:", err));

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
              }),
              ...resetDAYS.map(day => {
                const ytItem = youtubeSchedule[day];
                if (ytItem) {
                  return fetch(`${API_BASE}/api/youtube/${day}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...ytItem, completed: false })
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
    const todayDayName = getDayNameOfDate(getLocalDateString());
    if (day === todayDayName) {
      syncTodayHistoryField('sport', { muscle, name, completed: updatedWorkout.completed });
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
    const todayDayName = getDayNameOfDate(getLocalDateString());
    if (day === todayDayName) {
      syncTodayHistoryField('sport', { muscle, name, completed: updatedWorkout.completed });
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
    const todayDayName = getDayNameOfDate(getLocalDateString());
    if (day === todayDayName) {
      syncTodayHistoryField('entertainment', data ? { title: data.title, type: data.type, genre: data.genre, completed: data.completed } : { title: null, type: 'movie', genre: null, completed: false });
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
    const todayDayName = getDayNameOfDate(getLocalDateString());
    if (day === todayDayName) {
      syncTodayHistoryField('entertainment', { title: updatedItem.title, type: updatedItem.type, genre: updatedItem.genre, completed: nextCompleted });
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
    const todayDayName = getDayNameOfDate(getLocalDateString());
    if (day === todayDayName) {
      syncTodayHistoryField('learning', data ? { subject: data.subject, objective: data.objective, hours: data.hours, minutes: data.minutes, completed: data.completed } : { subject: null, objective: null, hours: 0, minutes: 0, completed: false });
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
    const todayDayName = getDayNameOfDate(getLocalDateString());
    if (day === todayDayName) {
      syncTodayHistoryField('learning', { subject: updatedItem.subject, objective: updatedItem.objective, hours: updatedItem.hours, minutes: updatedItem.minutes, completed: nextCompleted });
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
    const todayDayName = getDayNameOfDate(getLocalDateString());
    if (day === todayDayName) {
      syncTodayHistoryField('learning', { subject: updatedItem.subject, objective: updatedItem.objective, hours: updatedItem.hours, minutes: updatedItem.minutes, completed: nextCompleted });
    }
  };

  // Quran & Habits Actions
  const toggleTodayPrayer = async (prayerKey) => {
    if (!todayHistory) return;
    const nextVal = !todayHistory.prayers?.[prayerKey];
    if (nextVal) {
      setTimeout(() => addXP(10), 50);
    }
    const updated = {
      ...todayHistory,
      prayers: {
        ...todayHistory.prayers,
        [prayerKey]: nextVal
      }
    };
    setTodayHistory(updated);
    try {
      await fetch(`${API_BASE}/api/history/${getLocalDateString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTodayGrooming = async (groomingKey) => {
    if (!todayHistory) return;
    const nextVal = !todayHistory.grooming?.[groomingKey];
    const prospectiveGrooming = {
      ...todayHistory.grooming,
      [groomingKey]: nextVal
    };
    const allCompletedBefore = Object.values(todayHistory.grooming || {}).every(Boolean);
    const allCompletedNow = Object.values(prospectiveGrooming).every(Boolean);
    if (allCompletedNow && !allCompletedBefore) {
      setTimeout(() => addXP(25), 50);
    }
    const updated = {
      ...todayHistory,
      grooming: prospectiveGrooming
    };
    setTodayHistory(updated);
    try {
      await fetch(`${API_BASE}/api/history/${getLocalDateString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateTodayYoutube = async (title, completed) => {
    if (!todayHistory) return;
    const nextCompleted = completed && !todayHistory.youtube?.completed;
    if (nextCompleted) {
      setTimeout(() => addXP(30), 50);
    }
    const updated = {
      ...todayHistory,
      youtube: { title, completed }
    };
    setTodayHistory(updated);
    try {
      await fetch(`${API_BASE}/api/history/${getLocalDateString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateYoutubeSchedule = async (day, data) => {
    setYoutubeSchedule(prev => ({
      ...prev,
      [day]: data
    }));

    try {
      await fetch(`${API_BASE}/api/youtube/${day}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data === null ? { title: "" } : data)
      });
    } catch (err) {
      console.error(err);
    }
    const todayDayName = getDayNameOfDate(getLocalDateString());
    if (day === todayDayName) {
      syncTodayHistoryField('youtube', data ? { title: data.title, completed: data.completed } : { title: "", completed: false });
    }
  };

  const toggleYoutubeCompleted = async (day) => {
    const item = youtubeSchedule[day];
    if (!item) return;
    const nextCompleted = !item.completed;
    const updatedItem = { ...item, completed: nextCompleted };

    setYoutubeSchedule(prev => ({
      ...prev,
      [day]: updatedItem
    }));

    if (nextCompleted) {
      setTimeout(() => addXP(30), 50);
    }

    try {
      await fetch(`${API_BASE}/api/youtube/${day}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
    } catch (err) {
      console.error(err);
    }
    const todayDayName = getDayNameOfDate(getLocalDateString());
    if (day === todayDayName) {
      syncTodayHistoryField('youtube', { title: updatedItem.title, completed: nextCompleted });
    }
  };

  const addGoal = async (title, category, xpReward) => {
    const payload = { title, category, xpReward: Number(xpReward) || 150, completed: false };
    try {
      const res = await fetch(`${API_BASE}/api/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newGoal = await res.json();
        setGoalsList(prev => [...prev, newGoal]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleGoalCompleted = async (id) => {
    const goal = goalsList.find(g => g._id === id);
    if (!goal) return;
    const nextCompleted = !goal.completed;
    if (nextCompleted) {
      setTimeout(() => addXP(goal.xpReward || 150), 50);
    }
    const updatedGoal = { ...goal, completed: nextCompleted };
    setGoalsList(prev => prev.map(g => g._id === id ? updatedGoal : g));
    try {
      await fetch(`${API_BASE}/api/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGoal)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const removeGoal = async (id) => {
    setGoalsList(prev => prev.filter(g => g._id !== id));
    try {
      await fetch(`${API_BASE}/api/goals/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error(err);
    }
  };

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
    const todayDayName = getDayNameOfDate(getLocalDateString());
    if (day === todayDayName) {
      syncTodayHistoryField('habits', { surah, onePlusActivity, completed: updatedHabit.completed });
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
    const todayDayName = getDayNameOfDate(getLocalDateString());
    if (day === todayDayName) {
      syncTodayHistoryField('habits', { surah, onePlusActivity, completed: updatedHabit.completed });
    }
  };

  const manuallyResetWeeklyCompletions = async () => {
    // 1. Reset locally
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

    setYoutubeSchedule(prev => {
      const updated = {};
      Object.keys(prev).forEach(d => {
        updated[d] = prev[d] ? { ...prev[d], completed: false } : null;
      });
      return updated;
    });

    // Archive completed weekly goals
    const manualCompletedGoals = goalsList.filter(g => g.completed && !g.archived);
    try {
      await Promise.all(manualCompletedGoals.map(g => fetch(`${API_BASE}/api/goals/${g._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...g, archived: true, completedAt: new Date() })
      })));
      const res = await fetch(`${API_BASE}/api/goals`);
      if (res.ok) {
        const freshGoals = await res.json();
        setGoalsList(freshGoals);
      }
    } catch (err) {
      console.error(err);
    }

    // 2. Sync resets with backend database
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
        }),
        ...resetDAYS.map(day => {
          const ytItem = youtubeSchedule[day];
          if (ytItem) {
            return fetch(`${API_BASE}/api/youtube/${day}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...ytItem, completed: false })
            });
          }
          return Promise.resolve();
        })
      ]);
      console.log("Manual weekly completions reset sync complete.");
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
    setYoutubeSchedule(DEFAULT_YOUTUBE_SCHEDULE);
    
    // Archive completed weekly goals
    const manualCompletedGoals = goalsList.filter(g => g.completed && !g.archived);
    Promise.all(manualCompletedGoals.map(g => fetch(`${API_BASE}/api/goals/${g._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...g, archived: true, completedAt: new Date() })
    })))
      .then(async () => {
        const res = await fetch(`${API_BASE}/api/goals`);
        if (res.ok) {
          const freshGoals = await res.json();
          setGoalsList(freshGoals);
        }
      })
      .catch(err => console.error(err));

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
        })),
        ...DAYS.map(day => fetch(`${API_BASE}/api/youtube/${day}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: "" })
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
      todayHistory,
      toggleTodayPrayer,
      toggleTodayGrooming,
      updateTodayYoutube,
      youtubeSchedule,
      updateYoutubeSchedule,
      toggleYoutubeCompleted,
      goalsList,
      addGoal,
      toggleGoalCompleted,
      removeGoal,
      manuallyResetWeeklyCompletions,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};
