import { Link } from "react-router-dom";

import Java from "/assets/homePage/Java.png";
import Cpp from "/assets/homePage/Cplusplus.png";
import Python from "/assets/homePage/Python.png";
import Html from "/assets/homePage/Html.png";
import Javascript from "/assets/homePage/Javascript.png";

const Hero = () => {
  return (
    <div className="min-h-screen bg-white-50">
      {/* Hero Section */}
      <div className="flex items-center justify-center px-8 py-20">
        <div className="max-w-4xl text-center relative">
          {/* Programming Language Icons */}
          {/* Java - Top Left */}
          <div className="absolute -left-32 top-0 flex flex-col items-center">
            <img src={Java} alt="Java" className="w-16 h-16 mb-2" />
            <span className="text-sm font-medium text-gray-700">Java</span>
          </div>

          {/* C++ - Top Right */}
          <div className="absolute -right-32 -top-8 flex flex-col items-center">
            <img src={Cpp} alt="C++" className="w-16 h-16 mb-2" />
            <span className="text-sm font-medium text-gray-700">C++</span>
          </div>

          {/* Python - Middle Right */}
          <div className="absolute -right-32 top-32 flex flex-col items-center">
            <img src={Python} alt="Python" className="w-16 h-16 mb-2" />
            <span className="text-sm font-medium text-gray-700">Python</span>
          </div>

          {/* HTML - Bottom Left */}
          <div className="absolute -left-32 bottom-8 flex flex-col items-center">
            <img src={Html} alt="HTML" className="w-16 h-16 mb-2" />
            <span className="text-sm font-medium text-gray-700">Html</span>
          </div>

          {/* JavaScript - Bottom Right */}
          <div className="absolute -right-32 bottom-0 flex flex-col items-center">
            <img src={Javascript} alt="JavaScript" className="w-16 h-16 mb-2" />
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
