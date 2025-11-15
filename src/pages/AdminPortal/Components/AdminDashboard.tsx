import { useState, useEffect } from "react";
import { fetchDashboardStats } from "../../../functions";

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

function AdminDashboard({ onError }: { onError: (msg: string) => void }) {
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      icon: "👥",
      label: "Total Users",
      value: stats?.totalUsers || 0,
      subtitle: "All registered users",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: "⚡",
      label: "Active Users",
      value: stats?.activeUsers || 0,
      subtitle: "Currently active",
      color: "from-green-500 to-green-600",
    },
    {
      icon: "⛔",
      label: "Suspended Users",
      value: stats?.suspendedUsers || 0,
      subtitle: "Account suspended",
      color: "from-red-500 to-red-600",
    },
    {
      icon: "👨‍💼",
      label: "Admin Users",
      value: stats?.totalAdmins || 0,
      subtitle: "Total admins",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: "📚",
      label: "Total Tutorials",
      value: stats?.totalTutorials || 0,
      subtitle: "Available tutorials",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: "💬",
      label: "AI Chats",
      value: stats?.totalChats || 0,
      subtitle: "Total conversations",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: "📈",
      label: "New Users (30d)",
      value: stats?.newUsersLast30Days || 0,
      subtitle: "Last 30 days",
      color: "from-teal-500 to-teal-600",
    },
    {
      icon: "⚠️",
      label: "Suspension Rate",
      value: `${stats?.suspensionRate || 0}%`,
      subtitle: "Of total users",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-2">
                  {card.label}
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  {card.value}
                </h3>
                <p className="text-gray-500 text-xs">{card.subtitle}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl shadow-lg`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={fetchStats}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
      >
        <span>🔄</span>
        <span>Refresh Stats</span>
      </button>
    </div>
  );
}

export default AdminDashboard;
