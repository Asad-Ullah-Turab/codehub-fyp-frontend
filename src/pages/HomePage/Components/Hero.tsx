import { Link } from "react-router-dom";

import Java from "/assets/homePage/Java.png";
import Cpp from "/assets/homePage/Cplusplus.png";
import Python from "/assets/homePage/Python.png";
import Html from "/assets/homePage/Html.png";
import Javascript from "/assets/homePage/Javascript.png";

const Hero = () => {
  return (
    <div className="bg-white-50 mt-38">
      <div className="flex items-center justify-center px-8 py-20 ">
        <div className="max-w-4xl text-center relative">
          {/* Technology Icons */}
          <div className="absolute right-1/2 -top-30  flex flex-col items-center">
            <img src={Cpp} alt="C++" className="w-16 h-16 mb-2" />
          </div>
          <div className="absolute -left-42 top-0 flex flex-col items-center">
            <img src={Java} alt="Java" className="w-16 h-16 mb-2" />
          </div>
          <div className="absolute -right-42 top-0 flex flex-col items-center">
            <img src={Python} alt="Python" className="w-16 h-16 mb-2" />
          </div>
          <div className="absolute -left-25 bottom-8 flex flex-col items-center">
            <img src={Html} alt="HTML" className="w-16 h-16 mb-2" />
          </div>
          <div className="absolute -right-25 bottom-8 flex flex-col items-center">
            <img src={Javascript} alt="JavaScript" className="w-16 h-16 mb-2" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Learn to{" "}
            <span className="relative inline-block px-2">
              <span className="absolute inset-0 bg-yellow-500 rotate-[5deg] rounded mb-1 -z-10"></span>
              <span className="text-white relative">code</span>
            </span>{" "}
            your
            <br />
            dreams and{" "}
            <span className="relative inline-block px-2">
              <span className="absolute inset-0 bg-blue-500 rotate-[5deg] rounded mt-2 -z-10"></span>
              <span className="text-white relative">design</span>
            </span>{" "}
            your
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
              className="px-8 py-[12px] bg-yellow-500 text-white rounded font-medium hover:bg-yellow-600 transition-colors"
            >
              Explore Courses
            </Link>
            <Link
              to="/free-course"
              className="px-8 py-[10px] border-2 border-gray-800 text-gray-800 rounded font-medium hover:bg-gray-800 hover:text-white transition-colors"
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
