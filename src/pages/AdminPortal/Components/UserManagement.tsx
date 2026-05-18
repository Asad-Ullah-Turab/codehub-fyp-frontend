import { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Ban,
  CheckCircle,
  X,
  Eye,
  Calendar,
  Award,
  Sparkles,
  Star,
  Zap,
  MapPin,
  Globe,
  Github,
  Linkedin,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { adminAPI } from "../../../services/adminAPI";
import { useToast } from "../../../contexts/ToastContext";
import { getProfileImageUrl } from "../../../utils/imageUtils";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import AdminPageLayout from "./AdminPageLayout";

interface UserManagementProps {
  onError?: (message: string) => void;
  highlightedUserId?: string;
}

export default function UserManagement({
  highlightedUserId,
}: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightedUser, setHighlightedUser] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
  });
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

  const [emailFormData, setEmailFormData] = useState({
    subject: "",
    message: "",
  });

  const [suspendFormData, setSuspendFormData] = useState({
    reason: "",
  });

  // Handle highlighting
  useEffect(() => {
    if (highlightedUserId) {
      setHighlightedUser(highlightedUserId);
      // Remove highlight after animation
      setTimeout(() => {
        setHighlightedUser(null);
      }, 3000);
    }
  }, [highlightedUserId]);

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
        statusFilter,
      );
      setUsers(response.data || []);
      setPagination(
        response.pagination || { total: 0, pages: 0, currentPage: 1 },
      );
    } catch (error) {
      showToast("Failed to load users", "error");
      console.error("Error fetching users:", error);
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
        suspendFormData.reason,
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
        emailFormData.message,
      );
      showToast("Email sent successfully", "success");
      setShowEmailModal(false);
      setEmailFormData({ subject: "", message: "" });
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to send email",
        "error",
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
        "error",
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
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerMonthlyReset = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.triggerMonthlyReset();
      showToast(
        `Monthly reset completed successfully. ${response.data.updatedUsers} users updated.`,
        "success",
      );
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Failed to trigger monthly reset",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPageLayout
      title="User Management"
      subtitle="Manage users, suspend accounts, and send notifications"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-sm border border-purple-200 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                System Management
              </h2>
              <p className="text-sm text-gray-600">
                Perform system-wide maintenance and administrative tasks
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleTriggerMonthlyReset}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg
                         hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {loading ? "Processing..." : "Trigger Monthly Reset"}
              </button>
            </div>
          </div>
          <div className="mt-3 p-3 bg-white/50 rounded-md text-xs text-gray-600">
            <strong>Monthly Reset:</strong> Resets query limits for all free
            users to 5 queries each (Chat, Code, Tutorial Generation). This
            normally runs automatically on the 1st of each month.
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
                <option value="">User Role: All</option>
                <option value="admin">Admin</option>
                <option value="creator">Creator</option>
                <option value="user">User</option>
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
                  Plan
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
                    className={`border-b border-gray-100 transition-all duration-300 ${
                      highlightedUser === user._id
                        ? "bg-blue-50 border-l-4 border-l-blue-500 shadow-lg shadow-blue-200/50 animate-pulse"
                        : ""
                    } ${
                      user.subscriptionPlan === "premium"
                        ? "bg-yellow-50 hover:bg-yellow-100"
                        : user.creatorPlan === "pro" &&
                            user.creatorPlanStatus === "active"
                          ? "bg-indigo-50 hover:bg-indigo-100"
                          : "hover:bg-gray-50"
                    }`}
                  >
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
                        <option value="creator">Creator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <span className="capitalize">
                            {user.subscriptionPlan || "free"}
                          </span>
                          {user.subscriptionPlan === "premium" && (
                            <Star className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        {user.creatorPlan === "pro" &&
                          user.creatorPlanStatus === "active" && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700">
                              <Zap className="w-3 h-3" /> Creator Pro
                            </span>
                          )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleString()
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
                              const response = await adminAPI.getUserDetails(
                                user._id,
                              );
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
            <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              {/* Header */}
              <div className="relative bg-white border-b border-gray-200">
                <div className="px-6 py-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {selectedUser.profilePicture ? (
                        <img
                          src={
                            getProfileImageUrl(selectedUser.profilePicture) ||
                            selectedUser.profilePicture
                          }
                          alt={selectedUser.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 shadow-md"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                          <span className="text-3xl font-bold text-white">
                            {selectedUser.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {selectedUser.name}
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">
                          {selectedUser.email}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          ID: {selectedUser._id}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold capitalize">
                            {selectedUser.role}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              selectedUser.accountStatus === "active"
                                ? "bg-green-100 text-green-700"
                                : selectedUser.accountStatus === "suspended"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {selectedUser.accountStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Account Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase">
                        Member Since
                      </span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(selectedUser.createdAt).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase">
                        User Subscription
                      </span>
                    </div>
                    <p className="text-base font-semibold text-gray-900 capitalize">
                      {selectedUser.subscriptionPlan || "free"}
                      {selectedUser.subscriptionPlan === "premium" && (
                        <Star className="w-4 h-4 text-yellow-500 inline ml-1" />
                      )}
                    </p>
                    {selectedUser.subscriptionPlan === "free" && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {selectedUser.chatQueriesRemaining} chat ·{" "}
                        {selectedUser.codeQueriesRemaining} code ·{" "}
                        {selectedUser.tutorialGenRemaining} tutorials left
                      </p>
                    )}
                  </div>

                  {selectedUser.role === "creator" && (
                    <div
                      className={`border rounded-lg p-4 ${selectedUser.creatorPlan === "pro" && selectedUser.creatorPlanStatus === "active" ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-200"}`}
                    >
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Zap className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-medium uppercase">
                          Creator Pro
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-base font-semibold text-gray-900 capitalize">
                          {selectedUser.creatorPlan === "pro" &&
                          selectedUser.creatorPlanStatus === "active"
                            ? "Active"
                            : selectedUser.creatorPlanStatus ||
                              "Not subscribed"}
                        </p>
                        {selectedUser.creatorPlan === "pro" &&
                          selectedUser.creatorPlanStatus === "active" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">
                              <Zap className="w-3 h-3" /> Pro
                            </span>
                          )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Payout account:{" "}
                        {selectedUser.stripeConnectPayoutsEnabled
                          ? "✓ Connected"
                          : "Not connected"}
                      </p>
                    </div>
                  )}

                  {selectedUser.experience && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Award className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase">
                          Experience
                        </span>
                      </div>
                      <p className="text-base font-semibold text-gray-900 capitalize">
                        {selectedUser.experience}
                      </p>
                    </div>
                  )}

                  {selectedUser.location && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase">
                          Location
                        </span>
                      </div>
                      <p className="text-base font-semibold text-gray-900">
                        {selectedUser.location}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bio Section */}
                {selectedUser.bio && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      About
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedUser.bio}
                    </p>
                  </div>
                )}

                {/* Social Links Section */}
                {(selectedUser.github ||
                  selectedUser.linkedin ||
                  selectedUser.website) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Social Links
                    </h3>
                    <div className="space-y-3">
                      {selectedUser.github && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                            <Github className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 uppercase">
                              GitHub Profile
                            </p>
                            <a
                              href={selectedUser.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                            >
                              {selectedUser.github}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      )}

                      {selectedUser.linkedin && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <Linkedin className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 uppercase">
                              LinkedIn Profile
                            </p>
                            <a
                              href={selectedUser.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                            >
                              {selectedUser.linkedin}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      )}

                      {selectedUser.website && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <Globe className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 uppercase">
                              Website
                            </p>
                            <a
                              href={selectedUser.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                            >
                              {selectedUser.website}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Profile Completion Status */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Profile Completion
                    </h3>
                    <span className="text-xl font-bold text-blue-600">
                      {Math.round(
                        ([
                          selectedUser.name && selectedUser.email,
                          selectedUser.bio,
                          selectedUser.experience,
                          selectedUser.location,
                          selectedUser.programmingLanguages?.length > 0,
                          selectedUser.skills?.length > 0,
                          selectedUser.github ||
                            selectedUser.linkedin ||
                            selectedUser.website,
                        ].filter(Boolean).length /
                          7) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.round(
                          ([
                            selectedUser.name && selectedUser.email,
                            selectedUser.bio,
                            selectedUser.experience,
                            selectedUser.location,
                            selectedUser.programmingLanguages?.length > 0,
                            selectedUser.skills?.length > 0,
                            selectedUser.github ||
                              selectedUser.linkedin ||
                              selectedUser.website,
                          ].filter(Boolean).length /
                            7) *
                            100,
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Basic Info</span>
                      {selectedUser.name && selectedUser.email ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Bio</span>
                      {selectedUser.bio ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Experience Level</span>
                      {selectedUser.experience ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Location</span>
                      {selectedUser.location ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">
                        Programming Languages
                      </span>
                      {selectedUser.programmingLanguages?.length > 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Skills</span>
                      {selectedUser.skills?.length > 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Social Links</span>
                      {selectedUser.github ||
                      selectedUser.linkedin ||
                      selectedUser.website ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills & Interests */}
                {selectedUser.programmingLanguages?.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Programming Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.programmingLanguages.map(
                        (lang: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-medium"
                          >
                            {lang}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {selectedUser.skills?.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.skills.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-md text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedUser.interests?.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.interests.map(
                        (interest: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-xs font-medium"
                          >
                            {interest}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Send Email Modal */}
        {showEmailModal && selectedUser && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-lg shadow-2xl">
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
            <div className="bg-white rounded-lg w-full max-w-md shadow-2xl">
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
    </AdminPageLayout>
  );
}
