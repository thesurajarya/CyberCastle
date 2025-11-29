import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaShieldAlt,
  FaLock,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import TopicsModal from "./TopicsModal";

const Banner = () => {
  const [showTopics, setShowTopics] = useState(false);

  return (
    <section className="relative w-full mt-20 flex flex-col items-center justify-center py-24 overflow-hidden bg-[#050816]">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#ffffff12_1px,transparent_0)] bg-[size:36px_36px] opacity-20"></div>

      {/* Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-5xl text-center px-6">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
        >
          Welcome to{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            The Cyber Castle
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg sm:text-xl text-gray-300 mb-10 max-w-3xl mx-auto"
        >
          Learn cybersecurity, understand real-world threats, test your knowledge
          with interactive quizzes, and protect yourself in the digital world.
        </motion.p>

        {/* Feature Badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="flex items-center gap-2 px-4 py-2 bg-white/10 text-cyan-300 rounded-full border border-white/20">
            <FaShieldAlt /> Awareness
          </span>

          <span className="flex items-center gap-2 px-4 py-2 bg-white/10 text-purple-300 rounded-full border border-white/20">
            <FaLock /> Secure Learning
          </span>

          <span className="px-4 py-2 bg-white/10 text-gray-300 rounded-full border border-white/20">
            AI Quizzes
          </span>
        </motion.div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <Link to="/topics">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-cyan-500/40 transition-all"
            >
              🚀 Get Started
            </motion.button>
          </Link>

          <Link to="/topics">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white/10 text-white font-semibold rounded-full shadow-lg border border-white/20 backdrop-blur hover:bg-white/20 transition-all"
            >
              📚 Start Learning
            </motion.button>
          </Link>
        </div>

        {/* STATS SECTION */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-3xl font-bold text-cyan-400">50+</h3>
            <p className="text-gray-400 text-sm mt-1">Cyber Topics</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-3xl font-bold text-purple-400">100+</h3>
            <p className="text-gray-400 text-sm mt-1">Quizzes</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-3xl font-bold text-indigo-400">24/7</h3>
            <p className="text-gray-400 text-sm mt-1">Learning Access</p>
          </div>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          className="flex space-x-8 mt-14 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-white text-2xl hover:text-cyan-300 transition-all" />
          </a>

          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-white text-2xl hover:text-indigo-300 transition-all" />
          </a>

          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-white text-2xl hover:text-purple-300 transition-all" />
          </a>
        </motion.div>
      </div>

      {/* Topics Modal */}
      <TopicsModal isOpen={showTopics} onClose={() => setShowTopics(false)} />
    </section>
  );
};

export default Banner;
