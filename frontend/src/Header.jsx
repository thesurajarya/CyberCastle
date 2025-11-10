import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm";
import ProfileDropdown from "./ProfileDropdown";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const navItems = [
    "Home",
    "About",
    "Projects",
    "Services",
    "Contact",
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0b0f2a]/80 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(2,12,27,0.7)] border-b border-indigo-500/20"
          : "bg-transparent py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 md:py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#home"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 text-3xl font-extrabold tracking-tight"
        >
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]">
            TheCyberCastle
          </span>
        </motion.a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8 lg:space-x-12 text-gray-300 font-medium items-center">
          {navItems.map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative group py-2"
              whileHover={{ scale: 1.05, color: "#fff" }}
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_8px_rgba(103,232,249,0.8)]">
                {item}
              </span>
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(168,85,247,0.6)]"></span>
            </motion.a>
          ))}

          {/* Profile Dropdown or Login Button */}
          {user ? (
            <ProfileDropdown user={user} onLogout={() => setUser(null)} />
          ) : (
            <motion.button
              onClick={() => setShowLogin(true)}
              className="relative group py-2 bg-transparent border-none text-gray-300 cursor-pointer hover:text-cyan-400 transition"
              whileHover={{ scale: 1.05, color: "#fff" }}
            >
              Login
            </motion.button>
          )}
        </nav>

        {/* Mobile Toggle Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden relative z-10 text-2xl text-gray-200 p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaTimes className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaBars />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="md:hidden overflow-hidden bg-[#0b0f2a]/95 backdrop-blur-xl border-t border-indigo-500/30"
          >
            <nav className="flex flex-col items-center space-y-8 py-10">
              {navItems.map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  variants={menuItemVariants}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl text-gray-300 font-medium tracking-wider hover:text-cyan-400 transition-colors duration-300"
                >
                  {item}
                </motion.a>
              ))}

              {/* Mobile Profile or Login */}
              {user ? (
                <motion.div
                  variants={menuItemVariants}
                  className="w-full px-8"
                >
                  <ProfileDropdown user={user} onLogout={() => { setUser(null); setMenuOpen(false); }} />
                </motion.div>
              ) : (
                <motion.button
                  onClick={() => { setMenuOpen(false); setShowLogin(true); }}
                  variants={menuItemVariants}
                  className="text-2xl text-gray-300 font-medium tracking-wider hover:text-cyan-400 transition-colors duration-300"
                >
                  Login
                </motion.button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoginForm onClose={() => setShowLogin(false)} onLoginSuccess={(userData) => setUser(userData)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
