require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

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

// === AI QUIZ SYSTEM START ===
const Topic = require('./models/topic.model'); // NEW

const questionsStore = {};
const userStats = {};

const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

// NEW: Get all topics
app.get('/api/topics', async (req, res) => {
  try {
    const topics = await Topic.find({}, { html: 0 });
    res.json(topics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// UPDATED: Get single topic from MongoDB
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

// Generate questions using Hugging Face AI
async function generateQuestionsFromText(topicContent, weakAreas = []) {
  if (!HF_TOKEN) {
    console.error('Missing HUGGINGFACE_TOKEN in .env');
    throw new Error('AI service not configured');
  }

  const prompt = `Generate 5 multiple choice questions from this text. Return ONLY JSON:
{"questions":[{"id":"q1","text":"...","options":["A","B","C","D"],"correctIndex":0,"subtopicKey":"components"}]}

Content: ${topicContent}

Weak areas: ${weakAreas.join(', ') || 'none'}`;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 400, temperature: 0.7 }
      })
    });

    const data = await response.json();
    const text = Array.isArray(data) && data[0]?.generated_text ? data[0].generated_text : JSON.stringify(data);
    
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('Invalid AI response format');
    
    const jsonString = text.slice(start, end + 1);
    const parsed = JSON.parse(jsonString);
    return parsed.questions || [];
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
}

// Generate quiz for topic
app.post('/api/quiz/generate', async (req, res) => {
  const { topicId, userId = 'anonymous' } = req.body;
  
  try {
    const topic = await Topic.findOne({ id: topicId }); // UPDATED: From MongoDB
    if (!topic) return res.status(404).json({ error: 'Topic not found' });

    const statsKey = `${userId}_${topicId}`;
    const stats = userStats[statsKey] || { weakAreas: [] };
    
    const questions = await generateQuestionsFromText(topic.html, stats.weakAreas);
    
    questions.forEach((q, i) => {
      if (!q.id) q.id = `q_${Date.now()}_${i}`;
    });
    
    questionsStore[topicId] = questions;
    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

// Submit quiz results
app.post('/api/quiz/submit', (req, res) => {
  const { topicId, userId = 'anonymous', answers } = req.body;
  
  const questions = questionsStore[topicId];
  if (!questions) return res.status(400).json({ error: 'No questions found' });

  let correct = 0;
  const wrongSubtopics = {};

  answers.forEach(ans => {
    const q = questions.find(qq => qq.id === ans.questionId);
    if (!q) return;
    
    if (ans.selectedIndex === q.correctIndex) {
      correct++;
    } else if (q.subtopicKey) {
      wrongSubtopics[q.subtopicKey] = (wrongSubtopics[q.subtopicKey] || 0) + 1;
    }
  });

  const weakAreas = Object.keys(wrongSubtopics);
  
  const statsKey = `${userId}_${topicId}`;
  const prevStats = userStats[statsKey] || { correct: 0, total: 0, weakAreas: [] };
  userStats[statsKey] = {
    correct: prevStats.correct + correct,
    total: prevStats.total + questions.length,
    weakAreas: weakAreas.length ? weakAreas : prevStats.weakAreas
  };

  res.json({
    score: correct,
    total: questions.length,
    weakAreas,
    suggestions: weakAreas.map(w => `Review: ${w}`)
  });
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
