import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, CirclePlus, FileQuestion, Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "../../../contexts/ToastContext";
import { creatorCourseAPI } from "../../../services/creatorCourseAPI";
import type { Quiz, QuizQuestion } from "../../../services/adminCourseAPI";
import type { CreatorCourseWorkspaceContextValue } from "./CreatorCourseWorkspace";

const blankQuestion = (order: number): QuizQuestion => ({
  type: "multiple-choice",
  question: "",
  description: "",
  order,
  options: [
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ],
  points: 1,
  explanation: "",
});

export default function CreatorQuizEditor() {
  const { course, selectedSection, openSectionOverview, refreshCourse } = useOutletContext<CreatorCourseWorkspaceContextValue>();
  const navigate = useNavigate();
  const { sectionId, quizId } = useParams<{ sectionId: string; quizId?: string }>();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    passingScore: 70,
    timeLimit: 15,
    shuffleQuestions: true,
    shuffleOptions: true,
    showAnswerExplanation: true,
    retakeAllowed: true,
    maxRetakes: 3,
    questions: [] as QuizQuestion[],
  });

  const isEditing = useMemo(() => Boolean(quizId && quizId !== "new"), [quizId]);

  useEffect(() => {
    const loadQuiz = async () => {
      if (!sectionId) {
        return;
      }

      try {
        setLoading(true);

        if (isEditing && quizId) {
          const response = await creatorCourseAPI.getQuiz(quizId);
          const data = response?.data ?? response;
          const quiz = (data as Quiz) || null;
          setEditingQuiz(quiz);
          if (quiz) {
            setFormData({
              title: quiz.title,
              description: quiz.description || "",
              passingScore: quiz.passingScore || 70,
              timeLimit: quiz.timeLimit || 15,
              shuffleQuestions: quiz.shuffleQuestions,
              shuffleOptions: quiz.shuffleOptions,
              showAnswerExplanation: quiz.showAnswerExplanation,
              retakeAllowed: quiz.retakeAllowed,
              maxRetakes: quiz.maxRetakes,
              questions: quiz.questions || [],
            });
          }
          return;
        }

        const sectionResponse = await creatorCourseAPI.getCourseSections(course?._id || "");
        const sections = Array.isArray(sectionResponse?.data ?? sectionResponse)
          ? (sectionResponse?.data ?? sectionResponse)
          : [];
        const section = sections.find((item: any) => item._id === sectionId);
        const quiz = section?.sectionQuiz && typeof section.sectionQuiz === "object" ? section.sectionQuiz : null;
        setEditingQuiz(quiz);

        if (quiz) {
          setFormData({
            title: quiz.title,
            description: quiz.description || "",
            passingScore: quiz.passingScore || 70,
            timeLimit: quiz.timeLimit || 15,
            shuffleQuestions: quiz.shuffleQuestions,
            shuffleOptions: quiz.shuffleOptions,
            showAnswerExplanation: quiz.showAnswerExplanation,
            retakeAllowed: quiz.retakeAllowed,
            maxRetakes: quiz.maxRetakes,
            questions: quiz.questions || [],
          });
        } else {
          setFormData({
            title: "",
            description: "",
            passingScore: 70,
            timeLimit: 15,
            shuffleQuestions: true,
            shuffleOptions: true,
            showAnswerExplanation: true,
            retakeAllowed: true,
            maxRetakes: 3,
            questions: [blankQuestion(1)],
          });
        }
      } catch (error) {
        console.error("Error loading quiz:", error);
        showToast("Unable to load quiz data.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [course?._id, isEditing, quizId, sectionId, showToast]);

  const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...updates } : question,
      ),
    }));
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, blankQuestion(prev.questions.length + 1)],
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions
        .filter((_, questionIndex) => questionIndex !== index)
        .map((question, questionIndex) => ({ ...question, order: questionIndex + 1 })),
    }));
  };

  const addOption = (questionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: [...(question.options || []), { text: "", isCorrect: false }],
            }
          : question,
      ),
    }));
  };

  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options:
                question.options?.map((option, currentIndex) =>
                  currentIndex === optionIndex ? { ...option, text } : option,
                ) || [],
            }
          : question,
      ),
    }));
  };

  const setCorrectOption = (questionIndex: number, optionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options:
                question.options?.map((option, currentIndex) => ({
                  ...option,
                  isCorrect: currentIndex === optionIndex,
                })) || [],
            }
          : question,
      ),
    }));
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: (question.options || []).filter((_, currentIndex) => currentIndex !== optionIndex),
            }
          : question,
      ),
    }));
  };

  const handleSave = async () => {
    if (!sectionId || !course) {
      return;
    }

    if (!formData.title.trim()) {
      showToast("Quiz title is required.", "error");
      return;
    }

    if (formData.questions.length === 0) {
      showToast("Add at least one question.", "error");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...formData,
        questions: formData.questions.map((question, index) => ({
          ...question,
          order: index + 1,
          options: question.options || [],
        })),
      };

      if (editingQuiz) {
        await creatorCourseAPI.updateQuiz(editingQuiz._id, payload);
        showToast("Quiz updated successfully.", "success");
      } else {
        await creatorCourseAPI.createOrUpdateQuiz({
          ...payload,
          courseId: course._id,
          sectionId,
          type: "section-quiz",
        });
        showToast("Quiz created successfully.", "success");
      }

      await refreshCourse();
      openSectionOverview(sectionId);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to save quiz.";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!course || !selectedSection) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Quiz editor</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              {editingQuiz ? "Edit quiz" : "Add quiz"}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Create the quiz for {selectedSection.title}. This page uses the same course sidebar, so you can move around the course while editing.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openSectionOverview(selectedSection._id)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to section
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className="theme-primary-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : editingQuiz ? "Update quiz" : "Save quiz"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-900">Quiz title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Enter quiz title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900">Passing score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.passingScore}
                  onChange={(event) => setFormData((prev) => ({ ...prev, passingScore: Number(event.target.value) || 0 }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-900">Time limit (minutes)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.timeLimit}
                  onChange={(event) => setFormData((prev) => ({ ...prev, timeLimit: Number(event.target.value) || 0 }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900">Max retakes</label>
                <input
                  type="number"
                  min="0"
                  value={formData.maxRetakes}
                  onChange={(event) => setFormData((prev) => ({ ...prev, maxRetakes: Number(event.target.value) || 0 }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900">Description</label>
              <textarea
                value={formData.description}
                onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                rows={4}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="Describe what the quiz checks"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {([
                ["shuffleQuestions", "Shuffle questions"],
                ["shuffleOptions", "Shuffle options"],
                ["showAnswerExplanation", "Show answer explanations"],
                ["retakeAllowed", "Allow retakes"],
              ] as const).map(([field, label]) => (
                <label key={field} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean((formData as any)[field])}
                    onChange={(event) => setFormData((prev) => ({ ...prev, [field]: event.target.checked } as typeof prev))}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Selected section</p>
              <p className="mt-1">{selectedSection.title}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Questions</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Quiz content</h3>
            </div>
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <CirclePlus className="h-4 w-4" />
              Add question
            </button>
          </div>

          <div className="mt-5 space-y-5">
            {formData.questions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
                Add questions to build the section quiz.
              </div>
            ) : (
              formData.questions.map((question, index) => (
                <div key={`question-${index}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Question {index + 1}</p>
                      <h4 className="mt-1 text-base font-semibold text-slate-900">{question.type}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900">Question text</label>
                      <textarea
                        value={question.question}
                        onChange={(event) => updateQuestion(index, { question: event.target.value })}
                        rows={3}
                        className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        placeholder="Enter the question prompt"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900">Question type</label>
                        <select
                          value={question.type}
                          onChange={(event) => updateQuestion(index, { type: event.target.value as QuizQuestion["type"] })}
                          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        >
                          <option value="multiple-choice">Multiple choice</option>
                          <option value="true-false">True / false</option>
                          <option value="short-answer">Short answer</option>
                          <option value="coding">Coding</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900">Points</label>
                        <input
                          type="number"
                          min="1"
                          value={question.points}
                          onChange={(event) => updateQuestion(index, { points: Number(event.target.value) || 1 })}
                          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <label className="block text-sm font-semibold text-slate-900">Options</label>
                        <button
                          type="button"
                          onClick={() => addOption(index)}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add option
                        </button>
                      </div>

                      <div className="mt-3 space-y-3">
                        {(question.options || []).map((option, optionIndex) => (
                          <div key={`${index}-${optionIndex}`} className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setCorrectOption(index, optionIndex)}
                              className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-semibold transition ${
                                option.isCorrect
                                  ? "border-emerald-500 bg-emerald-500 text-white"
                                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                              }`}
                              title="Mark as correct"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <input
                              type="text"
                              value={option.text}
                              onChange={(event) => updateOption(index, optionIndex, event.target.value)}
                              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeOption(index, optionIndex)}
                              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-500 transition hover:bg-slate-50"
                              title="Remove option"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900">Explanation</label>
                      <textarea
                        value={question.explanation || ""}
                        onChange={(event) => updateQuestion(index, { explanation: event.target.value })}
                        rows={3}
                        className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        placeholder="Explain the correct answer"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}