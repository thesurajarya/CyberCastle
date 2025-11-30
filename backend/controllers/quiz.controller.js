const QuizResult = require("../models/quizResult.model");

// ✅ SUBMIT QUIZ & SAVE RESULT
exports.submitQuiz = async (req, res) => {
  try {
    const { topicId, answers, score, total, weakAreas } = req.body;

    const result = await QuizResult.create({
      user: req.userId,   // ✅ FIXED (from auth middleware)
      topicId,
      score,
      total,
      weakAreas
    });

    res.json({
      success: true,
      result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Quiz saving failed" });
  }
};
