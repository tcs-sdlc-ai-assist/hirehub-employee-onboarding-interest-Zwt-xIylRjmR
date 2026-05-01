import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

vi.mock('../utils/storage', () => ({
  getSubmissions: vi.fn(),
  updateSubmission: vi.fn(),
  deleteSubmission: vi.fn(),
}));

import { getSubmissions, updateSubmission, deleteSubmission } from '../utils/storage';

describe('AdminDashboard', () => {
  let store;

  const mockSubmissions = [
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
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      mobile: '1234567890',
      department: 'Marketing',
      submittedAt: '2024-04-02T12:00:00.000Z',
    },
    {
      id: 'sub-3',
      fullName: 'Bob Wilson',
      email: 'bob@example.com',
      mobile: '5555555555',
      department: 'Engineering',
      submittedAt: '2024-04-03T12:00:00.000Z',
    },
  ];

  beforeEach(() => {
    store = {};
    vi.stubGlobal('sessionStorage', {
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

    getSubmissions.mockReturnValue([]);
    updateSubmission.mockImplementation(() => {});
    deleteSubmission.mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function renderDashboard({ onLogout = vi.fn() } = {}) {
    return {
      onLogout,
      ...render(
        <MemoryRouter>
          <AdminDashboard onLogout={onLogout} />
        </MemoryRouter>
      ),
    };
  }

  it('renders stat cards showing correct total submissions count', () => {
    getSubmissions.mockReturnValue(mockSubmissions);
    renderDashboard();

    expect(screen.getByText('Total Submissions')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders stat cards showing correct unique department count', () => {
    getSubmissions.mockReturnValue(mockSubmissions);
    renderDashboard();

    expect(screen.getByText('Unique Departments')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders stat cards showing latest submission name', () => {
    getSubmissions.mockReturnValue(mockSubmissions);
    renderDashboard();

    expect(screen.getByText('Latest Submission')).toBeInTheDocument();
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
  });

  it('renders submission table with data', () => {
    getSubmissions.mockReturnValue(mockSubmissions);
    renderDashboard();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('5555555555')).toBeInTheDocument();
  });

  it('shows "No submissions yet." when submissions array is empty', () => {
    getSubmissions.mockReturnValue([]);
    renderDashboard();

    expect(screen.getByText('No submissions yet.')).toBeInTheDocument();
  });

  it('shows stat cards with zero and N/A when no submissions', () => {
    getSubmissions.mockReturnValue([]);
    renderDashboard();

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('clicking Edit button opens EditModal', async () => {
    getSubmissions.mockReturnValue(mockSubmissions);
    renderDashboard();
    const user = userEvent.setup();

    const editButtons = screen.getAllByText('Edit');
    await user.click(editButtons[0]);

    expect(screen.getByText('Edit Submission')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
  });

  it('clicking Delete button triggers window.confirm and removes submission on confirm', async () => {
    getSubmissions.mockReturnValue(mockSubmissions);
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderDashboard();
    const user = userEvent.setup();

    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this submission?');
    expect(deleteSubmission).toHaveBeenCalledWith('sub-1');

    confirmSpy.mockRestore();
  });

  it('clicking Delete button does not delete when confirm is cancelled', async () => {
    getSubmissions.mockReturnValue(mockSubmissions);
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderDashboard();
    const user = userEvent.setup();

    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);

    expect(confirmSpy).toHaveBeenCalled();
    expect(deleteSubmission).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('Logout button calls onLogout prop', async () => {
    getSubmissions.mockReturnValue([]);
    store['hirehub_admin_auth'] = 'true';
    const onLogout = vi.fn();
    renderDashboard({ onLogout });
    const user = userEvent.setup();

    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);

    expect(sessionStorage.removeItem).toHaveBeenCalledWith('hirehub_admin_auth');
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('saving edit modal calls updateSubmission and reloads submissions', async () => {
    getSubmissions.mockReturnValue(mockSubmissions);
    renderDashboard();
    const user = userEvent.setup();

    const editButtons = screen.getAllByText('Edit');
    await user.click(editButtons[0]);

    const nameInput = screen.getByDisplayValue('John Doe');
    await user.clear(nameInput);
    await user.type(nameInput, 'John Smith');

    const saveButton = screen.getByText('Save Changes');
    await user.click(saveButton);

    expect(updateSubmission).toHaveBeenCalledWith('sub-1', expect.objectContaining({
      fullName: 'John Smith',
    }));
  });

  it('closing edit modal by clicking Cancel hides the modal', async () => {
    getSubmissions.mockReturnValue(mockSubmissions);
    renderDashboard();
    const user = userEvent.setup();

    const editButtons = screen.getAllByText('Edit');
    await user.click(editButtons[0]);

    expect(screen.getByText('Edit Submission')).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(screen.queryByText('Edit Submission')).not.toBeInTheDocument();
  });
});