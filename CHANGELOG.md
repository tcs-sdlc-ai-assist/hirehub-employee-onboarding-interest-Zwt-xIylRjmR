# Changelog

All notable changes to the HireHub Onboarding Portal will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-08-01

### Added

- Landing page with hero section and call-to-action buttons linking to the interest form.
- Four feature cards highlighting Innovation, Growth, Culture, and Impact on the landing page.
- Candidate interest form with fields for full name, email, mobile number, and department selection.
- Client-side form validation with descriptive error messages for all fields:
  - Full name: required, 2–50 characters, alphabets and spaces only.
  - Email: required, valid email format.
  - Mobile number: required, exactly 10 digits.
  - Department: required selection from predefined list.
- Duplicate email prevention with case-insensitive checking against existing submissions.
- Success banner on form submission that auto-dismisses after 4 seconds.
- Admin login page with hardcoded credentials (`admin` / `admin`) and sessionStorage-based authentication.
- Admin dashboard with summary stat cards displaying total submissions, unique departments, and latest submission name.
- Submission data table with columns for name, email, mobile, department, submitted date, and actions.
- Department badge styling with color-coded labels for Engineering, Marketing, Sales, HR, Finance, and Design.
- Full CRUD operations on submissions:
  - **Create**: New submissions added via the interest form with auto-generated UUID and timestamp.
  - **Read**: All submissions displayed in the admin dashboard table.
  - **Update**: Edit modal with pre-filled fields for name, mobile, and department; email field is read-only.
  - **Delete**: Delete button with browser confirmation dialog before removal.
- Edit modal with overlay click-to-close and Cancel button support.
- Client-side routing with React Router v6 including three routes: Home (`/`), Apply (`/apply`), and Admin (`/admin`).
- `ProtectedRoute` component that renders the admin dashboard when authenticated or falls back to the login form.
- Fixed header with navigation links (Home, Apply, Admin) and a context-aware Login/Logout button.
- localStorage persistence layer for submissions with defensive error handling and corruption recovery.
- Centralized validation utility module (`validators.js`) with JSDoc-documented pure functions.
- Storage utility module (`storage.js`) with `getSubmissions`, `saveSubmissions`, `addSubmission`, `updateSubmission`, `deleteSubmission`, and `isEmailDuplicate` functions.
- Responsive design with CSS custom properties and a 768px mobile breakpoint.
- Additional 480px breakpoint for smaller mobile devices.
- Vercel static deployment configuration with SPA rewrite rules (`vercel.json`).
- Comprehensive test suite using Vitest and React Testing Library covering:
  - Validator functions (name, email, mobile, department).
  - Storage utility functions (CRUD operations, duplicate detection, corruption recovery).
  - Header component (navigation links, login/logout behavior).
  - Interest form (validation, submission, duplicate prevention, field clearing).
  - Admin dashboard (stat cards, table rendering, edit modal, delete confirmation, logout).
- PropTypes validation on all React components.
- Environment variable example file (`.env.example`) with future placeholders.