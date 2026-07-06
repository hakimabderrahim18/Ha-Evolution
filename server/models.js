import mongoose from 'mongoose';

const SportWorkoutSchema = new mongoose.Schema({
  day: { type: String, required: true, unique: true },
  muscle: { type: String, required: true },
  name: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const EntertainmentDaySchema = new mongoose.Schema({
  day: { type: String, required: true, unique: true },
  title: { type: String, default: null },
  type: { type: String, default: null }, // movie or game
  genre: { type: String, default: null },
  duration: { type: String, default: null },
  rating: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }
});

const WatchlistItemSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  genre: { type: String, required: true },
  duration: { type: String, required: true },
  rating: { type: Number, default: 0 }
});

const LearningDaySchema = new mongoose.Schema({
  day: { type: String, required: true, unique: true },
  subject: { type: String, default: null },
  objective: { type: String, default: null },
  minutes: { type: Number, default: 0 },
  hours: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }
});

const UserStatsSchema = new mongoose.Schema({
  xp: { type: Number, default: 120 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 3 },
  lastActiveDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  unlockedAchievements: { type: [String], default: [] }
});

const QuranHabitSchema = new mongoose.Schema({
  day: { type: String, required: true, unique: true },
  surah: { type: String, default: null },
  onePlusActivity: { type: String, default: null },
  completed: { type: Boolean, default: false }
});

const DailyHistorySchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // YYYY-MM-DD
  dayName: { type: String, required: true },
  sport: {
    muscle: { type: String, default: null },
    name: { type: String, default: null },
    completed: { type: Boolean, default: false }
  },
  entertainment: {
    title: { type: String, default: null },
    type: { type: String, default: null },
    genre: { type: String, default: null },
    completed: { type: Boolean, default: false }
  },
  learning: {
    subject: { type: String, default: null },
    objective: { type: String, default: null },
    hours: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 },
    completed: { type: Boolean, default: false }
  },
  habits: {
    surah: { type: String, default: null },
    onePlusActivity: { type: String, default: null },
    completed: { type: Boolean, default: false }
  },
  youtube: {
    title: { type: String, default: "" },
    completed: { type: Boolean, default: false }
  },
  grooming: {
    brushAM: { type: Boolean, default: false },
    brushPM: { type: Boolean, default: false },
    skincare: { type: Boolean, default: false },
    shower: { type: Boolean, default: false },
    floss: { type: Boolean, default: false }
  },
  prayers: {
    fajr: { type: Boolean, default: false },
    dhuhr: { type: Boolean, default: false },
    asr: { type: Boolean, default: false },
    maghrib: { type: Boolean, default: false },
    isha: { type: Boolean, default: false }
  },
  xpGained: { type: Number, default: 0 }
});

const YoutubeScheduleSchema = new mongoose.Schema({
  day: { type: String, required: true, unique: true },
  title: { type: String, default: "" },
  channel: { type: String, default: "" },
  completed: { type: Boolean, default: false }
});

const GoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  xpReward: { type: Number, default: 150 },
  completed: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  completedAt: { type: Date }
});

export const SportWorkout = mongoose.model('SportWorkout', SportWorkoutSchema);
export const EntertainmentDay = mongoose.model('EntertainmentDay', EntertainmentDaySchema);
export const WatchlistItem = mongoose.model('WatchlistItem', WatchlistItemSchema);
export const LearningDay = mongoose.model('LearningDay', LearningDaySchema);
export const UserStats = mongoose.model('UserStats', UserStatsSchema);
export const QuranHabit = mongoose.model('QuranHabit', QuranHabitSchema);
export const DailyHistory = mongoose.model('DailyHistory', DailyHistorySchema);
export const YoutubeSchedule = mongoose.model('YoutubeSchedule', YoutubeScheduleSchema);
export const Goal = mongoose.model('Goal', GoalSchema);
