import React from "react";
import {
  Search,
  Bell,
  HelpCircle,
  User,
  Plus,
  TrendingUp,
  Users,
  FileText,
  MessageSquare,
  BookOpen,
  Edit,
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "12,456", change: "+2.5%", positive: true },
    {
      label: "Active Subscriptions",
      value: "3,120",
      change: "+2.8%",
      positive: true,
    },
    {
      label: "Published Tutorials",
      value: "852",
      change: "+8.1%",
      positive: true,
    },
    {
      label: "AI Chatbot Queries",
      value: "5,678",
      change: "-1.2%",
      positive: false,
    },
  ];

  const contentData = [
    { name: "Python", value: 24.27, color: "#14b8a6" },
    { name: "JavaScript", value: 20.15, color: "#ec4899" },
    { name: "React", value: 18.88, color: "#a855f7" },
    { name: "Node", value: 9.43, color: "#22c55e" },
    { name: "CSS", value: 6.62, color: "#3b82f6" },
    { name: "Django", value: 5.9, color: "#f97316" },
    { name: "Vue", value: 4.16, color: "#eab308" },
    { name: "SQL", value: 2.91, color: "#ef4444" },
  ];

  const maxValue = Math.max(...contentData.map((item) => item.value));

  const recentActivity = [
    {
      icon: User,
      text: "John Doe signed up.",
      time: "2 minutes ago",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: BookOpen,
      text: 'Tutorial "React Hooks" was published.',
      time: "15 minutes ago",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: MessageSquare,
      text: 'New comment on "DSA Algorithms"',
      time: "1 hour ago",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Edit,
      text: 'Content "Node.js Basics" was updated.',
      time: "3 hours ago",
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  const latestContent = [
    {
      title: "Mastering CSS Grid",
      category: "Frontend",
      author: "Alex Johnson",
      status: "Published",
      date: "2023-10-26",
    },
    {
      title: "Intro to Django ORM",
      category: "Backend",
      author: "Maria Garcia",
      status: "Published",
      date: "2023-10-24",
    },
    {
      title: "Binary Search Algorithm",
      category: "DSA",
      author: "Sam Lee",
      status: "Draft",
      date: "2023-10-22",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tutorials, users, content..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2 ml-2">
              <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AN</span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Admin Name
                </div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6">
        {/* Welcome Section */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, Admin!
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Here's a summary of your site's activity today.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700">
              View Reports
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Content
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-5 shadow-sm border border-gray-100"
            >
              <div className="text-xs text-gray-500 mb-3">{stat.label}</div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div
                  className={`text-xs font-semibold ${
                    stat.positive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* User Growth Chart */}
          <div className="col-span-2 bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              User Growth (Last 30 Days)
            </h2>
            <div className="relative h-64 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden">
              <svg
                className="w-full h-full p-8"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#60a5fa", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#a78bfa", stopOpacity: 1 }}
                    />
                  </linearGradient>
                </defs>
                <polyline
                  points="5,75 20,65 35,55 50,70 65,45 80,35 95,25"
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="0.5"
                  vectorEffect="non-scaling-stroke"
                />
                <circle cx="5" cy="75" r="1.5" fill="#60a5fa" />
                <circle cx="20" cy="65" r="1.5" fill="#60a5fa" />
                <circle cx="35" cy="55" r="1.5" fill="#60a5fa" />
                <circle cx="50" cy="70" r="1.5" fill="#60a5fa" />
                <circle cx="65" cy="45" r="1.5" fill="#60a5fa" />
                <circle cx="80" cy="35" r="1.5" fill="#60a5fa" />
                <circle cx="95" cy="25" r="1.5" fill="#a78bfa" />
              </svg>
              <div className="absolute bottom-3 right-4 text-gray-500 text-xs tracking-wider">
                STRATEGY
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add New Tutorial
              </button>
              <button className="w-full px-4 py-2.5 border border-gray-200 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center justify-center gap-2 text-gray-700">
                <Users className="w-4 h-4" />
                Manage Users
              </button>
              <button className="w-full px-4 py-2.5 border border-gray-200 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center justify-center gap-2 text-gray-700">
                <FileText className="w-4 h-4" />
                View Reports
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Most Viewed Content */}
          <div className="col-span-2 bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Most Viewed Content
            </h2>
            <div className="space-y-2.5">
              {contentData.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 text-xs text-gray-600 text-right">
                    {item.name}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded h-7 relative overflow-hidden">
                    <div
                      className="h-7 rounded transition-all"
                      style={{
                        width: `${(item.value / maxValue) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <div className="w-10 text-xs text-gray-600">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex gap-3">
                    <div className={`${activity.color} p-1.5 rounded-md h-fit`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-900 leading-relaxed">
                        {activity.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Latest Content Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">
              Latest Content
            </h2>
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-600">
                    Title
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-600">
                    Author
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-600">
                    Date Created
                  </th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {latestContent.map((content, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 text-sm text-gray-900">
                      {content.title}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {content.category}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {content.author}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-medium ${
                          content.status === "Published"
                            ? "bg-teal-50 text-teal-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {content.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {content.date}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
