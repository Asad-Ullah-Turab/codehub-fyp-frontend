import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { tutorialAPI } from "../../services/tutorialAPI";
import { useToast } from "../../contexts/ToastContext";
import {
  getProfile,
  updateProfile,
  getDashboardStats,
  getCourseProgress,
  getSavedTutorials,
  updateEnrollmentStatus,
  formatDuration,
  formatProgress,
  getAvatarDisplay,
  markPromptShown,
  uploadProfilePicture,
  type User,
  type DashboardStats,
  type CourseProgress,
  type SavedTutorial,
} from "../../functions/ProfileFunctions/profileFunctions";
import ProfileCompletionModal from "../../components/ProfileCompletionModal/ProfileCompletionModal";
import UserCertificates from "../../components/Certificates/UserCertificates";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import {
  BookOpen,
  CheckCircle,
  Heart,
  Award,
  Clock,
  TrendingUp,
  Settings,
  Mail,
  Edit3,
  ChevronRight,
  Code,
  Target,
  BarChart3,
  ExternalLink,
  Bell,
  LogOut,
  User as UserIcon,
  MapPin,
  Globe,
  X,
  Trash2,
  Layers,
  Sparkles,
  Bookmark,
  Briefcase,
} from "lucide-react";

const ProfilePage: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
      showToast("Signed out", "info");
    } catch (err) {
      console.error("Logout error:", err);
      showToast(
        err instanceof Error ? err.message : "Failed to sign out",
        "error",
      );
    }
  };

  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    tutorialId?: string;
  }>({ show: false });
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
  );
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [savedTutorials, setSavedTutorials] = useState<SavedTutorial[]>([]);
  const [createdTutorials, setCreatedTutorials] = useState<
    {
      _id: string;
      title: string;
      description: string;
      language: string;
      concept: string;
      difficulty: string;
      content: string;
      tags?: string[];
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  type ProfileTab =
    | "overview"
    | "courses"
    | "tutorials"
    | "certificates"
    | "settings";
  const [activeTab, setActiveTab] = useState<ProfileTab>(() => {
    const stored = localStorage.getItem("profileActiveTab");
    if (
      stored &&
      ["overview", "courses", "tutorials", "certificates", "settings"].includes(
        stored,
      )
    ) {
      return stored as ProfileTab;
    }
    return "overview";
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    profilePicture: "",
    dateOfBirth: "",
    bio: "",
    location: "",
    github: "",
    linkedin: "",
    website: "",
    programmingLanguages: [] as string[],
    skills: [] as string[],
    interests: [] as string[],
    experience: "" as "beginner" | "intermediate" | "advanced" | "expert" | "",
    preferences: {
      emailNotifications: true,
    },
  });

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated) {
        window.location.href = "/signin";
        return;
      }

      const [profileRes, statsRes, courseProgressRes, savedTutorialsRes] =
        await Promise.all([
          getProfile(),
          getDashboardStats(),
          getCourseProgress(),
          getSavedTutorials(),
        ]);

      setUser(profileRes.data);
      setDashboardStats(statsRes.data);
      setCourseProgress(courseProgressRes.data);
      setSavedTutorials(savedTutorialsRes.data);

      try {
        const createdRes = await tutorialAPI.getUserCreatedTutorials();
        setCreatedTutorials(createdRes.data || []);
      } catch (err) {
        console.error("Error loading created tutorials:", err);
        setCreatedTutorials([]);
      }

      setProfileForm({
        name: profileRes.data.name,
        profilePicture: profileRes.data.profilePicture || "",
        dateOfBirth: profileRes.data.dateOfBirth || "",
        bio: profileRes.data.bio || "",
        location: profileRes.data.location || "",
        github: profileRes.data.github || "",
        linkedin: profileRes.data.linkedin || "",
        website: profileRes.data.website || "",
        programmingLanguages: profileRes.data.programmingLanguages || [],
        skills: profileRes.data.skills || [],
        interests: profileRes.data.interests || [],
        experience: profileRes.data.experience || "",
        preferences: {
          emailNotifications:
            profileRes.data.preferences?.emailNotifications !== false,
        },
      });

      if (!profileRes.data.profileCompletionPromptShown) {
        setShowProfileModal(true);
      }
    } catch (err) {
      console.error("Error loading profile data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load profile data",
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (
      tabParam &&
      ["overview", "courses", "tutorials", "settings", "certificates"].includes(
        tabParam,
      )
    ) {
      setActiveTab(tabParam as typeof activeTab);
      localStorage.setItem("profileActiveTab", tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem("profileActiveTab", activeTab);
    }
  }, [activeTab]);

  const handleUpdateProfile = async () => {
    try {
      const response = await updateProfile(profileForm);
      setUser(response.data);
      setEditingProfile(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  const handleWithdrawFromCourse = async (enrollmentId: string) => {
    try {
      await updateEnrollmentStatus(enrollmentId, "withdrawn");
      const courseProgressRes = await getCourseProgress();
      setCourseProgress(courseProgressRes.data);
    } catch (err) {
      console.error("Error withdrawing from course:", err);
      setError(
        err instanceof Error ? err.message : "Failed to withdraw from course",
      );
    }
  };

  const handleSkipModal = async () => {
    setShowProfileModal(false);
    try {
      const result = await markPromptShown();
      if (result.data) {
        setUser(result.data);
      }
    } catch (err) {
      console.error("Error marking prompt as shown:", err);
    }
  };

  const handleGoToProfile = async () => {
    setShowProfileModal(false);
    setActiveTab("settings");
    try {
      const result = await markPromptShown();
      if (result.data) {
        setUser(result.data);
      }
    } catch (err) {
      console.error("Error marking prompt as shown:", err);
    }
  };

  const handleContinueAgain = async (enrollmentId: string) => {
    try {
      await updateEnrollmentStatus(enrollmentId, "active");
      const courseProgressRes = await getCourseProgress();
      setCourseProgress(courseProgressRes.data);
    } catch (err) {
      console.error("Error reactivating course:", err);
      setError(
        err instanceof Error ? err.message : "Failed to reactivate course",
      );
    }
  };

  const getDifficultyColorClass = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "intermediate":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "advanced":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDeleteCreatedTutorial = async (tutorialId: string) => {
    try {
      await tutorialAPI.deleteUserTutorial(tutorialId);
      const createdRes = await tutorialAPI.getUserCreatedTutorials();
      setCreatedTutorials(createdRes.data || []);
      showToast("Tutorial deleted successfully", "success");
    } catch (err) {
      console.error("Error deleting tutorial:", err);
      showToast(
        err instanceof Error ? err.message : "Failed to delete tutorial",
        "error",
      );
      setError(
        err instanceof Error ? err.message : "Failed to delete tutorial",
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Oops!
          </h2>
          <p className="text-gray-600 mb-6 text-center">{error}</p>
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
            onClick={loadProfileData}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user || !dashboardStats) {
    return null;
  }

  const tabs = [
    { key: "overview", label: "Overview", icon: TrendingUp },
    { key: "courses", label: "My Courses", icon: BookOpen },
    { key: "tutorials", label: "Saved Tutorials", icon: Heart },
    { key: "certificates", label: "Certificates", icon: Award },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modals */}
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onSkip={handleSkipModal}
        onGoToProfile={handleGoToProfile}
      />
      <ConfirmModal
        isOpen={deleteConfirm.show}
        title="Delete tutorial"
        message="Are you sure you want to delete this tutorial? This action cannot be undone."
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        onConfirm={() => {
          if (deleteConfirm.tutorialId) {
            handleDeleteCreatedTutorial(deleteConfirm.tutorialId);
          }
          setDeleteConfirm({ show: false });
        }}
        onCancel={() => setDeleteConfirm({ show: false })}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 transition-shadow hover:shadow-md">
          <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-end -mt-12">
              <div className="flex-shrink-0">
                {user.profilePicture ? (
                  <img
                    src={
                      user.profilePicture.startsWith("http")
                        ? user.profilePicture
                        : `http://localhost:5000${user.profilePicture}`
                    }
                    alt={user.name}
                    className="w-24 h-24 rounded-xl border-4 border-white shadow-lg object-cover transition-transform hover:scale-105"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                    {getAvatarDisplay(user)}
                  </div>
                )}
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <div className="flex flex-wrap items-center text-gray-600 mt-1 gap-x-4 gap-y-1">
                    <span className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-1" />
                      {user.email}
                    </span>
                    {user.location && (
                      <span className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {user.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key as ProfileTab);
                    localStorage.setItem("profileActiveTab", tab.key);
                  }}
                  className={`py-3 px-1 inline-flex items-center gap-2 text-sm font-medium border-b-2 transition-all ${
                    isActive
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Panels */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-shadow hover:shadow-md">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Dashboard
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: BookOpen,
                    label: "Enrolled Courses",
                    value: dashboardStats.enrolledCourses,
                    color: "bg-indigo-500",
                  },
                  {
                    icon: CheckCircle,
                    label: "Completed",
                    value: dashboardStats.completedCourses,
                    color: "bg-emerald-500",
                  },
                  {
                    icon: Heart,
                    label: "Saved Tutorials",
                    value: dashboardStats.savedTutorials,
                    color: "bg-pink-500",
                  },
                  {
                    icon: Award,
                    label: "Certificates",
                    value: dashboardStats.certificates,
                    color: "bg-amber-500",
                  },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-gray-50 rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <div
                        className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center shadow-sm`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Average Progress */}
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Average Progress
                      </h3>
                      <p className="text-xs text-gray-600">
                        Across all enrolled courses
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                        style={{
                          width: `${dashboardStats.averageCourseProgress}%`,
                        }}
                      />
                    </div>
                    <span className="text-lg font-bold text-indigo-600">
                      {formatProgress(dashboardStats.averageCourseProgress)}
                    </span>
                  </div>
                </div>

                {/* Total Time */}
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Learning Time
                      </h3>
                      <p className="text-xs text-gray-600">
                        Total hours invested
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatDuration(dashboardStats.totalTimeSpentMinutes)}
                      </p>
                      <p className="text-xs text-gray-600">
                        of focused learning
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  My Learning Journey
                </h2>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">
                  {courseProgress.length} Active
                </span>
              </div>

              {courseProgress.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {courseProgress.map((course) => (
                    <div
                      key={course.enrollmentId}
                      className="bg-gray-50 rounded-xl p-5 hover:shadow-lg transition-all border border-gray-100 hover:-translate-y-1"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Code className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {course.course.title}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold border w-fit ${getDifficultyColorClass(
                                course.course.difficulty,
                              )}`}
                            >
                              {course.course.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {course.course.instructor?.name ||
                              "Unknown Instructor"}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                            {course.course.description}
                          </p>

                          <div className="mb-3">
                            <div className="flex justify-between items-center text-sm mb-1">
                              <span className="font-medium text-gray-700">
                                Progress
                              </span>
                              <span className="text-indigo-600 font-semibold">
                                {formatProgress(course.progressPercentage)}
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                                style={{
                                  width: `${course.progressPercentage}%`,
                                }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {course.completedSections} of{" "}
                              {course.totalSections} sections completed
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${
                                course.status === "active"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : course.status === "completed"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : course.status === "withdrawn"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {course.status.toUpperCase()}
                            </span>

                            <div className="flex items-center gap-2">
                              {course.status !== "withdrawn" && (
                                <button
                                  onClick={() =>
                                    navigate(`/courses/${course.course._id}`)
                                  }
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1 shadow-sm transition-colors"
                                >
                                  Continue
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              )}
                              {course.status === "active" && (
                                <button
                                  onClick={() =>
                                    handleWithdrawFromCourse(
                                      course.enrollmentId,
                                    )
                                  }
                                  className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                                >
                                  Withdraw
                                </button>
                              )}
                              {course.status === "withdrawn" && (
                                <button
                                  onClick={() =>
                                    handleContinueAgain(course.enrollmentId)
                                  }
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold shadow-sm transition-colors"
                                >
                                  Resume
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Start Your Learning Journey
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Discover courses and start building your skills today
                  </p>
                  <button
                    onClick={() => navigate("/tutorials")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold inline-flex items-center gap-2 shadow-sm transition-colors"
                  >
                    Explore Courses
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tutorials Tab */}
          {activeTab === "tutorials" && (
            <div className="space-y-8">
              {/* AI-Created Tutorials */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    My AI-Created Tutorials
                  </h2>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold">
                    {createdTutorials.length} Created
                  </span>
                </div>

                {createdTutorials.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {createdTutorials.map((tutorial) => (
                      <div
                        key={tutorial._id}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1 relative group"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm({
                              show: true,
                              tutorialId: tutorial._id,
                            });
                          }}
                          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete tutorial"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div
                          onClick={() =>
                            navigate(
                              `/tutorials/${tutorial.language}?tutorialId=${tutorial._id}`,
                            )
                          }
                          className="cursor-pointer"
                        >
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {tutorial.title}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {tutorial.concept}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold border ${getDifficultyColorClass(
                                tutorial.difficulty,
                              )}`}
                            >
                              {tutorial.difficulty.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                            {tutorial.description}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              AI-Generated
                            </span>
                            <span className="text-purple-600 font-semibold flex items-center gap-1">
                              View Tutorial
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No AI Tutorials Yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Generate personalized tutorials with AI
                    </p>
                    <button
                      onClick={() => navigate("/tutorials")}
                      className="text-purple-600 hover:text-purple-800 font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      Generate Tutorial
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Saved Tutorials */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-pink-600" />
                    Saved Tutorials
                  </h2>
                  <span className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {savedTutorials.length} Saved
                  </span>
                </div>

                {savedTutorials.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedTutorials.map((saved) =>
                      saved.tutorial ? (
                        <div
                          key={saved._id}
                          onClick={() =>
                            navigate(
                              `/tutorials/${saved.tutorial.language}?tutorialId=${saved.tutorial._id}`,
                            )
                          }
                          className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                        >
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                              <Code className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {saved.tutorial.title}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {saved.tutorial.concept}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold border ${getDifficultyColorClass(
                                saved.tutorial.difficulty,
                              )}`}
                            >
                              {saved.tutorial.difficulty
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                            {saved.tutorial.description}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">
                              {new Date(saved.savedAt).toLocaleDateString()}
                            </span>
                            <span className="text-indigo-600 font-semibold flex items-center gap-1">
                              Start Learning
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      ) : null,
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-8 h-8 text-pink-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Saved Tutorials Yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Save tutorials to quickly access them later
                    </p>
                    <button
                      onClick={() => navigate("/tutorials")}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      Browse Tutorials
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === "certificates" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                My Certificates
              </h2>
              <p className="text-gray-600">
                View and download your earned certificates
              </p>
              <UserCertificates />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                Account Settings
              </h2>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-indigo-600" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow"
                        disabled={!editingProfile}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={profileForm.dateOfBirth}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            dateOfBirth: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow"
                        disabled={!editingProfile}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow"
                        disabled={!editingProfile}
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience Level
                      </label>
                      <select
                        value={profileForm.experience}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            experience: e.target.value as
                              | ""
                              | "beginner"
                              | "intermediate"
                              | "advanced"
                              | "expert",
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow"
                        disabled={!editingProfile}
                      >
                        <option value="">Select experience</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio{" "}
                      <span className="text-gray-500">
                        ({profileForm.bio.length}/500)
                      </span>
                    </label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => {
                        if (e.target.value.length <= 500) {
                          setProfileForm((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }));
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none transition-shadow"
                      disabled={!editingProfile}
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>

                {/* Profile Picture */}
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-indigo-600" />
                    Profile Picture
                  </h3>
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    {profileForm.profilePicture && (
                      <div className="flex-shrink-0">
                        <img
                          src={
                            profileForm.profilePicture.startsWith("http")
                              ? profileForm.profilePicture
                              : `http://localhost:5000${profileForm.profilePicture}`
                          }
                          alt="Profile preview"
                          className="w-24 h-24 rounded-xl object-cover border border-gray-200 shadow-sm"
                        />
                        {editingProfile && (
                          <button
                            type="button"
                            onClick={() =>
                              setProfileForm((prev) => ({
                                ...prev,
                                profilePicture: "",
                              }))
                            }
                            className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                          >
                            <X className="w-4 h-4" /> Remove
                          </button>
                        )}
                      </div>
                    )}

                    <div className="flex-1 space-y-4">
                      {editingProfile && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Upload from Device
                            </label>
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const response =
                                      await uploadProfilePicture(file);
                                    setProfileForm((prev) => ({
                                      ...prev,
                                      profilePicture: response.data.fileUrl,
                                    }));
                                    setUser(response.data.user);
                                  } catch (err) {
                                    console.error(
                                      "Error uploading picture:",
                                      err,
                                    );
                                    setError(
                                      err instanceof Error
                                        ? err.message
                                        : "Failed to upload picture",
                                    );
                                  }
                                }
                              }}
                              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer transition-colors"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Max size: 5MB. JPG, PNG, GIF, WebP
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Or use Image URL
                            </label>
                            <input
                              type="url"
                              value={
                                profileForm.profilePicture.startsWith("http")
                                  ? profileForm.profilePicture
                                  : ""
                              }
                              onChange={(e) =>
                                setProfileForm((prev) => ({
                                  ...prev,
                                  profilePicture: e.target.value,
                                }))
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow"
                              placeholder="https://example.com/avatar.jpg"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-600" />
                    Social Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub
                      </label>
                      <input
                        type="url"
                        value={profileForm.github}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            github: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow"
                        disabled={!editingProfile}
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={profileForm.linkedin}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            linkedin: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow"
                        disabled={!editingProfile}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        value={profileForm.website}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            website: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow"
                        disabled={!editingProfile}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Skills & Interests */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    Skills & Interests
                  </h3>

                  {/* Programming Languages */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Programming Languages
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {profileForm.programmingLanguages.map((lang, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                        >
                          {lang}
                          {editingProfile && (
                            <button
                              onClick={() => {
                                setProfileForm((prev) => ({
                                  ...prev,
                                  programmingLanguages:
                                    prev.programmingLanguages.filter(
                                      (_, i) => i !== index,
                                    ),
                                }));
                              }}
                              className="ml-1 hover:text-indigo-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    {editingProfile && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a language... (press Enter)"
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              e.currentTarget.value.trim()
                            ) {
                              const value = e.currentTarget.value.trim();
                              e.currentTarget.value = "";
                              e.preventDefault();
                              setProfileForm((prev) => ({
                                ...prev,
                                programmingLanguages: [
                                  ...prev.programmingLanguages,
                                  value,
                                ],
                              }));
                            }
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow"
                        />
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {profileForm.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                        >
                          {skill}
                          {editingProfile && (
                            <button
                              onClick={() => {
                                setProfileForm((prev) => ({
                                  ...prev,
                                  skills: prev.skills.filter(
                                    (_, i) => i !== index,
                                  ),
                                }));
                              }}
                              className="ml-1 hover:text-purple-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    {editingProfile && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a skill... (press Enter)"
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              e.currentTarget.value.trim()
                            ) {
                              const value = e.currentTarget.value.trim();
                              e.currentTarget.value = "";
                              e.preventDefault();
                              setProfileForm((prev) => ({
                                ...prev,
                                skills: [...prev.skills, value],
                              }));
                            }
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow"
                        />
                      </div>
                    )}
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interests
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {profileForm.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                        >
                          {interest}
                          {editingProfile && (
                            <button
                              onClick={() => {
                                setProfileForm((prev) => ({
                                  ...prev,
                                  interests: prev.interests.filter(
                                    (_, i) => i !== index,
                                  ),
                                }));
                              }}
                              className="ml-1 hover:text-green-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    {editingProfile && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add an interest... (press Enter)"
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              e.currentTarget.value.trim()
                            ) {
                              const value = e.currentTarget.value.trim();
                              e.currentTarget.value = "";
                              e.preventDefault();
                              setProfileForm((prev) => ({
                                ...prev,
                                interests: [...prev.interests, value],
                              }));
                            }
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Notifications */}
                <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <label
                        htmlFor="notifications"
                        className="block text-sm font-medium text-gray-900"
                      >
                        Email Notifications
                      </label>
                      <p className="text-xs text-gray-600">
                        Receive updates about your courses
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="notifications"
                      checked={profileForm.preferences.emailNotifications}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            emailNotifications: e.target.checked,
                          },
                        }))
                      }
                      className="sr-only peer"
                      disabled={!editingProfile}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {editingProfile ? (
                    <>
                      <button
                        onClick={handleUpdateProfile}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-sm transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setEditingProfile(false);
                          if (user) {
                            setProfileForm({
                              name: user.name,
                              profilePicture: user.profilePicture || "",
                              dateOfBirth: user.dateOfBirth || "",
                              bio: user.bio || "",
                              location: user.location || "",
                              github: user.github || "",
                              linkedin: user.linkedin || "",
                              website: user.website || "",
                              programmingLanguages:
                                user.programmingLanguages || [],
                              skills: user.skills || [],
                              interests: user.interests || [],
                              experience: user.experience || "",
                              preferences: user.preferences,
                            });
                          }
                        }}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
