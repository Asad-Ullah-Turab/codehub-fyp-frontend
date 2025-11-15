import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
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
  getDifficultyColor,
  getLanguageEmoji,
  type User,
  type DashboardStats,
  type CourseProgress,
  type SavedTutorial,
} from "../../functions/ProfileFunctions/profileFunctions";

const ProfilePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [savedTutorials, setSavedTutorials] = useState<SavedTutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "courses" | "tutorials" | "settings"
  >("overview");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    profilePicture: "",
    preferences: {
      theme: "light" as "light" | "dark",
      fontSize: "medium" as "small" | "medium" | "large",
      notifications: true,
    },
  });

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated using AuthContext
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

      // Initialize form with user data
      setProfileForm({
        name: profileRes.data.name,
        profilePicture: profileRes.data.profilePicture || "",
        preferences: {
          theme: profileRes.data.preferences.theme,
          fontSize: profileRes.data.preferences.fontSize,
          notifications: profileRes.data.preferences.notifications,
        },
      });
    } catch (err) {
      console.error("Error loading profile data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load profile data"
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

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
      // Refresh course progress
      const courseProgressRes = await getCourseProgress();
      setCourseProgress(courseProgressRes.data);
    } catch (err) {
      console.error("Error withdrawing from course:", err);
      setError(
        err instanceof Error ? err.message : "Failed to withdraw from course"
      );
    }
  };

  const handleContinueAgain = async (enrollmentId: string) => {
    try {
      await updateEnrollmentStatus(enrollmentId, "active");
      // Refresh course progress
      const courseProgressRes = await getCourseProgress();
      setCourseProgress(courseProgressRes.data);
    } catch (err) {
      console.error("Error reactivating course:", err);
      setError(
        err instanceof Error ? err.message : "Failed to reactivate course"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="relative">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-indigo-200">
                    {getAvatarDisplay(user)}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.name}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.accountStatus === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user.accountStatus.charAt(0).toUpperCase() +
                      user.accountStatus.slice(1)}
                  </span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium capitalize">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setEditingProfile(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { key: "overview", label: "Overview", icon: "📊" },
              { key: "courses", label: "My Courses", icon: "📚" },
              { key: "tutorials", label: "My Tutorials", icon: "📝" },
              { key: "settings", label: "Settings", icon: "⚙️" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {dashboardStats ? (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <span className="text-2xl">📚</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Enrolled Courses
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {dashboardStats?.enrolledCourses || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <span className="text-2xl">✅</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Completed Courses
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {dashboardStats?.completedCourses || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-100 rounded-xl">
                        <span className="text-2xl">❤️</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Saved Tutorials
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {dashboardStats?.savedTutorials || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-100 rounded-xl">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Certificates
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {dashboardStats?.certificates || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Average Progress */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Average Course Progress
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              dashboardStats?.averageCourseProgress || 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-lg font-bold text-indigo-600">
                        {formatProgress(
                          dashboardStats?.averageCourseProgress || 0
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Time Spent */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Total Time Spent
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-indigo-100 rounded-xl">
                        <span className="text-2xl">⏱️</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatDuration(
                            dashboardStats?.totalTimeSpentMinutes || 0
                          )}
                        </p>
                        <p className="text-sm text-gray-600">Learning time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Loading dashboard...
                </h3>
                <p className="text-gray-600">
                  Please wait while we load your stats
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>

            {courseProgress.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courseProgress.map((course) => (
                  <div
                    key={course.enrollmentId}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {getLanguageEmoji(course.course.language)}
                        </span>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {course.course.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {course.course.instructor?.name || 'Unknown Instructor'}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                          course.course.difficulty
                        )}`}
                      >
                        {course.course.difficulty}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.course.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Progress
                        </span>
                        <span className="text-sm font-bold text-indigo-600">
                          {formatProgress(course.progressPercentage)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.progressPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {course.completedSections} of {course.totalSections}{" "}
                        sections completed
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            course.status === "active"
                              ? "bg-green-100 text-green-800"
                              : course.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : course.status === "withdrawn"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {course.status}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {course.status !== "withdrawn" && (
                          <button 
                            onClick={() => navigate(`/courses/${course.course._id}`)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Continue
                          </button>
                        )}
                        {course.status === "active" && (
                          <button
                            onClick={() =>
                              handleWithdrawFromCourse(course.enrollmentId)
                            }
                            className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Withdraw
                          </button>
                        )}
                        {course.status === "withdrawn" && (
                          <button
                            onClick={() =>
                              handleContinueAgain(course.enrollmentId)
                            }
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Continue Again
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No courses yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start learning by enrolling in a course
                </p>
                <a
                  href="/tutorials"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Browse Courses
                </a>
              </div>
            )}
          </div>
        )}

        {activeTab === "tutorials" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">My Tutorials</h2>

            {/* Saved Tutorials Section */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">❤️</span>
                  <h3 className="text-xl font-bold text-gray-900">
                    Saved Tutorials
                  </h3>
                </div>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {savedTutorials.length} saved
                </span>
              </div>

              {savedTutorials.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {savedTutorials.map((saved) =>
                    saved.tutorial ? (
                      <div
                        key={saved._id}
                        onClick={() => navigate(`/tutorials/${saved.tutorial.language}?tutorialId=${saved.tutorial._id}`)}
                        className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">
                              {getLanguageEmoji(saved.tutorial.language)}
                            </span>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm truncate">
                                {saved.tutorial.title}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {saved.tutorial.concept}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                              saved.tutorial.difficulty
                            )}`}
                          >
                            {saved.tutorial.difficulty}
                          </span>
                        </div>

                        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                          {saved.tutorial.description}
                        </p>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            Saved {new Date(saved.savedAt).toLocaleDateString()}
                          </span>
                          <span className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                            Start Learning →
                          </span>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🤍</div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No saved tutorials yet
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Save tutorials while browsing to access them quickly later
                  </p>
                  <a
                    href="/tutorials"
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    Browse Tutorials →
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Profile Settings
                </h3>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={!editingProfile}
                    />
                  </div>

                  {/* Profile Picture URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture URL
                    </label>
                    <input
                      type="url"
                      value={profileForm.profilePicture}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          profilePicture: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={!editingProfile}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={profileForm.preferences.theme}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            theme: e.target.value as "light" | "dark",
                          },
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={!editingProfile}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Size
                    </label>
                    <select
                      value={profileForm.preferences.fontSize}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            fontSize: e.target.value as
                              | "small"
                              | "medium"
                              | "large",
                          },
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={!editingProfile}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  {/* Notifications */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifications"
                      checked={profileForm.preferences.notifications}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            notifications: e.target.checked,
                          },
                        }))
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      disabled={!editingProfile}
                    />
                    <label
                      htmlFor="notifications"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Enable email notifications
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-4 pt-4">
                    {editingProfile ? (
                      <>
                        <button
                          onClick={handleUpdateProfile}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setEditingProfile(false);
                            // Reset form to original values
                            if (user) {
                              setProfileForm({
                                name: user.name,
                                profilePicture: user.profilePicture || "",
                                preferences: user.preferences,
                              });
                            }
                          }}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditingProfile(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
