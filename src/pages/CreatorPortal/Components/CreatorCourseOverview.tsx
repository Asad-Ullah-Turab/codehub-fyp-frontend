import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { BarChart2, BookOpen, FileQuestion, Layers, Pencil, Plus, Sparkles, Trash2, Zap } from "lucide-react";
import type { CourseSection } from "../../../services/adminCourseAPI";
import { useToast } from "../../../contexts/ToastContext";
import { creatorCourseAPI } from "../../../services/creatorCourseAPI";
import CreatorSectionModal from "./CreatorSectionModal";
import AISectionGenerateModal from "./AISectionGenerateModal";
import type { CreatorCourseWorkspaceContextValue } from "./CreatorCourseWorkspace";

const sectionSummary = (section: CourseSection) => {
  const quizId = typeof section.sectionQuiz === "string" ? section.sectionQuiz : section.sectionQuiz?._id;

  return {
    quizId,
    lessonCount: section.lessons?.length || 0,
  };
};

export default function CreatorCourseOverview() {
  const { course, sections, selectedSection, refreshCourse, openSectionOverview, openLessonEditor, openQuizEditor } =
    useOutletContext<CreatorCourseWorkspaceContextValue>();
  const { showToast } = useToast();
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<CourseSection | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);

  const nextOrder = useMemo(() => (sections.length > 0 ? Math.max(...sections.map((section) => section.order || 0)) + 1 : 0), [sections]);

  useEffect(() => {
    if (!course?._id) return;
    creatorCourseAPI.getCourseAnalytics(course._id).then(setAnalytics).catch(() => {});
  }, [course?._id]);

  if (!course) {
    return null;
  }

  const startAddSection = () => {
    setEditingSection(null);
    setSectionModalOpen(true);
  };

  const startEditSection = (section: CourseSection) => {
    setEditingSection(section);
    setSectionModalOpen(true);
  };

  const handleAISection = async (generated: { sectionTitle: string; lessons: any[] }) => {
    if (!course) return;
    try {
      const sectionRes = await creatorCourseAPI.createSection(course._id, {
        title: generated.sectionTitle,
        order: nextOrder,
      });
      const sectionData = sectionRes?.data ?? sectionRes;
      const newSectionId: string = sectionData?._id;

      if (newSectionId && generated.lessons.length > 0) {
        await Promise.all(
          generated.lessons.map((lesson: any, index: number) =>
            creatorCourseAPI.createLesson(newSectionId, {
              title: lesson.title,
              content: lesson.content || "",
              order: index + 1,
              codeExamples: lesson.codeExamples || [],
              notes: lesson.notes || [],
              tips: lesson.tips || [],
            }),
          ),
        );
      }

      showToast(`Section "${generated.sectionTitle}" created with ${generated.lessons.length} lessons.`, "success");
      await refreshCourse();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to apply AI-generated section.";
      showToast(message, "error");
    }
  };

  const activeSection = selectedSection || null;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Sections</h3>
              <p className="mt-1 text-sm text-slate-600">Select a section to manage its lessons and quiz.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={activeSection?._id || ""}
                onChange={(event) => {
                  if (event.target.value) {
                    openSectionOverview(event.target.value);
                  }
                }}
                className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select section</option>
                {sections.map((section) => (
                  <option key={section._id} value={section._id}>
                    {section.title}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowAIModal(true)}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
              >
                <Sparkles className="h-4 w-4" />
                AI Generate
              </button>
              <button
                type="button"
                onClick={startAddSection}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" />
                Add section
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {sections.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Layers className="mx-auto h-12 w-12 text-slate-400" />
              <h4 className="mt-4 text-lg font-semibold text-slate-900">No sections yet</h4>
              <p className="mt-2 text-sm text-slate-600">Add your first section to begin building the course structure.</p>
            </div>
          ) : !activeSection ? (
            <div className="px-6 py-16 text-center">
              <Layers className="mx-auto h-12 w-12 text-slate-400" />
              <h4 className="mt-4 text-lg font-semibold text-slate-900">Select a section</h4>
              <p className="mt-2 text-sm text-slate-600">
                Choose a section from the sidebar or the selector above to manage it here.
              </p>
            </div>
          ) : (
            (() => {
              const section = activeSection;
              const summary = sectionSummary(section);

              return (
                <div
                  key={section._id}
                  className="px-6 py-5"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <button
                      type="button"
                      onClick={() => openSectionOverview(section._id)}
                      className="flex-1 text-left"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xl font-semibold text-slate-900">{section.title}</h4>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          Section {section.order || 1}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {summary.lessonCount} lessons
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {summary.quizId ? "quiz ready" : "quiz missing"}
                        </span>
                      </div>
                      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{section.description}</p>
                    </button>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEditSection(section)}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit section
                      </button>
                      <button
                        type="button"
                        onClick={() => openLessonEditor(section._id)}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                      >
                        <Plus className="h-4 w-4" />
                        Add lesson
                      </button>
                      <button
                        type="button"
                        onClick={() => openQuizEditor(section._id, summary.quizId)}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <FileQuestion className="h-4 w-4" />
                        {summary.quizId ? "Edit quiz" : "Add quiz"}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const confirmed = window.confirm(`Delete section \"${section.title}\"? This will also delete its quiz.`);
                          if (!confirmed) {
                            return;
                          }

                          try {
                            await creatorCourseAPI.deleteSection(section._id);
                            showToast("Section deleted.", "success");
                            await refreshCourse();
                          } catch (error: any) {
                            const message = error?.response?.data?.message || "Unable to delete section.";
                            showToast(message, "error");
                          }
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete section
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Selected section</p>
                        <h5 className="mt-2 text-lg font-semibold text-slate-900">{section.title}</h5>
                      </div>
                      <button
                        type="button"
                        onClick={() => startEditSection(section)}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{section.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">{section.estimatedHours || 0} hours</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">Order {section.order}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">{summary.lessonCount} lessons</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">{summary.quizId ? "quiz ready" : "quiz missing"}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openLessonEditor(section._id)}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                      >
                        <Plus className="h-4 w-4" />
                        Add lesson
                      </button>
                      <button
                        type="button"
                        onClick={() => openQuizEditor(section._id, summary.quizId)}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <FileQuestion className="h-4 w-4" />
                        {summary.quizId ? "Edit quiz" : "Add quiz"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Lessons</p>
                        <p className="text-sm text-slate-500">Open any lesson to edit its content.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openLessonEditor(section._id)}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add lesson
                      </button>
                    </div>

                    <div className="mt-4 space-y-2">
                      {section.lessons?.length ? (
                        section.lessons.map((lesson) => (
                          <button
                            key={lesson._id}
                            type="button"
                            onClick={() => openLessonEditor(section._id, lesson._id)}
                            className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-indigo-600" />
                                <p className="truncate text-sm font-semibold text-slate-900">{lesson.title}</p>
                              </div>
                              <p className="mt-1 line-clamp-1 text-xs text-slate-500">{lesson.description || "No description provided"}</p>
                            </div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
                          No lessons in this section yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </div>

      {analytics && (
        analytics.isPro === false ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-slate-500" /> Course Analytics
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center"><p className="text-2xl font-bold text-slate-900">{analytics.data.totalEnrollments}</p><p className="text-xs text-slate-500">Total Enrollments</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-slate-900">{analytics.data.completionRate}%</p><p className="text-xs text-slate-500">Completion Rate</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-slate-900">{analytics.data.recentEnrollments}</p><p className="text-xs text-slate-500">Last 30 Days</p></div>
            </div>
            <div className="mt-4 rounded-xl bg-indigo-50 p-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-indigo-500 flex-shrink-0" />
              <p className="text-xs text-indigo-700">Upgrade to <strong>Creator Pro</strong> to unlock enrollment trends, rating breakdown, and earnings insights.</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-indigo-500" /> Course Analytics <span className="text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">Pro</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-2xl font-bold text-slate-900">{analytics.data.totalEnrollments}</p>
                <p className="text-xs text-slate-500">Total Enrollments</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-2xl font-bold text-green-700">{analytics.data.completionRate}%</p>
                <p className="text-xs text-slate-500">Completion Rate</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-2xl font-bold text-blue-700">{analytics.data.recentEnrollments}</p>
                <p className="text-xs text-slate-500">Last 30 Days</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-2xl font-bold text-indigo-700">⭐ {analytics.data.reviewStats?.avgRating?.toFixed(1) || '—'}</p>
                <p className="text-xs text-slate-500">{analytics.data.reviewStats?.totalReviews || 0} reviews</p>
              </div>
            </div>
            {analytics.data.enrollmentTrend?.length > 0 && (
              <div className="rounded-xl bg-slate-50 p-3 mb-3">
                <p className="text-xs font-medium text-slate-600 mb-2">Enrollment trend (last 30 days)</p>
                <div className="flex items-end gap-1 h-12">
                  {analytics.data.enrollmentTrend.map((d: any, i: number) => {
                    const max = Math.max(...analytics.data.enrollmentTrend.map((x: any) => x.count), 1);
                    return (
                      <div key={i} title={`${d._id}: ${d.count}`} className="flex-1 bg-indigo-400 rounded-sm min-h-[2px]" style={{ height: `${(d.count / max) * 100}%` }} />
                    );
                  })}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between rounded-xl bg-green-50 p-3">
              <div>
                <p className="text-xs text-green-600 font-medium">Revenue earned (all courses)</p>
                <p className="text-lg font-bold text-green-800">${analytics.data.payoutStats?.totalEarned?.toFixed(2) || '0.00'}</p>
              </div>
              <p className="text-xs text-green-600">{analytics.data.payoutStats?.payoutCount || 0} payouts processed</p>
            </div>
          </div>
        )
      )}

      <CreatorSectionModal
        open={sectionModalOpen}
        courseId={course._id}
        section={editingSection}
        nextOrder={nextOrder}
        onClose={() => setSectionModalOpen(false)}
        onSaved={refreshCourse}
      />

      {showAIModal && (
        <AISectionGenerateModal
          courseId={course._id}
          onClose={() => setShowAIModal(false)}
          onApply={handleAISection}
        />
      )}
    </div>
  );
}