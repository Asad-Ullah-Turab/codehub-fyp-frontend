import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, ChevronRight, Code, Cpu, Zap } from "lucide-react";
import type { Course } from "../../../functions/CourseFunctions/courseFunctions";

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  // Color palette selection for subtle accents
  const getRandomGradient = (id: string) => {
    const palettes = [
      { button: "bg-blue-500 hover:bg-blue-600", border: "border-blue-200" },
      { button: "bg-purple-500 hover:bg-purple-600", border: "border-purple-200" },
      { button: "bg-green-500 hover:bg-green-600", border: "border-green-200" },
      { button: "bg-rose-500 hover:bg-rose-600", border: "border-rose-200" },
      { button: "bg-indigo-500 hover:bg-indigo-600", border: "border-indigo-200" },
      { button: "bg-teal-500 hover:bg-teal-600", border: "border-teal-200" },
    ];

    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return palettes[hash % palettes.length];
  };

  const getDifficultyText = (difficulty: string) => {
    const lower = difficulty.toLowerCase();
    if (lower === "beginner") return "Beginner to Expert";
    if (lower === "intermediate") return "Intermediate to Expert";
    if (lower === "advanced") return "Advanced";
    return "Beginner to Advanced";
  };

  const getIcon = (language: string) => {
    const lang = (language || "").toLowerCase();
    if (lang === "python") return <Code className="w-5 h-5" />;
    if (lang === "javascript") return <Zap className="w-5 h-5" />;
    if (lang === "cpp" || lang === "c++") return <Cpu className="w-5 h-5" />;
    // fallback to book icon for content-type
    return <BookOpen className="w-5 h-5" />;
  };

  const colors = getRandomGradient(course._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.26 }}
      className={`bg-white rounded-xl border-2 ${colors.border} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* subtle accent */}
      <div className={`${colors.button} h-1 w-full`} />

      <div className="p-6 flex flex-col items-start">
        {/* icon */}
        <div className="mb-4 inline-flex items-center justify-center bg-slate-50 rounded-lg p-3 shadow-sm">
          <div className="text-slate-700">{getIcon(course.language)}</div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>

        {/* Difficulty Badge */}
        <span className="inline-block bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          {getDifficultyText(course.difficulty)}
        </span>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 min-h-[40px] line-clamp-2 w-full">
          {course.shortDescription || course.description}
        </p>

        {/* Course Stats */}
        <div className="flex items-center gap-4 text-gray-600 text-sm mb-4 w-full">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{course.totalSections || course.sections?.length || 0} Sections</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{course.estimatedHours || 0}h</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto w-full">
          <button
            className={`${colors.button} text-white font-semibold py-2 px-4 rounded-lg w-full flex items-center justify-center gap-2 transition-colors duration-200`}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <span>Start Learning</span>
            <ChevronRight className="w-4 h-4 opacity-90" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
