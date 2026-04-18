import { ListChecks, Pencil, Plus, Trash2 } from "lucide-react";
import type { CourseSection, CourseLesson, Quiz } from "../../services/adminCourseAPI";
import type { LessonForm, QuizForm, SectionForm } from "./CreatorCourseTypes";
import CreatorCourseSectionDetails from "./CreatorCourseSectionDetails";

interface CreatorCourseSectionsProps {
  sections: CourseSection[];
  selectedSection: CourseSection | null;
  sectionLessons: CourseLesson[];
  selectedQuiz: Quiz | null;
  sectionForm: SectionForm;
  lessonForm: LessonForm;
  quizForm: QuizForm;
  editingSectionId: string | null;
  editingLessonId: string | null;
  savingSection: boolean;
  savingLesson: boolean;
  savingQuiz: boolean;
  showSectionForm: boolean;
  onNewSection: () => void;
  onCloseSection: () => void;
  onCloseForm: () => void;
  onSelectSection: (section: CourseSection) => void;
  onEditSection: (section: CourseSection) => void;
  onDeleteSection: (sectionId: string) => void;
  onChangeSectionForm: (form: SectionForm) => void;
  onSaveSection: () => void;
  onResetSectionForm: () => void;
  onSaveLesson: () => void;
  onEditLesson: (lesson: CourseLesson) => void;
  onDeleteLesson: (lessonId: string) => void;
  onLessonFormChange: (form: LessonForm) => void;
  onResetLessonForm: () => void;
  onSaveQuiz: () => void;
  onDeleteQuiz: () => void;
  onQuizFormChange: (form: QuizForm) => void;
  onResetQuizForm: () => void;
}

export default function CreatorCourseSections({
  sections,
  selectedSection,
  sectionLessons,
  selectedQuiz,
  sectionForm,
  lessonForm,
  quizForm,
  editingSectionId,
  editingLessonId,
  savingSection,
  savingLesson,
  savingQuiz,
  onNewSection,
  onCloseSection,
  onCloseForm,
  onSelectSection,
  onEditSection,
  onDeleteSection,
  onChangeSectionForm,
  onSaveSection,
  onResetSectionForm,
  onSaveLesson,
  onEditLesson,
  onDeleteLesson,
  onLessonFormChange,
  onResetLessonForm,
  onSaveQuiz,
  onDeleteQuiz,
  onQuizFormChange,
  onResetQuizForm,
  showSectionForm,
}: CreatorCourseSectionsProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Sections</h2>
            <p className="mt-1 text-sm text-slate-500">Create and manage course sections, lessons, and quizzes.</p>
          </div>
          <button
            type="button"
            onClick={onNewSection}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> New Section
          </button>
        </div>
        <div className="space-y-4">
          {sections.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-600">
              No sections yet. Add a section to get started.
            </div>
          ) : (
            sections.map((section) => {
              const isSelected = selectedSection?._id === section._id;
              return (
                <div
                  key={section._id}
                  className={`rounded-3xl border p-5 shadow-sm transition ${
                    isSelected ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{section.description || "No description"}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-slate-100 px-2 py-1">Order: {section.order}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-1">Lessons: {section.lessons?.length || 0}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-1">Hours: {section.estimatedHours}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => (isSelected ? onCloseSection() : onSelectSection(section))}
                        className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                          isSelected ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                        }`}
                      >
                        <ListChecks className="h-4 w-4" /> {isSelected ? "Close" : "Manage"}
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditSection(section)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-200"
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSection(section._id)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="mt-6 border-t border-slate-200 pt-6">
                      <CreatorCourseSectionDetails
                        selectedSectionTitle={section.title}
                        sectionLessons={sectionLessons}
                        selectedQuiz={selectedQuiz}
                        lessonForm={lessonForm}
                        quizForm={quizForm}
                        editingLessonId={editingLessonId}
                        savingLesson={savingLesson}
                        savingQuiz={savingQuiz}
                        onCloseSection={onCloseSection}
                        onEditLesson={onEditLesson}
                        onDeleteLesson={onDeleteLesson}
                        onLessonFormChange={onLessonFormChange}
                        onSaveLesson={onSaveLesson}
                        onResetLessonForm={onResetLessonForm}
                        onDeleteQuiz={onDeleteQuiz}
                        onQuizFormChange={onQuizFormChange}
                        onSaveQuiz={onSaveQuiz}
                        onResetQuizForm={onResetQuizForm}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {!showSectionForm ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
            <p className="text-sm font-semibold text-slate-900">Section form is hidden.</p>
            <p className="mt-2 text-sm text-slate-500">Click + New Section or Edit to open the section form.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{editingSectionId ? "Edit Section" : "Add Section"}</h2>
                <p className="mt-1 text-sm text-slate-500">Use this panel to create or edit the current section.</p>
              </div>
              <button
                type="button"
                onClick={onCloseForm}
                className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-200"
              >
                Close form
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900">Title</label>
                <input
                  value={sectionForm.title}
                  onChange={(event) => onChangeSectionForm({ ...sectionForm, title: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900">Description</label>
                <textarea
                  value={sectionForm.description}
                  onChange={(event) => onChangeSectionForm({ ...sectionForm, description: event.target.value })}
                  className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  rows={4}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-900">Order</label>
                  <input
                    type="number"
                    min={1}
                    value={sectionForm.order}
                    onChange={(event) => onChangeSectionForm({ ...sectionForm, order: Number(event.target.value) || 1 })}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900">Estimated Hours</label>
                  <input
                    type="number"
                    min={0}
                    value={sectionForm.estimatedHours}
                    onChange={(event) => onChangeSectionForm({ ...sectionForm, estimatedHours: Number(event.target.value) || 0 })}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onResetSectionForm}
                  className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-200"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={onSaveSection}
                  disabled={savingSection}
                  className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {savingSection ? "Saving..." : editingSectionId ? "Update Section" : "Add Section"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
