/**
 * Author: OanhTP
 */
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function Header() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="admin-header">
      <div className="header-brand">
        <img src="/logo.png" alt="FUNews Logo" className="header-logo" />
        <span className="header-title">FUNews Management System</span>
      </div>
      <div className="header-user">
        <span className="user-badge">
          Hello, <strong>{user?.username || 'User'}</strong> ({user?.role === 1 ? 'Admin' : 'Staff'})
        </span>
        <button
          onClick={handleLogout}
          className="btn btn-outline"
          style={{ padding: '6px 12px', fontSize: '13px' }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
