# Signature Studio

A free web tool to build a professional email signature. Pick a template, fill in your details, add a photo and signature image, choose colors and fonts, then copy the result into Gmail, Outlook or Apple Mail.

## Features

- 10 email-safe templates: Classic, Stacked, Split, Centered, Reversed, Minimal, Banner, Compact, Boxed, Corporate
- Details form with up to 5 custom "Label: value" fields
- Social profile links with brand icons
- Photo and signature image upload (hosted on Cloudinary)
- Handwritten signature: draw with mouse, touch or stylus, or use handwriting fonts
- Style options: accent color, text color, font and signature width (Auto or 320 to 800px)
- Live preview with Desktop and Mobile modes
- Click a part of the preview to jump to its form field
- Optional legal footer with a standard disclaimer
- One-click copy as rich text or HTML source
- Install guides for Gmail, Outlook and Apple Mail
- Draft is saved automatically in the browser (localStorage)

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Cloudinary (image hosting)
- Vitest (tests)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your environment file:

   ```bash
   cp .env.example .env
   ```

3. Open `.env` and fill in the values (see Environment Variables below).

4. Start the dev server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

## Environment Variables

- Copy `.env.example` to `.env` and fill in every value listed there.
- Cloudinary credentials: cloud name, API key and API secret from your Cloudinary dashboard.
- Site URL: the public URL of your site.
- The API secret is used only on the server. Never expose it in client code.
- If the Cloudinary keys are missing, `/api/upload-signature` returns `503` and image upload is disabled. The rest of the app still works.

## Scripts

- `npm run dev`: start the development server
- `npm run build`: create a production build
- `npm run start`: run the production build
- `npm run icons`: rebuild the social icons in `public/social-icons/`
- `npm run placeholders`: rebuild the placeholders in `public/placeholders/`
- `npm run app-icons`: rebuild the favicons and app icons

## Tests

- Run the tests with Vitest:

  ```bash
  npx vitest run
  ```

- Covered: all 10 templates, HTML escaping, footer, custom fields, width, click-to-edit markers, reducer, upload signing and URL helpers.

## How It Works

```
Form → SignatureContext (state, saved in localStorage)
     → lib/signature/view-model.ts (escape text, validate links/colors/images)
     → lib/signature/templates/*.ts (email-safe HTML: tables + inline styles)
     → Live preview (sandboxed iframe)  or  Copy (clean HTML)
```

- Images: the browser asks `/api/upload-signature` for a signed request, then uploads directly to Cloudinary.
- The copied signature is clean HTML with no preview markers or placeholders.

## Project Structure

- `src/app/`: routes and API routes
- `src/components/`: React UI, grouped by feature (layout, studio, editor, preview, install, ui)
- `src/hooks/`: React hooks
- `src/lib/signature/`: core logic (state, validation, HTML rendering, templates)
- `src/services/`: Cloudinary upload and signing, icon renderer
- `src/constants/`: static data and config
- `src/types/`: shared TypeScript types
- `src/utils/`: small pure helpers
- `public/`: social icons and placeholders
- `scripts/`: icon and placeholder generators

See `DEVELOPER_GUIDE.md` for a full folder-by-folder explanation.

## Deployment

- Works on any Node host that supports Next.js, for example Vercel.
- Set the same environment variables from `.env` in your hosting dashboard.
- Run `npm run build`, then `npm run start` if you host it yourself.

## Credits

Developed by Traideas.