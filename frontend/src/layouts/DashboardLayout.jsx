import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Code2, Users, Map, User,
  History, LogOut, ChevronLeft, Menu, Zap, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/dashboard/resume', label: 'Resume Analyzer', icon: FileText },
  { path: '/dashboard/technical', label: 'Technical Interview', icon: Code2 },
  { path: '/dashboard/hr', label: 'HR Interview', icon: Users },
  { path: '/dashboard/roadmap', label: 'Career Roadmap', icon: Map },
  { path: '/dashboard/history', label: 'History', icon: History },
  { path: '/dashboard/profile', label: 'Profile', icon: User },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px', borderBottom: '1px solid rgba(99,102,241,0.15)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Zap size={18} color="white" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, color: '#F8FAFC' }}
          >
            CareerPilot
          </motion.span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: collapsed ? '12px' : '12px 14px',
              borderRadius: 10, marginBottom: 4,
              textDecoration: 'none',
              color: isActive ? '#6366F1' : 'rgba(248,250,252,0.6)',
              background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
              borderLeft: isActive ? '3px solid #6366F1' : '3px solid transparent',
              transition: 'all 0.2s',
              justifyContent: collapsed ? 'center' : 'flex-start',
            })}
          >
            <item.icon size={18} style={{ flexShrink: 0 }} />
            {!collapsed && (
              <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(99,102,241,0.15)' }}>
        {!collapsed && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10, marginBottom: 8,
            background: 'rgba(30,41,59,0.8)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0,
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </p>
              <p style={{ fontSize: 11, color: 'rgba(248,250,252,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '10px' : '10px 12px',
            width: '100%', borderRadius: 10, border: 'none',
            background: 'transparent', color: 'rgba(239,68,68,0.8)',
            cursor: 'pointer', transition: 'all 0.2s',
            justifyContent: collapsed ? 'center' : 'flex-start',
            fontSize: 14, fontWeight: 500,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0F172A' }}>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          background: 'rgba(15,23,42,0.95)',
          borderRight: '1px solid rgba(99,102,241,0.15)',
          position: 'fixed', left: 0, top: 0, bottom: 0,
          zIndex: 40, overflow: 'hidden',
          display: 'none',
        }}
        className="sidebar-desktop"
      >
        <SidebarContent />
        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: 'absolute', right: -14, top: 72,
            width: 28, height: 28, borderRadius: '50%',
            background: '#1E293B', border: '1px solid rgba(99,102,241,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#6366F1',
          }}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronLeft size={14} />
          </motion.div>
        </button>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 45 }}
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'fixed', left: 0, top: 0, bottom: 0, width: 260,
                background: '#0F172A', borderRight: '1px solid rgba(99,102,241,0.2)',
                zIndex: 50,
              }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}
        className="main-content">
        {/* Top navbar */}
        <header style={{
          height: 64, borderBottom: '1px solid rgba(99,102,241,0.1)',
          background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', position: 'sticky', top: 0, zIndex: 30,
        }}>
          <button
            onClick={() => setMobileOpen(true)}
            style={{
              background: 'none', border: 'none', color: '#F8FAFC',
              cursor: 'pointer', padding: 8,
            }}
            className="mobile-menu-btn"
          >
            <Menu size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              padding: '6px 14px', borderRadius: 999,
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
              fontSize: 13, color: '#6366F1', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Zap size={12} />
              AI Powered
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '32px 24px', overflowY: 'auto' }} className="page-transition">
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .sidebar-desktop { display: block !important; }
          .main-content { margin-left: ${collapsed ? 72 : 260}px; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}
