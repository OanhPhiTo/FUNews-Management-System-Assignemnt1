/**
 * Author: OanhTP
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { categoryService } from '../services/categoryService';
import { newsService } from '../services/newsService';
import { userService } from '../services/userService';

function DashboardPage() {
  const user = authService.getCurrentUser();

  const [stats, setStats] = useState({
    categoriesCount: 0,
    newsCount: 0,
    usersCount: 0,
  });

  const [recentNews, setRecentNews] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const cats = categoryService.getAll();
    const news = newsService.getAll();
    const users = userService.getAll();

    setStats({
      categoriesCount: cats.length,
      newsCount: news.length,
      usersCount: users.length,
    });

    setRecentNews(news.slice(-3).reverse());
    setCategories(cats);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Dashboard Overview</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Welcome back, <strong>{user?.username}</strong>! Live statistics from LocalStorage database:
        </p>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="card">
          <h4 style={{ color: 'var(--text-muted)', fontSize: '13px', letterSpacing: '0.5px' }}>
            CATEGORIES
          </h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: 'var(--primary)' }}>
            {stats.categoriesCount}
          </p>
          <div style={{ marginTop: '8px' }}>
            <Link to="/admin/categories" style={{ fontSize: '12px', color: 'var(--primary)' }}>
              Manage categories &rarr;
            </Link>
          </div>
        </div>

        <div className="card">
          <h4 style={{ color: 'var(--text-muted)', fontSize: '13px', letterSpacing: '0.5px' }}>
            NEWS ARTICLES
          </h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: 'var(--primary)' }}>
            {stats.newsCount}
          </p>
          <div style={{ marginTop: '8px' }}>
            <Link to="/admin/news" style={{ fontSize: '12px', color: 'var(--primary)' }}>
              Manage news &rarr;
            </Link>
          </div>
        </div>

        <div className="card">
          <h4 style={{ color: 'var(--text-muted)', fontSize: '13px', letterSpacing: '0.5px' }}>
            ACCOUNTS
          </h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: 'var(--primary)' }}>
            {stats.usersCount}
          </p>
          <div style={{ marginTop: '8px' }}>
            <Link to="/admin/users" style={{ fontSize: '12px', color: 'var(--primary)' }}>
              Manage users &rarr;
            </Link>
          </div>
        </div>

        <div className="card">
          <h4 style={{ color: 'var(--text-muted)', fontSize: '13px', letterSpacing: '0.5px' }}>
            LOGGED ROLE
          </h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: 'var(--primary)' }}>
            {user?.role === 1 ? 'Admin' : 'Staff'}
          </p>
          <span style={{ fontSize: '12px', color: 'var(--primary)' }}>
            ● Active Session
          </span>
        </div>
      </div>

      {/* Overview Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px' }}>Recent News Articles</h3>
            <Link to="/admin/news" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {recentNews.length > 0 ? (
            <ul style={{ listStyle: 'none' }}>
              {recentNews.map((n) => (
                <li
                  key={n.id}
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <strong style={{ fontSize: '14px' }}>{n.title}</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Author: {n.createdBy} | Status:{' '}
                    <span className={`badge ${n.status === 1 ? 'badge-success' : 'badge-secondary'}`}>
                      {n.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted" style={{ fontSize: '13px' }}>No news published yet.</p>
          )}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px' }}>Category Status</h3>
            <Link to="/admin/categories" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {categories.length > 0 ? (
            <ul style={{ listStyle: 'none' }}>
              {categories.map((c) => (
                <li
                  key={c.id}
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '14px' }}>{c.name}</span>
                  <span className={`badge ${c.status === 1 ? 'badge-success' : 'badge-secondary'}`}>
                    {c.status === 1 ? 'Active' : 'Inactive'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted" style={{ fontSize: '13px' }}>No categories created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
