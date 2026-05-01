import PropTypes from 'prop-types';

function getBadgeClass(department) {
  if (!department) return 'badge badge-default';
  const key = department.toLowerCase();
  const map = {
    engineering: 'badge badge-engineering',
    marketing: 'badge badge-marketing',
    sales: 'badge badge-sales',
    hr: 'badge badge-hr',
    design: 'badge badge-design',
    finance: 'badge badge-finance',
  };
  return map[key] || 'badge badge-default';
}

function SubmissionTable({ submissions, onEdit, onDelete }) {
  if (!submissions || submissions.length === 0) {
    return (
      <div className="empty-state">
        <p>No submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="submissions-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Department</th>
            <th>Submitted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission, index) => (
            <tr key={submission.id}>
              <td>{index + 1}</td>
              <td>{submission.fullName}</td>
              <td>{submission.email}</td>
              <td>{submission.mobile}</td>
              <td>
                <span className={getBadgeClass(submission.department)}>
                  {submission.department}
                </span>
              </td>
              <td>{new Date(submission.submittedAt).toLocaleDateString()}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(submission)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(submission.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

SubmissionTable.propTypes = {
  submissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      mobile: PropTypes.string.isRequired,
      department: PropTypes.string.isRequired,
      submittedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default SubmissionTable;