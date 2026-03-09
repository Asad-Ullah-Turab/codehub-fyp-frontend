import { useState, useEffect } from "react";
import { Search, ChevronDown, Star } from "lucide-react";
import { adminAPI } from "../../../services/adminAPI";
import { useToast } from "../../../contexts/ToastContext";

interface CourseData {
  name: string;
  category: string;
  views: number;
  completion: number;
  avgTime: string;
  isPremium?: boolean;
}

interface ChatCategory {
  name: string;
  color: string;
  value: number;
}

interface UserGrowthData {
  _id: string;
  count: number;
}

interface StatData {
  label: string;
  value: number;
}

interface ChatbotCategory {
  _id: string;
  count: number;
}

export default function AnalyticsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<StatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [chatCategories, setChatCategories] = useState<ChatCategory[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await adminAPI.getAnalytics();
        if (res.success) {
          const d = res.data;

          // Dashboard stats
          setStats([
            { label: "Total Users", value: d.totalUsers || 0 },
            { label: "Premium Users", value: d.premiumUsers || 0 },
            { label: "Active Users", value: d.activeUsers || 0 },
            { label: "Tutorials Published", value: d.totalTutorials || 0 },
          ]);

          // User growth data
          if (d.userGrowth && d.userGrowth.length > 0) {
            setUserGrowthData(d.userGrowth);
          }

          // Top performing courses/tutorials
          if (d.topContent && d.topContent.length > 0) {
            setCourses(d.topContent);
          }

          // Chatbot query categories
          if (d.chatbotCategories && d.chatbotCategories.length > 0) {
            const categoryColors = {
              general: "#a855f7",
              course: "#22c55e",
              tutorial: "#f97316",
              code: "#3b82f6",
              "ai-tutorial": "#ec4899",
              default: "#6b7280",
            };

            const categoryNames = {
              general: "General Help",
              course: "Course Questions",
              tutorial: "Tutorial Help",
              code: "Code Editor Chats",
              "ai-tutorial": "AI Tutorials Generated",
            };

            const formattedCategories = d.chatbotCategories.map(
              (cat: ChatbotCategory) => ({
                name:
                  categoryNames[cat._id as keyof typeof categoryNames] ||
                  cat._id,
                color:
                  categoryColors[cat._id as keyof typeof categoryColors] ||
                  categoryColors.default,
                value: cat.count,
              }),
            );

            setChatCategories(formattedCategories);
          }
        }

        // Also load dashboard stats for the header cards
        const statsRes = await adminAPI.getDashboardStats();
        if (statsRes.success) {
          const d = statsRes.data;
          setStats([
            { label: "Total Users", value: d.totalUsers || 0 },
            { label: "Premium Users", value: d.premiumUsers || 0 },
            { label: "Active Users", value: d.activeUsers || 0 },
            { label: "Total Tutorials", value: d.totalTutorials || 0 },
          ]);
        }
      } catch (err) {
        console.error(err);
        showToast("Could not load analytics data", "error");
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [showToast]);

  // Calculate total queries
  const totalQueries = chatCategories.reduce((sum, cat) => sum + cat.value, 0);

  // Filter courses based on search term
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm text-gray-500 mb-1">
                Admin Panel / Analytics
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                Last 30 Days
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800">
                Export to CSV
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Overview of site performance and user engagement.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {loading ? (
            <div className="col-span-4 text-center text-white">Loading...</div>
          ) : (
            stats.map((stat, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-6">
                <div className="text-xs text-gray-400 mb-2">{stat.label}</div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* User Growth Chart */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="mb-2">
              <h3 className="text-white font-semibold text-base">
                User Growth
              </h3>
              <p className="text-gray-400 text-xs">
                New signups over the last 30 days.
              </p>
            </div>
            <div className="relative h-64 mt-6">
              {userGrowthData.length > 0 ? (
                <>
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 400 200"
                    preserveAspectRatio="none"
                  >
                    {/* Area fill */}
                    <defs>
                      <linearGradient
                        id="areaGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          style={{ stopColor: "#3b82f6", stopOpacity: 0.4 }}
                        />
                        <stop
                          offset="100%"
                          style={{ stopColor: "#3b82f6", stopOpacity: 0 }}
                        />
                      </linearGradient>
                    </defs>
                    {(() => {
                      // Generate path from real data
                      const maxCount = Math.max(
                        ...userGrowthData.map((d) => d.count),
                        1,
                      );
                      const scaleFactor = 150 / maxCount;
                      const xStep =
                        400 / Math.max(userGrowthData.length - 1, 1);

                      const points = userGrowthData.map((d, i) => ({
                        x: i * xStep,
                        y: 200 - 20 - d.count * scaleFactor,
                      }));

                      const pathData = points
                        .map((p, i) =>
                          i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`,
                        )
                        .join(" ");

                      const areaPath = `${pathData} L 400,200 L 0,200 Z`;

                      return (
                        <>
                          <path d={areaPath} fill="url(#areaGradient)" />
                          <path
                            d={pathData}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                          />
                        </>
                      );
                    })()}
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
                    <span>
                      {new Date(userGrowthData[0]?._id).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" },
                      )}
                    </span>
                    <span className="text-center">Last 30 Days</span>
                    <span>
                      {new Date(
                        userGrowthData[userGrowthData.length - 1]?._id,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No user growth data available
                </div>
              )}
            </div>
          </div>

          {/* Chatbot Query Categories */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="mb-2">
              <h3 className="text-white font-semibold text-base">
                AI Interaction Analytics
              </h3>
              <p className="text-gray-400 text-xs">
                Breakdown of AI chats, code assistance, and tutorials generated.
              </p>
            </div>
            <div className="flex items-center justify-center h-64 relative">
              {/* Center circle with total */}
              <div className="text-center">
                <div className="text-4xl font-bold text-white">
                  {totalQueries.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">Total AI Interactions</div>
              </div>

              {/* Decorative dots around */}
              {chatCategories.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    {chatCategories.map((cat, idx) => {
                      const angle = (idx * 360) / chatCategories.length;
                      const radius = 80;
                      const x = Math.cos((angle * Math.PI) / 180) * radius;
                      const y = Math.sin((angle * Math.PI) / 180) * radius;
                      return (
                        <div
                          key={idx}
                          className="absolute w-3 h-3 rounded-sm transform -translate-x-1/2 -translate-y-1/2"
                          style={{
                            backgroundColor: cat.color,
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Legend */}
            {chatCategories.length > 0 && (
              <div className="flex items-center justify-center gap-6 mt-4 flex-wrap">
                {chatCategories.map((cat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <span className="text-xs text-gray-400">
                      {cat.name} ({cat.value})
                    </span>
                  </div>
                ))}
              </div>
            )}
            {chatCategories.length === 0 && (
              <div className="text-center text-gray-500 mt-4">
                No chat data available
              </div>
            )}
          </div>
        </div>

        {/* Top Performing Courses */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold text-base">
                Top Performing Courses
              </h3>
              <p className="text-gray-400 text-xs">
                Detailed view of course engagement metrics.
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">
                    Course Name
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">
                    Views
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">
                    Completion Rate
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">
                    Avg. Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      {courses.length === 0
                        ? "No course data available yet"
                        : "No courses match your search"}
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-800 hover:bg-gray-800"
                    >
                      <td className="px-4 py-4 text-sm text-white">
                        <div className="flex items-center gap-2">
                          {course.name}
                          {course.isPremium && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" title="Premium Content" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400 capitalize">
                        {course.category}
                      </td>
                      <td className="px-4 py-4 text-sm text-white">
                        {course.views.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-white">
                        {course.completion}%
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400">
                        {course.avgTime}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
