import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProfilePage from './pages/ProfilePage';
import DemoProfilePage from './pages/DemoProfilePage';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EditProfilePage from './pages/EditProfilePage';
import NotFound from './pages/NotFound';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import TemplatesPage from './pages/TemplatesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import HelpCenter from './pages/HelpCenter';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import StatusPage from './pages/StatusPage';
import BlogPage from './pages/BlogPage';
import CareersPage from './pages/CareersPage';
import PressPage from './pages/PressPage';
import CookiePolicy from './pages/CookiePolicy';
import GDPRPage from './pages/GDPRPage';
import DebugPage from './pages/DebugPage';
import PaymentSuccess from './pages/PaymentSuccess';
import RingAvatarDemo from './components/demo/RingAvatarDemo';

function App() {
  useEffect(() => {
    // Auto-disable animations on slower devices
    const shouldDisableAnimations =
      navigator.hardwareConcurrency <= 2 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.location.search.includes('no-animations');

    if (shouldDisableAnimations) {
      document.body.classList.add('disable-animations');
    }
  }, []);

  return (
    <AuthProvider>
      <ProfileProvider>
        <Router>
          <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/system-control-panel-x7k9m"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

           
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfilePage />
                </ProtectedRoute>
              }
            />

            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/press" element={<PressPage />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/gdpr" element={<GDPRPage />} />
            <Route path="/system-debug" element={<DebugPage />} />
            <Route path="/ring-avatar-demo" element={<RingAvatarDemo />} />
            <Route
              path="/premium/payment/success"
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
            <Route path="/404" element={<NotFound />} />

            <Route path="/demo-profile" element={<DemoProfilePage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/:username" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;