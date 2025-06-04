import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import TaskManagement from './pages/admin/TaskManagement';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import UserTasks from './pages/user/Tasks';

// Layout Components
import AdminLayout from './components/layouts/AdminLayout';
import UserLayout from './components/layouts/UserLayout';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return user.role === 'admin' 
      ? <Navigate to="/admin/dashboard" /> 
      : <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated 
            ? (user.role === 'admin' 
                ? <Navigate to="/admin/dashboard" /> 
                : <Navigate to="/dashboard" />)
            : <Login />
        } 
      />
      <Route 
        path="/register" 
        element={
          isAuthenticated 
            ? (user.role === 'admin' 
                ? <Navigate to="/admin/dashboard" /> 
                : <Navigate to="/dashboard" />)
            : <Register />
        } 
      />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="tasks" element={<TaskManagement />} />
      </Route>
      
      {/* User Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <UserLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="tasks" element={<UserTasks />} />
      </Route>
      
      {/* Default Redirect */}
      <Route path="/" element={
        <Navigate to={
          isAuthenticated 
            ? (user?.role === 'admin' ? "/admin/dashboard" : "/dashboard") 
            : "/login"
        } />
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;