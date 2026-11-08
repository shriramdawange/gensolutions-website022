# GenSolutions official website

A dark, responsive company website built with Next.js App Router, TypeScript, and Tailwind CSS v4. Styling is authored in `app/globals.css` for a highly art-directed, responsive visual system.

## Included

- Responsive navigation and hero section
- Company positioning and capabilities
- Product portfolio for ZeroBite, AIRLANCE, and VAYU-SENTINEL
- Engineering approach, people/culture, and careers sections
- Project enquiry form with server-side validation
- Optional Resend email delivery integration
- SEO metadata and Open Graph basics
- `.env.example` and this setup guide

## Run locally

Requirements: Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Connect the enquiry form

The form intentionally does **not** pretend to store or send messages until email delivery is configured.

1. Create a Resend account and API key.
2. Verify a sending domain/address in Resend.
3. Copy `.env.example` to `.env.local` and set:
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL` (default: `hello@gensolutions.in`)
   - `CONTACT_FROM_EMAIL` (must be an address/domain verified with your email provider)
4. Restart the development server.

The API route validates user input and sends the enquiry through Resend. Do not commit `.env.local` or API keys.

## Production check

```bash
npm run lint
npm run build
npm run start
```

## Deploy

Recommended: Vercel or another platform that supports Next.js App Router and Node route handlers.

1. Import the repository/project.
2. Add the three environment variables in the deployment settings.
3. Deploy and test the contact form on the deployed URL.
4. In your domain registrar DNS settings, connect `gensolutions.in` using the DNS records supplied by your hosting provider.
5. Verify both the apex domain and `www` behavior, HTTPS, metadata, and form delivery.

Do not copy DNS values from examples; use the exact values displayed by your selected host and registrar.

## Before public launch

- Confirm company contact inbox access and email delivery.
- Review product status and descriptions for accuracy.
- Add the final approved logo and social links if available.
- Add privacy notice and any applicable company/legal details.
- Test keyboard navigation, mobile layouts, and form delivery.
- Add analytics only if needed and with appropriate privacy disclosures.

## Current product status wording

The portfolio labels ZeroBite as a product in development, AIRLANCE as a product initiative, and VAYU-SENTINEL as a research initiative. Update these labels if the official status changes.
