# DAVAN Technologies — Official Website

The official DAVAN Technologies website is a static HTML, CSS and vanilla JavaScript site deployed using GitHub Pages from the repository root on the `main` branch. The custom domain `gensolutions.in` remains attached to the site.

## Website structure
- `index.html` — company overview, capabilities, work, founding members, careers and contact.
- `pages/` — about, capabilities, approach, founding members, selected work, project detail, contact and privacy pages.
- `careers/` — careers listing, dedicated role pages and generic role detail page for future Supabase openings.
- `css/styles.css` — shared responsive design system.
- `js/main.js` — navigation, motion, current year and email-draft contact form.
- `js/careers.js` — Supabase careers data, PDF skill extraction, resume upload and application submission.
- `assets/` — DAVAN logo, favicon and hiring poster.

## Careers and applications
The careers pages read published openings from `public.career_openings` in the DAVAN-CAREERS Supabase project. Candidate applications are inserted into `public.career_applications`; PDF resumes are uploaded to the private `davan-resumes` storage bucket.
- Initial positions: Full-Stack Developer Intern (2), Flutter Developer Intern (2), Management Intern (1).
- Hours: 4 per day. Start date: 05 December 2026.
- PDF resume only, maximum 5 MB.
- PDF.js extracts selectable resume text to suggest skills. Candidates can edit the selected skills.
- Applicants cannot read candidate records or set management-controlled application status fields. Review applications in the Supabase dashboard.
- Public frontend uses a Supabase publishable key only. Never add a service-role key or secret to this repository.

Supabase project: `svsweslezorghidounxd` (Mumbai / ap-south-1).

## Local preview
Serve the repository root using a local HTTP server so browser API requests work:

```bash
python -m http.server 8000
```

Open http://localhost:8000.

## Deployment
GitHub Pages publishes from `main / (root)`. The repository includes a root `CNAME` file for `gensolutions.in` and `.nojekyll`. Keep these files in place. A merge to `main` triggers the normal GitHub Pages deployment. No DNS changes are required for this visual/content release.

## Data and privacy
The careers application and resume handling are described in `pages/privacy.html`. Contact enquiries are prepared as an email draft and are not stored by the static website. Email notifications for job applications are not configured; review new applications in Supabase.
