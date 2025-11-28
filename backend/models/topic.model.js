const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String },
  html: { type: String, required: true }, // Detailed content
  subtopics: [
    {
      id: String,
      title: String,
      content: String
    }
  ],
  keyPoints: [String], // For flashcards
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Topic', topicSchema);
