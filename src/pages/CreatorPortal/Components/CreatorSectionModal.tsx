import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { creatorCourseAPI } from "../../../services/creatorCourseAPI";
import type { CourseSection } from "../../../services/adminCourseAPI";
import { useToast } from "../../../contexts/ToastContext";

interface CreatorSectionModalProps {
  open: boolean;
  courseId: string;
  section: CourseSection | null;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}

export default function CreatorSectionModal({
  open,
  courseId,
  section,
  nextOrder,
  onClose,
  onSaved,
}: CreatorSectionModalProps) {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    estimatedHours: 0,
    order: nextOrder,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (section) {
      setFormData({
        title: section.title,
        description: section.description || "",
        estimatedHours: section.estimatedHours || 0,
        order: section.order,
      });
      return;
    }

    setFormData({
      title: "",
      description: "",
      estimatedHours: 0,
      order: nextOrder,
    });
  }, [nextOrder, open, section]);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      showToast("Section title is required.", "error");
      return;
    }

    try {
      setSaving(true);

      if (section) {
        await creatorCourseAPI.updateSection(section._id, formData);
        showToast("Section updated successfully.", "success");
      } else {
        await creatorCourseAPI.createSection(courseId, formData);
        showToast("Section created successfully.", "success");
      }

      await onSaved();
      onClose();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to save section.";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Creator workspace</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {section ? "Edit section" : "Add section"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto px-6 py-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900">Section title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter section title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900">Description</label>
            <textarea
              value={formData.description}
              onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Explain what this section covers"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-900">Order</label>
              <input
                type="number"
                min="0"
                value={formData.order}
                onChange={(event) => setFormData((prev) => ({ ...prev, order: Number(event.target.value) || 0 }))}
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
            {saving ? "Saving..." : section ? "Update section" : "Create section"}
          </button>
        </div>
      </div>
    </div>
  );
}