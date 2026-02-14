import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Code, Cpu, Zap, ChevronRight, Star } from "lucide-react";

interface LanguageCardProps {
  language: string;
  emoji: string; // kept for compatibility but not used visually
  tutorialCount: number;
  isRecommended?: boolean;
  onClick: () => void;
}

const LanguageCard: React.FC<LanguageCardProps> = ({
  language,
  tutorialCount,
  isRecommended = false,
  onClick,
}) => {
  // Color mapping based on language
  const getLanguageColors = (lang: string) => {
    const lowerLang = lang.toLowerCase();
    switch (lowerLang) {
      case "python":
        return { button: "bg-blue-500 hover:bg-blue-600", border: "border-blue-200" };
      case "javascript":
        return { button: "bg-yellow-500 hover:bg-yellow-600", border: "border-yellow-200" };
      case "cpp":
      case "c++":
        return { button: "bg-purple-500 hover:bg-purple-600", border: "border-purple-200" };
      case "java":
        return { button: "bg-red-500 hover:bg-red-600", border: "border-red-200" };
      case "react":
        return { button: "bg-cyan-500 hover:bg-cyan-600", border: "border-cyan-200" };
      default:
        return { button: "bg-slate-500 hover:bg-slate-600", border: "border-gray-200" };
    }
  };

  const colors = getLanguageColors(language);

  const getIcon = (lang: string) => {
    const lower = lang.toLowerCase();
    if (lower === "python") return <Code className="w-5 h-5 text-white" />;
    if (lower === "javascript") return <Zap className="w-5 h-5 text-white" />;
    if (lower === "cpp" || lower === "c++") return <Cpu className="w-5 h-5 text-white" />;
    return <BookOpen className="w-5 h-5 text-white" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.28 }}
      className={`bg-white rounded-xl border-2 ${colors.border} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group relative`}
      onClick={onClick}
    >
      <div className={`${colors.button} h-1 w-full`} />

      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-2">
            <Star className="w-3 h-3" />
            Recommended
          </div>
        </div>
      )}

      <div className="p-6 flex flex-col items-start">
        <div className={`rounded-lg p-2 inline-flex items-center justify-center mb-4 ${colors.button}`}>
          {getIcon(language)}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">{language}</h3>

        {/* Difficulty Badge */}
        <span className="inline-block bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          Beginner to Expert
        </span>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 min-h-[40px] w-full">
          {language === "python" && "Complete Python programming from fundamentals to advanced topics"}
          {language === "javascript" && "Modern JavaScript, ES6+, and asynchronous programming"}
          {(language === "cpp" || language === "c++") && "Systems programming, memory management, and STL"}
          {language === "java" && "Enterprise Java development and object-oriented programming"}
          {language === "react" && "Building modern web applications with React and Hooks"}
        </p>

        {/* Topic Count */}
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{tutorialCount} Topics</span>
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

export default LanguageCard;
