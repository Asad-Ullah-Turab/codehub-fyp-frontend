import React, { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Ban,
  CheckCircle,
  X,
  Eye,
} from "lucide-react";
import { adminAPI } from "../../../services/adminAPI";
import { useToast } from "../../../contexts/ToastContext";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    userId: string | null;
  }>({
    show: false,
    userId: null,
  });
  const { showToast } = useToast();

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    bio: "",
    skills: [] as string[],
    programmingLanguages: [] as string[],
    interests: [] as string[],
    experience: "",
  });

  const [emailFormData, setEmailFormData] = useState({
    subject: "",
    message: "",
  });

  const [suspendFormData, setSuspendFormData] = useState({
    reason: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter, statusFilter, pagination.currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers(
        pagination.currentPage,
        10,
        searchTerm,
        roleFilter,
        statusFilter
      );
      setUsers(response.data || []);
      setPagination(
        response.pagination || { total: 0, pages: 0, currentPage: 1 }
      );
    } catch (error) {
      showToast("Failed to load users", "error");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = async (user: any) => {
    try {
      const response = await adminAPI.getUserDetails(user._id);
      const userData = response.data;
      setSelectedUser(userData);
      setEditFormData({
        name: userData.name || "",
        email: userData.email || "",
        bio: userData.bio || "",
        skills: userData.skills || [],
        programmingLanguages: userData.programmingLanguages || [],
        interests: userData.interests || [],
        experience: userData.experience || "",
      });
      setShowEditModal(true);
    } catch (error) {
      showToast("Failed to load user details", "error");
    }
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      await adminAPI.updateUserDetails(selectedUser._id, editFormData);
      showToast("User updated successfully", "success");
      setShowEditModal(false);
      fetchUsers();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to update user",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async () => {
    try {
      setLoading(true);
      await adminAPI.updateUserStatus(
        selectedUser._id,
        "suspended",
        suspendFormData.reason
      );
      showToast("User suspended successfully", "success");
      setShowSuspendModal(false);
      setSuspendFormData({ reason: "" });
      fetchUsers();
    } catch (error) {
      showToast("Failed to suspend user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (user: any) => {
    try {
      setLoading(true);
      await adminAPI.updateUserStatus(user._id, "active");
      showToast("User activated successfully", "success");
      fetchUsers();
    } catch (error) {
      showToast("Failed to activate user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      if (!emailFormData.subject || !emailFormData.message) {
        showToast("Please fill in all fields", "error");
        return;
      }
      setLoading(true);
      await adminAPI.sendEmailToUser(
        selectedUser._id,
        emailFormData.subject,
        emailFormData.message
      );
      showToast("Email sent successfully", "success");
      setShowEmailModal(false);
      setEmailFormData({ subject: "", message: "" });
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to send email",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirm.userId) return;

    try {
      setLoading(true);
      await adminAPI.deleteUser(deleteConfirm.userId);
      showToast("User deleted successfully", "success");
      setDeleteConfirm({ show: false, userId: null });
      fetchUsers();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to delete user",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (user: any, newRole: string) => {
    try {
      setLoading(true);
      await adminAPI.changeUserRole(user._id, newRole);
      showToast(`User role changed to ${newRole}`, "success");
      fetchUsers();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to change role",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const addItem = (
    field: "skills" | "programmingLanguages" | "interests",
    value: string
  ) => {
    if (value.trim() && !editFormData[field].includes(value.trim())) {
      setEditFormData({
        ...editFormData,
        [field]: [...editFormData[field], value.trim()],
      });
    }
  };

  const removeItem = (
    field: "skills" | "programmingLanguages" | "interests",
    item: string
  ) => {
    setEditFormData({
      ...editFormData,
      [field]: editFormData[field].filter((i) => i !== item),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage users, suspend accounts, and send notifications
            </p>
          </div>
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
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
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
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {user._id?.substring(0, 8)}...
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                          user.accountStatus === "active"
                            ? "bg-green-100 text-green-700"
                            : user.accountStatus === "suspended"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {user.accountStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={async () => {
                            try {
                              const response = await adminAPI.getUserDetails(user._id);
                              setSelectedUser(response.data);
                              setShowViewModal(true);
                            } catch (error) {
                              showToast("Failed to load user details", "error");
                            }
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                          title="View profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 hover:bg-gray-100 rounded text-blue-600"
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEmailModal(true);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded text-purple-600"
                          title="Send email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        {user.accountStatus === "active" ? (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowSuspendModal(true);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded text-orange-600"
                            title="Suspend user"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivateUser(user)}
                            className="p-1.5 hover:bg-gray-100 rounded text-green-600"
                            title="Activate user"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setDeleteConfirm({ show: true, userId: user._id })
                          }
                          className="p-1.5 hover:bg-gray-100 rounded text-red-600"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-semibold">{users.length}</span> of{" "}
                <span className="font-semibold">{pagination.total}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      currentPage: pagination.currentPage - 1,
                    })
                  }
                  disabled={pagination.currentPage === 1}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                {[...Array(Math.min(pagination.pages, 5))].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() =>
                      setPagination({ ...pagination, currentPage: i + 1 })
                    }
                    className={`px-3 py-1 rounded text-sm ${
                      pagination.currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      currentPage: pagination.currentPage + 1,
                    })
                  }
                  disabled={pagination.currentPage === pagination.pages}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* View Profile Modal */}
        {showViewModal && selectedUser && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
                <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-md">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Name</label>
                    <p className="text-sm text-gray-900">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                    <p className="text-sm text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Role</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedUser.role}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
                    <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${
                      selectedUser.accountStatus === "active"
                        ? "bg-green-100 text-green-700"
                        : selectedUser.accountStatus === "suspended"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {selectedUser.accountStatus}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Experience Level</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedUser.experience || "Not set"}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Joined Date</label>
                    <p className="text-sm text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {selectedUser.bio && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Bio</label>
                    <p className="text-sm text-gray-700">{selectedUser.bio}</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Profile Completion</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Basic Info</span>
                      <span className={`font-semibold ${
                        selectedUser.name && selectedUser.email ? "text-green-600" : "text-red-600"
                      }`}>
                        {selectedUser.name && selectedUser.email ? "✓ Complete" : "✗ Incomplete"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Bio</span>
                      <span className={`font-semibold ${
                        selectedUser.bio ? "text-green-600" : "text-red-600"
                      }`}>
                        {selectedUser.bio ? "✓ Complete" : "✗ Incomplete"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Experience Level</span>
                      <span className={`font-semibold ${
                        selectedUser.experience ? "text-green-600" : "text-red-600"
                      }`}>
                        {selectedUser.experience ? "✓ Complete" : "✗ Incomplete"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Programming Languages</span>
                      <span className={`font-semibold ${
                        selectedUser.programmingLanguages?.length > 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {selectedUser.programmingLanguages?.length > 0 ? "✓ Complete" : "✗ Incomplete"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Skills</span>
                      <span className={`font-semibold ${
                        selectedUser.skills?.length > 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {selectedUser.skills?.length > 0 ? "✓ Complete" : "✗ Incomplete"}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedUser.programmingLanguages?.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Programming Languages</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.programmingLanguages.map((lang: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedUser.skills?.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.skills.map((skill: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 bg-green-50 text-green-600 rounded text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedUser.interests?.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Interests</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.interests.map((interest: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded text-xs font-medium">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Edit User</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editFormData.bio}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, bio: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={editFormData.experience}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        experience: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Programming Languages
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editFormData.programmingLanguages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium"
                      >
                        {lang}
                        <button
                          onClick={() =>
                            removeItem("programmingLanguages", lang)
                          }
                          className="hover:bg-blue-100 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add language..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addItem("programmingLanguages", e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editFormData.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-600 rounded text-xs font-medium"
                      >
                        {skill}
                        <button
                          onClick={() => removeItem("skills", skill)}
                          className="hover:bg-green-100 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add skill..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addItem("skills", e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Interests
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editFormData.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-600 rounded text-xs font-medium"
                      >
                        {interest}
                        <button
                          onClick={() => removeItem("interests", interest)}
                          className="hover:bg-purple-100 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add interest..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addItem("interests", e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Send Email Modal */}
        {showEmailModal && selectedUser && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Send Email to {selectedUser.name}
                </h2>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={emailFormData.subject}
                    onChange={(e) =>
                      setEmailFormData({
                        ...emailFormData,
                        subject: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={emailFormData.message}
                    onChange={(e) =>
                      setEmailFormData({
                        ...emailFormData,
                        message: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                    placeholder="Email message"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {loading ? "Sending..." : "Send Email"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Suspend User Modal */}
        {showSuspendModal && selectedUser && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Suspend User
                </h2>
                <button
                  onClick={() => setShowSuspendModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Are you sure you want to suspend{" "}
                  <strong>{selectedUser.name}</strong>? They will be notified
                  via email.
                </p>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Reason (optional)
                  </label>
                  <textarea
                    value={suspendFormData.reason}
                    onChange={(e) =>
                      setSuspendFormData({ reason: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Reason for suspension..."
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowSuspendModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSuspendUser}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
                >
                  <Ban className="w-4 h-4" />
                  {loading ? "Suspending..." : "Suspend User"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteConfirm.show}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
          onConfirm={handleDeleteUser}
          onCancel={() => setDeleteConfirm({ show: false, userId: null })}
          confirmText="Delete"
          confirmButtonClass="bg-red-500 hover:bg-red-600"
        />
      </div>
    </div>
  );
}
