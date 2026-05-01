# Deployment Guide

This document covers deploying the HireHub Onboarding Portal to [Vercel](https://vercel.com/) and related CI/CD considerations.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Process](#build-process)
- [Vercel Deployment Steps](#vercel-deployment-steps)
- [vercel.json Configuration](#verceljson-configuration)
- [Environment Variables](#environment-variables)
- [CI/CD Notes](#cicd-notes)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have the following:

| Requirement | Details |
|---|---|
| **Node.js** | Version 18+ (LTS recommended). Download from [nodejs.org](https://nodejs.org/). |
| **npm** | Included with Node.js. Used for dependency installation and build scripts. |
| **Vercel Account** | Free tier is sufficient. Sign up at [vercel.com](https://vercel.com/). |
| **Git Provider** | A GitHub, GitLab, or Bitbucket account with the repository pushed to a remote. |

Verify your local environment:

```bash
node --version   # Should output v18.x.x or higher
npm --version    # Should output 9.x.x or higher
```

---

## Build Process

The project uses [Vite 5](https://vitejs.dev/) as its build tool. Running the build command produces a static output in the `dist/` directory.

```bash
# Install dependencies (if not already installed)
npm install

# Create a production build
npm run build
```

After a successful build, the `dist/` directory will contain:

- `index.html` — The single HTML entry point.
- `assets/` — Hashed JavaScript and CSS bundles.

You can preview the production build locally before deploying:

```bash
npm run preview
```

This starts a local static server (default: `http://localhost:4173`) serving the `dist/` directory.

---

## Vercel Deployment Steps

### 1. Push Your Repository

Ensure your code is pushed to a remote Git repository (GitHub, GitLab, or Bitbucket):

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Import the Project in Vercel

1. Log in to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New…"** → **"Project"**.
3. Select your Git provider and authorize Vercel if prompted.
4. Find and select the `hirehub-onboarding-portal` repository.
5. Click **"Import"**.

### 3. Configure Build Settings

Vercel automatically detects the Vite framework and applies the correct defaults. Verify the following settings on the import screen:

| Setting | Value |
|---|---|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

No changes should be necessary — Vercel's auto-detection handles these correctly for Vite projects.

### 4. Deploy

Click **"Deploy"**. Vercel will:

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Run `npm run build` to produce the `dist/` directory.
4. Serve the static files from `dist/` with the SPA rewrite rules from `vercel.json`.

The deployment typically completes in under 60 seconds. Once finished, Vercel provides a unique URL (e.g., `https://hirehub-onboarding-portal.vercel.app`).

---

## vercel.json Configuration

The project includes a `vercel.json` file at the repository root with SPA rewrite rules:

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

### What This Does

Since HireHub is a single-page application using client-side routing (React Router v6), all URL paths must resolve to `index.html`. Without this rewrite rule, navigating directly to `/apply` or `/admin` (or refreshing the page on those routes) would result in a 404 error from the server.

The rewrite rule ensures that **every request** is served by `index.html`, allowing React Router to handle the routing on the client side.

### Important Notes

- The `vercel.json` file contains **only** the `rewrites` key. No other configuration keys (such as `builds`, `routes`, `functions`, `headers`, or `redirects`) are needed for this static SPA.
- Do not add a `builds` configuration — Vercel's auto-detection for Vite handles the build process correctly without it.

---

## Environment Variables

**No environment variables are required for this application.**

HireHub is a fully static, client-side SPA. All configuration (admin credentials, storage keys, validation rules) is hardcoded in the source code. There are no API endpoints, backend services, or third-party integrations that require runtime configuration.

If environment variables are needed in the future, Vite exposes variables prefixed with `VITE_` to the client bundle. See `.env.example` for placeholder references:

```bash
# Copy the example file for local development
cp .env.example .env.local
```

Access environment variables in code via:

```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

To add environment variables in Vercel:

1. Go to **Project Settings** → **Environment Variables**.
2. Add the variable name (e.g., `VITE_API_BASE_URL`) and value.
3. Select the environments (Production, Preview, Development) where it should apply.
4. Redeploy for changes to take effect.

---

## CI/CD Notes

### Automatic Deployments

Once the repository is connected to Vercel, deployments are fully automated:

| Trigger | Deployment Type | URL |
|---|---|---|
| Push to `main` branch | **Production** deployment | Your production domain (e.g., `hirehub-onboarding-portal.vercel.app`) |
| Push to any other branch | **Preview** deployment | Unique preview URL per commit (e.g., `hirehub-onboarding-portal-git-feature-xyz.vercel.app`) |
| Pull request opened/updated | **Preview** deployment | Unique preview URL linked in the PR comments |

### Preview Deployments

Every pull request automatically receives a preview deployment. This allows reviewers to:

- Test changes in a live environment before merging.
- Verify that the build succeeds with the proposed changes.
- Share a working URL with stakeholders for feedback.

Preview deployment URLs are posted as comments on the pull request by the Vercel GitHub integration.

### Running Tests Before Deployment

The project includes a comprehensive test suite. While Vercel does not run tests as part of its default build pipeline, you can ensure tests pass before deployment by:

**Option A: Run tests locally before pushing**

```bash
npm run test
```

**Option B: Add a CI step in your Git provider**

For GitHub Actions, create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
      - run: npm ci
      - run: npm run test
      - run: npm run build
```

This ensures that tests pass and the build succeeds before Vercel deploys the changes.

### Build Caching

Vercel caches `node_modules` between deployments to speed up subsequent builds. If you encounter stale dependency issues, you can clear the build cache from **Project Settings** → **General** → **Build & Development Settings** → **Clear Build Cache**.

---

## Troubleshooting

### SPA Routing Returns 404

**Symptom:** Navigating directly to `/apply` or `/admin` (or refreshing the page on those routes) returns a 404 page.

**Cause:** The server does not know about client-side routes and tries to find a matching file on disk.

**Solution:** Ensure `vercel.json` exists at the repository root with the SPA rewrite rule:

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

If deploying to a platform other than Vercel, configure equivalent rewrite rules for that platform.

### Build Failures

**Symptom:** The Vercel deployment fails during the build step.

**Common causes and fixes:**

| Cause | Fix |
|---|---|
| **Node.js version mismatch** | Ensure Vercel is using Node.js 18+. Set this in **Project Settings** → **General** → **Node.js Version**. |
| **Missing dependencies** | Run `npm install` locally and verify `package.json` and `package-lock.json` are committed. |
| **Import errors** | Check that all imported files and modules exist. Run `npm run build` locally to reproduce the error. |
| **Syntax errors** | Run `npm run build` locally. Vite will report the exact file and line number. |

Always test the build locally before pushing:

```bash
npm run build
```

### localStorage Limits

**Symptom:** Submissions fail to save or the application behaves unexpectedly after many submissions.

**Cause:** Browsers impose a storage limit on `localStorage`, typically around **5 MB** per origin. Each submission object is approximately 200–300 bytes of JSON, so the practical limit is roughly **15,000–20,000 submissions** before hitting the cap.

**Mitigation:**

- The storage utility (`src/utils/storage.js`) includes defensive error handling. If `localStorage.setItem` throws a `QuotaExceededError`, the error is caught and logged.
- For production use with large volumes of data, consider migrating to a backend database and API.
- Users can clear stored data by opening the browser's Developer Tools → **Application** → **Local Storage** → delete the `hirehub_submissions` key.

### sessionStorage Authentication Issues

**Symptom:** Admin login state is lost unexpectedly, or the user cannot log in.

**Cause:** `sessionStorage` is scoped to the browser tab and is cleared when the tab is closed. This is by design for security.

**Notes:**

- Opening the admin dashboard in a new tab requires logging in again.
- Private/incognito browsing modes may have stricter storage policies.
- If `sessionStorage` is unavailable (e.g., in certain embedded browser contexts), the `ProtectedRoute` component falls back to the unauthenticated state gracefully.

### Preview Deployments Show Stale Data

**Symptom:** A preview deployment does not reflect the latest code changes.

**Solution:**

1. Verify the correct branch and commit are deployed by checking the deployment details in the Vercel dashboard.
2. Clear the build cache from **Project Settings** → **General** → **Clear Build Cache**, then redeploy.
3. Hard-refresh the browser (`Ctrl+Shift+R` or `Cmd+Shift+R`) to bypass the browser cache.