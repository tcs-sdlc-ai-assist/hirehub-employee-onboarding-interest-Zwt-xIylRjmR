import { NavLink, Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function Header({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/admin');
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('hirehub_admin_auth');
    } catch (error) {
      console.error('Error clearing session storage:', error);
    }
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  return (
    <header className="header">
      <Link to="/" className="header-brand">
        HireHub
      </Link>
      <nav className="header-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Home
        </NavLink>
        <NavLink
          to="/apply"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Apply
        </NavLink>
        <NavLink
          to="/admin"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Admin
        </NavLink>
      </nav>
      <div className="header-actions">
        {isAuthenticated ? (
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="btn-logout" onClick={handleLogin}>
            Login
          </button>
        )}
      </div>
    </header>
  );
}

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Header;