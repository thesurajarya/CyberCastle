import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFire, FaTrophy, FaChartLine, FaBook } from "react-icons/fa";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, use mock data. Later connect to backend
    const mockUser = {
      name: "Alex Engineer",
      totalScore: 3450,
      topicsStudied: 6,
      quizzesTaken: 12,
      streak: 7,
      accuracy: 82,
      weakAreas: ["sql-injection", "csrf-attacks"],
      attemptedTopics: [
        {
          id: "network-attacks",
          title: "Network Attacks",
          score: 85,
          attempts: 2,
          weak: false
        },
        {
          id: "web-application-attacks",
          title: "Web Application Attacks",
          score: 78,
          attempts: 2,
          weak: true
        },
        {
          id: "authentication-attacks",
          title: "Authentication Attacks",
          score: 92,
          attempts: 1,
          weak: false
        },
        {
          id: "social-engineering",
          title: "Social Engineering",
          score: 88,
          attempts: 3,
          weak: false
        },
        {
          id: "malware",
          title: "Malware",
          score: 81,
          attempts: 2,
          weak: true
        },
        {
          id: "wireless-attacks",
          title: "Wireless Attacks",
          score: 76,
          attempts: 1,
          weak: true
        }
      ]
    };
    
    setUserData(mockUser);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400 mb-4 mx-auto"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        
        {/* Welcome Section */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Welcome back, <span className="text-cyan-400">{userData?.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-gray-400 text-lg">Continue your cybersecurity learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Score */}
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-300 font-semibold">Total Score</h3>
              <FaTrophy className="text-2xl text-yellow-400" />
            </div>
            <p className="text-4xl font-bold text-white">{userData?.totalScore}</p>
            <p className="text-sm text-cyan-300 mt-2">XP Earned</p>
          </div>

          {/* Card 2: Accuracy */}
          <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-300 font-semibold">Accuracy</h3>
              <FaChartLine className="text-2xl text-green-400" />
            </div>
            <p className="text-4xl font-bold text-white">{userData?.accuracy}%</p>
            <p className="text-sm text-green-300 mt-2">Quiz Performance</p>
          </div>

          {/* Card 3: Streak */}
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-300 font-semibold">Streak</h3>
              <FaFire className="text-2xl text-orange-400" />
            </div>
            <p className="text-4xl font-bold text-white">{userData?.streak}</p>
            <p className="text-sm text-orange-300 mt-2">Days Active</p>
          </div>

          {/* Card 4: Topics */}
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-300 font-semibold">Topics</h3>
              <FaBook className="text-2xl text-purple-400" />
            </div>
            <p className="text-4xl font-bold text-white">{userData?.topicsStudied}</p>
            <p className="text-sm text-purple-300 mt-2">Studied</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Attempted Topics */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Your Progress</h2>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                {userData?.attemptedTopics.map((topic) => (
                  <Link
                    key={topic.id}
                    to={`/topic/${topic.id}`}
                    className="group block p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all hover:border-cyan-400/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {topic.attempts} attempt{topic.attempts > 1 ? 's' : ''}
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        {topic.weak && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
                            <span className="text-xs font-semibold text-red-300">Weak Area</span>
                          </div>
                        )}
                        
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">{topic.score}%</p>
                          <div className="w-20 h-2 bg-white/10 rounded-full mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                topic.score >= 85
                                  ? 'bg-green-500'
                                  : topic.score >= 75
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${topic.score}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Weak Areas & Continue Learning */}
          <div className="space-y-6">
            
            {/* Weak Areas */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">⚠️</span> Focus Areas
              </h3>
              <div className="space-y-2">
                {userData?.weakAreas.map((area) => {
                  const topic = userData.attemptedTopics.find(t => t.id === area);
                  return (
                    <Link
                      key={area}
                      to={`/topic/${area}`}
                      className="block p-3 bg-red-500/10 border border-red-500/30 hover:border-red-400/50 rounded-lg transition-all text-sm text-red-200 hover:text-red-100"
                    >
                      {topic?.title}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Continue Learning */}
            <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4">Continue Learning</h3>
              <Link
                to="/topics"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-lg font-semibold text-white transition-all shadow-lg"
              >
                <span>📚</span> Explore Topics
              </Link>
            </div>

            {/* Achievements */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4">Achievements</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <span className="text-2xl">🏆</span>
                  <p className="text-xs text-gray-300 mt-1">Starter</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <span className="text-2xl">⭐</span>
                  <p className="text-xs text-gray-300 mt-1">5-Day Streak</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <span className="text-2xl">🎯</span>
                  <p className="text-xs text-gray-300 mt-1">80% Accuracy</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg opacity-50">
                  <span className="text-2xl">🌟</span>
                  <p className="text-xs text-gray-400 mt-1">Locked</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
