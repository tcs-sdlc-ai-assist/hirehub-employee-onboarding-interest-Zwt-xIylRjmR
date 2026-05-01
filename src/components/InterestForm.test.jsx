import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import InterestForm from './InterestForm';

describe('InterestForm', () => {
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
      randomUUID: vi.fn(() => 'test-uuid-' + Math.random().toString(36).slice(2, 10)),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  function renderInterestForm() {
    return render(
      <MemoryRouter>
        <InterestForm />
      </MemoryRouter>
    );
  }

  it('renders all four form fields and submit button', () => {
    renderInterestForm();

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mobile Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Department')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit Application' })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    renderInterestForm();
    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: 'Submit Application' });
    await user.click(submitButton);

    expect(screen.getByText('Full name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Mobile number is required')).toBeInTheDocument();
    expect(screen.getByText('Department is required')).toBeInTheDocument();
  });

  it('shows success banner on valid submission with all fields filled', async () => {
    renderInterestForm();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Full Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Mobile Number'), '9876543210');
    await user.selectOptions(screen.getByLabelText('Department'), 'Engineering');

    await user.click(screen.getByRole('button', { name: 'Submit Application' }));

    expect(screen.getByText('Your application has been submitted successfully!')).toBeInTheDocument();
  });

  it('success banner disappears after timeout', async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <MemoryRouter>
        <InterestForm />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Full Name'), 'Jane Doe');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Mobile Number'), '1234567890');
    await user.selectOptions(screen.getByLabelText('Department'), 'Marketing');

    await user.click(screen.getByRole('button', { name: 'Submit Application' }));

    expect(screen.getByText('Your application has been submitted successfully!')).toBeInTheDocument();

    vi.advanceTimersByTime(4000);

    await waitFor(() => {
      expect(screen.queryByText('Your application has been submitted successfully!')).not.toBeInTheDocument();
    });
  });

  it('prevents duplicate email submission and shows error', async () => {
    const existing = [
      {
        id: 'existing-id',
        fullName: 'Existing User',
        email: 'duplicate@example.com',
        mobile: '1111111111',
        department: 'HR',
        submittedAt: '2024-04-01T12:00:00.000Z',
      },
    ];
    store['hirehub_submissions'] = JSON.stringify(existing);

    renderInterestForm();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Full Name'), 'Another User');
    await user.type(screen.getByLabelText('Email'), 'duplicate@example.com');
    await user.type(screen.getByLabelText('Mobile Number'), '9876543210');
    await user.selectOptions(screen.getByLabelText('Department'), 'Engineering');

    await user.click(screen.getByRole('button', { name: 'Submit Application' }));

    expect(screen.getByText('This email has already been submitted')).toBeInTheDocument();
  });

  it('form fields clear after successful submission', async () => {
    renderInterestForm();
    const user = userEvent.setup();

    const fullNameInput = screen.getByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Email');
    const mobileInput = screen.getByLabelText('Mobile Number');
    const departmentSelect = screen.getByLabelText('Department');

    await user.type(fullNameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(mobileInput, '9876543210');
    await user.selectOptions(departmentSelect, 'Engineering');

    await user.click(screen.getByRole('button', { name: 'Submit Application' }));

    expect(fullNameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(mobileInput).toHaveValue('');
    expect(departmentSelect).toHaveValue('');
  });

  it("'Back to Home' link is present and links to '/'", () => {
    renderInterestForm();

    const backLink = screen.getByText('Back to Home');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/');
  });
});