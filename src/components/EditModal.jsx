import { useState } from 'react';
import PropTypes from 'prop-types';
import { validateName, validateMobile, validateDepartment } from '../utils/validators';

function EditModal({ submission, onSave, onClose }) {
  const [fullName, setFullName] = useState(submission.fullName || '');
  const [email] = useState(submission.email || '');
  const [mobile, setMobile] = useState(submission.mobile || '');
  const [department, setDepartment] = useState(submission.department || '');
  const [errors, setErrors] = useState({});

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameError = validateName(fullName);
    const mobileError = validateMobile(mobile);
    const departmentError = validateDepartment(department);

    const newErrors = {};

    if (nameError) {
      newErrors.fullName = nameError;
    }
    if (mobileError) {
      newErrors.mobile = mobileError;
    }
    if (departmentError) {
      newErrors.department = departmentError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave({
      ...submission,
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      department: department.trim(),
    });
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-card">
        <h3>Edit Submission</h3>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="edit-fullName">Full Name</label>
            <input
              type="text"
              id="edit-fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={errors.fullName ? 'input-error' : ''}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <span className="error-text">{errors.fullName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="edit-email">Email</label>
            <input
              type="email"
              id="edit-email"
              value={email}
              disabled
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-mobile">Mobile Number</label>
            <input
              type="text"
              id="edit-mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className={errors.mobile ? 'input-error' : ''}
              placeholder="Enter your 10-digit mobile number"
            />
            {errors.mobile && (
              <span className="error-text">{errors.mobile}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="edit-department">Department</label>
            <select
              id="edit-department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className={errors.department ? 'input-error' : ''}
            >
              <option value="">Select a department</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
            {errors.department && (
              <span className="error-text">{errors.department}</span>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditModal.propTypes = {
  submission: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    submittedAt: PropTypes.string.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditModal;