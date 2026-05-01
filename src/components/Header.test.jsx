import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

describe('Header', () => {
  let store;

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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function renderHeader({ isAuthenticated = false, onLogout = vi.fn() } = {}) {
    return render(
      <MemoryRouter>
        <Header isAuthenticated={isAuthenticated} onLogout={onLogout} />
      </MemoryRouter>
    );
  }

  it('renders HireHub logo text', () => {
    renderHeader();
    expect(screen.getByText('HireHub')).toBeInTheDocument();
  });

  it('renders Home navigation link with correct href', () => {
    renderHeader();
    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('renders Apply navigation link with correct href', () => {
    renderHeader();
    const applyLink = screen.getByText('Apply');
    expect(applyLink).toBeInTheDocument();
    expect(applyLink.closest('a')).toHaveAttribute('href', '/apply');
  });

  it('renders Admin navigation link with correct href', () => {
    renderHeader();
    const adminLink = screen.getByText('Admin');
    expect(adminLink).toBeInTheDocument();
    expect(adminLink.closest('a')).toHaveAttribute('href', '/admin');
  });

  it('shows Login button when not authenticated', () => {
    renderHeader({ isAuthenticated: false });
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('shows Logout button when authenticated', () => {
    store['hirehub_admin_auth'] = 'true';
    renderHeader({ isAuthenticated: true });
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('clicking Logout clears sessionStorage and calls onLogout callback', async () => {
    store['hirehub_admin_auth'] = 'true';
    const onLogout = vi.fn();
    renderHeader({ isAuthenticated: true, onLogout });

    const user = userEvent.setup();
    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);

    expect(sessionStorage.removeItem).toHaveBeenCalledWith('hirehub_admin_auth');
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('HireHub logo links to home page', () => {
    renderHeader();
    const logo = screen.getByText('HireHub');
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });
});