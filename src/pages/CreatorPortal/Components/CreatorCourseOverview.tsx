import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { BookOpen, FileQuestion, Layers, Pencil, Plus, Trash2 } from "lucide-react";
import type { CourseSection } from "../../../services/adminCourseAPI";
import { useToast } from "../../../contexts/ToastContext";
import { creatorCourseAPI } from "../../../services/creatorCourseAPI";
import CreatorSectionModal from "./CreatorSectionModal";
import type { CreatorCourseWorkspaceContextValue } from "./CreatorCourseWorkspace";

const sectionSummary = (section: CourseSection) => {
  const quizId = typeof section.sectionQuiz === "string" ? section.sectionQuiz : section.sectionQuiz?._id;

  return {
    quizId,
    lessonCount: section.lessons?.length || 0,
  };
};

export default function CreatorCourseOverview() {
  const { course, sections, selectedSection, selectedSectionId, refreshCourse, openSectionOverview, openLessonEditor, openQuizEditor } =
    useOutletContext<CreatorCourseWorkspaceContextValue>();
  const { showToast } = useToast();
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<CourseSection | null>(null);

  const nextOrder = useMemo(() => (sections.length > 0 ? Math.max(...sections.map((section) => section.order || 0)) + 1 : 0), [sections]);

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

  const activeSection = selectedSection || sections[0] || null;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Sections</h3>
              <p className="mt-1 text-sm text-slate-600">Select a section to manage its lessons and quiz.</p>
            </div>
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

        <div className="divide-y divide-slate-200">
          {sections.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Layers className="mx-auto h-12 w-12 text-slate-400" />
              <h4 className="mt-4 text-lg font-semibold text-slate-900">No sections yet</h4>
              <p className="mt-2 text-sm text-slate-600">Add your first section to begin building the course structure.</p>
            </div>
          ) : (
            sections.map((section) => {
              const summary = sectionSummary(section);
              const isActive = section._id === activeSection?._id;

              return (
                <div
                  key={section._id}
                  className={`px-6 py-5 transition ${isActive ? "bg-indigo-50/50" : "hover:bg-slate-50/80"}`}
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
                          Section {section.order + 1}
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

                  {isActive && (
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
                  )}

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
            })
          )}
        </div>
      </div>

      <CreatorSectionModal
        open={sectionModalOpen}
        courseId={course._id}
        section={editingSection}
        nextOrder={nextOrder}
        onClose={() => setSectionModalOpen(false)}
        onSaved={refreshCourse}
      />
    </div>
  );
}