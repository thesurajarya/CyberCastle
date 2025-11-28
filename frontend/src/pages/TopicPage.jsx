import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FlashcardTopics from "../components/FlashcardTopics";
import QuizPanel from "../components/quiz/QuizPanel";

function TopicPage() {
  const { topicId } = useParams();
  const [topicContent, setTopicContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/topics/${topicId}`)
      .then(res => res.json())
      .then(data => {
        setTopicContent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [topicId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-300">
      <p className="text-xl">Loading topic...</p>
    </div>
  );

  if (!topicContent) return (
    <div className="min-h-screen flex items-center justify-center text-gray-300">
      <p className="text-xl">Topic not found</p>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Title */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent mb-6">
            {topicContent.title}
          </h1>
        </div>

        {/* Detailed Content Section */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
          <div 
            dangerouslySetInnerHTML={{ __html: topicContent.html }} 
            className="prose prose-invert max-w-none text-gray-200 leading-relaxed space-y-4"
          />
        </section>

        {/* Flashcards Section */}
        <section className="space-y-8">
          <h2 className="text-4xl font-bold text-white text-center">📚 Quick Revision</h2>
          <FlashcardTopics />
        </section>

        {/* Quiz Section */}
        <section className="space-y-8 pb-16">
          <h2 className="text-4xl font-bold text-white text-center">🧠 Test Yourself</h2>
          <QuizPanel topicId={topicId} />
        </section>

      </div>
    </div>
  );
}

export default TopicPage;
