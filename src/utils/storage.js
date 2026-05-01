/**
 * Client-side data persistence layer abstracting localStorage CRUD
 * for candidate submissions.
 *
 * All functions operate on the 'hirehub_submissions' key in localStorage.
 * Defensive coding is applied for corrupted or missing data.
 */

const STORAGE_KEY = 'hirehub_submissions';

/**
 * Reads and parses submissions from localStorage.
 * @returns {Array<Object>} Array of submission objects, or empty array on corruption/missing data.
 */
export function getSubmissions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      console.error('Corrupted submissions data: expected array, resetting.');
      localStorage.setItem(STORAGE_KEY, '[]');
      return [];
    }
    return parsed;
  } catch (error) {
    console.error('Error reading submissions from localStorage:', error);
    localStorage.setItem(STORAGE_KEY, '[]');
    return [];
  }
}

/**
 * Serializes and saves the submissions array to localStorage.
 * @param {Array<Object>} submissions - The array of submission objects to persist.
 */
export function saveSubmissions(submissions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch (error) {
    console.error('Error saving submissions to localStorage:', error);
  }
}

/**
 * Adds a new submission to localStorage.
 * Generates a unique id and submittedAt timestamp.
 * @param {Object} submission - The submission data (fullName, email, mobile, department).
 * @throws {Error} If the email already exists (duplicate).
 */
export function addSubmission(submission) {
  if (isEmailDuplicate(submission.email)) {
    throw new Error('Duplicate email');
  }
  const submissions = getSubmissions();
  const newSubmission = {
    ...submission,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };
  submissions.push(newSubmission);
  saveSubmissions(submissions);
}

/**
 * Updates an existing submission by id.
 * Merges updates into the existing submission, excluding id and email fields.
 * @param {string} id - The id of the submission to update.
 * @param {Object} updates - The fields to update.
 * @throws {Error} If the submission is not found.
 */
export function updateSubmission(id, updates) {
  const submissions = getSubmissions();
  let found = false;

  const updatedSubmissions = submissions.map((submission) => {
    if (submission.id === id) {
      found = true;
      const { id: _id, email: _email, ...safeUpdates } = updates;
      return { ...submission, ...safeUpdates };
    }
    return submission;
  });

  if (!found) {
    throw new Error('Submission not found');
  }

  saveSubmissions(updatedSubmissions);
}

/**
 * Deletes a submission by id.
 * @param {string} id - The id of the submission to delete.
 * @throws {Error} If the submission is not found.
 */
export function deleteSubmission(id) {
  const submissions = getSubmissions();
  const filtered = submissions.filter((submission) => submission.id !== id);

  if (filtered.length === submissions.length) {
    throw new Error('Submission not found');
  }

  saveSubmissions(filtered);
}

/**
 * Checks if an email already exists in submissions (case-insensitive).
 * @param {string} email - The email to check.
 * @param {string} [excludeId] - Optional id to exclude from the check (for edit scenarios).
 * @returns {boolean} True if a duplicate email exists, false otherwise.
 */
export function isEmailDuplicate(email, excludeId) {
  if (!email) {
    return false;
  }
  const submissions = getSubmissions();
  const normalizedEmail = email.trim().toLowerCase();

  return submissions.some((submission) => {
    if (excludeId && submission.id === excludeId) {
      return false;
    }
    return submission.email && submission.email.trim().toLowerCase() === normalizedEmail;
  });
}