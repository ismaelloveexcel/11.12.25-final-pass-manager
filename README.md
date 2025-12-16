# 11.12.25-final-pass-manager

A Pass Management System for HR screening workflows, featuring candidate tracking, AI-assisted screening, and pass generation.

## How to Deploy

This is a static HTML/CSS/JS application that can be deployed to any static file hosting service.

### Option 1: Local Preview

1. Clone the repository:
   ```bash
   git clone https://github.com/ismaelloveexcel/11.12.25-final-pass-manager.git
   cd 11.12.25-final-pass-manager
   ```

2. Open `index.html` directly in your browser, or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js (npx)
   npx serve .
   ```

3. Visit `http://localhost:8000` in your browser.

### Option 2: GitHub Pages (Recommended)

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose `main` branch and `/ (root)` folder
5. Click **Save**
6. Your site will be available at `https://ismaelloveexcel.github.io/11.12.25-final-pass-manager/`

### Option 3: Netlify

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click **Add new site** → **Import an existing project**
3. Connect your GitHub account and select this repository
4. Leave build settings empty (no build command needed)
5. Set **Publish directory** to `.` (root)
6. Click **Deploy site**

### Option 4: Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New** → **Project**
3. Import this repository from GitHub
4. No framework preset needed - Vercel will detect static files
5. Click **Deploy**

### Option 5: Any Static Host

Simply upload the following files to your web server:
- `index.html`

All CSS and JavaScript dependencies (Bootstrap) are loaded via CDN. The application requires no server-side processing or build step.

## Features

- **Candidate Screening Workflow**: 3-stage process (Initial Review → HR Screening → Interview Ready)
- **AI HR Assistant**: Automated scoring, ranking, and email drafting
- **Pass Management**: Generate and track screening/interview passes
- **Keyboard Shortcuts**: Press `?` to view available shortcuts

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge)