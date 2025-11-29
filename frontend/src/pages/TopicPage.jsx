import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuizPanel from "../components/quiz/QuizPanel";
import Flashcard from "../components/Flashcards/Flashcard";

function TopicPage() {
  const { topicId } = useParams();
  const [topicContent, setTopicContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [progress, setProgress] = useState(null);

  // Load topic content
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

  // Load per-topic progress (for subtopic dots)
  useEffect(() => {
    fetch(`http://localhost:5001/api/progress/anonymous/${topicId}`)
      .then(res => res.json())
      .then(setProgress)
      .catch(() => setProgress(null));
  }, [topicId]);

  const getSubtopicStatus = (subId) => {
    const s = progress?.subtopicStats?.[subId];
    if (!s || s.seen === 0) return "neutral";
    const accuracy = 1 - s.wrong / s.seen;
    if (accuracy >= 0.8) return "good";
    if (accuracy >= 0.5) return "medium";
    return "bad";
  };

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

        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Subtopics */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4">Chapters</h3>
              <div className="space-y-2">
                {topicContent.subtopics?.map((sub) => {
                  const status = getSubtopicStatus(sub.id);
                  const dotColor =
                    status === "good"
                      ? "bg-emerald-400"
                      : status === "medium"
                      ? "bg-amber-400"
                      : status === "bad"
                      ? "bg-red-500"
                      : "bg-gray-500/40";

                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubtopic(sub)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium ${
                        selectedSubtopic?.id === sub.id
                          ? "bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-500/20"
                          : "text-gray-300 hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                        <span className="truncate">{sub.title}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Overview Section */}
            {!selectedSubtopic && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                <h2 className="text-3xl font-bold text-white mb-6">Overview</h2>
                <div
                  dangerouslySetInnerHTML={{ __html: topicContent.html }}
                  className="prose prose-invert max-w-none text-gray-200 space-y-4 leading-relaxed"
                />
              </div>
            )}

            {/* Subtopic Content */}
            {selectedSubtopic && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
                  <h2 className="text-4xl font-bold text-cyan-300 mb-2">{selectedSubtopic.title}</h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-8"></div>
                  
                  <div
                    dangerouslySetInnerHTML={{ __html: selectedSubtopic.content }}
                    className="prose prose-invert max-w-none text-gray-200 space-y-4 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Real World Analogy */}
            {topicContent.realWorldAnalogy && (
              <div className="bg-amber-500/10 border border-amber-400/40 rounded-3xl p-6 md:p-8 space-y-3">
                <h3 className="text-2xl font-bold text-amber-300 flex items-center gap-2">
                  <span>💡</span> Real‑World Analogy
                </h3>
                <div
                  dangerouslySetInnerHTML={{ __html: topicContent.realWorldAnalogy }}
                  className="prose prose-invert max-w-none text-amber-100"
                />
              </div>
            )}

            {/* Memory Hooks (italic key phrases) */}
            {topicContent.memoryHooks?.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3">
                <h3 className="text-xl font-semibold text-white">Memory Hooks</h3>
                <ul className="space-y-2">
                  {topicContent.memoryHooks.map((hook, i) => (
                    <li key={i} className="text-gray-200 italic">• {hook}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Points */}
            {!selectedSubtopic && topicContent.keyPoints && (
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
          </div>
        </div>

        {/* History / Timeline Bubbles */}
        {topicContent.discoveryTimeline?.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-bold text-white mb-4">History & Timeline</h3>
            <div className="flex flex-wrap gap-4">
              {topicContent.discoveryTimeline.map((event, i) => (
                <div
                  key={i}
                  className="px-4 py-3 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-purple-500/10 border border-cyan-400/30 min-w-[180px]"
                >
                  <div className="text-sm font-semibold text-cyan-300">{event.year}</div>
                  <div className="text-white text-sm">{event.label}</div>
                  <div className="text-gray-300 text-xs mt-1">{event.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quiz Section */}
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
