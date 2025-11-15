import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample users data
  const users = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.j@example.com",
      userId: "alex.j",
      role: "Admin",
      dateJoined: "2023-01-15",
      lastActive: "2024-07-20",
      status: "Active",
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria.g@example.com",
      userId: "maria.g",
      role: "Member",
      dateJoined: "2023-02-20",
      lastActive: "2024-07-18",
      status: "Active",
    },
    {
      id: 3,
      name: "David Chen",
      email: "david.c@example.com",
      userId: "david.c",
      role: "Member",
      dateJoined: "2023-03-10",
      lastActive: "2024-05-11",
      status: "Suspended",
    },
    {
      id: 4,
      name: "Sarah Lee",
      email: "sarah.l@example.com",
      userId: "sarah.l",
      role: "Member",
      dateJoined: "2023-04-05",
      lastActive: "2024-07-19",
      status: "Active",
    },
    {
      id: 5,
      name: "Tom Williams",
      email: "Tom.w@example.com",
      userId: "tom.w",
      role: "Guest",
      dateJoined: "2023-05-22",
      lastActive: "2024-06-30",
      status: "Active",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New User
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, or user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div className="w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">User Role: All</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="guest">Guest</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-52">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Account Status: All</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-white border-b border-gray-200">
                <th className="w-8 px-4 py-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                  User
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                  User ID
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Role
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Date Joined
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Last Active
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {user.userId}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {user.role}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {user.dateJoined}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {user.lastActive}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : user.status === "Suspended"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-semibold">1-5</span> of{" "}
                <span className="font-semibold">100</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm text-gray-700">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm text-gray-700">
                  2
                </button>
                <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                  3
                </button>
                <span className="px-2 text-gray-500">...</span>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm text-gray-700">
                  20
                </button>
                <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
