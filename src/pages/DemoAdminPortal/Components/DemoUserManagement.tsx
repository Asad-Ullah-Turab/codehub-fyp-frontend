import { useState, useEffect } from "react";
import { adminAPI } from "../../../services/adminAPI";
import "./DemoUserManagement.css";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  accountStatus: "active" | "suspended" | "pending";
  createdAt: string;
}

interface Pagination {
  total: number;
  pages: number;
  currentPage: number;
}

function DemoUserManagement({ onError }: { onError: (msg: string) => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    pages: 0,
    currentPage: 1,
  });

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers(page, 10, search, roleFilter, statusFilter);
      if (response.success) {
        setUsers(response.data);
        setPagination(response.pagination);
      }
    } catch {
      onError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, roleFilter, statusFilter]);

  const handleStatusChange = async (user: User, newStatus: string) => {
    try {
      await adminAPI.updateUserStatus(user._id, newStatus);
      fetchUsers(pagination.currentPage);
      onError(""); // Clear errors
    } catch {
      onError("Failed to update user status");
    }
  };

  const handleRoleChange = async (user: User, newRole: string) => {
    try {
      await adminAPI.changeUserRole(user._id, newRole);
      fetchUsers(pagination.currentPage);
      onError("");
    } catch {
      onError("Failed to change user role");
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await adminAPI.deleteUser(user._id);
        fetchUsers(pagination.currentPage);
        onError("");
      } catch {
        onError("Failed to delete user");
      }
    }
  };

  return (
    <div className="demo-user-management">
      <div className="management-header">
        <h2>User Management</h2>
        <p>Total Users: {pagination.total}</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="demo-loading">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="no-data">No users found</div>
      ) : (
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="user-name">
                    <div className="avatar-small">{user.name?.charAt(0).toUpperCase()}</div>
                    {user.name}
                  </td>
                  <td className="user-email">{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user, e.target.value)}
                      className="role-select"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={user.accountStatus}
                      onChange={(e) => handleStatusChange(user, e.target.value)}
                      className={`status-select status-${user.accountStatus}`}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="joined-date">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user)}
                      title="Delete user"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => fetchUsers(page)}
              className={`page-btn ${pagination.currentPage === page ? "active" : ""}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DemoUserManagement;
