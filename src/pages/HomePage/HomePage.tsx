import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <nav className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold text-white">CodeHub</div>
        <div className="space-x-4">
          <Link
            to="/signin"
            className="px-4 py-2 text-white border border-white rounded-md hover:bg-white hover:text-gray-900 transition duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Welcome to <span className="text-blue-400">CodeHub</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl">
          Your online code editor and executor. Write, run, and test Python, JavaScript, and C++ code 
          in a secure, isolated environment with real-time results.
        </p>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl">
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Multi-Language Support</h3>
            <p className="text-gray-300">Python, JavaScript, and C++</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Secure Execution</h3>
            <p className="text-gray-300">Isolated Docker containers</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Results</h3>
            <p className="text-gray-300">Instant code execution</p>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to="/editor"
          className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
        >
          🚀 Open Code Editor
        </Link>
        
        <p className="text-sm text-gray-400 mt-4">
          No account required to try the editor
        </p>
      </div>
    </div>
  );
};

export default HomePage;
