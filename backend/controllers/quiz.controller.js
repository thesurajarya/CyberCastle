const QuizResult = require("../models/quizResult.model");

exports.submitQuiz = async (req, res) => {
  try {
    const { topicId, answers } = req.body;

    const total = answers.length;

    // ✅ TEMP scoring logic (replace with your real answer check)
    let score = 0;
    answers.forEach(a => {
      if (a.selected !== -1 && a.selected !== "") score++;
    });

    const result = await QuizResult.create({
      user: req.user.userId,
      topicId,
      score,
      total,
      weakAreas: []
    });

    res.json({
      success: true,
      score,
      total,
      result
    });

  } catch (err) {
    console.error("Quiz Submit Error:", err);
    res.status(500).json({ message: "Quiz saving failed" });
  }
};
