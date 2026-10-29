/**
 * Author: OanhTP
 */
import { useState } from 'react';
import { authService } from '../services/authService';
import { INITIAL_CATEGORIES, INITIAL_NEWS, INITIAL_USERS } from '../mock/initialData';
import ConfirmModal from '../components/ConfirmModal';

function SettingsPage() {
  const user = authService.getCurrentUser();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleResetDatabase = () => {
    localStorage.setItem('funews_categories', JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem('funews_articles', JSON.stringify(INITIAL_NEWS));
    localStorage.setItem('funews_users', JSON.stringify(INITIAL_USERS));
    setIsResetConfirmOpen(false);
    setResetMessage('Mock database has been successfully reset to default seed data!');
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2>System Settings</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          General application information, session data, and database maintenance.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '700px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Current Session & Environment</h3>
          <table style={{ width: '100%', fontSize: '14px', borderSpacing: '0 8px' }}>
            <tbody>
              <tr>
                <td style={{ color: 'var(--text-muted)', width: '180px' }}>Current User:</td>
                <td><strong>{user?.username}</strong></td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)' }}>Assigned Role:</td>
                <td>
                  <span className={`badge ${user?.role === 1 ? 'badge-primary' : 'badge-secondary'}`}>
                    {user?.role === 1 ? 'Administrator (Role 1)' : 'Staff (Role 2)'}
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)' }}>Application Name:</td>
                <td><strong>FUNewsManagementSystem</strong></td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)' }}>Student & Project:</td>
                <td><strong>OanhTP_CE190857</strong></td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-muted)' }}>Data Persistence:</td>
                <td>Browser LocalStorage (Keys: funews_categories, funews_articles, funews_users)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '12px', color: 'var(--danger)' }}>Database Maintenance</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            If you have performed extensive CRUD testing and wish to restore the system back to the
            original assignment test state (4 initial categories, 4 articles, 3 user accounts):
          </p>
          {resetMessage && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(169, 139, 152, 0.2)',
                color: '#ffffff',
                border: '1px solid var(--primary)',
                borderRadius: '6px',
                fontSize: '13px',
                marginBottom: '14px',
              }}
            >
              {resetMessage}
            </div>
          )}
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setIsResetConfirmOpen(true)}
          >
            Reset Mock Data to Initial Seed
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Reset Database Confirmation"
        message="Are you sure you want to restore the initial seed data? All newly added or edited categories, news, and users will be reset."
        confirmText="Confirm Reset"
        cancelText="Cancel"
        onConfirm={handleResetDatabase}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}

export default SettingsPage;
