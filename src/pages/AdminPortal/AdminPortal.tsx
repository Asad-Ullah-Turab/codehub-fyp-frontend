import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AdminDashboard from "./Components/AdminDashboard";
import UserManagement from "./Components/UserManagement";
import TutorialManagement from "./Components/TutorialManagement";
import Analytics from "./Components/Analytics";

function AdminPortal() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch {
      // Logout handled by context
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl shadow-lg">
              ⚙️
            </div>
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {/* View Website Button */}
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <span className="text-xl">🌐</span>
            <span>View Website</span>
          </button>

          {/* Dashboard */}
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
              activeTab === "dashboard"
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <span className="text-xl">📊</span>
            <span className="font-medium">Dashboard</span>
          </button>

          {/* User Management */}
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
              activeTab === "users"
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <span className="text-xl">👥</span>
            <span className="font-medium">User Management</span>
          </button>

          {/* Tutorial Management */}
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
              activeTab === "tutorials"
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={() => setActiveTab("tutorials")}
          >
            <span className="text-xl">📚</span>
            <span className="font-medium">Tutorial Management</span>
          </button>

          {/* Analytics */}
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
              activeTab === "analytics"
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            <span className="text-xl">📈</span>
            <span className="font-medium">Analytics</span>
          </button>
        </nav>

        {/* Footer - User Info */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-xl"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </p>
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 rounded-lg border border-indigo-200">
              <p className="text-gray-700">
                Welcome,{" "}
                <strong className="text-indigo-600">{user?.name}</strong>! 👋
              </p>
            </div>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between shadow-sm">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-600 hover:text-red-800 font-bold text-xl"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          )}

          {!loading && activeTab === "dashboard" && (
            <AdminDashboard onError={setError} />
          )}

          {!loading && activeTab === "users" && (
            <UserManagement onError={setError} />
          )}

          {!loading && activeTab === "tutorials" && (
            <TutorialManagement onError={setError} />
          )}

          {!loading && activeTab === "analytics" && (
            <Analytics onError={setError} />
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminPortal;
