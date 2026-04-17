import type { Dispatch, SetStateAction } from "react";

export interface CourseFormData {
  title: string;
  description: string;
  shortDescription: string;
  language: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  certificateTemplate: "standard" | "distinguished" | "excellence";
  tags: string[];
  prerequisites: string[];
  targetAudience: string;
  learningObjectives: string[];
  outcomes: string[];
  requirements: string[];
  isPremium?: boolean;
}

interface CourseFormProps {
  formData: CourseFormData;
  setFormData: Dispatch<SetStateAction<CourseFormData>>;
}

export default function CourseForm({ formData, setFormData }: CourseFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Primary details</h2>
            <p className="mt-2 text-sm text-slate-500">The fields learners see first when browsing courses.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Course Title *</label>
              <input
                type="text"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter course title"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Language *</label>
                <select
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                >
                  <option value="">Select Language</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="sql">SQL</option>
                  <option value="rust">Rust</option>
                  <option value="haskell">Haskell</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                <select
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  <option value="programming-language">Programming Language</option>
                  <option value="data-structures">Data Structures</option>
                  <option value="algorithms">Algorithms</option>
                  <option value="web-development">Web Development</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Short Description *</label>
              <input
                type="text"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="A concise summary for course listings"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty</label>
                <select
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as "beginner" | "intermediate" | "advanced" })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Estimated Hours</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm transition hover:border-blue-500">
                  <input
                    type="checkbox"
                    checked={!!formData.isPremium}
                    onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-slate-700">Premium course</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Advanced settings</h2>
            <p className="mt-2 text-sm text-slate-500">Optional details to make the course more informative.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Certificate Template</label>
              <select
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={formData.certificateTemplate}
                onChange={(e) => setFormData({ ...formData, certificateTemplate: e.target.value as "standard" | "distinguished" | "excellence" })}
              >
                <option value="standard">Standard</option>
                <option value="distinguished">Distinguished</option>
                <option value="excellence">Excellence</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Target Audience</label>
              <input
                type="text"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="Who will benefit from this course?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tags</label>
              <input
                type="text"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={formData.tags.join(", ")}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",").map((tag) => tag.trim()).filter((tag) => tag) })}
                placeholder="Add tags separated by commas"
              />
              <div className="mt-2 text-xs text-slate-500">Separate tags with commas</div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Prerequisites (Course IDs)</label>
              <input
                type="text"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={formData.prerequisites.join(", ")}
                onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value.split(",").map((prereq) => prereq.trim()).filter((prereq) => prereq) })}
                placeholder="Enter prerequisite course IDs separated by commas"
              />
              <div className="mt-2 text-xs text-slate-500">Use valid 24-character course IDs only.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Course description</h2>
          <p className="mt-2 text-sm text-slate-500">Add a detailed description that clearly explains what learners will achieve.</p>
          <textarea
            className="mt-4 h-44 w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed course description..."
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Learning objectives</h3>
            <textarea
              className="mt-4 h-28 w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={(formData.learningObjectives || []).join(", ")}
              onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) })}
              placeholder="Enter objectives separated by commas"
            />
            <div className="mt-2 text-xs text-slate-500">Separate objectives with commas.</div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Course outcomes</h3>
            <textarea
              className="mt-4 h-28 w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={(formData.outcomes || []).join(", ")}
              onChange={(e) => setFormData({ ...formData, outcomes: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) })}
              placeholder="Enter outcomes separated by commas"
            />
            <div className="mt-2 text-xs text-slate-500">Separate outcomes with commas.</div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Requirements</h3>
            <textarea
              className="mt-4 h-28 w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={(formData.requirements || []).join(", ")}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) })}
              placeholder="Enter requirements separated by commas"
            />
            <div className="mt-2 text-xs text-slate-500">Separate requirements with commas.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
