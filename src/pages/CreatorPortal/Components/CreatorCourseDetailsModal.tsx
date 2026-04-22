import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useToast } from "../../../contexts/ToastContext";
import { creatorCourseAPI } from "../../../services/creatorCourseAPI";
import type { Course } from "../../../services/adminCourseAPI";

interface CreatorCourseDetailsModalProps {
  open: boolean;
  course: Course | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}

const splitList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function CreatorCourseDetailsModal({ open, course, onClose, onSaved }: CreatorCourseDetailsModalProps) {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    language: "",
    category: "",
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    estimatedHours: 0,
    targetAudience: "",
    tags: "",
    requirements: "",
    isPremium: false,
  });

  useEffect(() => {
    if (!open || !course) {
      return;
    }

    setFormData({
      title: course.title || "",
      shortDescription: course.shortDescription || "",
      description: course.description || "",
      language: course.language || "",
      category: course.category || "",
      difficulty: (course.difficulty as "beginner" | "intermediate" | "advanced") || "beginner",
      estimatedHours: course.estimatedHours || 0,
      targetAudience: course.targetAudience || "",
      tags: Array.isArray(course.tags) ? course.tags.join(", ") : "",
      requirements: Array.isArray(course.requirements) ? course.requirements.join(", ") : "",
      isPremium: Boolean(course.isPremium),
    });
  }, [course, open]);

  const handleSave = async () => {
    if (!course) {
      return;
    }

    if (!formData.title.trim() || !formData.shortDescription.trim() || !formData.description.trim()) {
      showToast("Title, short description, and description are required.", "error");
      return;
    }

    try {
      setSaving(true);
      await creatorCourseAPI.updateCourse(course._id, {
        title: formData.title,
        shortDescription: formData.shortDescription,
        description: formData.description,
        language: formData.language,
        category: formData.category,
        difficulty: formData.difficulty,
        estimatedHours: formData.estimatedHours,
        targetAudience: formData.targetAudience,
        tags: splitList(formData.tags),
        requirements: splitList(formData.requirements),
        isPremium: formData.isPremium,
      });
      showToast("Course details updated.", "success");
      await onSaved();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Unable to update course details.";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!open || !course) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Creator dashboard</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Edit course details</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 overflow-y-auto px-6 py-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900">Short description *</label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(event) => setFormData((prev) => ({ ...prev, shortDescription: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900">Description *</label>
              <textarea
                rows={7}
                value={formData.description}
                onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-900">Language</label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(event) => setFormData((prev) => ({ ...prev, language: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-900">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(event) => setFormData((prev) => ({ ...prev, difficulty: event.target.value as typeof formData.difficulty }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900">Estimated hours</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.estimatedHours}
                  onChange={(event) => setFormData((prev) => ({ ...prev, estimatedHours: Number(event.target.value) || 0 }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900">Target audience</label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(event) => setFormData((prev) => ({ ...prev, targetAudience: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900">Tags</label>
              <textarea
                rows={3}
                value={formData.tags}
                onChange={(event) => setFormData((prev) => ({ ...prev, tags: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="Comma-separated tags"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900">Requirements</label>
              <textarea
                rows={3}
                value={formData.requirements}
                onChange={(event) => setFormData((prev) => ({ ...prev, requirements: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="Comma-separated requirements"
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={formData.isPremium}
                onChange={(event) => setFormData((prev) => ({ ...prev, isPremium: event.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200"
              />
              Premium course
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="theme-primary-button rounded-full px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}