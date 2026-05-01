/**
 * Centralized validation utility module for form fields.
 * All functions return an empty string if valid, or an error message string if invalid.
 */

/**
 * Validates a full name field.
 * @param {string} name - The name to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateName(name) {
  if (!name || name.trim().length === 0) {
    return 'Full name is required';
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return 'Full name must be at least 2 characters';
  }
  if (trimmed.length > 50) {
    return 'Full name must not exceed 50 characters';
  }
  if (!/^[A-Za-z\s]+$/.test(trimmed)) {
    return 'Full name must contain only alphabets and spaces';
  }
  return '';
}

/**
 * Validates an email field.
 * @param {string} email - The email to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateEmail(email) {
  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }
  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return 'Please enter a valid email address';
  }
  return '';
}

/**
 * Validates a mobile number field.
 * @param {string} mobile - The mobile number to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateMobile(mobile) {
  if (!mobile || mobile.trim().length === 0) {
    return 'Mobile number is required';
  }
  const trimmed = mobile.trim();
  if (!/^\d{10}$/.test(trimmed)) {
    return 'Mobile number must be exactly 10 digits';
  }
  return '';
}

/**
 * Validates a department selection field.
 * @param {string} department - The department value to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateDepartment(department) {
  if (!department || department.trim().length === 0) {
    return 'Department is required';
  }
  return '';
}