import { useMemo } from "react";
import { BookOpen, FileQuestion, Plus, ChevronRight, Layers, Pencil } from "lucide-react";
import type { CourseSection } from "../../../services/adminCourseAPI";

interface CreatorCourseSidebarProps {
  sections: CourseSection[];
  selectedSectionId: string | null;
  collapsed: boolean;
  onSelectSection: (sectionId: string) => void;
  onOpenLesson: (sectionId: string, lessonId?: string) => void;
  onOpenQuiz: (sectionId: string, quizId?: string | null) => void;
}

export default function CreatorCourseSidebar({
  sections,
  selectedSectionId,
  collapsed,
  onSelectSection,
  onOpenLesson,
  onOpenQuiz,
}: CreatorCourseSidebarProps) {
  const sortedSections = useMemo(
    () => [...sections].sort((left, right) => (left.order || 0) - (right.order || 0)),
    [sections],
  );

  const renderCollapsedSection = (section: CourseSection) => {
    const isActive = section._id === selectedSectionId;
    const sectionQuizId = typeof section.sectionQuiz === "string" ? section.sectionQuiz : section.sectionQuiz?._id;

    return (
      <div key={section._id} className="group relative">
        <button
          type="button"
          onClick={() => onSelectSection(section._id)}
          className={`flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold transition ${
            isActive
              ? "bg-sky-500/20 text-white ring-1 ring-sky-300/40"
              : "bg-white/5 text-slate-200 hover:bg-white/10"
          }`}
          title={section.title}
        >
          {section.order || 1}
        </button>

        {isActive && (
          <div className="absolute left-full top-0 ml-3 hidden min-w-52 rounded-2xl border border-slate-700/50 bg-slate-950 p-3 shadow-2xl group-hover:block">
            <p className="text-sm font-semibold text-white">{section.title}</p>
            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onOpenLesson(section._id)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
              >
                <Plus className="h-3.5 w-3.5" />
                Add lesson
              </button>
              <button
                type="button"
                onClick={() => onOpenQuiz(section._id, sectionQuizId)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-slate-800"
              >
                <FileQuestion className="h-3.5 w-3.5" />
                {sectionQuizId ? "Edit quiz" : "Add quiz"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderExpandedSection = (section: CourseSection) => {
    const isActive = section._id === selectedSectionId;
    const sectionQuizId = typeof section.sectionQuiz === "string" ? section.sectionQuiz : section.sectionQuiz?._id;

    return (
      <div
        key={section._id}
        className={`overflow-hidden rounded-2xl border transition ${
          isActive ? "border-sky-300/40 bg-white/10 shadow-lg" : "border-white/10 bg-white/5 hover:bg-white/10"
        }`}
      >
        <button
          type="button"
          onClick={() => onSelectSection(section._id)}
          className="flex w-full items-start gap-3 px-4 py-4 text-left"
        >
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              isActive ? "bg-sky-400 text-slate-950" : "bg-slate-700 text-slate-100"
            }`}
          >
            <Layers className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{section.title}</p>
                <p className="mt-1 text-xs text-slate-300">
                  {section.lessons?.length || 0} lessons
                  {sectionQuizId ? " · quiz ready" : " · quiz not added"}
                </p>
              </div>
              <ChevronRight className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition ${isActive ? "rotate-90" : ""}`} />
            </div>
          </div>
        </button>

        {isActive && (
          <div className="border-t border-white/10 px-4 pb-4 pt-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenLesson(section._id)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
              >
                <Plus className="h-3.5 w-3.5" />
                Add lesson
              </button>
              <button
                type="button"
                onClick={() => onOpenQuiz(section._id, sectionQuizId)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-slate-800"
              >
                <FileQuestion className="h-3.5 w-3.5" />
                {sectionQuizId ? "Edit quiz" : "Add quiz"}
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {(section.lessons || []).length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-700/70 px-3 py-3 text-xs text-slate-300">
                  No lessons yet.
                </div>
              ) : (
                section.lessons.map((lesson) => (
                  <button
                    key={lesson._id}
                    type="button"
                    onClick={() => onOpenLesson(section._id, lesson._id)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs text-slate-200 transition hover:bg-white/10"
                  >
                    <BookOpen className="h-3.5 w-3.5 shrink-0 text-sky-300" />
                    <span className="line-clamp-1 flex-1">{lesson.title}</span>
                    <Pencil className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (collapsed) {
    return (
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-2">
          {sortedSections.map(renderCollapsedSection)}
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex-1 overflow-y-auto px-4 py-4">
      <div className="space-y-3">
        {sortedSections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-600/60 bg-white/5 p-4 text-sm text-slate-300">
            No sections yet. Add your first section from the course overview.
          </div>
        ) : (
          sortedSections.map(renderExpandedSection)
        )}
      </div>
    </nav>
  );
}