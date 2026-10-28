import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function AdminLayout() {
  return (
    <div className="admin-layout">
      {/* 1. Header cố định phía trên */}
      <Header />
      
      {/* 2. Thân trang gồm Sidebar trái và Nội dung phải */}
      <div className="admin-main">
        <Sidebar />
        <main className="admin-content">
          {/* Outlet là vị trí React Router render các trang con (Dashboard, Category, News...) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
