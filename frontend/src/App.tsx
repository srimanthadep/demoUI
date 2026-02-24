import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from './hooks/useDarkMode';
import NotificationBell from './components/NotificationBell';

// Pages
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import StaffPage from './pages/StaffPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ExpensePage from './pages/ExpensePage';
import AttendancePage from './pages/AttendancePage';

// Icons
import {
    MdDashboard, MdPeople, MdSchool,
    MdBarChart, MdSettings, MdMenu,
    MdReceiptLong, MdChecklist, MdPlayCircle
} from 'react-icons/md';

const NAV_ITEMS = [
    { path: '/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
    { path: '/students', label: 'Students', icon: <MdSchool /> },
    { path: '/staff', label: 'Staff', icon: <MdPeople /> },
    { path: '/reports', label: 'Reports', icon: <MdBarChart /> },
    { path: '/expenses', label: 'Expenses', icon: <MdReceiptLong /> },
    { path: '/attendance', label: 'Attendance', icon: <MdChecklist /> },
    { path: '/settings', label: 'Settings', icon: <MdSettings /> },
];

// ── Sidebar ────────────────────────────────────────────────────
function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="sidebar-overlay active"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <h2 style={{ fontSize: 18 }}>St Aloysius High School</h2>
                    <p style={{ fontSize: 11, opacity: 0.75 }}>Fee &amp; Salary Management</p>
                </div>
                <nav className="sidebar-nav">
                    <span className="nav-section-title">Main Navigation</span>
                    {NAV_ITEMS.map((item, idx) => (
                        <motion.div
                            key={item.path}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.05 + idx * 0.05 }}
                        >
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `nav-item ${isActive ? 'active shadow-sm' : ''}`}
                                onClick={onClose}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {item.label}
                            </NavLink>
                        </motion.div>
                    ))}
                </nav>
                {/* Sidebar footer removed as per user request */}
                <div style={{ padding: 16 }}></div>
            </aside>
        </>
    );
}

// ── Main Layout ────────────────────────────────────────────────
function AdminLayout({ children, pageTitle, pageSubtitle }: {
    children: React.ReactNode;
    pageTitle: string;
    pageSubtitle?: string;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();
    const { isDark, toggle } = useDarkMode();

    return (
        <div className="app-layout">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="main-content">
                <header className="topbar glass">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
                            <MdMenu />
                        </button>
                        <div className="topbar-title">
                            <motion.h1
                                key={pageTitle}
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                style={{ fontSize: 20, fontWeight: 700 }}
                            >
                                {pageTitle}
                            </motion.h1>
                            {pageSubtitle && <p style={{ fontSize: 12, color: '#64748b' }}>{pageSubtitle}</p>}
                        </div>
                    </div>
                    <div className="topbar-actions">
                        {/* Dark Mode Toggle */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={toggle}
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            style={{
                                width: 42, height: 42, borderRadius: '50%',
                                border: 'none', cursor: 'pointer', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                fontSize: 20,
                                background: isDark ? 'rgba(249,168,37,0.15)' : 'rgba(26,35,126,0.08)',
                                transition: 'background 0.3s'
                            }}
                        >
                            <motion.span
                                key={isDark ? 'moon' : 'sun'}
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 90 }}
                                transition={{ duration: 0.25 }}
                            >
                                {isDark ? '☀️' : '🌙'}
                            </motion.span>
                        </motion.button>
                        {/* Notification Bell */}
                        <NotificationBell />
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="user-badge glass shadow-sm"
                            style={{ padding: '6px 12px', borderRadius: 12 }}
                        >
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: 14, fontWeight: 700
                            }}>
                                SA
                            </div>
                            <div className="user-info-text">
                                <div className="user-name" style={{ fontSize: 13, fontWeight: 600 }}>
                                    {user?.name || 'School Admin'}
                                </div>
                                <div className="user-role" style={{ fontSize: 10, color: '#64748b' }}>
                                    👑 Main Admin
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </header>
                <main className="content-area">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
                {/* Mobile Bottom Nav */}
                <nav className="bottom-nav">
                    {NAV_ITEMS.map(item => (
                        <NavLink key={item.path} to={item.path} className={({ isActive }) => isActive ? 'active' : ''}>
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
}

// ── Routes (no auth guard) ─────────────────────────────────────
function AppRoutes() {
    const location = useLocation();
    return (
        <Routes>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={
                <AdminLayout pageTitle="Dashboard" pageSubtitle="Overview of school finances">
                    <Dashboard />
                </AdminLayout>
            } />
            <Route path="/students" element={
                <AdminLayout pageTitle="Students" pageSubtitle="Manage student records and fees">
                    <StudentsPage />
                </AdminLayout>
            } />
            <Route path="/staff" element={
                <AdminLayout pageTitle="Staff" pageSubtitle="Manage staff and salaries">
                    <StaffPage />
                </AdminLayout>
            } />
            <Route path="/reports" element={
                <AdminLayout pageTitle="Reports" pageSubtitle="Financial reports and analytics">
                    <ReportsPage />
                </AdminLayout>
            } />
            <Route path="/expenses" element={
                <AdminLayout pageTitle="Expenses" pageSubtitle="Manage school expenses">
                    <ExpensePage />
                </AdminLayout>
            } />
            <Route path="/attendance" element={
                <AdminLayout pageTitle="Attendance" pageSubtitle="Swipe to mark student attendance">
                    <AttendancePage />
                </AdminLayout>
            } />
            <Route path="/settings" element={
                <AdminLayout pageTitle="Settings" pageSubtitle="School configuration">
                    <SettingsPage />
                </AdminLayout>
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
            refetchOnWindowFocus: false,
            staleTime: 30 * 1000,
        },
    },
});

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <NotificationProvider>
                    <BrowserRouter>
                        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                            <div style={{ flex: 1 }}>
                                <AppRoutes />
                            </div>
                        </div>
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 3500,
                                style: { fontFamily: "'Inter', sans-serif", fontSize: 14, borderRadius: 10 }
                            }}
                        />
                    </BrowserRouter>
                </NotificationProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
