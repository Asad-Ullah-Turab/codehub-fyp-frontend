import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { adminCourseAPI, type Course } from "../../../services/adminCourseAPI";
import { useToast } from "../../../contexts/ToastContext";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import CourseList from "./CourseList";
import CourseForm from "./CourseForm";
import SectionManagement from "./SectionManagement";

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    courseId: null as string | null,
  });

  // Section management state
  const [selectedCourseForSections, setSelectedCourseForSections] = useState<Course | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    language: "",
    category: "",
    difficulty: "",
    page: 1,
    limit: 10,
  });

  // Pagination
  // const [pagination, setPagination] = useState({
  //   total: 0,
  //   pages: 0,
  //   currentPage: 1,
  // });

  // Form data
  const [formData, setFormData] = useState<{
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
  }>({
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
  });

  const { showToast } = useToast();

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminCourseAPI.getAllCourses(filters);
      setCourses(response.data);
      // setPagination(response.pagination);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch courses";
      showToast(message, "error");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    fetchCourses();
  }, [filters, fetchCourses]);

  const resetForm = () => {
    setFormData({
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
    });
    setEditingCourse(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (course: Course) => {
    setFormData({
      title: course.title,
      description: course.description,
      shortDescription: course.shortDescription,
      language: course.language,
      category: course.category,
      difficulty: course.difficulty,
      estimatedHours: course.estimatedHours,
      certificateTemplate: course.certificateTemplate,
      tags: course.tags || [],
      prerequisites: course.prerequisites || [],
    });
    setEditingCourse(course);
    setShowAddModal(true);
  };

  const handleSaveCourse = async () => {
    try {
      if (!formData.title || !formData.description || !formData.shortDescription || !formData.language || !formData.category) {
        showToast("Please fill in all required fields", "error");
        return;
      }

      setLoading(true);

      if (editingCourse) {
        await adminCourseAPI.updateCourse(editingCourse._id, formData);
        showToast("Course updated successfully", "success");
      } else {
        await adminCourseAPI.createCourse(formData);
        showToast("Course created successfully", "success");
      }

      fetchCourses();
      setShowAddModal(false);
      resetForm();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save course";
      showToast(message, "error");
      console.error("Error saving course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      setLoading(true);
      await adminCourseAPI.deleteCourse(courseId);
      showToast("Course deleted successfully", "success");
      fetchCourses();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete course";
      showToast(message, "error");
      console.error("Error deleting course:", error);
    } finally {
      setLoading(false);
    }
  };

  const openSectionModal = (course: Course) => {
    setSelectedCourseForSections(course);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600">Create and manage your courses, sections, and lessons</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search courses..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.language}
              onChange={(e) => setFilters({ ...filters, language: e.target.value })}
            >
              <option value="">All Languages</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
              <option value="php">PHP</option>
              <option value="ruby">Ruby</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              <option value="web-development">Web Development</option>
              <option value="mobile-development">Mobile Development</option>
              <option value="data-science">Data Science</option>
              <option value="machine-learning">Machine Learning</option>
              <option value="devops">DevOps</option>
              <option value="security">Security</option>
              <option value="game-development">Game Development</option>
              <option value="blockchain">Blockchain</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            >
              <option value="">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course List */}
      <CourseList
        courses={courses}
        loading={loading}
        onEdit={openEditModal}
        onDelete={(courseId) => setDeleteConfirm({ show: true, courseId })}
        onManageSections={openSectionModal}
      />

      {/* Course Form Modal */}
      <CourseForm
        show={showAddModal}
        editingCourse={editingCourse}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        onSave={handleSaveCourse}
        onCancel={() => {
          setShowAddModal(false);
          resetForm();
        }}
      />

      {/* Section Management Modal */}
      {selectedCourseForSections && (
        <SectionManagement
          course={selectedCourseForSections}
          onClose={() => {
            setSelectedCourseForSections(null);
          }}
        />
      )}

      <ConfirmModal
        isOpen={deleteConfirm.show}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone and will also delete all sections and lessons within this course."
        confirmText="Delete Course"
        cancelText="Cancel"
        onConfirm={async () => {
          if (deleteConfirm.courseId) {
            await handleDeleteCourse(deleteConfirm.courseId);
          }
          setDeleteConfirm({ show: false, courseId: null });
        }}
        onCancel={() => setDeleteConfirm({ show: false, courseId: null })}
      />
    </div>
  );
}