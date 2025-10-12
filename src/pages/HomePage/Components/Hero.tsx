import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
const Hero = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 bg-gray-50">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                <path d="M8 15h8v2H8zm0-3h8v2H8zm0-3h5v2H8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            About
          </Link>
          <Link
            to="/tutorials"
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            Tutorials
          </Link>
          <Link
            to="/editor"
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            Code Editor
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            Contact Us
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-gray-800 font-medium">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-6 py-2 border-2 border-gray-800 text-gray-800 rounded hover:bg-gray-800 hover:text-white transition-colors font-medium"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="px-6 py-2 border-2 border-gray-800 text-gray-800 rounded hover:bg-gray-800 hover:text-white transition-colors font-medium"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors font-medium"
              >
                Join For Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-center px-8 py-20">
        <div className="max-w-4xl text-center relative">
          {/* Programming Language Icons */}
          {/* Java - Top Left */}
          <div className="absolute -left-32 top-0 flex flex-col items-center">
            <img
              src="/images/java-icon.png"
              alt="Java"
              className="w-16 h-16 mb-2"
            />
            <span className="text-sm font-medium text-gray-700">Java</span>
          </div>

          {/* C++ - Top Right */}
          <div className="absolute -right-32 -top-8 flex flex-col items-center">
            <img
              src="/images/cpp-icon.png"
              alt="C++"
              className="w-16 h-16 mb-2"
            />
            <span className="text-sm font-medium text-gray-700">C++</span>
          </div>

          {/* Python - Middle Right */}
          <div className="absolute -right-32 top-32 flex flex-col items-center">
            <img
              src="/images/python-icon.png"
              alt="Python"
              className="w-16 h-16 mb-2"
            />
            <span className="text-sm font-medium text-gray-700">Python</span>
          </div>

          {/* HTML - Bottom Left */}
          <div className="absolute -left-32 bottom-8 flex flex-col items-center">
            <img
              src="/images/html-icon.png"
              alt="HTML"
              className="w-16 h-16 mb-2"
            />
            <span className="text-sm font-medium text-gray-700">Html</span>
          </div>

          {/* JavaScript - Bottom Right */}
          <div className="absolute -right-32 bottom-0 flex flex-col items-center">
            <img
              src="/images/javascript-icon.png"
              alt="JavaScript"
              className="w-16 h-16 mb-2"
            />
            <span className="text-sm font-medium text-gray-700">
              Javascript
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Learn to <span className="bg-yellow-400 px-2">code</span> your
            <br />
            dreams and{" "}
            <span className="bg-blue-500 text-white px-2">design</span> your
            <br />
            future
          </h1>

          {/* Subheading */}
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Learn to code with step-by-step tutorials and practice instantly
            <br />
            in our built-in online editor. CodeHub makes coding simple,
            <br />
            interactive, and beginner-friendly.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/courses"
              className="px-8 py-3 bg-yellow-500 text-white rounded font-medium hover:bg-yellow-600 transition-colors"
            >
              Explore Courses
            </Link>
            <Link
              to="/free-course"
              className="px-8 py-3 border-2 border-gray-800 text-gray-800 rounded font-medium hover:bg-gray-800 hover:text-white transition-colors"
            >
              Join Free Course
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
