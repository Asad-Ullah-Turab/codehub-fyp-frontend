import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock3, Layers, Pencil, Plus, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import AdminPageLayout from "../../AdminPortal/Components/AdminPageLayout";
import { useToast } from "../../../contexts/ToastContext";
import { creatorCourseAPI } from "../../../services/creatorCourseAPI";
import type { Course } from "../../../services/adminCourseAPI";
import CreatorCourseDetailsModal from "./CreatorCourseDetailsModal";
import CreatorCreateCourseModal from "./CreatorCreateCourseModal";

const toArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }

  return [];
};

export default function CreatorCoursesDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [creatingCourse, setCreatingCourse] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await creatorCourseAPI.getMyCourses({ page: 1, limit: 100 });
      const data = response?.data ?? response;
      setCourses(toArray<Course>(data));
    } catch (error) {
      console.error("Error loading creator courses:", error);
      showToast("Unable to load your courses.", "error");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const totalSections = useMemo(
    () => courses.reduce((sum, course) => sum + (course.totalSections || 0), 0),
    [courses],
  );

  const totalLessons = useMemo(
    () => courses.reduce((sum, course) => sum + (course.totalLessons || 0), 0),
    [courses],
  );

  const openWorkspace = (courseId: string) => {
    navigate(`/creator/courses/${courseId}`);
  };

  const requestPublish = async (courseId: string) => {
    try {
      await creatorCourseAPI.requestPublishCourse(courseId);
      showToast("Publish request submitted.", "success");
      fetchCourses();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to request publish.";
      showToast(message, "error");
    }
  };

  const togglePublish = async (course: Course) => {
    try {
      await creatorCourseAPI.togglePublishCourse(course._id);
      showToast(course.status === "published" ? "Course unpublished." : "Course published.", "success");
      fetchCourses();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Unable to change publish status.";
      showToast(message, "error");
    }
  };

  const deleteCourse = async (course: Course) => {
    const confirmed = window.confirm(`Delete "${course.title}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    try {
      await creatorCourseAPI.deleteCourse(course._id);
      showToast("Course deleted.", "success");
      setCourses((current) => current.filter((item) => item._id !== course._id));
    } catch (error: any) {
      const message = error?.response?.data?.message || "Unable to delete course.";
      showToast(message, "error");
    }
  };

  const getPublishLabel = (status: Course["status"]) => {
    if (status === "published") {
      return "Published";
    }

    if (status === "pending") {
      return "Pending review";
    }

    return "Request publish";
  };

  const renderPublishAction = (course: Course) => {
    if (course.status === "published") {
      return (
        <button
          type="button"
          onClick={() => togglePublish(course)}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Unpublish
        </button>
      );
    }

    if (course.hasAdminApprovedPublish) {
      return (
        <button
          type="button"
          onClick={() => togglePublish(course)}
          disabled={course.status === "pending"}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
        >
          Publish
        </button>
      );
    }

    if (course.status === "pending") {
      return (
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
        >
          Pending review
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => requestPublish(course._id)}
        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Request publish
      </button>
    );
  };

  return (
    <AdminPageLayout
      title="Creator Courses"
      subtitle="A clean dashboard for your courses, with no sidebar. Open a course to manage its sections, lessons, and quizzes in the new workspace."
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setCreatingCourse(true)}
            className="theme-primary-button inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Create new course
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to website
          </button>
          <button
            type="button"
            onClick={fetchCourses}
            className="theme-primary-button inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Courses</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{courses.length}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Sections</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{totalSections}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Lessons</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{totalLessons}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Your courses</h2>
              <p className="mt-1 text-sm text-slate-600">
                Open a course to manage its sections, lessons, and quizzes.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
              <Sparkles className="h-3.5 w-3.5" />
              Creator workspace
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {loading ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" />
              <p className="mt-4 text-sm text-slate-600">Loading your courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Layers className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No courses yet</h3>
              <p className="mt-2 text-sm text-slate-600">
                Your created courses will appear here once they are available.
              </p>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="px-6 py-5 transition hover:bg-slate-50/80">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <button
                    type="button"
                    onClick={() => openWorkspace(course._id)}
                    className="group flex-1 text-left"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold text-slate-900 transition group-hover:text-indigo-700">
                        {course.title}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          course.status === "published"
                            ? "bg-emerald-100 text-emerald-700"
                            : course.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : course.status === "rejected"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {course.status}
                      </span>
                    </div>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                      {course.shortDescription || course.description}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                        <Layers className="h-3.5 w-3.5" />
                        {course.totalSections || 0} sections
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {course.totalLessons || 0} lessons
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">{course.language}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">{course.category}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">{course.difficulty}</span>
                    </div>
                  </button>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingCourse(course)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit details
                    </button>
                    {renderPublishAction(course)}
                    <button
                      type="button"
                      onClick={() => deleteCourse(course)}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <CreatorCourseDetailsModal
        open={Boolean(editingCourse)}
        course={editingCourse}
        onClose={() => setEditingCourse(null)}
        onSaved={() => {
          setEditingCourse(null);
          fetchCourses();
        }}
      />

      <CreatorCreateCourseModal
        open={creatingCourse}
        onClose={() => setCreatingCourse(false)}
        onCreated={() => {
          setCreatingCourse(false);
          fetchCourses();
        }}
      />
    </AdminPageLayout>
  );
}