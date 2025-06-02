import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.css';

// Components
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rules from './pages/Rules';
import UserManagement from './pages/UserManagement';
import RuleManagement from './pages/RuleManagement';
import NotFound from './pages/NotFound';

// Services
import { authService, userService } from './services/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Load users and check authentication status
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if user is already logged in
        const savedUser = authService.getCurrentUser();
        if (savedUser) {
          setCurrentUser(savedUser);
          setIsLoggedIn(true);
          
          // Fetch users if admin or superadmin
          if (savedUser.role === 'admin' || savedUser.role === 'superadmin') {
            const response = await userService.getAll();
            setUsers(response.data.data);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);

  // Handle login
  const handleLogin = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      
      if (response.success) {
        setCurrentUser(response.user);
        setIsLoggedIn(true);
        
        // Fetch users if admin or superadmin
        if (response.user.role === 'admin' || response.user.role === 'superadmin') {
          const usersResponse = await userService.getAll();
          setUsers(usersResponse.data.data);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsLoggedIn(false);
    setUsers([]);
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  // Admin route component
  const AdminRoute = ({ children }) => {
    if (!isLoggedIn || (currentUser && currentUser.role !== 'superadmin' && currentUser.role !== 'admin')) {
      return <Navigate to="/dashboard" />;
    }
    return children;
  };

  // SuperAdmin route component
  const SuperAdminRoute = ({ children }) => {
    if (!isLoggedIn || (currentUser && currentUser.role !== 'superadmin')) {
      return <Navigate to="/dashboard" />;
    }
    return children;
  };
  
  // Log the current user for debugging
  console.log('Current user in App.jsx:', currentUser);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <Layout 
              isLoggedIn={isLoggedIn} 
              currentUser={currentUser} 
              handleLogout={handleLogout} 
            />
          }
        >
          <Route index element={<Home isLoggedIn={isLoggedIn} />} />
          <Route 
            path="login" 
            element={
              isLoggedIn ? 
              <Navigate to="/dashboard" /> : 
              <Login handleLogin={handleLogin} />
            } 
          />
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard currentUser={currentUser} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="rules" 
            element={
              <ProtectedRoute>
                <Rules currentUser={currentUser} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="user-management" 
            element={
              <AdminRoute>
                <UserManagement currentUser={currentUser} />
              </AdminRoute>
            } 
          />
          <Route 
            path="rule-management" 
            element={
              <SuperAdminRoute>
                <RuleManagement currentUser={currentUser} />
              </SuperAdminRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
