import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import DemoAdminDashboard from "./Components/DemoAdminDashboard";
import DemoUserManagement from "./Components/DemoUserManagement";
import DemoTutorialManagement from "./Components/DemoTutorialManagement";
import DemoAnalytics from "./Components/DemoAnalytics";
import "./DemoAdminPortal.css";

function DemoAdminPortal() {
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
    <div className="demo-admin-portal">
      {/* Sidebar */}
      <aside className="demo-admin-sidebar">
        <div className="demo-admin-logo">
          <div className="logo-icon">⚙️</div>
          <h2>Admin Panel</h2>
        </div>

        <nav className="demo-admin-nav">
          <button
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <span className="icon">📊</span>
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <span className="icon">👥</span>
            <span>User Management</span>
          </button>
          <button
            className={`nav-item ${activeTab === "tutorials" ? "active" : ""}`}
            onClick={() => setActiveTab("tutorials")}
          >
            <span className="icon">📚</span>
            <span>Tutorial Management</span>
          </button>
          <button
            className={`nav-item ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <span className="icon">📈</span>
            <span>Analytics</span>
          </button>
        </nav>

        <div className="demo-admin-footer">
          <div className="user-info">
            <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <p className="user-name">{user?.name}</p>
              <p className="user-role">Admin</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            🚪
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="demo-admin-content">
        {/* Header */}
        <header className="demo-admin-header">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p className="breadcrumb">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </p>
          </div>
          <div className="header-right">
            <div className="user-greeting">
              Welcome, <strong>{user?.name}</strong>! 👋
            </div>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={() => setError("")}>✕</button>
          </div>
        )}

        {/* Content Area */}
        <div className="demo-admin-main">
          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          )}

          {!loading && activeTab === "dashboard" && (
            <DemoAdminDashboard onError={setError} />
          )}

          {!loading && activeTab === "users" && (
            <DemoUserManagement onError={setError} />
          )}

          {!loading && activeTab === "tutorials" && (
            <DemoTutorialManagement onError={setError} />
          )}

          {!loading && activeTab === "analytics" && (
            <DemoAnalytics onError={setError} />
          )}
        </div>
      </main>
    </div>
  );
}

export default DemoAdminPortal;
