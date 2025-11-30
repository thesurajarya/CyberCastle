import React, { useState } from "react";

function QuizPanel({ topicId = "network-attacks", userId = "anonymous" }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState({});

  const loadQuiz = async () => {
    setLoading(true);
    setFinished(false);
    setResult(null);
    setAnswers({});
    setCurrent(0);
    setAnswered(false);
    setCorrectAnswers({});

    try {
      console.log("🔍 Fetching quiz for topic:", topicId);

      const res = await fetch("http://localhost:5001/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ REQUIRED
        },
        body: JSON.stringify({ topicId }), // ✅ VALID PAYLOAD
      });

      console.log("🔍 Response status:", res.status);
      const data = await res.json();
      console.log("🔍 Response data:", data);

      if (!res.ok) {
        alert(data?.error || "Failed to generate quiz!");
        setQuestions([]);
      } else if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        alert("No questions returned for this topic.");
      }
    } catch (e) {
      console.error("❌ Fetch error:", e);
      alert("Failed to load quiz!");
    }

    setLoading(false);
  };

  // For MCQ, optionIndex is a number
  const handleOptionSelect = (questionId, optionIndex) => {
    if (answered) return; // Prevent changing answer after submission
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    
    // Find the current question and check if answer is correct
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const isCorrect = optionIndex === question.correctIndex;
      setCorrectAnswers((prev) => ({ ...prev, [questionId]: isCorrect }));
      setAnswered(true);
    }
  };

  // For FILL, store string
  const handleFillChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleFillSubmit = (questionId) => {
    if (answered) return;
    
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const userAnswer = (answers[questionId] || "").trim().toLowerCase();
      // Handle both single answer string and array of acceptable answers
      const expectedArray = Array.isArray(question.answer)
        ? question.answer.map(a => String(a).trim().toLowerCase())
        : [String(question.answer).trim().toLowerCase()];
      const isCorrect = expectedArray.includes(userAnswer);
      
      setCorrectAnswers((prev) => ({ ...prev, [questionId]: isCorrect }));
      setAnswered(true);
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setAnswered(false);
    }
  };
  const handlePrev = () => current > 0 && setCurrent((c) => c - 1);

  const handleSubmit = async () => {
    if (!questions.length) return;
    setLoading(true);

    try {
      // ✅ CREATE PAYLOAD PROPERLY
      const payload = {
        topicId,
        answers: questions.map((q) => ({
          questionId: q.id,
          selected:
            q.type === "mcq"
              ? typeof answers[q.id] === "number"
                ? answers[q.id]
                : -1
              : typeof answers[q.id] === "string"
              ? answers[q.id]
              : "",
        })),
      };

      console.log("📤 Submitting quiz payload:", payload);

      const res = await fetch("http://localhost:5001/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ REQUIRED
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("📥 Submit response:", data);

      if (!res.ok) {
        console.error("❌ Quiz submit error:", data);
        alert(data?.message || "Failed to submit quiz!");
      } else {
        setResult(data);
        setFinished(true);
      }
    } catch (e) {
      console.error("❌ Submit catch error:", e);
      alert("Failed to submit quiz!");
    }

    setLoading(false);
  };

  if (loading && questions.length === 0) {
    return (
      <p className="text-center text-gray-300 text-lg">
        Generating your quiz...
      </p>
    );
  }

  const currentQuestion = questions[current];

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm text-gray-100 max-w-3xl mx-auto">
      {questions.length === 0 && !finished && (
        <div className="text-center">
          <p className="text-gray-300 mb-6">
            Generate questions based on this topic and test your understanding.
          </p>
          <button
            onClick={loadQuiz}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-bold shadow-lg transition-all text-lg"
          >
            🎯 Generate Quiz
          </button>
        </div>
      )}

      {questions.length > 0 && !finished && currentQuestion && (
        <>
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>
                Question {current + 1} of {questions.length}
              </span>
              <span>
                {Math.round(((current + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${((current + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-8">
            {currentQuestion.text}
          </h3>

          {/* MCQ vs Fill-in-the-blank */}
          {currentQuestion.type === "fill" ? (
            <div className="mb-10">
              <div className="flex gap-2">
                <input
                  type="text"
                  className={`flex-1 px-4 py-3 rounded-xl bg-white/5 border-2 text-gray-100 focus:outline-none transition-all ${
                    answered
                      ? correctAnswers[currentQuestion.id]
                        ? "border-green-500 bg-green-500/5"
                        : "border-red-500 bg-red-500/5"
                      : "border-white/20 focus:border-cyan-400"
                  }`}
                  placeholder="Type your answer here..."
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) =>
                    handleFillChange(currentQuestion.id, e.target.value)
                  }
                  disabled={answered}
                />
                {!answered && (
                  <button
                    type="button"
                    onClick={() => handleFillSubmit(currentQuestion.id)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-all whitespace-nowrap"
                  >
                    Check
                  </button>
                )}
              </div>
              {answered && (
                <p className={`mt-2 text-sm font-medium ${
                  correctAnswers[currentQuestion.id]
                    ? "text-green-400"
                    : "text-red-400"
                }`}>
                  {correctAnswers[currentQuestion.id]
                    ? "Correct!"
                    : `Incorrect. Correct answer: ${Array.isArray(currentQuestion.answer) ? currentQuestion.answer.join(' / ') : currentQuestion.answer}`}
                </p>
              )}
              {!answered && (
                <p className="mt-2 text-sm text-gray-400">
                  The blank in the sentence is shown as "______" in the question
                  text.
                </p>
              )}
            </div>
          ) : (
            <ul className="space-y-4 mb-10">
              {currentQuestion.options?.map((opt, idx) => {
                const qid = currentQuestion.id;
                const selected = answers[qid] === idx;
                const isCorrectOption = idx === currentQuestion.correctIndex;
                
                let optionClasses = "px-6 py-4 rounded-xl border-2 cursor-pointer transition-all font-medium ";
                
                if (!answered) {
                  optionClasses += selected
                    ? "bg-blue-600/80 border-blue-400 shadow-lg shadow-blue-500/30"
                    : "bg-white/5 hover:bg-white/10 border-white/20 hover:shadow-md hover:cursor-pointer";
                } else {
                  if (isCorrectOption) {
                    optionClasses += "bg-green-500/15 border-green-500 shadow-lg shadow-green-500/15";
                  } else if (selected && !isCorrectOption) {
                    optionClasses += "bg-red-500/15 border-red-500 shadow-lg shadow-red-500/15";
                  } else {
                    optionClasses += "bg-white/5 border-white/20 opacity-60";
                  }
                }
                
                return (
                  <li
                    key={idx}
                    onClick={() => !answered && handleOptionSelect(qid, idx)}
                    className={optionClasses}
                  >
                    {opt}
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <button
              onClick={handlePrev}
              disabled={current === 0}
              className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 disabled:opacity-40 hover:bg-white/10 font-medium transition-all"
            >
              Previous
            </button>
            <span className="text-gray-400">
              {current + 1} / {questions.length}
            </span>
            {current < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!answered}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 font-medium shadow-lg transition-all"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!answered}
                className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-40 font-bold shadow-lg transition-all text-white"
              >
                ✓ Submit Quiz
              </button>
            )}
          </div>
        </>
      )}

      {finished && result && (
        <div className="text-center space-y-8">
          <div>
            <p className="text-6xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text mb-2">
              {result.score}/{result.total}
            </p>
            <p className="text-2xl font-semibold text-gray-200">
              {Math.round((result.score / result.total) * 100)}% Correct
            </p>
          </div>

          <div className="text-lg text-gray-300">
            {result.score === result.total && (
              <p>🎉 Perfect Score! Amazing work!</p>
            )}
            {result.score >= result.total * 0.8 &&
              result.score < result.total && (
                <p>✨ Great job! You're doing well.</p>
              )}
            {result.score >= result.total * 0.6 &&
              result.score < result.total * 0.8 && (
                <p>👍 Good effort! Keep practicing.</p>
              )}
            {result.score < result.total * 0.6 && (
              <p>💪 Keep learning! You'll improve.</p>
            )}
          </div>

          {result.weakAreas?.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <p className="font-bold text-red-300 mb-3">
                📌 Topics to Review:
              </p>
              <ul className="space-y-2 text-left">
                {result.weakAreas.map((area) => (
                  <li key={area} className="text-red-200">
                    • {area}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestions?.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <p className="font-bold text-blue-300 mb-3">💡 Suggestions:</p>
              <ul className="space-y-2 text-left">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-blue-200">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={loadQuiz}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-bold shadow-lg transition-all text-lg w-full"
          >
            🔄 Take Another Quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizPanel;
