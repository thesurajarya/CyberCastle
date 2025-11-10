import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 60 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 25 } }
};

const errorVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
};

const shakeVariants = {
  idle: {},
  error: { x: [-3, 3, -3, 3, 0] }
};

const inputVariants = {
  focus: { scale: 1.03, boxShadow: "0 0 0 3px rgba(103,232,249,0.3)" },
  idle: { scale: 1, boxShadow: "none" }
};

const LoginForm = ({ onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState("login"); // 'login' or 'signup'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState("idle");
  const [focusField, setFocusField] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((mode === "signup" && !name) || !email || !password) {
      setError("Fill in all fields");
      setShake("error");
      setTimeout(() => setShake("idle"), 600);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const base = import.meta.env.VITE_API_URL || "";
      const url =
        mode === "signup"
          ? `${base}/api/auth/register`
          : `${base}/api/auth/login`;

      const body =
        mode === "signup"
          ? { username: name, email, password }
          : { email, password };

      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.message || "Request failed");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // Notify parent about successful login
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      }

      // Success UI: simple alert for now
      alert(mode === "signup" ? "Signed up!" : "Logged in!");
      onClose();
    } catch (err) {
      setError(err.message || "Request failed");
      setShake("error");
      setTimeout(() => setShake("idle"), 600);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
      >
        <motion.div
          className="bg-white rounded-xl p-8 shadow-2xl w-80 relative"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.h2
            className="text-2xl font-extrabold mb-8 text-center text-gradient bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 text-transparent bg-clip-text drop-shadow"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </motion.h2>
          <motion.form
  onSubmit={handleSubmit}
  variants={shakeVariants}
  animate={shake === "error" ? "error" : "idle"}
>

            <AnimatePresence>
              {mode === "signup" && (
                <motion.div
  initial="hidden"
  animate={shake === "error" ? "error" : "visible"}
  exit="hidden"
>

                  <FaUser className="mr-2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Name"
                    className="outline-none bg-transparent w-full text-gray-800"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onFocus={() => setFocusField("name")}
                    onBlur={() => setFocusField("")}
                    autoFocus={mode === "signup"}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              className={`flex items-center mb-6 px-3 py-2 rounded bg-gray-100 ${
                focusField === "email" ? "ring-2 ring-cyan-400" : ""
              }`}
              variants={inputVariants}
              animate={focusField === "email" ? "focus" : "idle"}
            >
              <FaEnvelope className="mr-2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                className="outline-none bg-transparent w-full text-gray-800"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusField("email")}
                onBlur={() => setFocusField("")}
                autoFocus={mode === "login"}
              />
            </motion.div>
            <motion.div
              className={`flex items-center mb-6 px-3 py-2 rounded bg-gray-100 ${
                focusField === "password" ? "ring-2 ring-purple-400" : ""
              }`}
              variants={inputVariants}
              animate={focusField === "password" ? "focus" : "idle"}
            >
              <FaLock className="mr-2 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                className="outline-none bg-transparent w-full text-gray-800"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusField("password")}
                onBlur={() => setFocusField("")}
              />
            </motion.div>
            <AnimatePresence>
              {error && (
                <motion.div
                  className="text-red-500 text-center mb-4"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={errorVariants}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              type="submit"
              className={
                "w-full py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-400 text-white font-semibold mt-4 drop-shadow-lg focus:outline-none" +
                (isLoading ? " opacity-60 cursor-not-allowed" : " hover:bg-gradient-to-r hover:from-purple-400 hover:to-cyan-400")
              }
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <motion.span
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  {mode === "signup" ? "Signing up..." : "Logging in..."}
                </motion.span>
              ) : (
                mode === "signup" ? "Sign Up" : "Login"
              )}
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              className="w-full mt-4 text-gray-500 hover:text-cyan-500 transition"
              whileHover={{ scale: 1.05, color: "#06b6d4" }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <div className="w-full mt-2 text-center">
              {mode === "login"
                ? <button
                  type="button"
                  className="text-indigo-500 hover:underline mt-2 font-medium"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                    setShake("idle");
                  }}>
                  Don't have an account? Sign Up
                </button>
                : <button
                  type="button"
                  className="text-cyan-500 hover:underline mt-2 font-medium"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setShake("idle");
                  }}>
                  Already have an account? Login
                </button>
              }
            </div>
          </motion.form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginForm;
