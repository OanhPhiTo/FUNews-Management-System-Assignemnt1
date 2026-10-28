import { useState, useEffect, useMemo } from 'react';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import SearchBar from '../components/SearchBar';

function UserManagement() {
  const currentUser = authService.getCurrentUser();

  // Source list
  const [users, setUsers] = useState([]);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog State (Create / Update)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'update'
  const [selectedUser, setSelectedUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 2,
    status: 1,
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete Confirmation State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteWarning, setDeleteWarning] = useState('');

  // Load Users
  const loadUsers = () => {
    const data = userService.getAll();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Search filter (by username)
  const displayedUsers = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) return users;
    return users.filter((u) => u.username.toLowerCase().includes(trimmed));
  }, [users, searchTerm]);

  // Open Create Dialog
  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedUser(null);
    setFormData({
      username: '',
      password: '',
      role: 2,
      status: 1,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (user) => {
    setModalMode('update');
    setSelectedUser(user);
    setFormData({
      username: user.username,
      password: '', // Blank by default, user enters new password only if changing
      role: user.role,
      status: user.status,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    const trimmedUsername = formData.username.trim();

    if (!trimmedUsername) {
      errors.username = 'Username is required.';
    } else {
      // Check username uniqueness
      const existingUser = users.find(
        (u) =>
          u.username.toLowerCase() === trimmedUsername.toLowerCase() &&
          (modalMode === 'create' || u.id !== selectedUser?.id)
      );
      if (existingUser) {
        errors.username = 'Username already exists. Please choose another.';
      }
    }

    if (modalMode === 'create' && !formData.password) {
      errors.password = 'Password is required for new users.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (modalMode === 'create') {
      userService.create({
        username: formData.username,
        password: formData.password,
        role: Number(formData.role),
        status: Number(formData.status),
      });
    } else {
      userService.update(selectedUser.id, {
        username: formData.username,
        password: formData.password || undefined,
        role: Number(formData.role),
        status: Number(formData.status),
      });
    }

    loadUsers();
    setIsModalOpen(false);
  };

  // Open Delete Confirm
  const handleOpenDelete = (user) => {
    if (user.username === currentUser?.username) {
      setDeleteWarning(
        `Security restriction: You cannot delete your own active session account ("${user.username}").`
      );
      setUserToDelete(null);
      setIsConfirmOpen(true);
      return;
    }

    setDeleteWarning('');
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (userToDelete) {
      userService.delete(userToDelete.id);
      loadUsers();
    }
    setIsConfirmOpen(false);
    setUserToDelete(null);
    setDeleteWarning('');
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2>User Management</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Manage system accounts, administrator privileges, and staff roles.
        </p>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Search by username..."
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenCreate}
        >
          + Add User Account
        </button>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ID</th>
              <th>Username</th>
              <th style={{ width: '160px' }}>Role</th>
              <th style={{ width: '120px' }}>Status</th>
              <th style={{ width: '160px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.length > 0 ? (
              displayedUsers.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>
                    <strong>{user.username}</strong>
                    {user.username === currentUser?.username && (
                      <span
                        style={{
                          marginLeft: '8px',
                          fontSize: '11px',
                          color: 'var(--primary)',
                          fontWeight: 600,
                        }}
                      >
                        (Current User)
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === 1 ? 'badge-primary' : 'badge-secondary'
                      }`}
                    >
                      {user.role === 1 ? 'Role 1 - Admin' : 'Role 2 - Staff'}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        user.status === 1 ? 'badge-success' : 'badge-secondary'
                      }`}
                    >
                      {user.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="action-cell" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleOpenEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleOpenDelete(user)}
                        disabled={user.username === currentUser?.username}
                        title={
                          user.username === currentUser?.username
                            ? 'Cannot delete your own account'
                            : 'Delete user'
                        }
                        style={{
                          opacity: user.username === currentUser?.username ? 0.5 : 1,
                          cursor:
                            user.username === currentUser?.username
                              ? 'not-allowed'
                              : 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">
                  {searchTerm
                    ? `No users matching "${searchTerm}". Try another keyword or clear search.`
                    : 'No users found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Create New User' : 'Edit User Account'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username *</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. staff_alex"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              autoFocus
            />
            {formErrors.username && (
              <span className="text-error">{formErrors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              {modalMode === 'create'
                ? 'Password *'
                : 'Password (leave blank to keep current)'}
            </label>
            <input
              type="password"
              className="input-field"
              placeholder={
                modalMode === 'create'
                  ? 'Enter password'
                  : 'Enter new password if changing'
              }
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {formErrors.password && (
              <span className="text-error">{formErrors.password}</span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: Number(e.target.value) })
                }
              >
                <option value={1}>1 - Admin</option>
                <option value={2}>2 - Staff</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: Number(e.target.value) })
                }
              >
                <option value={1}>1 - Active</option>
                <option value={0}>0 - Inactive</option>
              </select>
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '20px -20px -20px -20px' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {modalMode === 'create' ? 'Create User' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title={deleteWarning ? 'Action Not Allowed' : 'Confirm User Deletion'}
        message={
          deleteWarning ? (
            <span style={{ color: 'var(--danger)', fontWeight: 500 }}>
              {deleteWarning}
            </span>
          ) : userToDelete ? (
            <span>
              Are you sure you want to delete user account{' '}
              <strong>"{userToDelete.username}"</strong> (ID: #{userToDelete.id}, Role: {userToDelete.role === 1 ? 'Admin' : 'Staff'})?
            </span>
          ) : (
            'Are you sure you want to delete this user?'
          )
        }
        confirmText={deleteWarning ? 'Understood' : 'Confirm Delete'}
        cancelText={deleteWarning ? null : 'Cancel'}
        onConfirm={
          deleteWarning
            ? () => {
                setIsConfirmOpen(false);
                setDeleteWarning('');
              }
            : handleConfirmDelete
        }
        onCancel={() => {
          setIsConfirmOpen(false);
          setUserToDelete(null);
          setDeleteWarning('');
        }}
      />
    </div>
  );
}

export default UserManagement;
