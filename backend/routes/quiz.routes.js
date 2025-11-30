const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const quizController = require("../controllers/quiz.controller");

// ✅ Protected route
router.post("/submit", auth, quizController.submitQuiz);

module.exports = router;   // ✅ THIS LINE PREVENTS YOUR SERVER CRASH
