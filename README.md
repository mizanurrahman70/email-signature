# Email Signature Generator

A free web tool: enter your details, pick a template, customize colors and fonts, upload a photo/logo, and copy a ready-made signature into Gmail, Outlook, or Apple Mail.

Built with Next.js 16 (App Router), React 19, Tailwind CSS 4, and Cloudinary for image hosting.

## Getting started

```bash
cp .env.example .env.local   # add your Cloudinary credentials
npm install
npm run dev                  # http://localhost:3000
```

| Script              | Purpose                    |
| ------------------- | -------------------------- |
| `npm run dev`       | Development server         |
| `npm run build`     | Production build           |
| `npm test`          | Unit tests (Vitest)        |
| `npm run typecheck` | TypeScript check           |
| `npm run lint`      | ESLint                     |
| `npm run icons`     | Regenerate social icon PNGs |
| `npm run placeholders` | Regenerate preview placeholder images |

Without Cloudinary credentials the app still works: uploads show an error, and users can paste an image URL instead.

## How it works

```
src/
├── app/                    # Routes only
│   ├── page.tsx            #   Static page; editor inside <Suspense>
│   ├── api/upload-signature/route.ts  # signs Cloudinary uploads
│   └── api/icons/[name]/route.ts      # accent-colored contact icon PNGs
├── components/             # React UI, grouped by feature
│   ├── layout/             #   SiteHeader, Hero, SiteFooter
│   ├── studio/             #   StepRail (left tabs), StepPanel, PreviewCanvas
│   ├── editor/             #   Step forms, template picker + thumbnails, context
│   ├── preview/            #   EmailWindow, sandboxed SignaturePreview, CopyActions
│   ├── install/            #   Gmail / Outlook / Apple Mail steps
│   └── ui/                 #   Button, TextField, Tabs, SegmentedControl, FormSection
├── hooks/                  # React hooks (persistence, copy status, upload)
├── constants/              # Static data and config, no logic
│   ├── signature-options.ts  # fonts, colors, templates, form fields
│   ├── editor.ts           #   studio steps, preview device widths
│   ├── signature-defaults.ts
│   ├── install-guides.ts
│   ├── cloudinary.ts       #   limits, folder, delivery transforms
│   ├── copy-status.ts
│   └── storage.ts
├── types/                  # Shared TypeScript types only
├── utils/                  # Pure, framework-free helpers (+ tests)
│   ├── html.ts  url.ts  color.ts  file.ts  error.ts  keyboard.ts  cn.ts
│   ├── http.ts             #   fetchJson with readable errors
│   ├── cloudinary.ts       #   URL/form/signature-string builders
│   └── clipboard.ts  storage.ts   # safe browser API wrappers
├── services/               # I/O with outside systems
│   ├── cloudinary-upload.ts  # browser → Cloudinary
│   └── cloudinary-signing.ts # server-only signing
└── lib/signature/          # Domain logic
    ├── view-model.ts       #   sanitize + normalize input
    ├── render.ts  copy.ts  reducer.ts  schema.ts
    └── templates/          #   10 layouts (classic … corporate) + shared parts
```

**Rules of thumb:** components render and call functions; data lives in `constants/`; types in `types/`; reusable logic in `utils/` (pure) or `services/` (network/server). Everything imports with `@/…`, and there are no barrel `index.ts` files, so the bundler only pulls in what's used.

- **One rendering path.** `renderSignatureHtml()` produces the email HTML; the preview renders that same string, so what you see is what gets copied.
- **Safe by construction.** All user input goes through `buildViewModel()`, which escapes text, allows only `http(s)` links and `https` images, and validates colors and fonts. Templates never touch raw input.
- **Email-client compatible.** Table layout, inline styles, explicit image sizes, email-safe fonts, brand-colored social icons as hosted PNGs (Gmail and Outlook don't render SVG), and PNG images with the photo rounded by Cloudinary (`r_max`), since Outlook ignores `border-radius`.
- **Suspense + `use`.** The editor restores the draft from `localStorage`, so it calls `use(browser())` and the server prerenders the `<EditorSkeleton />` fallback. The rest of the page (header, install guides) is static and indexable. Context is read with `use(SignatureContext)`.
- **Responsive typing.** The preview renders from `useDeferredValue(state)`; uploads run in `useTransition`.
- **Persistence.** The draft is saved to `localStorage` (debounced) and validated with Zod when it's restored. Corrupt fields fall back one by one.

## Templates

| Template | Layout |
| --- | --- |
| Classic | Photo left, accent divider, labeled contacts (P:/E:/W:) |
| Stacked | Logo on top, inline contacts, accent bar underneath |
| Split | Photo, name block, divider, contacts with icons; rule and logo below |
| Centered | Everything centered under a round photo |
| Reversed | Details with icons on the left; photo and logo on the right |
| Minimal | Text only, no images |
| Banner | Name, photo and title on an accent bar; contacts with icons below |
| Compact | Small photo and two tight lines, made for replies |
| Boxed | Bordered card with an accent edge; socials and logo along the bottom |
| Corporate | Logo first (photo if no logo), details beside an accent divider |

To add one: write a `render…Template(vm)` in `lib/signature/templates/`, then register it in `TEMPLATE_IDS` / `TEMPLATE_OPTIONS` (constants), `TEMPLATE_RENDERERS` (render.ts) and `THUMBNAILS` (TemplateThumbnail.tsx).

The live preview renders in a sandboxed iframe so the app's CSS can't affect it, the way an email client shows it.

## Contact icons

`GET /api/icons/{phone|email|website|address}?color=rrggbb` returns the icon as a PNG in the accent color, rendered with `sharp` and cached for a year. Email clients don't render SVG, and pre-made PNGs couldn't follow a custom color.

## Custom fields and email signature footer

The Details step mirrors the signature's order: About you → **Custom fields** → How to reach you → **Email signature footer**.

- **Custom fields:** up to 5 "Label: value" rows, shown in every template directly under name / title / company ([renderCustomFields](src/lib/signature/templates/parts.ts)). Values that are emails or web addresses become links. In Banner they open the white area just below the accent bar, where links stay readable.
- **Legal content:** a disclaimer or confidentiality notice (up to 1000 characters, with an "Insert standard disclaimer" shortcut). It's rendered once in `render.ts` ([templates/footer.ts](src/lib/signature/templates/footer.ts)) below whichever template is selected, in small print under a thin rule, with line breaks kept.

## Signature width

The Style step has a **Signature width** control: **Auto** (natural width, the default) or **Custom** (320–800px, slider or number box). A custom width wraps the signature in a table with `width="W"` for Outlook desktop and `width:100%; max-width:Wpx` for other clients, so it still shrinks on phones. The template stretches to fill it. Saved widths outside the range fall back to Auto.

## Handwritten signatures

The **Signature** image field has a "Create handwritten signature" option that opens a modal (native `<dialog>`):

- **Draw freehand:** a canvas pad using Pointer Events, so mouse, touch and stylus all work. Strokes are stored in CSS pixels and drawn as smooth curves, with ink colors, Undo and Clear ([useSignaturePad](src/hooks/useSignaturePad.ts)).
- **Use fonts:** type a name in one of four script fonts loaded with `next/font` ([fonts.ts](src/components/editor/handwriting/fonts.ts)).

On **Apply**, the drawing is rendered at 3× resolution, cropped to the ink with transparent padding ([utils/canvas.ts](src/utils/canvas.ts)), and uploaded through the normal Cloudinary flow.

## Placeholder images

Until a photo or logo is added, the live preview fills those slots with gray placeholders (`public/placeholders/`, made by [scripts/generate-placeholders.mjs](scripts/generate-placeholders.mjs)). Only the preview passes `showPlaceholders: true` to the renderer. Copied signatures never include placeholders.

## Social icons

`public/social-icons/*.png` are generated by [scripts/generate-social-icons.mjs](scripts/generate-social-icons.mjs) from [simple-icons](https://simpleicons.org) paths (LinkedIn's mark is drawn in the script, because simple-icons removed it). They're 72px images displayed at 24px.

The signature links to them by absolute URL: `NEXT_PUBLIC_SITE_URL` when set, otherwise the current origin. Signatures copied from `localhost` will show broken icons to recipients, so always copy from the deployed site.

## Cloudinary

The browser uploads directly to Cloudinary using a short-lived signature from `/api/upload-signature`. The API secret never leaves the server. The signature locks the `folder` and `allowed_formats`.

For production, also consider:
- An **upload preset** with a max file size and incoming transformation (can be enforced in the Cloudinary console).
- **Rate limiting** `/api/upload-signature` (for example with Vercel Firewall or Upstash), because the endpoint is public.

## Deploying

**Vercel:** import the repo and add the three `CLOUDINARY_*` environment variables. No other config is needed.

**Netlify:** import the repo. Netlify detects Next.js automatically through its Next.js runtime. Add the same environment variables.
