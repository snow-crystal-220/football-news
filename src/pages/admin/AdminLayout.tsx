import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, FileText, FolderOpen, Tags, Image, Megaphone,
  Settings, LogOut, Menu, X, ChevronLeft, Users, Globe
} from 'lucide-react';
import { SITE_NAME } from '@/lib/constants';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/articles', label: 'Articles', icon: FileText },
  { path: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { path: '/admin/tags', label: 'Tags', icon: Tags },
  { path: '/admin/media', label: 'Media', icon: Image },
  { path: '/admin/ads', label: 'Ad Placements', icon: Megaphone },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A1628] transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00FF87] rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#0A1628">
                  <circle cx="12" cy="12" r="10" stroke="#0A1628" strokeWidth="2" fill="none" />
                  <path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z" fill="#0A1628" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-bold text-white">FP Admin</span>
                <span className="block text-[9px] text-gray-500 uppercase">CMS</span>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map(item => {
              const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    active ? 'bg-[#00FF87]/10 text-[#00FF87]' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="px-4 py-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#00FF87] rounded-full flex items-center justify-center text-[#0A1628] text-sm font-bold">
                {user?.display_name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.display_name}</p>
                <p className="text-[10px] text-gray-500 uppercase">{user?.role}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/" className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-gray-400 hover:text-white bg-white/5 rounded-lg transition">
                <Globe size={12} /> View Site
              </Link>
              <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-gray-400 hover:text-red-400 bg-white/5 rounded-lg transition">
                <LogOut size={12} /> Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-[#0A1628] hover:bg-gray-100 rounded-lg">
              <Menu size={20} />
            </button>
            <h2 className="text-sm font-semibold text-[#0A1628]">
              {navItems.find(i => location.pathname.startsWith(i.path))?.label || 'Admin'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:block">{user?.email}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
