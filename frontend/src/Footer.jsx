import React from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        {/* Brand / Logo */}
        <div className="text-lg font-semibold text-white mb-3 md:mb-0">
          © {new Date().getFullYear()} TheCyberCastle
        </div>

        {/* Links */}
        <div className="flex space-x-6">
          <a
            href="#"
            className="hover:text-white transition-colors duration-200"
          >
            Home
          </a>
          <a
            href="#about"
            className="hover:text-white transition-colors duration-200"
          >
            About
          </a>
          <a
            href="#contact"
            className="hover:text-white transition-colors duration-200"
          >
            Contact
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4 mt-3 md:mt-0">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white text-xl"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white text-xl"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://twitter.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white text-xl"
          >
            <FaTwitter />
          </a>
          <a
            href="mailto:youremail@example.com"
            className="hover:text-white text-xl"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
