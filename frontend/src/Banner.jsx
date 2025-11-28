import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom"; // NEW: Import Link for routing
import TopicsModal from "./TopicsModal";

const Banner = () => {
  const [showTopics, setShowTopics] = useState(false);

  return (
    <section className="w-full mt-20 flex flex-col items-center justify-center py-14 bg-gradient-to-r from-cyan-700 via-indigo-700 to-purple-700 shadow-lg">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-5xl font-bold text-white mb-4 drop-shadow-lg"
      >
        Welcome to The Cyber Castle
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-lg text-white/70 mb-8 text-center max-w-xl"
      >
        A modern landing page with smooth animations, interactive UI, and secure login. Explore our services or sign in to continue.
      </motion.p>

      {/* Button Group */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Original "Get Started" button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-cyan-400 text-white font-semibold rounded-full shadow-md hover:bg-purple-400 transition-colors focus:outline-none"
          onClick={() => setShowTopics(true)}
        >
          Get Started
        </motion.button>

        {/* NEW: Learn button - navigates to topic page */}
        <Link to="/topic/react-basics">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-indigo-500 text-white font-semibold rounded-full shadow-md hover:bg-indigo-600 transition-colors focus:outline-none"
          >
            📚 Start Learning
          </motion.button>
        </Link>
      </div>

      <motion.div
        className="flex space-x-6 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
          <FaGithub className="text-white text-2xl hover:text-cyan-300 transition-all"/>
        </a>
        <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="text-white text-2xl hover:text-indigo-300 transition-all"/>
        </a>
        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="text-white text-2xl hover:text-purple-300 transition-all"/>
        </a>
      </motion.div>
      <TopicsModal isOpen={showTopics} onClose={() => setShowTopics(false)} />
    </section>
  );
};

export default Banner;
