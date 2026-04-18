import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../contexts/ToastContext";
import CreatorCourseForm from "./CreatorCourseForm";
import CreatorCourseList from "./CreatorCourseList";
import creatorCourseAPI, { type CreatorCourseFormData } from "../../services/creatorCourseAPI";

const initialFormData: CreatorCourseFormData = {
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

export default function CreatorPortal() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [courses, setCourses] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CreatorCourseFormData>(initialFormData);
  const [activeTab, setActiveTab] = useState<"my-courses" | "create-course">("my-courses");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/signin");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isLoading && user && user.role !== "creator") {
      navigate("/");
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    if (user?.role === "creator") {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await creatorCourseAPI.getMyCourses();
      setCourses(response.data || []);
    } catch (error) {
      console.error("Error fetching creator courses:", error);
      showToast("Unable to load your courses", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.shortDescription.trim() || !formData.language || !formData.category) {
      showToast("Please fill in all required course fields.", "error");
      return;
    }

    try {
      setSaving(true);
      await creatorCourseAPI.createCourse(formData);
      showToast("Course created successfully", "success");
      setFormData(initialFormData);
      setActiveTab("my-courses");
      fetchCourses();
    } catch (error) {
      console.error("Error creating course:", error);
      showToast("Failed to create course", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRequestPublish = async (courseId: string) => {
    try {
      await creatorCourseAPI.requestPublishCourse(courseId);
      showToast("Publish request submitted", "success");
      fetchCourses();
    } catch (error) {
      console.error("Error requesting publish:", error);
      showToast("Could not submit publish request", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-indigo-600">Creator Portal</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">Manage your creator courses</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Create course drafts, request publication, and track the status of your creator submissions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "my-courses" ? "create-course" : "my-courses")}
              className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              {activeTab === "my-courses" ? "Create new course" : "View my courses"}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
                <p className="mt-2 text-sm text-slate-600">Switch between the creator dashboard and course creation tools.</p>
              </div>
              <button
                onClick={() => setActiveTab("my-courses")}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeTab === "my-courses"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                My Courses
              </button>
              <button
                onClick={() => setActiveTab("create-course")}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeTab === "create-course"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                Create Course
              </button>
            </div>
          </aside>

          <main>
            {activeTab === "my-courses" ? (
              <CreatorCourseList courses={courses} loading={loading} onRequestPublish={handleRequestPublish} />
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Create a new course</h2>
                    <p className="mt-2 text-sm text-slate-600">Save a course draft and submit it for admin approval when it is ready.</p>
                  </div>
                </div>
                <CreatorCourseForm formData={formData} setFormData={setFormData} />
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCreateCourse}
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {saving ? "Saving course..." : "Save draft"}
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
