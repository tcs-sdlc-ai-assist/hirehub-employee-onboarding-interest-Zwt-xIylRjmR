import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import InterestForm from './components/InterestForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('hirehub_admin_auth') === 'true';
    } catch (error) {
      console.error('Error reading auth state from sessionStorage:', error);
      return false;
    }
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('hirehub_admin_auth');
    } catch (error) {
      console.error('Error clearing session storage:', error);
    }
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/apply" element={<InterestForm />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                fallback={<AdminLogin onLogin={handleLogin} />}
              >
                <AdminDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;