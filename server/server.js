import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import {
  SportWorkout,
  EntertainmentDay,
  WatchlistItem,
  LearningDay,
  UserStats,
  QuranHabit,
  DailyHistory
} from './models.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ha_life_evolution';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB database');
    seedDatabase();
  })
  .catch(err => {
    console.error('MongoDB database connection error:', err);
  });

// Default Week Days list starting on Saturday
const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const DEFAULT_SPORT = {
  Saturday: { muscle: 'Core', name: 'Planks & Hanging Leg Raises' },
  Sunday: { muscle: 'Rest', name: 'Active Recovery & Stretching' },
  Monday: { muscle: 'Chest', name: 'Barbell Bench Press & Flyes' },
  Tuesday: { muscle: 'Back', name: 'Deadlifts & Lat Pulldowns' },
  Wednesday: { muscle: 'Shoulders', name: 'Overhead Press & Lateral Raises' },
  Thursday: { muscle: 'Arms', name: 'Bicep Curls & Tricep Pushdowns' },
  Friday: { muscle: 'Legs', name: 'Squats & Bulgarian Split Squats' }
};

const DEFAULT_HABIT = {
  Saturday: { surah: 'Surah Al-Mulk', onePlusActivity: 'Feed a bird/stray animal' },
  Sunday: { surah: 'Surah Sajdah', onePlusActivity: 'Call a relative / check on family' },
  Monday: { surah: 'Surah Al-Fatihah & Al-Mulk', onePlusActivity: 'Dhikr 100x' },
  Tuesday: { surah: 'Surah Yaseen', onePlusActivity: 'Give Charity' },
  Wednesday: { surah: 'Surah Al-Waqiah', onePlusActivity: 'Help someone in need' },
  Thursday: { surah: 'Surah Ar-Rahman', onePlusActivity: 'Read 1 Islamic Article' },
  Friday: { surah: 'Surah Al-Kahf', onePlusActivity: 'Send blessings (Salawat) 100x' }
};

// Seed database with default schedules if collection is empty
async function seedDatabase() {
  try {
    // 1. Seed Sport
    const sportCount = await SportWorkout.countDocuments();
    if (sportCount === 0) {
      console.log('Seeding default sport workouts...');
      for (const day of DAYS) {
        await SportWorkout.create({
          day,
          muscle: DEFAULT_SPORT[day].muscle,
          name: DEFAULT_SPORT[day].name,
          completed: false
        });
      }
    }

    // 2. Seed Entertainment
    const entCount = await EntertainmentDay.countDocuments();
    if (entCount === 0) {
      console.log('Seeding default entertainment schedule...');
      for (const day of DAYS) {
        await EntertainmentDay.create({
          day,
          title: null,
          type: null,
          genre: null,
          duration: null,
          rating: 0,
          completed: false
        });
      }
    }

    // 3. Seed Learning
    const learnCount = await LearningDay.countDocuments();
    if (learnCount === 0) {
      console.log('Seeding default learning schedule...');
      for (const day of DAYS) {
        await LearningDay.create({
          day,
          subject: null,
          objective: null,
          minutes: 0,
          hours: 0,
          completed: false
        });
      }
    }

    // 4. Seed User Stats
    const statsCount = await UserStats.countDocuments();
    if (statsCount === 0) {
      console.log('Seeding default user stats...');
      await UserStats.create({
        xp: 120,
        level: 1,
        streak: 3,
        lastActiveDate: new Date().toISOString().split('T')[0],
        unlockedAchievements: []
      });
    }

    // 5. Seed Quran & Habits
    const habitCount = await QuranHabit.countDocuments();
    if (habitCount === 0) {
      console.log('Seeding default Quran and Habits schedule...');
      for (const day of DAYS) {
        await QuranHabit.create({
          day,
          surah: DEFAULT_HABIT[day].surah,
          onePlusActivity: DEFAULT_HABIT[day].onePlusActivity,
          completed: false
        });
      }
    }
    
    console.log('Database seeding complete / verified.');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

// REST API Endpoints

// 1. Sport Planner Routes
app.get('/api/sport', async (req, res) => {
  try {
    const workouts = await SportWorkout.find({});
    const schedule = {};
    workouts.forEach(w => {
      schedule[w.day] = { muscle: w.muscle, name: w.name, completed: w.completed };
    });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sport/:day', async (req, res) => {
  try {
    const { muscle, name, completed } = req.body;
    const workout = await SportWorkout.findOneAndUpdate(
      { day: req.params.day },
      { $set: { muscle, name, completed } },
      { new: true, upsert: true }
    );
    res.json(workout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Entertainment Routes
app.get('/api/entertainment', async (req, res) => {
  try {
    const days = await EntertainmentDay.find({});
    const schedule = {};
    days.forEach(d => {
      schedule[d.day] = d.title ? {
        title: d.title,
        type: d.type,
        genre: d.genre,
        duration: d.duration,
        rating: d.rating,
        completed: d.completed
      } : null;
    });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/entertainment/:day', async (req, res) => {
  try {
    const { title, type, genre, duration, rating, completed } = req.body;
    
    const updateObj = title === null ? {
      title: null, type: null, genre: null, duration: null, rating: 0, completed: false
    } : {
      title, type, genre, duration, rating, completed
    };

    const entDay = await EntertainmentDay.findOneAndUpdate(
      { day: req.params.day },
      { $set: updateObj },
      { new: true, upsert: true }
    );
    res.json(entDay);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Watchlist Routes
app.get('/api/watchlist', async (req, res) => {
  try {
    const items = await WatchlistItem.find({});
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/watchlist', async (req, res) => {
  try {
    const { id, title, type, genre, duration, rating } = req.body;
    const item = await WatchlistItem.create({ id, title, type, genre, duration, rating });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/watchlist/:id', async (req, res) => {
  try {
    const result = await WatchlistItem.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!result) return res.status(404).json({ error: 'Watchlist item not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Learning Routes
app.get('/api/learning', async (req, res) => {
  try {
    const days = await LearningDay.find({});
    const schedule = {};
    days.forEach(d => {
      schedule[d.day] = d.subject ? {
        subject: d.subject,
        objective: d.objective,
        minutes: d.minutes,
        hours: d.hours,
        completed: d.completed
      } : null;
    });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/learning/:day', async (req, res) => {
  try {
    const { subject, objective, minutes, hours, completed } = req.body;
    const updateObj = subject === null ? {
      subject: null, objective: null, minutes: 0, hours: 0, completed: false
    } : {
      subject, objective, minutes, hours, completed
    };

    const learnDay = await LearningDay.findOneAndUpdate(
      { day: req.params.day },
      { $set: updateObj },
      { new: true, upsert: true }
    );
    res.json(learnDay);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. User Stats Routes
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await UserStats.findOne({});
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/stats', async (req, res) => {
  try {
    const { xp, level, streak, lastActiveDate, unlockedAchievements } = req.body;
    const stats = await UserStats.findOneAndUpdate(
      {},
      { $set: { xp, level, streak, lastActiveDate, unlockedAchievements } },
      { new: true }
    );
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Quran & Habits Routes
app.get('/api/habits', async (req, res) => {
  try {
    const habits = await QuranHabit.find({});
    const schedule = {};
    habits.forEach(h => {
      schedule[h.day] = h.surah ? {
        surah: h.surah,
        onePlusActivity: h.onePlusActivity,
        completed: h.completed
      } : null;
    });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/habits/:day', async (req, res) => {
  try {
    const { surah, onePlusActivity, completed } = req.body;
    const updateObj = surah === null ? {
      surah: null, onePlusActivity: null, completed: false
    } : {
      surah, onePlusActivity, completed
    };

    const habit = await QuranHabit.findOneAndUpdate(
      { day: req.params.day },
      { $set: updateObj },
      { new: true, upsert: true }
    );
    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. History Routes
app.get('/api/history', async (req, res) => {
  try {
    const history = await DailyHistory.find({}).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/history/:date', async (req, res) => {
  try {
    const record = await DailyHistory.findOne({ date: req.params.date });
    res.json(record || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/history/:date', async (req, res) => {
  try {
    const { dayName, sport, entertainment, learning, habits, youtube, grooming, prayers, xpGained } = req.body;
    const record = await DailyHistory.findOneAndUpdate(
      { date: req.params.date },
      { $set: { dayName, sport, entertainment, learning, habits, youtube, grooming, prayers, xpGained } },
      { new: true, upsert: true }
    );
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server Start Listener
app.listen(PORT, () => {
  console.log(`HA Life Evolution Server is active on port ${PORT}`);
});
