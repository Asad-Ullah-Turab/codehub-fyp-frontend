import type { Dispatch, SetStateAction } from "react";
import type { CreatorCourseFormData } from "../CreatorPortal/CreatorPortal";

interface CreatorCourseFormProps {
  formData: CreatorCourseFormData;
  setFormData: Dispatch<SetStateAction<CreatorCourseFormData>>;
}

export default function CreatorCourseForm({ formData, setFormData }: CreatorCourseFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-900">Course Title *</label>
          <input
            value={formData.title}
            onChange={(event) => setFormData({ ...formData, title: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Enter course title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900">Short Description *</label>
          <input
            value={formData.shortDescription}
            onChange={(event) => setFormData({ ...formData, shortDescription: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="One-line summary for learners"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900">Detailed Description *</label>
        <textarea
          value={formData.description}
          onChange={(event) => setFormData({ ...formData, description: event.target.value })}
          className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          rows={5}
          placeholder="Explain what learners will gain from this course"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-900">Language *</label>
          <select
            value={formData.language}
            onChange={(event) => setFormData({ ...formData, language: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Select language</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="sql">SQL</option>
            <option value="rust">Rust</option>
            <option value="haskell">Haskell</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900">Category *</label>
          <select
            value={formData.category}
            onChange={(event) => setFormData({ ...formData, category: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Select category</option>
            <option value="programming-language">Programming Language</option>
            <option value="data-structures">Data Structures</option>
            <option value="algorithms">Algorithms</option>
            <option value="web-development">Web Development</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(event) =>
              setFormData({
                ...formData,
                difficulty: event.target.value as "beginner" | "intermediate" | "advanced",
              })
            }
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-900">Estimated Hours</label>
          <input
            type="number"
            value={formData.estimatedHours}
            onChange={(event) =>
              setFormData({ ...formData, estimatedHours: Number(event.target.value) || 0 })
            }
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Estimated study time"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
            <input
              type="checkbox"
              checked={!!formData.isPremium}
              onChange={(event) => setFormData({ ...formData, isPremium: event.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Premium course
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900">Tags</label>
        <input
          value={formData.tags.join(", ")}
          onChange={(event) =>
            setFormData({
              ...formData,
              tags: event.target.value
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            })
          }
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Example: javascript, algorithms, beginner"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900">Prerequisites</label>
        <input
          value={formData.prerequisites.join(", ")}
          onChange={(event) =>
            setFormData({
              ...formData,
              prerequisites: event.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Comma-separated course IDs"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-900">Learning Objectives</label>
          <input
            value={formData.learningObjectives.join(", ")}
            onChange={(event) =>
              setFormData({
                ...formData,
                learningObjectives: event.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Example: Build a full-stack app"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900">Outcomes</label>
          <input
            value={formData.outcomes.join(", ")}
            onChange={(event) =>
              setFormData({
                ...formData,
                outcomes: event.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Example: Deploy a Node app"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900">Requirements</label>
        <input
          value={formData.requirements.join(", ")}
          onChange={(event) =>
            setFormData({
              ...formData,
              requirements: event.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Example: Basic JavaScript knowledge"
        />
      </div>
    </div>
  );
}
