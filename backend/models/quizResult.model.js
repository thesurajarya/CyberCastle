const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  topicId: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  weakAreas: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("QuizResult", quizResultSchema);
