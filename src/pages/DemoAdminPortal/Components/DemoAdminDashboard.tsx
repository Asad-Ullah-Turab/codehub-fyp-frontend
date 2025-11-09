import { useState, useEffect } from "react";
import { fetchDashboardStats } from "../../../functions";
import "./DemoAdminDashboard.css";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalAdmins: number;
  totalTutorials: number;
  totalChats: number;
  newUsersLast30Days: number;
  suspensionRate: string;
}

function DemoAdminDashboard({ onError }: { onError: (msg: string) => void }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const stats = await fetchDashboardStats();
      setStats(stats);
    } catch (error) {
      onError("Failed to load dashboard statistics");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="demo-loading">Loading dashboard...</div>;
  }

  return (
    <div className="demo-admin-dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <p className="stat-label">Total Users</p>
            <h3 className="stat-value">{stats?.totalUsers || 0}</h3>
            <p className="stat-subtitle">All registered users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <p className="stat-label">Active Users</p>
            <h3 className="stat-value">{stats?.activeUsers || 0}</h3>
            <p className="stat-subtitle">Currently active</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⛔</div>
          <div className="stat-content">
            <p className="stat-label">Suspended Users</p>
            <h3 className="stat-value">{stats?.suspendedUsers || 0}</h3>
            <p className="stat-subtitle">Account suspended</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍💼</div>
          <div className="stat-content">
            <p className="stat-label">Admin Users</p>
            <h3 className="stat-value">{stats?.totalAdmins || 0}</h3>
            <p className="stat-subtitle">Total admins</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <p className="stat-label">Total Tutorials</p>
            <h3 className="stat-value">{stats?.totalTutorials || 0}</h3>
            <p className="stat-subtitle">Available tutorials</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <p className="stat-label">AI Chats</p>
            <h3 className="stat-value">{stats?.totalChats || 0}</h3>
            <p className="stat-subtitle">Total conversations</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <p className="stat-label">New Users (30d)</p>
            <h3 className="stat-value">{stats?.newUsersLast30Days || 0}</h3>
            <p className="stat-subtitle">Last 30 days</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <p className="stat-label">Suspension Rate</p>
            <h3 className="stat-value">{stats?.suspensionRate || 0}%</h3>
            <p className="stat-subtitle">Of total users</p>
          </div>
        </div>
      </div>

      <button className="refresh-btn" onClick={fetchStats}>
        🔄 Refresh Stats
      </button>
    </div>
  );
}

export default DemoAdminDashboard;
