import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import SchoolsList from './pages/schools/SchoolsList';
import SchoolDetails from './pages/schools/SchoolDetails';
import SchoolCreate from './pages/schools/SchoolCreate';
import SchoolEdit from './pages/schools/SchoolEdit';
import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</Box>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      
      {/* Protected routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Schools routes */}
        <Route path="/schools" element={
          <ProtectedRoute>
            <SchoolsList />
          </ProtectedRoute>
        } />
        <Route path="/schools/new" element={
          <ProtectedRoute>
            <SchoolCreate />
          </ProtectedRoute>
        } />
        <Route path="/schools/:id" element={
          <ProtectedRoute>
            <SchoolDetails />
          </ProtectedRoute>
        } />
        <Route path="/schools/:id/edit" element={
          <ProtectedRoute>
            <SchoolEdit />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App; 