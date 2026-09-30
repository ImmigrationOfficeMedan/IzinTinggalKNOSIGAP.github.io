import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import SearchPage from './pages/SearchPage';
import PenjaminPage from './pages/PenjaminPage';
import PenjaminLoginPage from './pages/PenjaminLoginPage';
import PenjaminDashboardPage from './pages/PenjaminDashboardPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <Toaster richColors position="top-right" />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/layanan/:slug" element={<ServiceDetailPage />} />
                    <Route path="/pencarian" element={<SearchPage />} />
                    <Route path="/penjamin" element={<PenjaminPage />} />
                    <Route path="/penjamin/login" element={<PenjaminLoginPage />} />
                    <Route path="/penjamin/dashboard" element={<PenjaminDashboardPage />} />
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
