import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { adminCourseAPI } from "../../../services/adminCourseAPI";
import { useToast } from "../../../contexts/ToastContext";
import CourseForm, { type CourseFormData } from "../Components/CourseForm";

const initialCourseFormData: CourseFormData = {
  title: "",
  description: "",
  shortDescription: "",
  language: "",
  category: "",
  difficulty: "beginner",
  estimatedHours: 0,
  certificateTemplate: "standard",
  tags: [],
  prerequisites: [],
  targetAudience: "",
  learningObjectives: [],
  outcomes: [],
  requirements: [],
  isPremium: false,
};

const isValidCourseId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export default function CourseCreatePage() {
  const [formData, setFormData] = useState<CourseFormData>(initialCourseFormData);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleCancel = () => {
    navigate("/admin/courses");
  };

  const handleSave = async () => {
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.shortDescription.trim() ||
      !formData.language ||
      !formData.category
    ) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    const invalidPrerequisites = formData.prerequisites?.some(
      (id) => id && !isValidCourseId(id)
    );

    if (invalidPrerequisites) {
      showToast(
        "Prerequisites must be valid 24-character course IDs or left blank.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);
      await adminCourseAPI.createCourse({
        ...formData,
        prerequisites: formData.prerequisites.filter(Boolean),
      });
      showToast("Course created successfully", "success");
      navigate("/admin/courses");
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Failed to create course", "error");
      console.error("Error creating course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white px-8 py-8 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Admin Panel / Courses / Create</p>
            <h1 className="mt-2 text-3xl font-semibold">Create New Course</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Build course metadata, define learning objectives, and configure course details before publishing.
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl p-6">
        <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Course Details</h2>
                  <p className="mt-1 text-sm text-slate-500">Core course metadata and descriptions.</p>
                </div>
              </div>
              <CourseForm formData={formData} setFormData={setFormData} />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Preview & Notes</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Once created, the course will remain in draft mode until you publish it in the Courses dashboard. Use valid prerequisite course IDs if you want to enforce completion order.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Actions</h2>
              <div className="mt-5 flex flex-col gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  type="button"
                >
                  {loading ? "Creating course..." : "Create Course"}
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Need help?</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Fill the required fields and use commas to separate list items. Keep prerequisite course IDs in the correct MongoDB ID format to avoid validation errors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
