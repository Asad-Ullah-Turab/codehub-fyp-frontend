import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Save } from "lucide-react";
import { useToast } from "../../../contexts/ToastContext";
import { creatorCourseAPI } from "../../../services/creatorCourseAPI";
import type { CourseLesson } from "../../../services/adminCourseAPI";
import type { CreatorCourseWorkspaceContextValue } from "./CreatorCourseWorkspace";

const blankForm = {
  title: "",
  description: "",
  content: "",
  order: 1,
  videoUrl: "",
  duration: 0,
  difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
  estimatedHours: 0,
  notes: [""] as string[],
  tips: [""] as string[],
};

const toArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

export default function CreatorLessonEditor() {
  const { course, selectedSection, openSectionOverview, refreshCourse } = useOutletContext<CreatorCourseWorkspaceContextValue>();
  const navigate = useNavigate();
  const { sectionId, lessonId } = useParams<{ sectionId: string; lessonId?: string }>();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sectionLessons, setSectionLessons] = useState<CourseLesson[]>([]);
  const [editingLesson, setEditingLesson] = useState<CourseLesson | null>(null);
  const [formData, setFormData] = useState(blankForm);

  const isEditing = useMemo(() => Boolean(lessonId && lessonId !== "new"), [lessonId]);

  useEffect(() => {
    const loadLessons = async () => {
      if (!sectionId) {
        return;
      }

      try {
        setLoading(true);
        const response = await creatorCourseAPI.getSectionLessons(sectionId);
        const data = response?.data ?? response;
        const lessons = toArray<CourseLesson>(data);
        setSectionLessons(lessons);

        if (isEditing) {
          const lesson = lessons.find((item) => item._id === lessonId) || null;
          setEditingLesson(lesson);
          if (lesson) {
            setFormData({
              title: lesson.title,
              description: lesson.description || "",
              content: lesson.content || "",
              order: lesson.order || 1,
              videoUrl: lesson.videoUrl || "",
              duration: lesson.duration || 0,
              difficulty: (lesson.difficulty as "beginner" | "intermediate" | "advanced") || "beginner",
              estimatedHours: lesson.estimatedHours || 0,
              notes: lesson.notes && lesson.notes.length ? lesson.notes : [""],
              tips: lesson.tips && lesson.tips.length ? lesson.tips : [""],
            });
          }
        } else {
          setEditingLesson(null);
          setFormData((prev) => ({
            ...blankForm,
            order: lessons.length + 1,
            notes: prev.notes.length ? prev.notes : [""],
            tips: prev.tips.length ? prev.tips : [""],
          }));
        }
      } catch (error) {
        console.error("Error loading section lessons:", error);
        showToast("Unable to load lessons for this section.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [isEditing, lessonId, sectionId, showToast]);

  const updateNote = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      notes: prev.notes.map((note, noteIndex) => (noteIndex === index ? value : note)),
    }));
  };

  const addNote = () => {
    setFormData((prev) => ({ ...prev, notes: [...prev.notes, ""] }));
  };

  const removeNote = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      notes: prev.notes.filter((_, noteIndex) => noteIndex !== index),
    }));
  };

  const updateTip = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      tips: prev.tips.map((tip, tipIndex) => (tipIndex === index ? value : tip)),
    }));
  };

  const addTip = () => {
    setFormData((prev) => ({ ...prev, tips: [...prev.tips, ""] }));
  };

  const removeTip = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tips: prev.tips.filter((_, tipIndex) => tipIndex !== index),
    }));
  };

  const handleSave = async () => {
    if (!sectionId) {
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      showToast("Lesson title and content are required.", "error");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        order: formData.order,
        videoUrl: formData.videoUrl,
        duration: formData.duration,
        difficulty: formData.difficulty,
        estimatedHours: formData.estimatedHours,
        notes: formData.notes.filter((note) => note.trim()),
        tips: formData.tips.filter((tip) => tip.trim()),
      };

      if (editingLesson) {
        await creatorCourseAPI.updateLesson(editingLesson._id, payload);
        showToast("Lesson updated successfully.", "success");
      } else {
        await creatorCourseAPI.createLesson(sectionId, payload);
        showToast("Lesson created successfully.", "success");
      }

      await refreshCourse();
      openSectionOverview(sectionId);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to save lesson.";
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
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Lesson editor</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              {editingLesson ? "Edit lesson" : "Add lesson"}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Build the content for {selectedSection.title}. This page keeps the same sidebar so you can move between sections while editing.
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
              {saving ? "Saving..." : editingLesson ? "Update lesson" : "Save lesson"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-900">Lesson title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Enter lesson title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(event) => setFormData((prev) => ({ ...prev, difficulty: event.target.value as typeof formData.difficulty }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900">Description</label>
              <textarea
                value={formData.description}
                onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="Short lesson summary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900">Lesson content *</label>
              <textarea
                value={formData.content}
                onChange={(event) => setFormData((prev) => ({ ...prev, content: event.target.value }))}
                rows={14}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="Write the lesson content here"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-semibold text-slate-900">Order</label>
                <input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(event) => setFormData((prev) => ({ ...prev, order: Number(event.target.value) || 1 }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900">Duration (min)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.duration}
                  onChange={(event) => setFormData((prev) => ({ ...prev, duration: Number(event.target.value) || 0 }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900">Estimated hours</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.estimatedHours}
                  onChange={(event) => setFormData((prev) => ({ ...prev, estimatedHours: Number(event.target.value) || 0 }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-900">Video URL</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(event) => setFormData((prev) => ({ ...prev, videoUrl: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="https://..."
                />
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Selected section</p>
                <p className="mt-1">{selectedSection.title}</p>
                <p className="mt-1">{sectionLessons.length} existing lessons</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Notes</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">Teaching notes</h3>
              </div>
              <button
                type="button"
                onClick={addNote}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {formData.notes.map((note, index) => (
                <div key={`note-${index}`} className="flex gap-2">
                  <input
                    type="text"
                    value={note}
                    onChange={(event) => updateNote(index, event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Lesson note"
                  />
                  <button
                    type="button"
                    onClick={() => removeNote(index)}
                    className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Tips</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">Quick tips</h3>
              </div>
              <button
                type="button"
                onClick={addTip}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {formData.tips.map((tip, index) => (
                <div key={`tip-${index}`} className="flex gap-2">
                  <input
                    type="text"
                    value={tip}
                    onChange={(event) => updateTip(index, event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Helpful tip"
                  />
                  <button
                    type="button"
                    onClick={() => removeTip(index)}
                    className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}