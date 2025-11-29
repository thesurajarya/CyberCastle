import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuizPanel from "../components/quiz/QuizPanel";
import Flashcard from "../components/Flashcards/Flashcard";

function TopicPage() {
  const { topicId } = useParams();
  const [topicContent, setTopicContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5001/api/topics/${topicId}`)
      .then((res) => res.json())
      .then((data) => {
        setTopicContent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [topicId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300 mt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400 mb-4"></div>
          <p className="text-xl">Loading topic...</p>
        </div>
      </div>
    );
  }

  if (!topicContent) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300 mt-20">
        <p className="text-xl">Topic not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20">
      <div className="max-w-6xl mx-auto px-4 space-y-14">

        {/* HEADER */}
        <div className="space-y-4">
          <div className="inline-flex items-center px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
            <span className="text-sm font-semibold text-cyan-400">
              📚 Learning Path
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
            {topicContent.title}
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
            {topicContent.description}
          </p>

          <div className="flex gap-6 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <span className="text-gray-300">
                {topicContent.subtopics?.length || 0} Subtopics
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span className="text-gray-300">
                {topicContent.keyPoints?.length || 0} Key Points
              </span>
            </div>
          </div>
        </div>

        {/* TOPIC OVERVIEW */}
        {topicContent.html && (
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-6">Overview</h2>
            <div
              dangerouslySetInnerHTML={{ __html: topicContent.html }}
              className="prose prose-invert max-w-none text-gray-200 space-y-4 leading-relaxed"
            />
          </div>
        )}

        {/* ✅ FLASHCARD SUBTOPICS GRID */}
        <div>
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            🧠 Subtopics Flashcards
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {topicContent.subtopics?.map((sub) => (
              <Flashcard
                key={sub.id || sub._id}
                title={sub.title}
                content={sub.content}
              />
            ))}
          </div>
        </div>

        {/* KEY POINTS */}
        {topicContent.keyPoints && (
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">⭐</span> Key Takeaways
            </h3>
            <ul className="space-y-3">
              {topicContent.keyPoints.map((point, idx) => (
                <li key={idx} className="flex gap-3 text-gray-200">
                  <span className="text-cyan-400 font-bold mt-1">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* QUIZ SECTION */}
        <div className="border-t border-white/10 pt-12">
          <div className="space-y-4 mb-8">
            <h2 className="text-4xl font-bold text-white">
              Test Your Knowledge
            </h2>
            <p className="text-gray-300">
              Take our adaptive quiz to check your understanding
            </p>
          </div>

          <QuizPanel topicId={topicId} />
        </div>

      </div>
    </div>
  );
}

export default TopicPage;
