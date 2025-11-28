import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function TopicsListPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/topics")
      .then(res => res.json())
      .then(data => {
        setTopics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-300 mt-20">
      <p className="text-xl">Loading topics...</p>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-12 text-center">
          All Cybersecurity Topics
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/topic/${topic.id}`}
              className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/20 hover:border-cyan-400/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer group"
            >
              <h3 className="text-2xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300 transition-colors">
                {topic.title}
              </h3>
              <p className="text-gray-300 mb-4 line-clamp-2">{topic.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {topic.subtopics?.length || 0} subtopics
                </span>
                <span className="text-cyan-400 group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

        {topics.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No topics available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopicsListPage;
