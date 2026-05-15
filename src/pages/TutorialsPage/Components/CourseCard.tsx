import React from "react";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  ChevronRight,
  Clock,
  Code,
  Cpu,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Zap,
} from "lucide-react";
import type { Course } from "../../../functions/CourseFunctions/courseFunctions";

interface CourseCardProps {
  course: Course;
  onClick: () => void;
  userHasPremium?: boolean;
  isEnrolled?: boolean;
  isOwnCourse?: boolean;
  userRole?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick, userHasPremium = false, isEnrolled = false, isOwnCourse = false, userRole }) => {
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

  const isCreatorCourse = course.instructor?.role === "creator";
  const instructorName = course.instructor?.name || "CodeHub Team";
  const instructorInitial = instructorName.trim().charAt(0).toUpperCase() || "C";
  const rating = Number(course.averageRating || 0);
  const ratingCount = course.ratingCount || 0;

  const visual = isCreatorCourse
    ? {
        card:
          "border-emerald-200 bg-gradient-to-b from-emerald-50/80 via-white to-white hover:border-emerald-300",
        accent: "bg-emerald-500",
        iconWrap: "bg-emerald-100 text-emerald-700",
        badge: "bg-emerald-100 text-emerald-800",
        cta: "bg-emerald-600 hover:bg-emerald-700",
        label: "Creator course",
        labelIcon: <Sparkles className="w-3.5 h-3.5" />,
      }
    : {
        card:
          "border-sky-200 bg-gradient-to-b from-sky-50/80 via-white to-white hover:border-sky-300",
        accent: "bg-sky-600",
        iconWrap: "bg-sky-100 text-sky-700",
        badge: "bg-sky-100 text-sky-800",
        cta: "bg-sky-600 hover:bg-sky-700",
        label: "Official course",
        labelIcon: <ShieldCheck className="w-3.5 h-3.5" />,
      };

  const renderCreatorRating = () => (
    <div className="flex items-center gap-2 rounded-lg bg-white/85 px-3 py-2 text-sm shadow-sm ring-1 ring-emerald-100">
      <div className="flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 rating`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              rating >= star
                ? "fill-amber-400 text-amber-400"
                : rating >= star - 0.5
                ? "fill-amber-200 text-amber-400"
                : "text-slate-300"
            }`}
          />
        ))}
      </div>
      <span className="font-semibold text-slate-800">{rating.toFixed(1)}</span>
      <span className="text-xs text-slate-500">({ratingCount})</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.26 }}
      className={`rounded-xl border-2 ${visual.card} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className={`${visual.accent} h-1 w-full`} />

      <div className="p-6 flex min-h-[360px] flex-col items-start">
        <div className="mb-4 flex w-full items-start justify-between gap-3">
          <div className={`inline-flex items-center justify-center rounded-lg p-3 shadow-sm ${visual.iconWrap}`}>
            {getIcon(course.language)}
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${visual.badge}`}>
            {visual.labelIcon}
            {visual.label}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 flex items-center gap-2">
          {course.title}
          {course.isPremium && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" aria-label="Premium course" />}
        </h3>

        {isCreatorCourse ? (
          <div className="mb-4 flex w-full items-center justify-between gap-3 rounded-xl bg-white/80 p-3 ring-1 ring-emerald-100">
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-emerald-600 text-white">
                {course.instructor?.profilePicture ? (
                  <img
                    src={course.instructor.profilePicture}
                    alt={`${instructorName} avatar`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold">
                    {instructorInitial}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase text-emerald-700">Created by</p>
                <p className="truncate text-sm font-bold text-slate-900">{instructorName}</p>
              </div>
            </div>
            <UserRound className="h-4 w-4 flex-shrink-0 text-emerald-600" />
          </div>
        ) : (
          <div className="mb-4 flex w-full items-center justify-between gap-3 rounded-xl bg-white/80 p-3 ring-1 ring-sky-100">
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-sky-600 text-white">
                {course.instructor?.profilePicture ? (
                  <img
                    src={course.instructor.profilePicture}
                    alt={`${instructorName} avatar`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold">
                    {instructorInitial}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase text-sky-700">CodeHub Official</p>
                <p className="truncate text-sm font-bold text-slate-900">{instructorName}</p>
              </div>
            </div>
            <Award className="h-4 w-4 flex-shrink-0 text-sky-600" />
          </div>
        )}

        <p className="text-gray-600 text-sm mb-4 min-h-[40px] line-clamp-2 w-full">
          {course.shortDescription || course.description}
        </p>

        <div className="mb-4 flex flex-wrap items-center gap-3 text-gray-600 text-sm w-full">
          <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">
            {getDifficultyText(course.difficulty)}
          </span>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{course.totalSections || course.sections?.length || 0} Sections</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{course.estimatedHours || 0}h</span>
          </div>
        </div>

        {isCreatorCourse && <div className="mb-4">{renderCreatorRating()}</div>}

        <div className="mt-auto w-full">
          <button
            className={`${
              userRole === "admin"
                ? "bg-slate-700 hover:bg-slate-800"
                : isOwnCourse
                ? "bg-amber-600 hover:bg-amber-700"
                : isEnrolled
                ? "bg-indigo-600 hover:bg-indigo-700"
                : visual.cta
            } text-white font-semibold py-2.5 px-4 rounded-lg w-full flex items-center justify-center gap-2 transition-colors duration-200`}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <span>
              {userRole === "admin"
                ? "View Course"
                : isOwnCourse
                ? "Preview Course"
                : isEnrolled
                ? "Continue Learning"
                : course.isPremium && !userHasPremium
                ? "Upgrade to Access"
                : "Start Learning"}
            </span>
            <ChevronRight className="w-4 h-4 opacity-90" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
