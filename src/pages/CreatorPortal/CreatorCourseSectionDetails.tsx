import { Pencil, Trash2 } from "lucide-react";
import type { CourseLesson, Quiz } from "../../services/adminCourseAPI";
import type { LessonForm, QuizForm } from "./CreatorCourseTypes";

interface CreatorCourseSectionDetailsProps {
  selectedSectionTitle: string;
  sectionLessons: CourseLesson[];
  selectedQuiz: Quiz | null;
  lessonForm: LessonForm;
  quizForm: QuizForm;
  editingLessonId: string | null;
  savingLesson: boolean;
  savingQuiz: boolean;
  onCloseSection: () => void;
  onEditLesson: (lesson: CourseLesson) => void;
  onDeleteLesson: (lessonId: string) => void;
  onLessonFormChange: (form: LessonForm) => void;
  onSaveLesson: () => void;
  onResetLessonForm: () => void;
  onDeleteQuiz: () => void;
  onQuizFormChange: (form: QuizForm) => void;
  onSaveQuiz: () => void;
  onResetQuizForm: () => void;
}

export default function CreatorCourseSectionDetails({
  selectedSectionTitle,
  sectionLessons,
  selectedQuiz,
  lessonForm,
  quizForm,
  editingLessonId,
  savingLesson,
  savingQuiz,
  onCloseSection,
  onEditLesson,
  onDeleteLesson,
  onLessonFormChange,
  onSaveLesson,
  onResetLessonForm,
  onDeleteQuiz,
  onQuizFormChange,
  onSaveQuiz,
  onResetQuizForm,
}: CreatorCourseSectionDetailsProps) {
  return (
    <div className="mt-10 border-t border-slate-200 pt-6">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Manage Section: {selectedSectionTitle}</h3>
          <p className="mt-1 text-sm text-slate-500">Add lessons or review the section quiz.</p>
        </div>
        <button
          type="button"
          onClick={onCloseSection}
          className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-200"
        >
          Close section
        </button>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h4 className="text-lg font-semibold text-slate-900">Lessons</h4>
            <span className="text-sm text-slate-500">{sectionLessons.length} lessons</span>
          </div>
          <div className="space-y-4">
            {sectionLessons.length === 0 ? (
              <p className="text-sm text-slate-500">No lessons added yet.</p>
            ) : (
              sectionLessons.map((lesson) => (
                <div key={lesson._id} className="rounded-[20px] border border-slate-200 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h5 className="text-base font-semibold text-slate-900">{lesson.title}</h5>
                      <p className="text-sm text-slate-500">{lesson.description || "No description"}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onEditLesson(lesson)}
                        className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-200"
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteLesson(lesson._id)}
                        className="rounded-2xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 p-5">
          <h4 className="text-lg font-semibold text-slate-900">{editingLessonId ? "Edit Lesson" : "Add Lesson"}</h4>
          <p className="mt-1 text-sm text-slate-500">{editingLessonId ? "Editing the selected lesson. Update its content and save." : "Create a new lesson for this section."}</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900">Title</label>
              <input
                value={lessonForm.title}
                onChange={(event) => onLessonFormChange({ ...lessonForm, title: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900">Content</label>
              <textarea
                value={lessonForm.content}
                onChange={(event) => onLessonFormChange({ ...lessonForm, content: event.target.value })}
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
                  value={lessonForm.order}
                  onChange={(event) => onLessonFormChange({ ...lessonForm, order: Number(event.target.value) || 1 })}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900">Duration (minutes)</label>
                <input
                  type="number"
                  min={0}
                  value={lessonForm.duration}
                  onChange={(event) => onLessonFormChange({ ...lessonForm, duration: Number(event.target.value) || 0 })}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onResetLessonForm}
                className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-200"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={onSaveLesson}
                disabled={savingLesson}
                className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {savingLesson ? "Saving..." : editingLessonId ? "Update Lesson" : "Add Lesson"}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h4 className="text-lg font-semibold text-slate-900">Section Quiz</h4>
              <p className="mt-1 text-sm text-slate-500">Create or edit a section quiz for this section.</p>
            </div>
            {selectedQuiz && (
              <button
                type="button"
                onClick={onDeleteQuiz}
                className="rounded-2xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
              >
                Delete Quiz
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900">Quiz Title</label>
              <input
                value={quizForm.title}
                onChange={(event) => onQuizFormChange({ ...quizForm, title: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900">Description</label>
              <textarea
                value={quizForm.description}
                onChange={(event) => onQuizFormChange({ ...quizForm, description: event.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                rows={3}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-900">Passing Score</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={quizForm.passingScore}
                  onChange={(event) => onQuizFormChange({ ...quizForm, passingScore: Number(event.target.value) || 0 })}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900">Time Limit (minutes)</label>
                <input
                  type="number"
                  min={0}
                  value={quizForm.timeLimit}
                  onChange={(event) => onQuizFormChange({ ...quizForm, timeLimit: Number(event.target.value) || 0 })}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 p-4 bg-slate-50">
              <div className="flex items-center justify-between gap-4 mb-3">
                <h5 className="text-sm font-semibold text-slate-900">Questions</h5>
                <button
                  type="button"
                  onClick={onResetQuizForm}
                  className="rounded-2xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Reset
                </button>
              </div>
              <div className="space-y-4">
                {quizForm.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-sm font-semibold text-slate-900">Question {questionIndex + 1}</span>
                      <button
                        type="button"
                        onClick={() =>
                          onQuizFormChange({
                            ...quizForm,
                            questions: quizForm.questions.filter((_, idx) => idx !== questionIndex),
                          })
                        }
                        className="text-xs font-semibold text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-900">Question</label>
                        <input
                          value={question.question}
                          onChange={(event) =>
                            onQuizFormChange({
                              ...quizForm,
                              questions: quizForm.questions.map((item, idx) =>
                                idx === questionIndex ? { ...item, question: event.target.value } : item,
                              ),
                            })
                          }
                          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-900">Explanation</label>
                        <input
                          value={question.explanation}
                          onChange={(event) =>
                            onQuizFormChange({
                              ...quizForm,
                              questions: quizForm.questions.map((item, idx) =>
                                idx === questionIndex ? { ...item, explanation: event.target.value } : item,
                              ),
                            })
                          }
                          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-slate-900">Points</label>
                          <input
                            type="number"
                            min={1}
                            value={question.points}
                            onChange={(event) =>
                              onQuizFormChange({
                                ...quizForm,
                                questions: quizForm.questions.map((item, idx) =>
                                  idx === questionIndex
                                    ? { ...item, points: Number(event.target.value) || 1 }
                                    : item,
                                ),
                              })
                            }
                            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-900">Answer Type</label>
                          <select
                            value={question.type}
                            onChange={(event) =>
                              onQuizFormChange({
                                ...quizForm,
                                questions: quizForm.questions.map((item, idx) =>
                                  idx === questionIndex ? { ...item, type: event.target.value } : item,
                                ),
                              })
                            }
                            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                          >
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="short-answer">Short Answer</option>
                            <option value="true-false">True / False</option>
                          </select>
                        </div>
                      </div>
                      {question.type === "multiple-choice" && (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-slate-900">Options</p>
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-3">
                              <input
                                value={option.text}
                                onChange={(event) =>
                                  onQuizFormChange({
                                    ...quizForm,
                                    questions: quizForm.questions.map((item, idx) =>
                                      idx === questionIndex
                                        ? {
                                            ...item,
                                            options: item.options.map((opt, optIdx) =>
                                              optIdx === optionIndex ? { ...opt, text: event.target.value } : opt,
                                            ),
                                          }
                                        : item,
                                    ),
                                  })
                                }
                                className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                              />
                              <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={option.isCorrect}
                                  onChange={(event) =>
                                    onQuizFormChange({
                                      ...quizForm,
                                      questions: quizForm.questions.map((item, idx) =>
                                        idx === questionIndex
                                          ? {
                                              ...item,
                                              options: item.options.map((opt, optIdx) =>
                                                optIdx === optionIndex ? { ...opt, isCorrect: event.target.checked } : opt,
                                              ),
                                            }
                                          : item,
                                      ),
                                    })
                                  }
                                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                Correct
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onResetQuizForm}
                className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-200"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={onSaveQuiz}
                disabled={savingQuiz}
                className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {savingQuiz ? "Saving..." : "Save Quiz"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
