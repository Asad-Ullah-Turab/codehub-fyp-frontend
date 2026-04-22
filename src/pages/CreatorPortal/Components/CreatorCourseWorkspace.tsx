import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Home, Layers, RefreshCw, Sparkles } from "lucide-react";
import { useToast } from "../../../contexts/ToastContext";
import { creatorCourseAPI } from "../../../services/creatorCourseAPI";
import type { Course, CourseSection } from "../../../services/adminCourseAPI";
import CreatorCourseSidebar from "./CreatorCourseSidebar";

export interface CreatorCourseWorkspaceContextValue {
  course: Course | null;
  sections: CourseSection[];
  selectedSection: CourseSection | null;
  selectedSectionId: string | null;
  loading: boolean;
  refreshCourse: () => Promise<void>;
  openSectionOverview: (sectionId: string) => void;
  openLessonEditor: (sectionId: string, lessonId?: string) => void;
  openQuizEditor: (sectionId: string, quizId?: string | null) => void;
}

const toArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

export default function CreatorCourseWorkspace() {
  const navigate = useNavigate();
  const { courseId, sectionId, lessonId, quizId } = useParams<{
    courseId: string;
    sectionId?: string;
    lessonId?: string;
    quizId?: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem("creatorSidebarCollapsed");
    return stored === "true";
  });

  const refreshCourse = useCallback(async () => {
    if (!courseId) {
      return;
    }

    try {
      setLoading(true);
      const [courseResponse, sectionsResponse] = await Promise.all([
        creatorCourseAPI.getCourse(courseId),
        creatorCourseAPI.getCourseSections(courseId),
      ]);

      const courseData = courseResponse?.data ?? courseResponse;
      const sectionData = sectionsResponse?.data ?? sectionsResponse;

      setCourse(courseData ?? null);
      setSections(toArray<CourseSection>(sectionData));
    } catch (error) {
      console.error("Error loading creator course workspace:", error);
      showToast("Unable to load this course.", "error");
      setCourse(null);
      setSections([]);
    } finally {
      setLoading(false);
    }
  }, [courseId, showToast]);

  useEffect(() => {
    refreshCourse();
  }, [refreshCourse]);

  useEffect(() => {
    localStorage.setItem("creatorSidebarCollapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const selectedSectionId = useMemo(() => {
    return sectionId || searchParams.get("section") || sections[0]?._id || null;
  }, [sectionId, searchParams, sections]);

  const selectedSection = useMemo(
    () => sections.find((section) => section._id === selectedSectionId) || null,
    [sections, selectedSectionId],
  );

  useEffect(() => {
    if (!sectionId && !lessonId && !quizId && selectedSectionId && searchParams.get("section") !== selectedSectionId) {
      setSearchParams({ section: selectedSectionId }, { replace: true });
    }
  }, [lessonId, quizId, searchParams, sectionId, selectedSectionId, setSearchParams]);

  const openSectionOverview = (targetSectionId: string) => {
    navigate(`/creator/courses/${courseId}?section=${targetSectionId}`);
  };

  const openLessonEditor = (targetSectionId: string, targetLessonId = "new") => {
    navigate(`/creator/courses/${courseId}/sections/${targetSectionId}/lessons/${targetLessonId}`);
  };

  const openQuizEditor = (targetSectionId: string, targetQuizId?: string | null) => {
    if (targetQuizId) {
      navigate(`/creator/courses/${courseId}/sections/${targetSectionId}/quiz/${targetQuizId}`);
      return;
    }

    navigate(`/creator/courses/${courseId}/sections/${targetSectionId}/quiz`);
  };

  const handleRequestRefresh = async () => {
    await refreshCourse();
    showToast("Course workspace refreshed.", "success");
  };

  const contextValue: CreatorCourseWorkspaceContextValue = {
    course,
    sections,
    selectedSection,
    selectedSectionId,
    loading,
    refreshCourse,
    openSectionOverview,
    openLessonEditor,
    openQuizEditor,
  };

  if (loading && !course) {
    return (
      <div className="admin-portal-shell flex h-screen items-center justify-center">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-lg">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" />
          <p className="mt-4 text-sm text-slate-600">Loading creator workspace...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="admin-theme min-h-screen px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Course not found</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            We could not load this course workspace. Go back to the dashboard and open another course.
          </p>
          <button
            type="button"
            onClick={() => navigate("/creator/courses")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-portal-shell flex h-screen overflow-hidden">
      <aside
        className={`admin-portal-sidebar flex flex-col overflow-hidden shadow-xl transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-80"}`}
      >
        <div className={`flex items-center justify-between border-b border-slate-700/50 ${sidebarCollapsed ? "px-3 py-4" : "p-6"}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-lg shadow-indigo-900/35">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="sidebar-brand truncate text-xl font-bold tracking-wide">CODEHUB</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">Creator workspace</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="rounded-lg p-1.5 text-slate-200 transition hover:bg-slate-700/40"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {!sidebarCollapsed && (
          <div className="border-b border-slate-700/40 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Current course</p>
            <h2 className="mt-2 text-lg font-semibold text-white">{course.title}</h2>
            <p className="mt-1 text-sm text-slate-300">{course.status} · {course.totalSections || 0} sections</p>
          </div>
        )}

        <CreatorCourseSidebar
          sections={sections}
          selectedSectionId={selectedSectionId}
          collapsed={sidebarCollapsed}
          onSelectSection={openSectionOverview}
          onOpenLesson={openLessonEditor}
          onOpenQuiz={openQuizEditor}
        />

        <div className={`border-t border-slate-700/40 ${sidebarCollapsed ? "p-3" : "p-4"}`}>
          <button
            type="button"
            onClick={() => navigate("/creator/courses")}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700/70 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-slate-800 ${sidebarCollapsed ? "px-0" : ""}`}
            title="Back to dashboard"
          >
            <Home className="h-4 w-4" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </button>
        </div>
      </aside>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Creator workspace</div>
              <h1 className="mt-3 truncate text-2xl font-semibold text-slate-900 sm:text-3xl">
                {course.title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Use the sidebar to switch sections, open lesson editors, and create or edit section quizzes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRequestRefresh}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button
                type="button"
                onClick={() => openSectionOverview(selectedSectionId || sections[0]?._id || "")}
                disabled={!selectedSectionId && sections.length === 0}
                className="theme-primary-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Layers className="h-4 w-4" />
                Manage section
              </button>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet context={contextValue} />
        </main>
      </div>
    </div>
  );
}