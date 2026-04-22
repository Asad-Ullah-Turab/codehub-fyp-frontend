import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "../../../contexts/ToastContext";
import { creatorCourseAPI } from "../../../services/creatorCourseAPI";

interface CreatorCreateCourseModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => Promise<void> | void;
}

const initialFormData = {
  title: "",
  shortDescription: "",
  description: "",
  language: "javascript",
  category: "programming-language",
  difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
  estimatedHours: 0,
  targetAudience: "",
  tags: [] as string[],
  requirements: [] as string[],
  isPremium: false,
};

export default function CreatorCreateCourseModal({ open, onClose, onCreated }: CreatorCreateCourseModalProps) {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  const handleClose = () => {
    setFormData(initialFormData);
    setTagInput("");
    setRequirementInput("");
    onClose();
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (!value) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(value) ? prev.tags : [...prev.tags, value],
    }));
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((item) => item !== tag),
    }));
  };

  const addRequirement = () => {
    const value = requirementInput.trim();
    if (!value) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.includes(value)
        ? prev.requirements
        : [...prev.requirements, value],
    }));
    setRequirementInput("");
  };

  const removeRequirement = (requirement: string) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((item) => item !== requirement),
    }));
  };

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.shortDescription.trim() || !formData.description.trim()) {
      showToast("Title, short description, and description are required.", "error");
      return;
    }

    try {
      setSaving(true);
      await creatorCourseAPI.createCourse({
        title: formData.title,
        shortDescription: formData.shortDescription,
        description: formData.description,
        language: formData.language,
        category: formData.category,
        difficulty: formData.difficulty,
        estimatedHours: formData.estimatedHours,
        certificateTemplate: "standard",
        tags: formData.tags,
        prerequisites: [],
        targetAudience: formData.targetAudience,
        learningObjectives: [],
        outcomes: [],
        requirements: formData.requirements,
        isPremium: formData.isPremium,
      });
      showToast("Course created successfully.", "success");
      setFormData(initialFormData);
      await onCreated();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Unable to create course.";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Creator dashboard</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Create new course</h2>
          </div>
          <button type="button" onClick={handleClose} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
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
                <select
                  value={formData.language}
                  onChange={(event) => setFormData((prev) => ({ ...prev, language: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="sql">SQL</option>
                  <option value="rust">Rust</option>
                  <option value="haskell">Haskell</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900">Category</label>
                <select
                  value={formData.category}
                  onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="programming-language">Programming language</option>
                  <option value="data-structures">Data structures</option>
                  <option value="algorithms">Algorithms</option>
                  <option value="web-development">Web development</option>
                  <option value="mobile-development">Mobile development</option>
                  <option value="data-science">Data science</option>
                  <option value="machine-learning">Machine learning</option>
                  <option value="devops">DevOps</option>
                  <option value="security">Security</option>
                  <option value="game-development">Game development</option>
                  <option value="blockchain">Blockchain</option>
                  <option value="cloud-computing">Cloud computing</option>
                  <option value="databases">Databases</option>
                  <option value="system-design">System design</option>
                  <option value="testing-qa">Testing & QA</option>
                  <option value="other">Other</option>
                </select>
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
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Add
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.tags.length === 0 ? (
                  <span className="text-sm text-slate-500">No tags added.</span>
                ) : (
                  formData.tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                      title="Remove"
                    >
                      {tag} ×
                    </button>
                  ))
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900">Requirements</label>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={requirementInput}
                  onChange={(event) => setRequirementInput(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Add a requirement"
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Add
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.requirements.length === 0 ? (
                  <span className="text-sm text-slate-500">No requirements added.</span>
                ) : (
                  formData.requirements.map((requirement) => (
                    <button
                      key={requirement}
                      type="button"
                      onClick={() => removeRequirement(requirement)}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                      title="Remove"
                    >
                      {requirement} ×
                    </button>
                  ))
                )}
              </div>
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
            onClick={handleClose}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={saving}
            className="theme-primary-button rounded-full px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create course"}
          </button>
        </div>
      </div>
    </div>
  );
}
