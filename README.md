# 11.12.25-final-pass-manager

Single-page HR screening/pass management UI prototype.

## Deployment recommendation

This project is a single static `index.html`, so the simplest and most reliable platform to deploy is **GitHub Pages**:
- In the repository settings, enable GitHub Pages with the source set to the `main` branch (or your default branch) and folder set to `/` (root) so `index.html` is served.
- After saving, your app will be available at `https://<your-username>.github.io/<repo-name>/` with no additional build steps.

If you need a custom domain, redirects, or form/edge add-ons, **Netlify** or **Vercel** are good alternatives—both can deploy this static site by pointing to the repo and using the root directory with no build command.

## Azure deployment (Microsoft umbrella)

For minimal manual intervention under Microsoft services, use **Azure Static Web Apps**:
- In Azure Portal, create a Static Web App, connect this GitHub repo, set **app location** to `/` (root), and leave the **build command** empty for pure static.
- It auto-provisions CDN/SSL, sets up GitHub Actions for CI/CD, and deploys on push to the tracked branch.
- Optional: enable Azure AD B2C if you later need authenticated HR access.

## UX and AI alignment (solo HR, UAE context)

- **AI surfacing**: The page already includes an AI assistant UI; keep its entry point visible (floating button) and add a short helper text near the header to clarify it can draft UAE labor-law-aligned emails and screening flows.
- **Minimalist glass/iOS feel**: Retain the existing light/glass styling; favor ample white space, soft shadows, rounded corners, and monochrome icons to keep the Apple-like look.
- **Solo HR efficiency**: Prioritize one-click combos (already present) and keep “Process All Urgent” visible; consider grouping UAE labor-law reminders (e.g., probation, notice periods) in the priority dashboard text.
