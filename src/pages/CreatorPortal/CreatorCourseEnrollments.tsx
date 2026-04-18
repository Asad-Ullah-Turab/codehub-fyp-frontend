import type { CourseEnrollment } from "./CreatorCourseTypes";

interface CreatorCourseEnrollmentsProps {
  enrollments: CourseEnrollment[];
  ratings: { averageRating: number; ratingCount: number } | null;
}

export default function CreatorCourseEnrollments({ enrollments, ratings }: CreatorCourseEnrollmentsProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Enrollments & feedback</h2>
          <p className="mt-1 text-sm text-slate-500">View learners enrolled in this course and overall course feedback.</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          Rating: {ratings?.averageRating.toFixed(1) || "0.0"} / 5 ({ratings?.ratingCount || 0})
        </div>
      </div>
      <div className="space-y-4">
        {enrollments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
            No enrollments found yet.
          </div>
        ) : (
          enrollments.map((enrollment) => (
            <div key={enrollment._id} className="rounded-3xl border border-slate-200 p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-semibold text-slate-900">{enrollment.user.name}</p>
                  <p className="text-sm text-slate-500">{enrollment.user.email}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1">Status: {enrollment.status}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">Progress: {enrollment.overallProgress}%</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">Time: {enrollment.totalTimeSpentMinutes} min</span>
                </div>
              </div>
              {enrollment.notes && (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Learner notes</p>
                  <p className="mt-2">{enrollment.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
