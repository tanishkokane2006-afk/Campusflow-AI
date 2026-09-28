import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import PlacementDrives from './pages/student/PlacementDrives';
import JobDetails from './pages/student/JobDetails';
import MyApplications from './pages/student/MyApplications';
import Profile from './pages/student/Profile';
import AIAssistant from './pages/student/AIAssistant';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Companies from './pages/admin/Companies';
import PlacementDrivesAdmin from './pages/admin/PlacementDrivesAdmin';
import ApplicantsAdmin from './pages/admin/ApplicantsAdmin';
import AnalyticsAdmin from './pages/admin/AnalyticsAdmin';

// Index Redirect Component
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Student Protected Routes */}
          <Route
            element={
              <ProtectedRoute allowedRole="student">
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/drives" element={<PlacementDrives />} />
            <Route path="/student/drives/:jobId" element={<JobDetails />} />
            <Route path="/student/applications" element={<MyApplications />} />
            <Route path="/student/profile" element={<Profile />} />
            <Route path="/student/ai-assistant" element={<AIAssistant />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route
            element={
              <ProtectedRoute allowedRole="admin">
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/companies" element={<Companies />} />
            <Route path="/admin/drives" element={<PlacementDrivesAdmin />} />
            <Route path="/admin/applicants" element={<ApplicantsAdmin />} />
            <Route path="/admin/analytics" element={<AnalyticsAdmin />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
