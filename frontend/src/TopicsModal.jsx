import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaChevronDown, FaShieldAlt } from "react-icons/fa";

const TopicsModal = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const topicsStructure = {
    "Network Attacks": [
      "Phishing",
      "Ransomware",
      "Denial of Service (DoS/DDoS)",
      "Man-in-the-Middle (MitM)",
      "SQL Injection",
    ],
    "Web Application Attacks": [
      "Cross-Site Scripting (XSS)",
      "Cross-Site Request Forgery (CSRF)",
    ],
    "Authentication Attacks": [
      "Brute Force",
      "Credential Stuffing",
    ],
    "Social Engineering": [
      "Spear Phishing",
      "Pretexting",
    ],
    "Malware": [
      "Trojan Horses",
      "Keyloggers",
    ],
    "Wireless Attacks": [
      "Evil Twin",
    ],
    "Basic Security Issues": [
      "Weak Passwords",
      "Unpatched Software",
      "Misconfigured Systems",
      "Insecure Data Storage",
    ],
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleTopicClick = (section, topic) => {
    setSelectedSection(section);
    setSelectedTopic(topic);
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="flex h-screen w-screen">
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors z-20"
            >
              <FaTimes size={28} />
            </motion.button>

            {/* Left Sidebar */}
            <motion.div
              className="w-72 bg-[#0a0e24] border-r border-indigo-500/20 overflow-y-auto flex flex-col"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
            >
              {/* Sidebar Header */}
              <div className="sticky top-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 px-6 py-5 border-b border-indigo-500/30">
                <button
                  onClick={() => {
                    // Close modal and return to top/home
                    onClose && onClose();
                    if (typeof window !== "undefined") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="flex items-center gap-3"
                >
                  <span className="text-2xl font-extrabold tracking-tight">
                    <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]">
                      The Cyber Castle
                    </span>
                  </span>
                </button>
              </div>

              {/* Topics List */}
              <div className="flex-1 p-4 space-y-2">
                {Object.entries(topicsStructure).map(([section, topics]) => (
                  <motion.div
                    key={section}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Section Header */}
                    <motion.button
                      onClick={() => toggleSection(section)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 transition-all rounded-lg flex items-center justify-between text-white font-semibold text-sm"
                      whileHover={{ paddingLeft: "1.25rem" }}
                    >
                      <span className="text-left">{section}</span>
                      <motion.div
                        animate={{ rotate: expandedSections[section] ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FaChevronDown size={14} className="text-cyan-400" />
                      </motion.div>
                    </motion.button>

                    {/* Topics List */}
                    <AnimatePresence>
                      {expandedSections[section] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-2 mt-1 space-y-1 border-l-2 border-indigo-500/20">
                            {topics.map((topic) => (
                              <motion.button
                                key={topic}
                                onClick={() => handleTopicClick(section, topic)}
                                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                                  selectedTopic === topic && selectedSection === section
                                    ? "bg-gradient-to-r from-cyan-500/40 to-purple-500/40 text-white border-l-2 border-cyan-400"
                                    : "text-gray-400 hover:text-gray-300 hover:bg-indigo-500/10"
                                }`}
                                whileHover={{ x: 5 }}
                              >
                                {topic}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Main Content Area */}
            <motion.div
              className="flex-1 bg-[#0b0f2a] overflow-y-auto"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
            >
              {selectedTopic ? (
                <div className="max-w-4xl mx-auto px-8 py-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Breadcrumb */}
                    <div className="text-sm text-gray-400 mb-6">
                      {selectedSection} &gt; <span className="text-cyan-400">{selectedTopic}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent mb-8">
                      {selectedTopic}
                    </h1>

                    {/* Content Placeholder */}
                    <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-8 text-center">
                      <p className="text-xl text-gray-300 font-medium">
                        Content for this topic will be added soon.
                      </p>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <motion.div
                    className="text-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaShieldAlt className="text-cyan-400 mx-auto mb-4" size={56} />
                    <p className="text-gray-400 text-lg">Select a topic from the left to get started</p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopicsModal;
