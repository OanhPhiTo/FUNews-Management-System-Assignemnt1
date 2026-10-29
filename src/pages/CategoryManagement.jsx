/**
 * Author: OanhTP
 */
import { useState, useEffect, useMemo } from 'react';
import { categoryService } from '../services/categoryService';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import SearchBar from '../components/SearchBar';

function CategoryManagement() {
  // Source data list
  const [categories, setCategories] = useState([]);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog State (Create / Update)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'update'
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    status: 1,
  });
  const [formError, setFormError] = useState('');

  // Delete Confirmation State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Load Categories from Service
  const loadCategories = () => {
    const data = categoryService.getAll();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Search logic: Derived state from categories source list
  const displayedCategories = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) return categories;
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(trimmed)
    );
  }, [categories, searchTerm]);

  // Open Create Dialog
  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedCategory(null);
    setFormData({ name: '', status: 1 });
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (category) => {
    setModalMode('update');
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      status: category.status,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Form submit handler for Create & Update
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!formData.name.trim()) {
      setFormError('Category name is required and cannot be empty.');
      return;
    }

    if (modalMode === 'create') {
      categoryService.create({
        name: formData.name,
        status: formData.status,
      });
    } else {
      categoryService.update(selectedCategory.id, {
        name: formData.name,
        status: formData.status,
      });
    }

    loadCategories();
    setIsModalOpen(false);
  };

  // Open Delete Confirmation
  const handleOpenDelete = (category) => {
    setCategoryToDelete(category);
    setIsConfirmOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      categoryService.delete(categoryToDelete.id);
      loadCategories();
    }
    setIsConfirmOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Category Management</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Organize and maintain article categories and publication status.
        </p>
      </div>

      {/* Toolbar: Search box & Add button */}
      <div className="toolbar">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Search by category name..."
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenCreate}
        >
          + Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ID</th>
              <th>Category Name</th>
              <th style={{ width: '120px' }}>Status</th>
              <th style={{ width: '160px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedCategories.length > 0 ? (
              displayedCategories.map((cat) => (
                <tr key={cat.id}>
                  <td>#{cat.id}</td>
                  <td><strong>{cat.name}</strong></td>
                  <td>
                    <span
                      className={`badge ${
                        cat.status === 1 ? 'badge-success' : 'badge-secondary'
                      }`}
                    >
                      {cat.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="action-cell" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleOpenEdit(cat)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleOpenDelete(cat)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty-state">
                  {searchTerm
                    ? `No categories matching "${searchTerm}". Try another keyword or clear search.`
                    : 'No categories available.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Update Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Create New Category' : 'Edit Category'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Category Name *</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Campus Events"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              autoFocus
            />
            {formError && <span className="text-error">{formError}</span>}
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

          <div className="modal-footer" style={{ margin: '20px -20px -20px -20px' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {modalMode === 'create' ? 'Create Category' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Confirm Category Deletion"
        message={
          categoryToDelete ? (
            <span>
              Are you sure you want to delete category{' '}
              <strong>"{categoryToDelete.name}"</strong> (ID: #{categoryToDelete.id})?
            </span>
          ) : (
            'Are you sure you want to delete this category?'
          )
        }
        confirmText="Confirm Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setCategoryToDelete(null);
        }}
      />
    </div>
  );
}

export default CategoryManagement;
