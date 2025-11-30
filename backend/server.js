require('dotenv').config();
require("./cron/dailyNews");
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const chatbotRoutes = require("./routes/chatbot.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));
const dashboardRoutes = require("./routes/dashboard.routes");
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/quiz", require("./routes/quiz.routes"));
app.use("/api/newsletter", require("./routes/newsletter.routes"));
app.use("/api/chatbot", chatbotRoutes);


const Topic = require('./models/topic.model');
const { topicQuestions, questionsStore, userStats } = require('./quizStore');

// Helper: shuffle array
function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Get all topics (for listing)
app.get('/api/topics', async (req, res) => {
  try {
    const topics = await Topic.find({}, { html: 0 });
    res.json(topics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// Get single topic
app.get('/api/topics/:id', async (req, res) => {
  try {
    const topic = await Topic.findOne({ id: req.params.id });
    if (!topic) return res.status(404).json({ error: 'Topic not found' });
    res.json(topic);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch topic' });
  }
});

// Generate quiz - random 5 questions, with 1–2 fill-in-the-blank if available
app.post('/api/quiz/generate', async (req, res) => {
  const { topicId, userId = 'anonymous', mode = 'normal' } = req.body;
  
  try {
    console.log('🔍 Quiz Generate Called');
    console.log('Topic ID:', topicId);
    
    const topic = await Topic.findOne({ id: topicId });
    if (!topic) return res.status(404).json({ error: 'Topic not found' });

    let pool = topicQuestions[topicId] || topicQuestions['network-attacks'];
    if (!pool || pool.length === 0) {
      return res.status(400).json({ error: 'No questions available for this topic' });
    }

    // If revision mode: try to restrict pool to weak subtopics
    if (mode === 'revision') {
      const statsKey = `${userId}_${topicId}`;
      const stats = userStats[statsKey];
      const weakSet = new Set(stats?.weakAreas || []);
      const filtered = pool.filter(q => weakSet.has(q.subtopicKey));
      if (filtered.length > 0) {
        pool = filtered;
      }
    }

    const mcqs = pool.filter(q => q.type === 'mcq');
    const fills = pool.filter(q => q.type === 'fill');

    const desiredTotal = 5;
    const maxFill = Math.min(2, fills.length);
    const minFill = fills.length > 0 ? 1 : 0;
    const fillCount = Math.min(maxFill, Math.max(minFill, 1));

    const chosenFills = fills.sort(() => Math.random() - 0.5).slice(0, fillCount);
    const remaining = desiredTotal - chosenFills.length;
    const chosenMcqs = mcqs.sort(() => Math.random() - 0.5).slice(0, remaining);

    const selected = [...chosenFills, ...chosenMcqs].sort(() => Math.random() - 0.5);

    questionsStore[topicId] = selected;
    console.log(`✅ Selected ${selected.length} questions for ${topicId}`);

    res.json({ questions: selected });
  } catch (error) {
    console.error('❌ Quiz error:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});



// Submit quiz results
// Expect answers like: { questionId, selected } 
// - MCQ: selected is a number (option index)
// - FILL: selected is a string (typed answer)
// Submit quiz results
// Frontend sends answers: { questionId, selected }
// - MCQ: selected is a number (option index)
// - FILL: selected is a string (typed answer)
app.post('/api/quiz/submit', (req, res) => {
  const { topicId, userId = 'anonymous', answers } = req.body;
  
  const questions = questionsStore[topicId];
  if (!questions) return res.status(400).json({ error: 'No questions found' });

  let correct = 0;
  const wrongSubtopics = {};

  answers.forEach(ans => {
    const q = questions.find(qq => qq.id === ans.questionId);
    if (!q) return;

    let isCorrect = false;

    if (q.type === 'mcq') {
      // selected is option index
      isCorrect = ans.selected === q.correctIndex;
    } else if (q.type === 'fill') {
      const given = String(ans.selected || '').trim().toLowerCase();
      const expectedArray = Array.isArray(q.answer)
        ? q.answer.map(a => String(a).trim().toLowerCase())
        : [String(q.answer).trim().toLowerCase()];
      isCorrect = expectedArray.includes(given);
    }

    if (isCorrect) {
      correct++;
    } else if (q.subtopicKey) {
      wrongSubtopics[q.subtopicKey] = (wrongSubtopics[q.subtopicKey] || 0) + 1;
    }
  });

  const weakAreas = Object.keys(wrongSubtopics);
  
  const statsKey = `${userId}_${topicId}`;
  const prevStats = userStats[statsKey] || { correct: 0, total: 0, weakAreas: [], subtopicStats: {} };

  // Update per-topic & per-subtopic stats
  userStats[statsKey] = {
    correct: prevStats.correct + correct,
    total: prevStats.total + questions.length,
    weakAreas: weakAreas.length ? weakAreas : prevStats.weakAreas,
    subtopicStats: {
      ...(prevStats.subtopicStats || {}),
      ...Object.fromEntries(
        Object.entries(wrongSubtopics).map(([key, value]) => {
          const prev = (prevStats.subtopicStats || {})[key] || { wrong: 0, seen: 0 };
          return [key, {
            wrong: prev.wrong + value,
            seen: prev.seen + value
          }];
        })
      )
    }
  };

  // Mastery tracking: ≥80% counts as a pass
  const passedThisQuiz = (correct / questions.length) >= 0.8;
  const masteryKey = `${userId}_${topicId}_mastery`;
  const prevMastery = userStats[masteryKey] || { passes: 0 };
  userStats[masteryKey] = {
    passes: prevMastery.passes + (passedThisQuiz ? 1 : 0)
  };

  res.json({
    score: correct,
    total: questions.length,
    weakAreas,
    suggestions: weakAreas.map(w => `Review subtopic: ${w}`)
  });
});

// Get per-topic stats (including subtopicStats)
app.get('/api/progress/:userId/:topicId', (req, res) => {
  const { userId, topicId } = req.params;
  const statsKey = `${userId}_${topicId}`;
  const stats = userStats[statsKey] || { correct: 0, total: 0, weakAreas: [], subtopicStats: {} };

  res.json(stats);
});

// Get mastery info for all topics for a user
app.get('/api/mastery/:userId', (req, res) => {
  const { userId } = req.params;
  const result = {};

  Object.keys(userStats).forEach(key => {
    if (key.startsWith(`${userId}_`) && key.endsWith('_mastery')) {
      const topicId = key.slice(userId.length + 1, -('_mastery'.length));
      const { passes } = userStats[key];
      result[topicId] = { passes, mastered: passes >= 3 };
    }
  });

  res.json(result);
});



// === AI QUIZ SYSTEM END ===

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
