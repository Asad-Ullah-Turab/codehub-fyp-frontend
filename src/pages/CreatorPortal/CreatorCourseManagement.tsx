import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Layers, Users } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import creatorCourseAPI from "../../services/creatorCourseAPI";
import type { Course, CourseSection, CourseLesson, Quiz } from "../../services/adminCourseAPI";
import type { CourseEnrollment, LessonForm, QuizForm, SectionForm } from "./CreatorCourseTypes";
import CreatorCourseOverview from "./CreatorCourseOverview";
import CreatorCourseSections from "./CreatorCourseSections";
import CreatorCourseEnrollments from "./CreatorCourseEnrollments";

interface CreatorCourseManagementProps {
  courseId: string;
  initialCourse?: Course | null;
  onClose: () => void;
}

const defaultSectionForm: SectionForm = {
  title: "",
  description: "",
  order: 1,
  estimatedHours: 0,
};

const defaultLessonForm: LessonForm = {
  title: "",
  description: "",
  content: "",
  order: 1,
  videoUrl: "",
  duration: 0,
  difficulty: "beginner",
  estimatedHours: 0,
  codeExamples: [
    {
      title: "",
      description: "",
      code: "",
      language: "javascript",
      input: "",
      expectedOutput: "",
      order: 1,
      notes: "",
      explanation: "",
    },
  ],
  notes: [""],
  tips: [""],
  resources: [
    {
      title: "",
      url: "",
      type: "reference",
      description: "",
      order: 1,
    },
  ],
};

const defaultQuizForm: QuizForm = {
  title: "",
  description: "",
  passingScore: 70,
  timeLimit: 0,
  questions: [
    {
      question: "",
      type: "multiple-choice",
      options: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
      ],
      points: 10,
      explanation: "",
    },
  ],
};

export default function CreatorCourseManagement({ courseId, initialCourse = null, onClose }: CreatorCourseManagementProps) {
  const [course, setCourse] = useState<Course | null>(initialCourse);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [ratings, setRatings] = useState<{ averageRating: number; ratingCount: number } | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "sections" | "enrollments">("overview");
  const [loading, setLoading] = useState(false);
  const [savingSection, setSavingSection] = useState(false);
  const [savingLesson, setSavingLesson] = useState(false);
  const [savingQuiz, setSavingQuiz] = useState(false);
  const [savingPublish, setSavingPublish] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState(false);
  const [selectedSection, setSelectedSection] = useState<CourseSection | null>(null);
  const [sectionLessons, setSectionLessons] = useState<CourseLesson[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [sectionForm, setSectionForm] = useState<SectionForm>(defaultSectionForm);
  const [lessonForm, setLessonForm] = useState<LessonForm>(defaultLessonForm);
  const [quizForm, setQuizForm] = useState<QuizForm>(defaultQuizForm);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [showSectionForm, setShowSectionForm] = useState(false);

  const { showToast } = useToast();

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await creatorCourseAPI.getCourse(courseId);
      setCourse(response.data);
    } catch (error: unknown) {
      console.error("Error fetching course:", error);
      if (initialCourse) {
        setCourse(initialCourse);
      }
      const status = (error as any)?.response?.status;
      if (status === 403) {
        showToast("You are not authorized to access this course.", "error");
      } else {
        showToast("Failed to load course details", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await creatorCourseAPI.getCourseSections(courseId);
      setSections(response.data || []);
    } catch (error) {
      console.error("Error fetching sections:", error);
      showToast("Unable to load sections", "error");
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await creatorCourseAPI.getCourseEnrollments(courseId);
      setEnrollments(response.data || []);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      showToast("Unable to load enrollments", "error");
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await creatorCourseAPI.getCourseRatings(courseId);
      setRatings(response.data || { averageRating: 0, ratingCount: 0 });
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const loadSectionLessons = async (section: CourseSection) => {
    try {
      setSelectedSection(section);
      const response = await creatorCourseAPI.getSectionLessons(section._id);
      setSectionLessons(response.data || []);
      if (section.sectionQuiz && typeof section.sectionQuiz === "string") {
        const quizResponse = await creatorCourseAPI.getQuiz(section.sectionQuiz);
        setSelectedQuiz(quizResponse.data || null);
        setEditingQuizId(section.sectionQuiz);
      } else {
        setSelectedQuiz(null);
        setEditingQuizId(null);
      }
    } catch (error) {
      console.error("Error loading section lessons:", error);
      showToast("Unable to load section lessons", "error");
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchSections();
    fetchEnrollments();
    fetchRatings();
  }, [courseId]);

  const resetSectionForm = () => {
    setSectionForm({ ...defaultSectionForm, order: sections.length + 1 });
    setEditingSectionId(null);
  };

  const resetLessonForm = () => {
    setLessonForm({ ...defaultLessonForm, order: sectionLessons.length + 1 });
    setEditingLessonId(null);
  };

  const resetQuizForm = () => {
    setQuizForm(defaultQuizForm);
    setEditingQuizId(null);
  };

  const handleNewSection = () => {
    setSelectedSection(null);
    setSectionLessons([]);
    setSelectedQuiz(null);
    setEditingQuizId(null);
    resetSectionForm();
    resetLessonForm();
    setShowSectionForm(true);
  };

  const handleSaveSection = async () => {
    if (!sectionForm.title.trim()) {
      showToast("Section title is required", "error");
      return;
    }

    try {
      setSavingSection(true);
      if (editingSectionId) {
        await creatorCourseAPI.updateSection(editingSectionId, sectionForm);
        showToast("Section updated", "success");
      } else {
        await creatorCourseAPI.createSection(courseId, sectionForm);
        showToast("Section created", "success");
      }
      await fetchSections();
      resetSectionForm();
    } catch (error) {
      console.error("Error saving section:", error);
      showToast("Failed to save section", "error");
    } finally {
      setSavingSection(false);
    }
  };

  const handleEditSection = (section: CourseSection) => {
    setSelectedSection(section);
    setSectionForm({
      title: section.title,
      description: section.description,
      order: section.order,
      estimatedHours: section.estimatedHours,
    });
    setEditingSectionId(section._id);
    setShowSectionForm(true);
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await creatorCourseAPI.deleteSection(sectionId);
      showToast("Section deleted", "success");
      setSelectedSection((current) => (current?._id === sectionId ? null : current));
      await fetchSections();
    } catch (error) {
      console.error("Error deleting section:", error);
      showToast("Failed to delete section", "error");
    }
  };

  const handleSaveLesson = async () => {
    if (!selectedSection) {
      showToast("Choose a section first", "error");
      return;
    }
    if (!lessonForm.title.trim() || !lessonForm.content.trim()) {
      showToast("Lesson title and content are required", "error");
      return;
    }

    try {
      setSavingLesson(true);
      if (editingLessonId) {
        await creatorCourseAPI.updateLesson(editingLessonId, lessonForm);
        showToast("Lesson updated", "success");
      } else {
        await creatorCourseAPI.createLesson(selectedSection._id, lessonForm);
        showToast("Lesson added", "success");
      }
      await loadSectionLessons(selectedSection);
      resetLessonForm();
    } catch (error) {
      console.error("Error saving lesson:", error);
      showToast("Failed to save lesson", "error");
    } finally {
      setSavingLesson(false);
    }
  };

  const handleEditLesson = (lesson: CourseLesson) => {
    setLessonForm({
      title: lesson.title,
      description: lesson.description || "",
      content: lesson.content,
      order: lesson.order,
      videoUrl: lesson.videoUrl || "",
      duration: lesson.duration || 0,
      difficulty: lesson.difficulty || "beginner",
      estimatedHours: lesson.estimatedHours || 0,
      codeExamples: lesson.codeExamples?.map((example) => ({
        title: example.title,
        description: example.description || "",
        code: example.code,
        language: example.language,
        input: example.input || "",
        expectedOutput: example.expectedOutput || "",
        order: example.order || 1,
        notes: "",
        explanation: "",
      })) || [
        {
          title: "",
          description: "",
          code: "",
          language: "javascript",
          input: "",
          expectedOutput: "",
          order: 1,
          notes: "",
          explanation: "",
        },
      ],
      notes: lesson.notes || [""],
      tips: lesson.tips || [""],
      resources: lesson.resources?.map((resource, index) => ({
        title: resource.title,
        url: resource.url,
        type: resource.type as "documentation" | "article" | "video" | "reference" | "example",
        description: "",
        order: index + 1,
      })) || [
        {
          title: "",
          url: "",
          type: "reference",
          description: "",
          order: 1,
        },
      ],
    });
    setEditingLessonId(lesson._id);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await creatorCourseAPI.deleteLesson(lessonId);
      showToast("Lesson deleted", "success");
      if (selectedSection) {
        await loadSectionLessons(selectedSection);
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
      showToast("Failed to delete lesson", "error");
    }
  };

  const initializeQuizForm = (quiz?: Quiz | null) => {
    if (!quiz) {
      resetQuizForm();
      return;
    }

    setQuizForm({
      title: quiz.title,
      description: quiz.description || "",
      passingScore: quiz.passingScore || 70,
      timeLimit: quiz.timeLimit || 0,
      questions:
        quiz.questions?.map((question) => ({
          question: question.question || "",
          type: question.type,
          options: question.options || [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
          points: question.points || 10,
          explanation: question.explanation || "",
        })) || [
          {
            question: "",
            type: "multiple-choice",
            options: [
              { text: "", isCorrect: true },
              { text: "", isCorrect: false },
            ],
            points: 10,
            explanation: "",
          },
        ],
    });
    setEditingQuizId(quiz._id);
  };

  const handleSaveQuiz = async () => {
    if (!selectedSection) {
      showToast("Select a section before adding a quiz", "error");
      return;
    }
    if (!quizForm.title.trim()) {
      showToast("Quiz title is required", "error");
      return;
    }

    try {
      setSavingQuiz(true);
      await creatorCourseAPI.createOrUpdateQuiz({
        courseId,
        sectionId: selectedSection._id,
        title: quizForm.title,
        description: quizForm.description,
        type: "section-quiz",
        questions: quizForm.questions,
        passingScore: quizForm.passingScore,
        timeLimit: quizForm.timeLimit,
        maxRetakes: 3,
      });
      showToast(editingQuizId ? "Quiz updated" : "Quiz created", "success");
      await loadSectionLessons(selectedSection);
    } catch (error) {
      console.error("Error saving quiz:", error);
      showToast("Failed to save quiz", "error");
    } finally {
      setSavingQuiz(false);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!selectedQuiz) {
      showToast("No quiz selected", "error");
      return;
    }

    try {
      await creatorCourseAPI.deleteQuiz(selectedQuiz._id);
      showToast("Quiz removed", "success");
      setSelectedQuiz(null);
      if (selectedSection) {
        await loadSectionLessons(selectedSection);
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      showToast("Failed to delete quiz", "error");
    }
  };

  const handleCloseSection = () => {
    setSelectedSection(null);
    setSectionLessons([]);
    setSelectedQuiz(null);
    setEditingQuizId(null);
    resetLessonForm();
    resetQuizForm();
  };

  const handleCloseForm = () => {
    setShowSectionForm(false);
    setEditingSectionId(null);
    resetSectionForm();
  };

  const handleTogglePublish = async () => {
    if (!course) return;

    try {
      setSavingPublish(true);
      const response = await creatorCourseAPI.togglePublishCourse(course._id);
      setCourse(response.data);
      showToast(
        `Course ${response.data.isPublished ? "published" : "unpublished"} successfully`,
        "success",
      );
    } catch (error) {
      console.error("Error toggling publish status:", error);
      showToast("Unable to change publish status", "error");
    } finally {
      setSavingPublish(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!course) return;
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this course? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeletingCourse(true);
      await creatorCourseAPI.deleteCourse(course._id);
      showToast("Course deleted successfully", "success");
      onClose();
    } catch (error) {
      console.error("Error deleting course:", error);
      showToast("Unable to delete course", "error");
    } finally {
      setDeletingCourse(false);
    }
  };

  const summaryStats = useMemo(
    () => ({
      enrollments: course?.enrollmentCount || 0,
      rating: ratings?.averageRating || 0,
      totalSections: course?.totalSections || 0,
      totalLessons: course?.totalLessons || 0,
      status: course?.status || "draft",
    }),
    [course, ratings],
  );

  if (loading && !course) {
    return (
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
            <p className="mt-4 text-sm text-slate-600">Loading course management...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-indigo-600">Creator Course Manager</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">{course?.title || "Course management"}</h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage sections, lessons, quizzes, enrollments, and course ratings for your creator course.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {course?.hasAdminApprovedPublish ? (
              <button
                type="button"
                onClick={handleTogglePublish}
                disabled={savingPublish || course.status === "pending"}
                className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
              >
                {savingPublish
                  ? "Updating..."
                  : course.isPublished
                  ? "Unpublish"
                  : "Publish"}
              </button>
            ) : (
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {course?.status === "pending"
                  ? "Publish request is pending admin review."
                  : "Awaiting first admin approval before publish toggle becomes available."}
              </div>
            )}
            <button
              type="button"
              onClick={handleDeleteCourse}
              disabled={deletingCourse}
              className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            >
              {deletingCourse ? "Deleting..." : "Delete Course"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { key: "overview", label: "Overview", icon: BookOpen },
            { key: "sections", label: "Sections", icon: Layers },
            { key: "enrollments", label: "Enrollments", icon: Users },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                activeTab === tab.key
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-700 shadow-sm hover:bg-slate-50"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <CreatorCourseOverview course={course} ratings={ratings} summaryStats={summaryStats} />
        )}

        {activeTab === "sections" && (
          <CreatorCourseSections
            sections={sections}
            selectedSection={selectedSection}
            sectionLessons={sectionLessons}
            selectedQuiz={selectedQuiz}
            sectionForm={sectionForm}
            lessonForm={lessonForm}
            quizForm={quizForm}
            editingSectionId={editingSectionId}
            editingLessonId={editingLessonId}
            savingSection={savingSection}
            savingLesson={savingLesson}
            savingQuiz={savingQuiz}
            showSectionForm={showSectionForm}
            onNewSection={handleNewSection}
            onCloseSection={handleCloseSection}
            onCloseForm={handleCloseForm}
            onSelectSection={loadSectionLessons}
            onEditSection={handleEditSection}
            onDeleteSection={handleDeleteSection}
            onChangeSectionForm={setSectionForm}
            onSaveSection={handleSaveSection}
            onResetSectionForm={resetSectionForm}
            onSaveLesson={handleSaveLesson}
            onEditLesson={handleEditLesson}
            onDeleteLesson={handleDeleteLesson}
            onLessonFormChange={setLessonForm}
            onResetLessonForm={resetLessonForm}
            onSaveQuiz={handleSaveQuiz}
            onDeleteQuiz={handleDeleteQuiz}
            onQuizFormChange={setQuizForm}
            onResetQuizForm={() => initializeQuizForm(selectedQuiz)}
          />
        )}

        {activeTab === "enrollments" && <CreatorCourseEnrollments enrollments={enrollments} ratings={ratings} />}
      </div>
    </div>
  );
}
