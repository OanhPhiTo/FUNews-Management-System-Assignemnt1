/**
 * Author: OanhTP
 */
import { useState, useEffect, useMemo } from 'react';
import { newsService } from '../services/newsService';
import { categoryService } from '../services/categoryService';
import { authService } from '../services/authService';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import SearchBar from '../components/SearchBar';

function NewsManagement() {
  // Source lists
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog State (Create / Update)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'update'
  const [selectedNews, setSelectedNews] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    status: 1,
    tagsString: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete Confirmation State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  // Load News & Categories
  const loadData = () => {
    const news = newsService.getAll();
    const cats = categoryService.getAll();
    setNewsList(news);
    setCategories(cats);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Map categoryId to Category Name
  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      map[cat.id] = cat.name;
    });
    return map;
  }, [categories]);

  // Search filter (by Title or Content) - Non-destructive
  const displayedNews = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) return newsList;
    return newsList.filter(
      (item) =>
        item.title.toLowerCase().includes(trimmed) ||
        item.content.toLowerCase().includes(trimmed)
    );
  }, [newsList, searchTerm]);

  // Open Create Dialog
  const handleOpenCreate = () => {
    const defaultCategoryId = categories.length > 0 ? categories[0].id : '';
    setModalMode('create');
    setSelectedNews(null);
    setFormData({
      title: '',
      content: '',
      categoryId: defaultCategoryId,
      status: 1,
      tagsString: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (article) => {
    setModalMode('update');
    setSelectedNews(article);
    setFormData({
      title: article.title,
      content: article.content,
      categoryId: article.categoryId,
      status: article.status,
      tagsString: Array.isArray(article.tags) ? article.tags.join(', ') : '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required.';
    }
    if (!formData.content.trim()) {
      errors.content = 'Content is required.';
    }
    if (!formData.categoryId) {
      errors.categoryId = 'Please select a valid category.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const currentUser = authService.getCurrentUser();
    const createdBy = currentUser?.username || 'Admin';

    if (modalMode === 'create') {
      newsService.create({
        title: formData.title,
        content: formData.content,
        categoryId: Number(formData.categoryId),
        createdBy,
        status: Number(formData.status),
        tags: formData.tagsString,
      });
    } else {
      newsService.update(selectedNews.id, {
        title: formData.title,
        content: formData.content,
        categoryId: Number(formData.categoryId),
        status: Number(formData.status),
        tags: formData.tagsString,
      });
    }

    loadData();
    setIsModalOpen(false);
  };

  // Open Delete Confirm
  const handleOpenDelete = (article) => {
    setNewsToDelete(article);
    setIsConfirmOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (newsToDelete) {
      newsService.delete(newsToDelete.id);
      loadData();
    }
    setIsConfirmOpen(false);
    setNewsToDelete(null);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2>News Management</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Create, update, and publish news articles with categories and tags.
        </p>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Search news by title or content..."
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenCreate}
        >
          + Add News Article
        </button>
      </div>

      {/* News Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>ID</th>
              <th>Article Title</th>
              <th style={{ width: '160px' }}>Category</th>
              <th style={{ width: '100px' }}>Author</th>
              <th style={{ width: '180px' }}>Tags</th>
              <th style={{ width: '100px' }}>Status</th>
              <th style={{ width: '150px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedNews.length > 0 ? (
              displayedNews.map((article) => (
                <tr key={article.id}>
                  <td>#{article.id}</td>
                  <td>
                    <strong>{article.title}</strong>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        marginTop: '4px',
                        maxWidth: '450px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {article.content}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">
                      {categoryMap[article.categoryId] || `Category #${article.categoryId}`}
                    </span>
                  </td>
                  <td>{article.createdBy}</td>
                  <td>
                    {Array.isArray(article.tags) && article.tags.length > 0 ? (
                      article.tags.map((tag, idx) => (
                        <span key={idx} className="tag-pill">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>None</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        article.status === 1 ? 'badge-success' : 'badge-secondary'
                      }`}
                    >
                      {article.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="action-cell" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleOpenEdit(article)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleOpenDelete(article)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-state">
                  {searchTerm
                    ? `No articles matching "${searchTerm}". Try another keyword or clear search.`
                    : 'No news articles available. Click "+ Add News Article" to create one.'}
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
        title={modalMode === 'create' ? 'Create New Article' : 'Edit News Article'}
        isLarge={true}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Article Title *</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. FPT University Tech Symposium"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              autoFocus
            />
            {formErrors.title && (
              <span className="text-error">{formErrors.title}</span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.status === 1 ? 'Active' : 'Inactive'})
                  </option>
                ))}
              </select>
              {formErrors.categoryId && (
                <span className="text-error">{formErrors.categoryId}</span>
              )}
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
                <option value={1}>1 - Active (Published)</option>
                <option value={0}>0 - Inactive (Draft)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Technology, AI, Campus"
              value={formData.tagsString}
              onChange={(e) =>
                setFormData({ ...formData, tagsString: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content *</label>
            <textarea
              className="input-field form-textarea"
              placeholder="Write the article content here..."
              rows={5}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />
            {formErrors.content && (
              <span className="text-error">{formErrors.content}</span>
            )}
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
              {modalMode === 'create' ? 'Create Article' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Confirm News Deletion"
        message={
          newsToDelete ? (
            <span>
              Are you sure you want to delete article{' '}
              <strong>"{newsToDelete.title}"</strong> (ID: #{newsToDelete.id})?
            </span>
          ) : (
            'Are you sure you want to delete this article?'
          )
        }
        confirmText="Confirm Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setNewsToDelete(null);
        }}
      />
    </div>
  );
}

export default NewsManagement;
