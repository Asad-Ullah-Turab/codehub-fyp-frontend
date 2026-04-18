import { Award, ListChecks, Star, Users } from "lucide-react";
import type { Course } from "../../services/adminCourseAPI";

interface CreatorCourseOverviewProps {
  course: Course | null;
  ratings: { averageRating: number; ratingCount: number } | null;
  summaryStats: {
    enrollments: number;
    rating: number;
    totalSections: number;
    totalLessons: number;
    status: string;
  };
}

export default function CreatorCourseOverview({ course, ratings, summaryStats }: CreatorCourseOverviewProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 text-slate-500">
              <Users className="h-5 w-5" />
              <span className="text-sm font-semibold">Enrollments</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{summaryStats.enrollments}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 text-slate-500">
              <Star className="h-5 w-5" />
              <span className="text-sm font-semibold">Rating</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{summaryStats.rating.toFixed(1)} / 5</p>
            <p className="text-sm text-slate-500">Based on {ratings?.ratingCount || 0} reviews</p>
          </div>
          <div className="rounded-3xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 text-slate-500">
              <ListChecks className="h-5 w-5" />
              <span className="text-sm font-semibold">Sections</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{summaryStats.totalSections}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 text-slate-500">
              <Award className="h-5 w-5" />
              <span className="text-sm font-semibold">Lessons</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{summaryStats.totalLessons}</p>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Course summary</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <p>
            <strong>Status:</strong> {summaryStats.status}
          </p>
          <p>
            <strong>Language:</strong> {course?.language}
          </p>
          <p>
            <strong>Category:</strong> {course?.category}
          </p>
          <p>
            <strong>Difficulty:</strong> {course?.difficulty}
          </p>
          <p>
            <strong>Published:</strong> {course?.status === "published" ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </div>
  );
}
