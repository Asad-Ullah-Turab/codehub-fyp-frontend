import { useState, useEffect } from "react";
import { fetchAnalyticsData } from "../../../functions";

interface LanguageStat {
  _id: string;
  count: number;
}

interface AnalyticsData {
  totalExecutions: number;
  languageStats: LanguageStat[];
  totalChats: number;
  totalProgress: number;
}

function Analytics({ onError }: { onError: (msg: string) => void }) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await fetchAnalyticsData();
      setAnalytics(data as unknown as AnalyticsData);
    } catch {
      onError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLanguageEmoji = (lang: string) => {
    switch (lang) {
      case "python":
        return "🐍";
      case "javascript":
        return "🟨";
      case "cpp":
        return "⚙️";
      default:
        return "💻";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Statistics</h2>
          <button
            onClick={loadAnalytics}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Code Executions</p>
              <h3 className="text-3xl font-bold text-gray-900">{analytics?.totalExecutions || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg">
              ⚡
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-600 text-sm font-medium mb-2">AI Chat Interactions</p>
              <h3 className="text-3xl font-bold text-gray-900">{analytics?.totalChats || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-2xl shadow-lg">
              💬
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-600 text-sm font-medium mb-2">User Progress Records</p>
              <h3 className="text-3xl font-bold text-gray-900">{analytics?.totalProgress || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-2xl shadow-lg">
              📈
            </div>
          </div>
        </div>
      </div>

      {/* Language Usage Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Code Executions by Language</h3>
        <div className="space-y-4">
          {analytics?.languageStats && analytics.languageStats.length > 0 ? (
            analytics.languageStats.map((stat) => {
              const total = analytics.totalExecutions || 1;
              const percentage = ((stat.count / total) * 100).toFixed(1);
              const bgColor = stat._id === "python" ? "#3776ab" : stat._id === "javascript" ? "#f1e05a" : "#00599c";
              
              return (
                <div key={stat._id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getLanguageEmoji(stat._id)}</span>
                      <span className="font-semibold text-gray-900 capitalize">{stat._id}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">{percentage}%</span>
                      <span className="text-gray-500 text-sm ml-2">({stat.count} executions)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: bgColor }}
                    ></div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-8">No execution data available</p>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <p className="text-gray-700 text-sm font-medium mb-2">Platform Activity Level:</p>
            <p className="text-2xl font-bold text-indigo-600">
              {analytics && analytics.totalExecutions > 100
                ? "High 🔥"
                : analytics && analytics.totalExecutions > 50
                ? "Medium 📈"
                : "Low 📉"}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <p className="text-gray-700 text-sm font-medium mb-2">Most Used Language:</p>
            <p className="text-2xl font-bold text-purple-600">
              {analytics?.languageStats &&
              analytics.languageStats.length > 0 &&
              analytics.languageStats[0]
                ? `${getLanguageEmoji(analytics.languageStats[0]._id)} ${analytics.languageStats[0]._id}`
                : "N/A"}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-4 border border-green-200">
            <p className="text-gray-700 text-sm font-medium mb-2">Total Platform Interactions:</p>
            <p className="text-2xl font-bold text-green-600">
              {(
                (analytics?.totalExecutions || 0) +
                (analytics?.totalChats || 0) +
                (analytics?.totalProgress || 0)
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
