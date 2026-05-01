import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSubmissions,
  saveSubmissions,
  addSubmission,
  updateSubmission,
  deleteSubmission,
  isEmailDuplicate,
} from './storage';

describe('storage', () => {
  let store;

  beforeEach(() => {
    store = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key) => (key in store ? store[key] : null)),
      setItem: vi.fn((key, value) => {
        store[key] = String(value);
      }),
      removeItem: vi.fn((key) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    });

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'test-uuid-1234'),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getSubmissions', () => {
    it('returns empty array when no data exists in localStorage', () => {
      const result = getSubmissions();
      expect(result).toEqual([]);
    });

    it('returns parsed array when valid data exists', () => {
      const submissions = [
        {
          id: 'abc-123',
          fullName: 'John Doe',
          email: 'john@example.com',
          mobile: '9876543210',
          department: 'Engineering',
          submittedAt: '2024-04-01T12:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(submissions);

      const result = getSubmissions();
      expect(result).toEqual(submissions);
      expect(result).toHaveLength(1);
      expect(result[0].fullName).toBe('John Doe');
    });

    it('returns empty array and recovers when JSON is corrupted', () => {
      store['hirehub_submissions'] = '{not valid json!!!';

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = getSubmissions();

      expect(result).toEqual([]);
      expect(localStorage.setItem).toHaveBeenCalledWith('hirehub_submissions', '[]');
      consoleSpy.mockRestore();
    });

    it('returns empty array and resets when data is not an array', () => {
      store['hirehub_submissions'] = JSON.stringify({ foo: 'bar' });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = getSubmissions();

      expect(result).toEqual([]);
      expect(localStorage.setItem).toHaveBeenCalledWith('hirehub_submissions', '[]');
      consoleSpy.mockRestore();
    });
  });

  describe('saveSubmissions', () => {
    it('serializes and saves submissions to localStorage', () => {
      const submissions = [
        {
          id: 'abc-123',
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          mobile: '1234567890',
          department: 'Marketing',
          submittedAt: '2024-04-01T12:00:00.000Z',
        },
      ];

      saveSubmissions(submissions);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'hirehub_submissions',
        JSON.stringify(submissions)
      );
    });
  });

  describe('addSubmission', () => {
    it('adds submission with generated id and submittedAt', () => {
      const submission = {
        fullName: 'John Doe',
        email: 'john@example.com',
        mobile: '9876543210',
        department: 'Engineering',
      };

      addSubmission(submission);

      const saved = JSON.parse(store['hirehub_submissions']);
      expect(saved).toHaveLength(1);
      expect(saved[0].id).toBe('test-uuid-1234');
      expect(saved[0].fullName).toBe('John Doe');
      expect(saved[0].email).toBe('john@example.com');
      expect(saved[0].mobile).toBe('9876543210');
      expect(saved[0].department).toBe('Engineering');
      expect(saved[0].submittedAt).toBeDefined();
    });

    it('persists to localStorage', () => {
      const submission = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        mobile: '1234567890',
        department: 'Sales',
      };

      addSubmission(submission);

      expect(localStorage.setItem).toHaveBeenCalled();
      const saved = JSON.parse(store['hirehub_submissions']);
      expect(saved).toHaveLength(1);
    });

    it('throws error when email is duplicate', () => {
      const existing = [
        {
          id: 'existing-id',
          fullName: 'Existing User',
          email: 'john@example.com',
          mobile: '1111111111',
          department: 'HR',
          submittedAt: '2024-04-01T12:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      const submission = {
        fullName: 'John Doe',
        email: 'john@example.com',
        mobile: '9876543210',
        department: 'Engineering',
      };

      expect(() => addSubmission(submission)).toThrow('Duplicate email');
    });

    it('throws error for case-insensitive duplicate email', () => {
      const existing = [
        {
          id: 'existing-id',
          fullName: 'Existing User',
          email: 'John@Example.com',
          mobile: '1111111111',
          department: 'HR',
          submittedAt: '2024-04-01T12:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      const submission = {
        fullName: 'John Doe',
        email: 'john@example.com',
        mobile: '9876543210',
        department: 'Engineering',
      };

      expect(() => addSubmission(submission)).toThrow('Duplicate email');
    });
  });

  describe('updateSubmission', () => {
    it('updates specified fields by id', () => {
      const existing = [
        {
          id: 'sub-1',
          fullName: 'John Doe',
          email: 'john@example.com',
          mobile: '9876543210',
          department: 'Engineering',
          submittedAt: '2024-04-01T12:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      updateSubmission('sub-1', { fullName: 'John Smith', department: 'Marketing' });

      const saved = JSON.parse(store['hirehub_submissions']);
      expect(saved[0].fullName).toBe('John Smith');
      expect(saved[0].department).toBe('Marketing');
      expect(saved[0].mobile).toBe('9876543210');
    });

    it('does not modify email field', () => {
      const existing = [
        {
          id: 'sub-1',
          fullName: 'John Doe',
          email: 'john@example.com',
          mobile: '9876543210',
          department: 'Engineering',
          submittedAt: '2024-04-01T12:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      updateSubmission('sub-1', { fullName: 'John Smith', email: 'newemail@example.com' });

      const saved = JSON.parse(store['hirehub_submissions']);
      expect(saved[0].email).toBe('john@example.com');
      expect(saved[0].fullName).toBe('John Smith');
    });

    it('does not modify id field', () => {
      const existing = [
        {
          id: 'sub-1',
          fullName: 'John Doe',
          email: 'john@example.com',
          mobile: '9876543210',
          department: 'Engineering',
          submittedAt: '2024-04-01T12:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      updateSubmission('sub-1', { id: 'new-id', fullName: 'John Smith' });

      const saved = JSON.parse(store['hirehub_submissions']);
      expect(saved[0].id).toBe('sub-1');
    });

    it('throws error when submission is not found', () => {
      store['hirehub_submissions'] = JSON.stringify([]);

      expect(() => updateSubmission('nonexistent', { fullName: 'Test' })).toThrow(
        'Submission not found'
      );
    });
  });

  describe('deleteSubmission', () => {
    it('removes submission by id', () => {
      const existing = [
        {
          id: 'sub-1',
          fullName: 'John Doe',
          email: 'john@example.com',
          mobile: '9876543210',
          department: 'Engineering',
          submittedAt: '2024-04-01T12:00:00.000Z',
        },
        {
          id: 'sub-2',
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          mobile: '1234567890',
          department: 'Marketing',
          submittedAt: '2024-04-02T12:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      deleteSubmission('sub-1');

      const saved = JSON.parse(store['hirehub_submissions']);
      expect(saved).toHaveLength(1);
      expect(saved[0].id).toBe('sub-2');
    });

    it('leaves other submissions intact', () => {
      const existing = [
        {
          id: 'sub-1',
          fullName: 'John Doe',
          email: 'john@example.com',
          mobile: '9876543210',
          department: 'Engineering',
          submittedAt: '2024-04-01T12:00:00.000Z',
        },
        {
          id: 'sub-2',
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          mobile: '1234567890',
          department: 'Marketing',
          submittedAt: '2024-04-02T12:00:00.000Z',
        },
        {
          id: 'sub-3',
          fullName: 'Bob Smith',
          email: 'bob@example.com',
          mobile: '5555555555',
          department: 'Sales',
          submittedAt: '2024-04-03T12:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      deleteSubmission('sub-2');

      const saved = JSON.parse(store['hirehub_submissions']);
      expect(saved).toHaveLength(2);
      expect(saved[0].id).toBe('sub-1');
      expect(saved[1].id).toBe('sub-3');
    });

    it('throws error when submission is not found', () => {
      store['hirehub_submissions'] = JSON.stringify([]);

      expect(() => deleteSubmission('nonexistent')).toThrow('Submission not found');
    });
  });

  describe('isEmailDuplicate', () => {
    const existing = [
      {
        id: 'sub-1',
        fullName: 'John Doe',
        email: 'john@example.com',
        mobile: '9876543210',
        department: 'Engineering',
        submittedAt: '2024-04-01T12:00:00.000Z',
      },
      {
        id: 'sub-2',
        fullName: 'Jane Doe',
        email: 'Jane@Example.COM',
        mobile: '1234567890',
        department: 'Marketing',
        submittedAt: '2024-04-02T12:00:00.000Z',
      },
    ];

    beforeEach(() => {
      store['hirehub_submissions'] = JSON.stringify(existing);
    });

    it('returns true for existing email', () => {
      expect(isEmailDuplicate('john@example.com')).toBe(true);
    });

    it('returns true for existing email case-insensitive', () => {
      expect(isEmailDuplicate('JOHN@EXAMPLE.COM')).toBe(true);
      expect(isEmailDuplicate('jane@example.com')).toBe(true);
    });

    it('returns false for new email', () => {
      expect(isEmailDuplicate('newuser@example.com')).toBe(false);
    });

    it('returns false for empty email', () => {
      expect(isEmailDuplicate('')).toBe(false);
    });

    it('returns false for null/undefined email', () => {
      expect(isEmailDuplicate(null)).toBe(false);
      expect(isEmailDuplicate(undefined)).toBe(false);
    });

    it('respects excludeId parameter', () => {
      expect(isEmailDuplicate('john@example.com', 'sub-1')).toBe(false);
    });

    it('still returns true when excludeId does not match the duplicate', () => {
      expect(isEmailDuplicate('john@example.com', 'sub-2')).toBe(true);
    });
  });
});