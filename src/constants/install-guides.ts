import type { InstallGuide } from "@/types/install-guide";

export const INSTALL_GUIDES: ReadonlyArray<InstallGuide> = [
  {
    id: "gmail",
    client: "Gmail",
    steps: [
      "Click “Copy signature” above.",
      "In Gmail, open Settings (gear icon) → See all settings.",
      "On the General tab, scroll to Signature and click “Create new”.",
      "Name it, then paste (Ctrl/Cmd + V) into the signature box.",
      "Choose it under “Signature defaults”, then click “Save Changes” at the bottom.",
    ],
    tip: "Images show as soon as they are hosted online — uploaded images already are.",
  },
  {
    id: "outlook",
    client: "Outlook",
    steps: [
      "Click “Copy signature” above.",
      "New Outlook / Outlook on the web: Settings → Accounts → Signatures.",
      "Classic Outlook for Windows: File → Options → Mail → Signatures.",
      "Click “New signature”, name it, and paste into the editor.",
      "Pick it as the default for new messages and replies, then Save.",
    ],
    tip: "If spacing looks off in classic Outlook, paste with Ctrl + V (not “Paste as text”).",
  },
  {
    id: "apple-mail",
    client: "Apple Mail",
    steps: [
      "Click “Copy signature” above.",
      "In Mail, open Mail → Settings → Signatures.",
      "Select your account and click + to add a signature.",
      "Uncheck “Always match my default message font”.",
      "Paste into the right-hand panel. Changes save automatically.",
    ],
    tip: "On iPhone: Settings → Apps → Mail → Signature, paste, then shake the phone and tap “Undo” to bring back the formatting.",
  },
];
