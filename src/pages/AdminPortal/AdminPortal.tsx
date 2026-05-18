import { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AdminDashboard from "./Components/AdminDashboard";
import UserManagement from "./Components/UserManagement";
import TutorialManagement from "./Components/TutorialManagement";
import CourseManagement from "./Components/CourseManagement";
import CreatorApplicationReviews from "./Components/CreatorApplicationReviews";
import CreatorCourseApprovals from "./Components/CreatorCourseApprovals";
import AnalyticsDashboard from "./Components/Analytics";
import CertificateApproval from "./Components/CertificateApproval";
import QueriesManagement from "./Components/QueriesManagement";
import AdminCreatorRevenue from "./Components/AdminCreatorRevenue";
import AdminUserRevenue from "./Components/AdminUserRevenue";
import CourseCreatePage from "./Pages/CourseCreatePage";
import TutorialCreatePage from "./Pages/TutorialCreatePage";
import "./admin-theme.css";

function AdminPortal() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // restore from storage so layout persists across reloads
    const stored = localStorage.getItem("adminSidebarCollapsed");
    return stored === "true";
  });
  const [activeTab, setActiveTab] = useState(() => {
    const stored = localStorage.getItem("adminActiveTab");
    return stored || "dashboard";
  });
  const location = useLocation();
  const [highlightedItem, setHighlightedItem] = useState<{
    type: string;
    id: string | undefined;
  } | null>(null);

  const handleTabNavigation = (
    tab: string,
    data?: { userId?: string; tutorialId?: string; courseId?: string },
  ) => {
    const routeMap: Record<string, string> = {
      dashboard: "/admin",
      tutorials: "/admin/tutorials",
      courses: "/admin/courses",
      users: "/admin/users",
      analytics: "/admin/analytics",
      "creator-applications": "/admin/creator-applications",
      "creator-course-approvals": "/admin/creator-course-approvals",
      "creator-revenue": "/admin/creator-revenue",
      "user-revenue": "/admin/user-revenue",
      certificates: "/admin/certificates",
      queries: "/admin/queries",
    };

    const target = routeMap[tab] || tab;
    navigate(target);

    setActiveTab(tab);
    if (data) {
      setHighlightedItem({
        type: tab,
        id: data.userId || data.tutorialId || data.courseId,
      });
      setTimeout(() => {
        setHighlightedItem(null);
      }, 3000);
    }
  };

  useEffect(() => {
    if (location.pathname.startsWith("/admin/tutorials")) {
      setActiveTab("tutorials");
    } else if (location.pathname.startsWith("/admin/courses")) {
      setActiveTab("courses");
    } else if (location.pathname.startsWith("/admin/users")) {
      setActiveTab("users");
    } else if (location.pathname.startsWith("/admin/analytics")) {
      setActiveTab("analytics");
    } else if (location.pathname.startsWith("/admin/creator-applications")) {
      setActiveTab("creator-applications");
    } else if (
      location.pathname.startsWith("/admin/creator-course-approvals")
    ) {
      setActiveTab("creator-course-approvals");
    } else if (location.pathname.startsWith("/admin/certificates")) {
      setActiveTab("certificates");
    } else if (location.pathname.startsWith("/admin/queries")) {
      setActiveTab("queries");
    } else if (location.pathname.startsWith("/admin/creator-revenue")) {
      setActiveTab("creator-revenue");
    } else if (location.pathname.startsWith("/admin/user-revenue")) {
      setActiveTab("user-revenue");
    } else {
      setActiveTab("dashboard");
    }
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch {
      // Logout handled by context
    }
  };

  return (
    <div className="admin-portal-shell flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <aside
        className={`admin-portal-sidebar flex flex-col transition-all duration-300 shadow-xl overflow-x-hidden ${sidebarCollapsed ? "w-20" : "w-60"}`}
      >
        {/* Logo + collapse toggle */}
        <div
          className={`${sidebarCollapsed ? "px-3 py-4" : "p-6"} border-b border-slate-700/50 flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/35">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <span className="sidebar-brand text-xl font-bold tracking-wide">
                CODEHUB
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setSidebarCollapsed((prev) => {
                const next = !prev;
                localStorage.setItem("adminSidebarCollapsed", String(next));
                return next;
              });
            }}
            className="p-1 rounded-lg hover:bg-slate-700/40 ml-1 text-slate-200"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${
                sidebarCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3">
          <button
            className={`relative w-full flex items-center ${sidebarCollapsed ? "justify-center" : "justify-start"} gap-3 ${sidebarCollapsed ? "px-3" : "px-4"} py-2.5 mb-1 rounded-lg transition-colors text-left group ${
              activeTab === "dashboard"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => handleTabNavigation("dashboard")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {!sidebarCollapsed && (
              <span className="font-medium">Dashboard</span>
            )}
            {sidebarCollapsed && (
              <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Dashboard
              </span>
            )}
          </button>

          <button
            className={`relative w-full flex items-center ${sidebarCollapsed ? "justify-center" : "justify-start"} gap-3 ${sidebarCollapsed ? "px-3" : "px-4"} py-2.5 mb-1 rounded-lg transition-colors text-left group ${
              activeTab === "tutorials"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => handleTabNavigation("tutorials")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {!sidebarCollapsed && (
              <span className="font-medium">Tutorials</span>
            )}
            {sidebarCollapsed && (
              <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Tutorials
              </span>
            )}
          </button>

          <button
            className={`relative w-full flex items-center ${sidebarCollapsed ? "justify-center" : "justify-start"} gap-3 ${sidebarCollapsed ? "px-3" : "px-4"} py-2.5 mb-1 rounded-lg transition-colors text-left group ${
              activeTab === "courses"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => handleTabNavigation("courses")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            {!sidebarCollapsed && <span className="font-medium">Courses</span>}
            {sidebarCollapsed && (
              <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Courses
              </span>
            )}
          </button>

          <button
            className={`relative w-full flex items-center ${sidebarCollapsed ? "justify-center" : "justify-start"} gap-3 ${sidebarCollapsed ? "px-3" : "px-4"} py-2.5 mb-1 rounded-lg transition-colors text-left group ${
              activeTab === "users"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => handleTabNavigation("users")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            {!sidebarCollapsed && <span className="font-medium">Users</span>}
            {sidebarCollapsed && (
              <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Users
              </span>
            )}
          </button>

          <button
            className={`relative w-full flex items-center ${sidebarCollapsed ? "justify-center" : "justify-start"} gap-3 ${sidebarCollapsed ? "px-3" : "px-4"} py-2.5 mb-1 rounded-lg transition-colors text-left group ${
              activeTab === "analytics"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => handleTabNavigation("analytics")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            {!sidebarCollapsed && (
              <span className="font-medium">Analytics</span>
            )}
            {sidebarCollapsed && (
              <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Analytics
              </span>
            )}
          </button>

          <button
            className={`relative w-full flex items-center ${sidebarCollapsed ? "justify-center" : "justify-start"} gap-3 ${sidebarCollapsed ? "px-3" : "px-4"} py-2.5 mb-1 rounded-lg transition-colors text-left group ${
              activeTab === "creator-applications"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => handleTabNavigation("creator-applications")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-6 8h6m-6 4h6m2 4H6a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2z"
              />
            </svg>
            {!sidebarCollapsed && (
              <span className="font-medium">Applications</span>
            )}
            {sidebarCollapsed && (
              <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Applications
              </span>
            )}
          </button>

          <button
            className={`relative w-full flex items-center ${sidebarCollapsed ? "justify-center" : "justify-start"} gap-3 ${sidebarCollapsed ? "px-3" : "px-4"} py-2.5 mb-1 rounded-lg transition-colors text-left group ${
              activeTab === "creator-course-approvals"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => handleTabNavigation("creator-course-approvals")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {!sidebarCollapsed && (
              <span className="font-medium">Creator Courses</span>
            )}
            {sidebarCollapsed && (
              <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Creator Courses
              </span>
            )}
          </button>

          <button
            className={`relative w-full flex items-center ${sidebarCollapsed ? "justify-center" : "justify-start"} gap-3 ${sidebarCollapsed ? "px-3" : "px-4"} py-2.5 mb-1 rounded-lg transition-colors text-left group ${
              activeTab === "creator-revenue"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => handleTabNavigation("creator-revenue")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {!sidebarCollapsed && (
              <span className="font-medium">Creator Revenue</span>
            )}
            {sidebarCollapsed && (
              <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Creator Revenue
              </span>
            )}
          </button>

          <button
            className={`relative w-full flex items-center ${sidebarCollapsed ? "justify-center" : "justify-start"} gap-3 ${sidebarCollapsed ? "px-3" : "px-4"} py-2.5 mb-1 rounded-lg transition-colors text-left group ${
              activeTab === "user-revenue"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => handleTabNavigation("user-revenue")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            {!sidebarCollapsed && (
              <span className="font-medium">User Revenue</span>
            )}
            {sidebarCollapsed && (
              <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                User Revenue
              </span>
            )}
          </button>

          <button
            className={`relative w-full flex items-center ${sidebarCollapsed ? "justify-center" : "justify-start"} gap-3 ${sidebarCollapsed ? "px-3" : "px-4"} py-2.5 mb-1 rounded-lg transition-colors text-left group ${
              activeTab === "certificates"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => handleTabNavigation("certificates")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {!sidebarCollapsed && (
              <span className="font-medium">Certificates</span>
            )}
            {sidebarCollapsed && (
              <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Certificates
              </span>
            )}
          </button>

          <button
            className={`relative w-full flex items-center ${sidebarCollapsed ? "justify-center" : "justify-start"} gap-3 ${sidebarCollapsed ? "px-3" : "px-4"} py-2.5 mb-1 rounded-lg transition-colors text-left group ${
              activeTab === "queries"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => handleTabNavigation("queries")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            {!sidebarCollapsed && <span className="font-medium">Queries</span>}
            {sidebarCollapsed && (
              <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Queries
              </span>
            )}
          </button>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700/50 p-4">
          <button
            title={sidebarCollapsed ? "Back to Website" : undefined}
            onClick={() => navigate("/")}
            className={`relative w-full flex items-center ${sidebarCollapsed ? "justify-center" : "justify-start"} gap-3 px-3 py-2.5 mb-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-left group`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {!sidebarCollapsed && (
              <span className="font-medium">Back to Website</span>
            )}
            {sidebarCollapsed && (
              <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Back to Website
              </span>
            )}
          </button>

          <button
            title={sidebarCollapsed ? "Log Out" : undefined}
            onClick={handleLogout}
            className={`relative w-full flex items-center ${sidebarCollapsed ? "justify-center" : "justify-start"} gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-left group`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {!sidebarCollapsed && <span className="font-medium">Log Out</span>}
            {sidebarCollapsed && (
              <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Log Out
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-transparent">
        <div className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route
              path=""
              element={<AdminDashboard onNavigate={handleTabNavigation} />}
            />
            <Route
              path="tutorials"
              element={
                <TutorialManagement
                  onError={(msg: string) => console.error(msg)}
                  highlightedTutorialId={
                    highlightedItem?.type === "tutorials"
                      ? highlightedItem.id
                      : undefined
                  }
                />
              }
            />
            <Route path="tutorials/new" element={<TutorialCreatePage />} />
            <Route
              path="courses"
              element={
                <CourseManagement
                  onError={(msg: string) => console.error(msg)}
                  highlightedCourseId={
                    highlightedItem?.type === "courses"
                      ? highlightedItem.id
                      : undefined
                  }
                />
              }
            />
            <Route path="courses/new" element={<CourseCreatePage />} />
            <Route
              path="users"
              element={
                <UserManagement
                  onError={(msg: string) => console.error(msg)}
                  highlightedUserId={
                    highlightedItem?.type === "users"
                      ? highlightedItem.id
                      : undefined
                  }
                />
              }
            />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route
              path="creator-applications"
              element={<CreatorApplicationReviews />}
            />
            <Route
              path="creator-course-approvals"
              element={<CreatorCourseApprovals />}
            />
            <Route path="creator-revenue" element={<AdminCreatorRevenue />} />
            <Route path="user-revenue" element={<AdminUserRevenue />} />
            <Route path="certificates" element={<CertificateApproval />} />
            <Route path="queries" element={<QueriesManagement />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default AdminPortal;
