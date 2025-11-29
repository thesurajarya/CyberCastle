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

// Pre-built questions for each topic
const topicQuestions = {
  'network-attacks': [
    { id: 'q1', text: 'What does DDoS stand for?', options: ['Domain Denial System', 'Distributed Denial of Service', 'Data Delivery Service', 'Digital Defense System'], correctIndex: 1, subtopicKey: 'ddos' },
    { id: 'q2', text: 'In a MITM attack, what happens?', options: ['Data is encrypted', 'Attacker intercepts communication', 'Connection is blocked', 'Firewall activated'], correctIndex: 1, subtopicKey: 'mitm' },
    { id: 'q3', text: 'What is DNS spoofing?', options: ['Email verification', 'Manipulating DNS responses', 'Password hashing', 'Token generation'], correctIndex: 1, subtopicKey: 'dns' },
    { id: 'q4', text: 'Which prevents network attacks?', options: ['Ignoring updates', 'Encryption and authentication', 'Disabling firewalls', 'Public networks'], correctIndex: 1, subtopicKey: 'prevention' },
    { id: 'q5', text: 'What is ARP spoofing?', options: ['Email spoofing', 'Manipulating ARP tables', 'Web spoofing', 'Phone spoofing'], correctIndex: 1, subtopicKey: 'arp' }
  ],
  'web-application-attacks': [
    { id: 'q1', text: 'What is SQL Injection?', options: ['Injecting CSS', 'Inserting malicious SQL', 'Injecting JavaScript', 'Injecting HTML'], correctIndex: 1, subtopicKey: 'sql' },
    { id: 'q2', text: 'XSS stands for?', options: ['XML Secure Shell', 'Cross-Site Scripting', 'Extra Security System', 'X Protocol'], correctIndex: 1, subtopicKey: 'xss' },
    { id: 'q3', text: 'How does CSRF work?', options: ['Steals cookies', 'Tricks authenticated users', 'Breaks encryption', 'Deletes data'], correctIndex: 1, subtopicKey: 'csrf' },
    { id: 'q4', text: 'Prevents SQL injection?', options: ['Strong passwords', 'Prepared statements', 'Firewalls', 'Encryption'], correctIndex: 1, subtopicKey: 'sql' },
    { id: 'q5', text: 'Prevents XSS?', options: ['Firewalls', 'Input validation', 'VPNs', 'Proxies'], correctIndex: 1, subtopicKey: 'xss' }
  ],
  'authentication-attacks': [
    { id: 'q1', text: 'What is brute force?', options: ['Physical attack', 'Trying all passwords', 'Social engineering', 'Malware'], correctIndex: 1, subtopicKey: 'brute' },
    { id: 'q2', text: 'MFA stands for?', options: ['Maximum File Access', 'Multi-Factor Authentication', 'Mobile First', 'Modified File'], correctIndex: 1, subtopicKey: 'mfa' },
    { id: 'q3', text: 'Credential stuffing is?', options: ['Creating passwords', 'Using leaked credentials', 'Forgetting passwords', 'Sharing passwords'], correctIndex: 1, subtopicKey: 'cred' },
    { id: 'q4', text: 'Prevents brute force?', options: ['Open passwords', 'Account lockout', 'Simple passwords', 'No auth'], correctIndex: 1, subtopicKey: 'brute' },
    { id: 'q5', text: 'What is phishing?', options: ['Real fishing', 'Login forms', 'Deceptive emails', 'Network fishing'], correctIndex: 1, subtopicKey: 'phish' }
  ],
  'social-engineering': [
    { id: 'q1', text: 'Social engineering exploits?', options: ['Hardware', 'Human psychology', 'Networks', 'Firewalls'], correctIndex: 1, subtopicKey: 'se' },
    { id: 'q2', text: 'Pretexting is?', options: ['Real scenario', 'Fabricated scenario', 'Real email', 'Fake password'], correctIndex: 1, subtopicKey: 'pretex' },
    { id: 'q3', text: 'Baiting involves?', options: ['Real offers', 'Infected USB drives', 'Real gifts', 'Real money'], correctIndex: 1, subtopicKey: 'bait' },
    { id: 'q4', text: 'Best defense against SE?', options: ['Firewall', 'User training', 'VPN', 'Antivirus'], correctIndex: 1, subtopicKey: 'defense' },
    { id: 'q5', text: 'Phishing red flag?', options: ['Valid sender', 'Professional format', 'Urgent language', 'Clear identity'], correctIndex: 1, subtopicKey: 'phish' }
  ],
  'malware': [
    { id: 'q1', text: 'Viruses need?', options: ['Internet', 'Host file', 'Network', 'Server'], correctIndex: 1, subtopicKey: 'virus' },
    { id: 'q2', text: 'Worms spread?', options: ['Slowly', 'Autonomously', 'Manually', 'By email only'], correctIndex: 1, subtopicKey: 'worm' },
    { id: 'q3', text: 'Ransomware does?', options: ['Steals data', 'Encrypts data for payment', 'Deletes files', 'Monitors activity'], correctIndex: 1, subtopicKey: 'ransom' },
    { id: 'q4', text: 'Trojans disguise as?', options: ['Viruses', 'Legitimate software', 'Emails', 'Links'], correctIndex: 1, subtopicKey: 'trojan' },
    { id: 'q5', text: 'Protects against malware?', options: ['Open networks', 'Antivirus and backups', 'Disabling updates', 'Public access'], correctIndex: 1, subtopicKey: 'protect' }
  ],
  'wireless-attacks': [
    { id: 'q1', text: 'Wi-Fi broadcast is?', options: ['Encrypted', 'Open signal', 'Secure', 'Private'], correctIndex: 1, subtopicKey: 'wifi' },
    { id: 'q2', text: 'WPA3 is?', options: ['Old standard', 'Latest standard', 'Outdated', 'Cracked'], correctIndex: 1, subtopicKey: 'wpa' },
    { id: 'q3', text: 'Evil twin is?', options: ['Real network', 'Fake Wi-Fi network', 'Secure network', 'Private network'], correctIndex: 1, subtopicKey: 'evil' },
    { id: 'q4', text: 'Protects wireless?', options: ['No encryption', 'VPN and encryption', 'Public Wi-Fi', 'No password'], correctIndex: 1, subtopicKey: 'protect' },
    { id: 'q5', text: 'Packet sniffing prevents?', options: ['Firewall only', 'HTTPS and VPN', 'No solution', 'Hidden SSID only'], correctIndex: 1, subtopicKey: 'sniff' }
  ],
  'basic-security-issues': [
    { id: 'q1', text: 'Strong password needs?', options: ['8 chars', '12+ chars mixed', '6 digits', 'Only letters'], correctIndex: 1, subtopicKey: 'pass' },
    { id: 'q2', text: 'Default credentials are?', options: ['Secure', 'Critical vulnerability', 'Optional', 'Random'], correctIndex: 1, subtopicKey: 'default' },
    { id: 'q3', text: 'Unpatched systems are?', options: ['Secure', 'Vulnerable to exploits', 'Updated', 'Protected'], correctIndex: 1, subtopicKey: 'patch' },
    { id: 'q4', text: 'Backups protect against?', options: ['Viruses only', 'Data loss', 'Firewalls', 'Passwords'], correctIndex: 1, subtopicKey: 'backup' },
    { id: 'q5', text: 'Regular updates prevent?', options: ['All attacks', 'Known vulnerabilities', 'Social engineering', 'Physical theft'], correctIndex: 1, subtopicKey: 'update' }
  ]
};

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

// Generate quiz - uses pre-built questions (no AI)
app.post('/api/quiz/generate', async (req, res) => {
  const { topicId, userId = 'anonymous' } = req.body;
  
  try {
    console.log('🔍 Quiz Generate Called');
    console.log('Topic ID:', topicId);
    
    const topic = await Topic.findOne({ id: topicId });
    if (!topic) return res.status(404).json({ error: 'Topic not found' });

    // Get pre-built questions for this topic
    const questions = topicQuestions[topicId] || topicQuestions['network-attacks'];
    
    if (!questions || questions.length === 0) {
      return res.status(400).json({ error: 'No questions available for this topic' });
    }

    // Shuffle questions order
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    
    questionsStore[topicId] = shuffled;
    console.log(`✅ Generated ${shuffled.length} questions for ${topicId}`);
    
    res.json({ questions: shuffled });
  } catch (error) {
    console.error('❌ Quiz error:', error);
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
