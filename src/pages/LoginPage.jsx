import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function LoginPage() {
  // Local UI State cho Form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi reload trang mặc định của form
    setError('');

    // Validation cơ bản
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    const result = authService.login(username, password);
    if (result.success) {
      // Đăng nhập thành công -> Điều hướng sang Admin Dashboard
      navigate('/admin/dashboard');
    } else {
      // Thất bại -> Hiển thị lỗi
      setError(result.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-main)', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', border: '1px solid var(--border-strong)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/logo.png" alt="FUNews Logo" className="header-logo" style={{ width: '52px', height: '52px', margin: '0 auto 12px auto', display: 'block' }} />
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#ffffff' }}>FUNews Login</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>
            Management Portal &bull; Huytpn_SE1910
          </p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="input-field" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter username (e.g. admin or staff)"
              autoComplete="username"
            />
          </div>
          <div className="form-group" style={{ marginBottom: '22px' }}>
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>
          {error && <span className="text-error" style={{ marginBottom: '16px' }}>{error}</span>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
