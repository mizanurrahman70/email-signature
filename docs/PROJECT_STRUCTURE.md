# Project structure

Signature Studio is a free web tool for building an email signature. Users pick a template, fill in their details, add a photo and a signature image, choose colors and fonts, and copy the result into Gmail, Outlook or Apple Mail.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 and Cloudinary (image hosting).

## How it fits together

```
User edits the form ──► SignatureContext (state, saved to localStorage)
                             │
                             ▼
              lib/signature/view-model.ts   ← escapes text, validates links, colors, images
                             │
                             ▼
              lib/signature/templates/*.ts  ← builds email-safe HTML (tables, inline styles)
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
   Live preview (sandboxed iframe)    Copy signature (clipboard)
   + click-to-edit markers            clean HTML, no markers or placeholders
```

Images: the browser asks `/api/upload-signature` for a signature, then uploads straight to Cloudinary. The API secret never leaves the server.

### Folder rules

| Folder | Holds |
|---|---|
| `app/` | Routes and the root page only |
| `components/` | React UI, grouped by feature |
| `hooks/` | React hooks |
| `constants/` | Static data and config, no logic |
| `types/` | Shared TypeScript types only |
| `utils/` | Small, pure helper functions |
| `services/` | Talking to outside systems (Cloudinary, image rendering) |
| `lib/signature/` | The signature logic: state, validation, HTML rendering |

---

## `src/app/` — routes

| File | What it does |
|---|---|
| `layout.tsx` | Root HTML shell: font, page title and description |
| `page.tsx` | Home page: header, hero, editor (inside `<Suspense>`), install guide, footer |
| `globals.css` | Tailwind import, brand color palette, shadows, dot-grid background, focus-flash animation |
| `api/upload-signature/route.ts` | Returns a signed Cloudinary upload request (returns 503 if keys are missing) |
| `api/icons/[name]/route.ts` | Returns contact icons (phone, email, website, address) as PNGs in the user's accent color |
| `favicon.ico`, `icon.svg`, `apple-icon.png` | Site icons (made by `scripts/generate-app-icons.mjs`) |

## `src/components/layout/` — page sections

| File | What it does |
|---|---|
| `SiteHeader.tsx` | Sticky top bar: logo, Editor / How to install links, "100% free" badge |
| `Hero.tsx` | Headline, short intro and three highlights |
| `SiteFooter.tsx` | © year (updates itself) and "Developed by Traideas" |

## `src/components/studio/` — the editor frame

| File | What it does |
|---|---|
| `StepRail.tsx` | Left icon bar: Template, Details, Social, Images, Style (keyboard arrow navigation) |
| `StepPanel.tsx` | Middle column: step title, scrollable form area, Back / Next buttons |
| `PreviewCanvas.tsx` | Right side: Desktop/Mobile toggle, Copy buttons and the live email preview |

## `src/components/editor/` — forms and editor logic

| File | What it does |
|---|---|
| `SignatureEditor.tsx` | Editor root: loads the saved draft, connects steps, rail, panel and preview |
| `SignatureContext.tsx` | Shares the signature state and actions (update field, add custom field, reset…) |
| `EditorSkeleton.tsx` | Loading placeholder shown while the editor starts |
| `TemplatePicker.tsx` | Grid of the 10 templates with a selected check mark |
| `TemplateThumbnail.tsx` | The small wireframe drawing of each template |
| `DetailsForm.tsx` | Details step: About you, Custom fields, How to reach you, Footer |
| `CustomFieldsSection.tsx` | Add / edit / remove up to 5 "Label: value" rows |
| `FooterFields.tsx` | Legal content box with "Insert standard disclaimer" |
| `SocialForm.tsx` | Social profile links with brand icons |
| `ImagesForm.tsx` | Images step: photo and signature image fields |
| `ImageUploadField.tsx` | One image field: drag-and-drop, upload, remove, paste URL, handwriting button |
| `DesignForm.tsx` | Style step: accent color, text color, font |
| `WidthControl.tsx` | Signature width: Auto or Custom (320–800px slider) |
| `handwriting/HandwritingModal.tsx` | "Create handwritten signature" modal with Draw / Use fonts tabs |
| `handwriting/DrawPanel.tsx` | Drawing pad (mouse, touch, stylus) with Undo / Clear |
| `handwriting/TypePanel.tsx` | Type your name and pick a handwriting font |
| `handwriting/InkColorPicker.tsx` | Black / blue / green ink choice |
| `handwriting/fonts.ts` | Loads the four handwriting fonts |

## `src/components/preview/` — the email preview

| File | What it does |
|---|---|
| `EmailWindow.tsx` | Fake "New message" window around the signature |
| `SignaturePreview.tsx` | Sandboxed iframe that shows the exact signature HTML; handles click-to-edit |
| `CopyActions.tsx` | "Copy signature" and "HTML" buttons with Copied! / error feedback |

## `src/components/install/`

| File | What it does |
|---|---|
| `InstallGuides.tsx` | "Add it to your email" section with Gmail / Outlook / Apple Mail steps |

## `src/components/ui/` — reusable building blocks

| File | What it does |
|---|---|
| `Button.tsx` | Button with primary / secondary / ghost styles and sizes |
| `TextField.tsx` | Labelled text input (optional icon and hint) |
| `TextArea.tsx` | Labelled multi-line input with a character counter |
| `Tabs.tsx` | Accessible horizontal tabs |
| `SegmentedControl.tsx` | Pill switch (e.g. Desktop / Mobile, Auto / Custom) |
| `FormSection.tsx` | Small uppercase section heading around form fields |
| `Modal.tsx` | Accessible popup built on the native `<dialog>` |

## `src/hooks/`

| File | What it does |
|---|---|
| `usePersistentSignature.ts` | Signature state that is restored from and saved to localStorage |
| `useStepNavigation.ts` | Current step plus next / back helpers |
| `useImageUpload.ts` | Uploads an image to Cloudinary with loading and error state |
| `useCopyStatus.ts` | Short-lived "Copied!" / error status for copy buttons |
| `useIframeAutoHeight.ts` | Sizes the preview iframe and zooms wide signatures to fit |
| `useSignaturePad.ts` | Freehand drawing logic and PNG export for the handwriting pad |
| `useDockingWheel.ts` | Mouse-wheel behavior: page scrolls to the editor first, then the panel, then on to the footer |

## `src/lib/signature/` — signature logic

| File | What it does |
|---|---|
| `view-model.ts` | Turns raw form data into safe, ready-to-render values (escaping, link checks, icons) |
| `render.ts` | Picks the template, adds the legal footer and custom width; also builds the plain-text version |
| `reducer.ts` | All state changes (update field, social link, image, style, custom fields, reset) |
| `schema.ts` | Validates a saved draft; repairs bad or missing values field by field |
| `copy.ts` | Copy signature (rich text) and copy HTML source |
| `edit-targets.ts` | Names that link a preview part to its form field (e.g. `details:jobTitle`) |
| `handwriting.ts` | Turns typed text in a handwriting font into a PNG |
| `templates/parts.ts` | Shared HTML pieces: name, title line, contacts, icons, images, custom fields |
| `templates/footer.ts` | Legal notice under every template |
| `templates/classic.ts` … `corporate.ts` | The 10 templates: Classic, Stacked, Split, Centered, Reversed, Minimal, Banner, Compact, Boxed, Corporate |

## `src/services/` — outside systems

| File | What it does |
|---|---|
| `cloudinary-upload.ts` | Browser side: checks the file, gets a signature, uploads to Cloudinary |
| `cloudinary-signing.ts` | Server side: reads the keys from `.env` and signs uploads |
| `icon-renderer.ts` | Server side: draws a contact icon in a given color as PNG |

## `src/constants/` — static data

| File | What it holds |
|---|---|
| `signature-options.ts` | Template list, fonts, color presets, form fields, social networks, limits |
| `signature-defaults.ts` | The example signature new visitors see |
| `editor.ts` | Editor steps (order, titles) and preview widths |
| `install-guides.ts` | Gmail / Outlook / Apple Mail instructions |
| `cloudinary.ts` | Upload limits, folder and image size settings |
| `contact-icons.ts` | Shapes of the phone / email / website / address icons |
| `handwriting.ts` | Ink colors and export settings for handwritten signatures |
| `copy-status.ts` | Copy button labels |
| `storage.ts` | localStorage key and save delay |

## `src/types/` — TypeScript types

| File | What it holds |
|---|---|
| `signature.ts` | Signature state, actions, view model and render options |
| `editor.ts` | Step id and preview device types |
| `cloudinary.ts` | Cloudinary credentials and upload response types |
| `handwriting.ts` | Points, strokes and drawing types |
| `install-guide.ts` | Install guide type |
| `copy-status.ts` | `idle` / `copied` / `error` |

## `src/utils/` — small helpers

| File | What it does |
|---|---|
| `html.ts` | Escape HTML, build inline styles, build the preview document |
| `url.ts` | Clean up and validate links, `tel:` and `mailto:` |
| `color.ts` | Hex color checks |
| `clipboard.ts` | Copy rich text / plain text (with fallback for older browsers) |
| `canvas.ts` | Crop, smooth-draw and export canvas images |
| `cloudinary.ts` | Build Cloudinary upload URLs and image transforms |
| `site.ts` | Site URL and render options |
| `storage.ts` | Safe localStorage read / write |
| `dom.ts` | Focus and highlight a form field after a preview click |
| `fonts.ts` | Wait for a web font before drawing it |
| `file.ts` | File type and size checks |
| `http.ts` | `fetch` with readable error messages |
| `keyboard.ts` | Arrow-key navigation for tabs |
| `svg.ts` | Build stroke-icon SVGs |
| `error.ts`, `id.ts`, `cn.ts` | Error message, random id, class-name join |

## Tests (Vitest)

| File | What it checks |
|---|---|
| `lib/signature/render.test.ts` | All 10 templates, escaping, footer, custom fields, width, click-to-edit markers |
| `lib/signature/reducer.test.ts` | Custom field add / edit / remove and the 5-field limit |
| `lib/signature/edit-targets.test.ts` | Parsing of click-to-edit names |
| `services/cloudinary-signing.test.ts` | Upload signature is correct |
| `utils/url.test.ts`, `utils/utils.test.ts` | Helper functions |

## Outside `src/`

| Path | What it is |
|---|---|
| `public/social-icons/` | Brand-colored social icons used in signatures |
| `public/placeholders/` | Gray photo / image placeholders (preview only, never copied) |
| `scripts/generate-social-icons.mjs` | Rebuilds the social icons (`npm run icons`) |
| `scripts/generate-placeholders.mjs` | Rebuilds the placeholders (`npm run placeholders`) |
| `scripts/generate-app-icons.mjs` | Rebuilds the favicons (`npm run app-icons`) |
| `.env.example` | Environment variables to set (Cloudinary keys, site URL) |
| `next.config.ts` | Next.js settings |
| `vitest.config.mts` | Test settings |
| `README.md` | Setup, features and deployment notes |
