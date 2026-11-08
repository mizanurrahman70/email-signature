/** The studio's steps, in order. Icons are mapped by id in the StepRail component. */
export const EDITOR_STEPS = [
  {
    id: "details",
    label: "Details",
    title: "Your details",
    description: "Fill in what you want people to see. Empty fields are left out.",
  },
  {
    id: "social",
    label: "Social",
    title: "Social profiles",
    description: "Add links to your profiles. They show as brand icons.",
  },
  {
    id: "images",
    label: "Images",
    title: "Photo & signature",
    description: "Upload images. They're hosted for you, so they show in every inbox.",
  },
  {
    id: "template",
    label: "Template",
    title: "Choose a template",
    description: "Pick a layout. Your details and images carry over to every template.",
  },
  {
    id: "style",
    label: "Style",
    title: "Colors & font",
    description: "Match your brand. Only email-safe fonts are offered.",
  },
] as const;

/** Preview widths: a typical desktop reading pane and a phone screen. */
export const PREVIEW_DEVICES = [
  { id: "desktop", label: "Desktop", width: 680 },
  { id: "mobile", label: "Mobile", width: 375 },
] as const;

export const RESET_CONFIRMATION = "Reset all fields to the example signature? This can't be undone.";
