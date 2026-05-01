# HireHub — Employee Onboarding Interest Portal

A modern, single-page application for managing employee onboarding interest submissions. Built with React 18+ and Vite, HireHub provides a public-facing landing page, a candidate interest form, and a secure admin dashboard with full CRUD capabilities.

## Features

- **Landing Page** — Hero section with call-to-action buttons and four feature cards highlighting Innovation, Growth, Culture, and Impact.
- **Interest Form** — Candidate submission form with fields for full name, email, mobile number, and department selection. Includes client-side validation with descriptive error messages and duplicate email prevention.
- **Admin Dashboard** — Protected dashboard with summary stat cards (total submissions, unique departments, latest submission) and a full data table of all submissions.
- **CRUD Operations** — Create new submissions via the interest form; read, update, and delete submissions from the admin dashboard. Edit modal supports inline editing with validation.
- **Responsive Design** — Fully responsive layout with CSS custom properties and breakpoints at 768px and 480px for mobile devices.
- **Client-Side Persistence** — Submissions stored in `localStorage` with defensive error handling and corruption recovery. Authentication state managed via `sessionStorage`.
- **Department Badges** — Color-coded labels for Engineering, Marketing, Sales, HR, Finance, and Design departments.
- **Success Feedback** — Success banner on form submission that auto-dismisses after 4 seconds.

## Tech Stack

| Technology | Purpose |
|---|---|
| [React 18+](https://react.dev/) | UI component library |
| [Vite 5](https://vitejs.dev/) | Build tool and dev server |
| [React Router v6](https://reactrouter.com/) | Client-side routing |
| [PropTypes](https://www.npmjs.com/package/prop-types) | Runtime prop type checking |
| Plain CSS | Styling with CSS custom properties |
| localStorage | Persistent submission data storage |
| sessionStorage | Admin authentication state |
| [Vitest](https://vitest.dev/) | Unit testing framework |
| [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) | Component testing utilities |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- npm (included with Node.js)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hirehub-onboarding-portal

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Build

```bash
# Create a production build
npm run build
```

The output will be in the `dist/` directory.

### Preview

```bash
# Preview the production build locally
npm run preview
```

### Testing

```bash
# Run the test suite
npm run test
```

Tests are written with Vitest and React Testing Library, covering validators, storage utilities, and all major components.

## Project Structure

```
hirehub-onboarding-portal/
├── index.html                          # HTML entry point
├── package.json                        # Dependencies and scripts
├── vite.config.js                      # Vite configuration with React plugin and Vitest setup
├── vercel.json                         # Vercel deployment config with SPA rewrites
├── .env.example                        # Environment variable placeholders
├── .gitignore                          # Git ignore rules
├── CHANGELOG.md                        # Project changelog
├── README.md                           # Project documentation (this file)
└── src/
    ├── main.jsx                        # Application entry point, renders <App />
    ├── App.jsx                         # Root component with routing and auth state
    ├── App.css                         # Global styles and CSS custom properties
    ├── setupTests.js                   # Test setup (jest-dom matchers)
    ├── components/
    │   ├── Header.jsx                  # Fixed navigation header with Login/Logout
    │   ├── Header.test.jsx             # Header component tests
    │   ├── LandingPage.jsx             # Public landing page with hero and features
    │   ├── InterestForm.jsx            # Candidate interest submission form
    │   ├── InterestForm.test.jsx       # Interest form tests
    │   ├── AdminLogin.jsx              # Admin login form with hardcoded credentials
    │   ├── AdminDashboard.jsx          # Admin dashboard with stats and submission table
    │   ├── AdminDashboard.test.jsx     # Admin dashboard tests
    │   ├── SubmissionTable.jsx         # Submission data table with edit/delete actions
    │   ├── EditModal.jsx               # Modal for editing submission details
    │   └── ProtectedRoute.jsx          # Auth guard component for admin route
    └── utils/
        ├── validators.js               # Pure validation functions with JSDoc
        ├── validators.test.js          # Validator unit tests
        ├── storage.js                  # localStorage CRUD abstraction layer
        └── storage.test.js             # Storage utility tests
```

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | `LandingPage` | Public landing page with hero section and feature cards |
| `/apply` | `InterestForm` | Candidate interest submission form |
| `/admin` | `ProtectedRoute` → `AdminDashboard` / `AdminLogin` | Admin dashboard (authenticated) or login form (unauthenticated) |

## Admin Credentials

The admin login uses hardcoded credentials for demonstration purposes:

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `admin` |

Authentication state is stored in `sessionStorage` under the key `hirehub_admin_auth` and persists for the duration of the browser session.

## Storage Schema

Submissions are stored in `localStorage` under the key `hirehub_submissions` as a JSON array. Each submission object has the following shape:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fullName": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "department": "Engineering",
  "submittedAt": "2024-08-01T12:00:00.000Z"
}
```

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Auto-generated UUID via `crypto.randomUUID()` |
| `fullName` | `string` | Candidate full name (2–50 characters, alphabets and spaces only) |
| `email` | `string` | Candidate email (unique, case-insensitive duplicate check) |
| `mobile` | `string` | 10-digit mobile number |
| `department` | `string` | Selected department (Engineering, Marketing, Sales, HR, Finance, Operations) |
| `submittedAt` | `string` | ISO 8601 timestamp of submission |

## Deployment

This project is configured for static deployment on [Vercel](https://vercel.com/). The `vercel.json` file includes SPA rewrite rules to ensure all routes are handled by `index.html`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

To deploy:

1. Push the repository to GitHub (or your preferred Git provider).
2. Import the project in the Vercel dashboard.
3. Vercel will automatically detect the Vite framework and apply the correct build settings.
4. The app will be built with `npm run build` and served from the `dist/` directory.

## License

This project is private and proprietary.