import PropTypes from 'prop-types';

function ProtectedRoute({ children, fallback }) {
  let isAuthenticated = false;

  try {
    isAuthenticated = sessionStorage.getItem('hirehub_admin_auth') === 'true';
  } catch (error) {
    console.error('Error reading auth state from sessionStorage:', error);
    try {
      sessionStorage.removeItem('hirehub_admin_auth');
    } catch (removeError) {
      console.error('Error clearing sessionStorage:', removeError);
    }
    isAuthenticated = false;
  }

  if (isAuthenticated) {
    return children;
  }

  return fallback;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node.isRequired,
};

export default ProtectedRoute;