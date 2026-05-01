import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { validateName, validateEmail, validateMobile, validateDepartment } from '../utils/validators';
import { addSubmission, isEmailDuplicate } from '../utils/storage';

function InterestForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [department, setDepartment] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameError = validateName(fullName);
    const emailError = validateEmail(email);
    const mobileError = validateMobile(mobile);
    const departmentError = validateDepartment(department);

    const newErrors = {};

    if (nameError) {
      newErrors.fullName = nameError;
    }
    if (emailError) {
      newErrors.email = emailError;
    }
    if (mobileError) {
      newErrors.mobile = mobileError;
    }
    if (departmentError) {
      newErrors.department = departmentError;
    }

    if (!emailError && isEmailDuplicate(email)) {
      newErrors.email = 'This email has already been submitted';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccessMessage('');
      return;
    }

    try {
      addSubmission({
        fullName: fullName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        department: department.trim(),
      });

      setFullName('');
      setEmail('');
      setMobile('');
      setDepartment('');
      setErrors({});
      setSuccessMessage('Your application has been submitted successfully!');
    } catch (error) {
      if (error.message === 'Duplicate email') {
        setErrors({ email: 'This email has already been submitted' });
      } else {
        console.error('Error submitting application:', error);
        setErrors({ form: 'An unexpected error occurred. Please try again.' });
      }
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Express Your Interest</h2>
        <p className="form-subtitle">
          Fill out the form below to express your interest in joining our team.
        </p>

        {successMessage && (
          <div className="success-banner">{successMessage}</div>
        )}

        {errors.form && (
          <div className="error-banner">{errors.form}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'input-error' : ''}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="text"
              id="mobile"
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
            <label htmlFor="department">Department</label>
            <select
              id="department"
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

          <button type="submit" className="btn btn-primary">
            Submit Application
          </button>
        </form>

        <div className="text-center mt-16">
          <Link to="/" className="nav-link">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InterestForm;