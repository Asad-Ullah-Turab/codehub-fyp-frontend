import type { Course } from "../../services/adminCourseAPI";

interface CreatorCourseListProps {
  courses: Course[];
  loading: boolean;
  onRequestPublish: (courseId: string) => void;
  onManageCourse: (course: Course) => void;
}

export default function CreatorCourseList({ courses, loading, onRequestPublish, onManageCourse }: CreatorCourseListProps) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
        <p className="mt-4 text-sm text-slate-600">Loading creator courses...</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 shadow-sm">
        <p className="text-lg font-semibold">No creator courses found</p>
        <p className="mt-2 text-sm">Create your first course and submit it for review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <div key={course._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-600">{course.status.toUpperCase()}</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">{course.title}</h3>
              <p className="mt-2 text-sm text-slate-600 line-clamp-2">{course.shortDescription}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-1">{course.language}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1">{course.category}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1 capitalize">{course.difficulty}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <p className="text-sm text-slate-600">Enrolled: {course.enrollmentCount || 0}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onManageCourse(course)}
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
                >
                  Manage
                </button>
                <button
                  disabled={course.status === "pending" || course.status === "published"}
                  onClick={() => onRequestPublish(course._id)}
                  className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                >
                  {course.status === "draft" || course.status === "rejected"
                    ? "Request Publish"
                    : course.status === "pending"
                    ? "Pending Review"
                    : "Published"}
                </button>
              </div>
            </div>
          </div>
          {course.publishReviewComment && (
            <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              <p className="font-semibold">Review note</p>
              <p className="mt-1">{course.publishReviewComment}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
