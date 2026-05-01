import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import SubmissionTable from './SubmissionTable';
import EditModal from './EditModal';
import { getSubmissions, updateSubmission, deleteSubmission } from '../utils/storage';

function AdminDashboard({ onLogout }) {
  const [submissions, setSubmissions] = useState([]);
  const [editingSubmission, setEditingSubmission] = useState(null);

  const loadSubmissions = useCallback(() => {
    const data = getSubmissions();
    setSubmissions(data);
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const totalSubmissions = submissions.length;

  const uniqueDepartments = new Set(submissions.map((s) => s.department)).size;

  const latestSubmission = (() => {
    if (submissions.length === 0) {
      return 'N/A';
    }
    const sorted = [...submissions].sort(
      (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
    );
    return sorted[0].fullName || 'N/A';
  })();

  const handleEdit = (submission) => {
    setEditingSubmission(submission);
  };

  const handleSave = (updatedSubmission) => {
    try {
      const { id, ...updates } = updatedSubmission;
      updateSubmission(id, updates);
      setEditingSubmission(null);
      loadSubmissions();
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        deleteSubmission(id);
        loadSubmissions();
      } catch (error) {
        console.error('Error deleting submission:', error);
      }
    }
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
  };

  return (
    <div className="dashboard-page">
      <div className="table-card-header" style={{ padding: '0 0 24px 0', border: 'none' }}>
        <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-card-label">Total Submissions</div>
          <div className="stat-card-value">{totalSubmissions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Unique Departments</div>
          <div className="stat-card-value">{uniqueDepartments}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Latest Submission</div>
          <div className="stat-card-value">{latestSubmission}</div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <h3>All Submissions</h3>
        </div>
        <SubmissionTable
          submissions={submissions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {editingSubmission && (
        <EditModal
          submission={editingSubmission}
          onSave={handleSave}
          onClose={() => setEditingSubmission(null)}
        />
      )}
    </div>
  );
}

AdminDashboard.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default AdminDashboard;