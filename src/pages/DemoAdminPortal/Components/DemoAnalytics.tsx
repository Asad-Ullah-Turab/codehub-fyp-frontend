import { useState, useEffect } from "react";
import { fetchAnalyticsData } from "../../../functions";
import "./DemoAnalytics.css";

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

function DemoAnalytics({ onError }: { onError: (msg: string) => void }) {
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
    return <div className="demo-loading">Loading analytics...</div>;
  }

  return (
    <div className="demo-analytics">
      <div className="analytics-header">
        <h2>Analytics & Statistics</h2>
        <button className="refresh-btn" onClick={loadAnalytics}>
          🔄 Refresh
        </button>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <p className="metric-label">Total Code Executions</p>
            <h3 className="metric-value">{analytics?.totalExecutions || 0}</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💬</div>
          <div className="metric-content">
            <p className="metric-label">AI Chat Interactions</p>
            <h3 className="metric-value">{analytics?.totalChats || 0}</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <p className="metric-label">User Progress Records</p>
            <h3 className="metric-value">{analytics?.totalProgress || 0}</h3>
          </div>
        </div>
      </div>

      {/* Language Usage Chart */}
      <div className="chart-section">
        <h3>Code Executions by Language</h3>
        <div className="language-stats">
          {analytics?.languageStats && analytics.languageStats.length > 0 ? (
            analytics.languageStats.map((stat) => {
              const total = analytics.totalExecutions || 1;
              const percentage = ((stat.count / total) * 100).toFixed(1);
              return (
                <div key={stat._id} className="language-stat-item">
                  <div className="stat-label">
                    <span className="emoji">{getLanguageEmoji(stat._id)}</span>
                    <span className="lang-name">{stat._id}</span>
                  </div>
                  <div className="stat-bar-container">
                    <div className="stat-bar">
                      <div
                        className="stat-bar-fill"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor:
                            stat._id === "python"
                              ? "#3776ab"
                              : stat._id === "javascript"
                              ? "#f1e05a"
                              : "#00599c",
                        }}
                      ></div>
                    </div>
                    <span className="stat-percentage">{percentage}%</span>
                  </div>
                  <span className="stat-count">{stat.count} executions</span>
                </div>
              );
            })
          ) : (
            <p className="no-stats">No execution data available</p>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="analytics-summary">
        <h3>Summary</h3>
        <div className="summary-items">
          <div className="summary-item">
            <span className="summary-label">Platform Activity Level:</span>
            <span className="summary-value">
              {analytics && analytics.totalExecutions > 100
                ? "High 🔥"
                : analytics && analytics.totalExecutions > 50
                ? "Medium 📈"
                : "Low 📉"}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Most Used Language:</span>
            <span className="summary-value">
              {analytics?.languageStats &&
              analytics.languageStats.length > 0 &&
              analytics.languageStats[0]
                ? `${getLanguageEmoji(
                    analytics.languageStats[0]._id
                  )} ${analytics.languageStats[0]._id}`
                : "N/A"}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Platform Interactions:</span>
            <span className="summary-value">
              {(
                (analytics?.totalExecutions || 0) +
                (analytics?.totalChats || 0) +
                (analytics?.totalProgress || 0)
              ).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DemoAnalytics;
