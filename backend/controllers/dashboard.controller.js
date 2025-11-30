const QuizResult = require("../models/quizResult.model");

exports.getDashboard = async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.user.userId });

    let totalScore = 0;
    let totalQuestions = 0;
    let topicMap = {};

    results.forEach(r => {
      totalScore += r.score;
      totalQuestions += r.total;

      if (!topicMap[r.topicId]) {
        topicMap[r.topicId] = {
          attempts: 0,
          totalScore: 0,
          totalQuestions: 0
        };
      }

      topicMap[r.topicId].attempts++;
      topicMap[r.topicId].totalScore += r.score;
      topicMap[r.topicId].totalQuestions += r.total;
    });

    const attemptedTopics = Object.keys(topicMap).map(topicId => {
      const t = topicMap[topicId];
      const percent = Math.round((t.totalScore / t.totalQuestions) * 100);

      return {
        id: topicId,
        title: topicId.replace(/-/g, " "),
        score: percent,
        attempts: t.attempts,
        weak: percent < 75
      };
    });

    const weakAreas = attemptedTopics
      .filter(t => t.weak)
      .map(t => t.id);

    const accuracy = totalQuestions
      ? Math.round((totalScore / totalQuestions) * 100)
      : 0;

    res.json({
      totalScore,
      accuracy,
      topicsStudied: attemptedTopics.length,
      quizzesTaken: results.length,
      streak: 1, // can later calculate
      weakAreas,
      attemptedTopics
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard error" });
  }
};
