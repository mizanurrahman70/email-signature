import { Caveat, Dancing_Script, Great_Vibes, Sacramento } from "next/font/google";

// Loaded only where the handwriting modal is imported. `preload: false`
// keeps them off the critical path; they're fetched when first used.
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], preload: false });
const dancingScript = Dancing_Script({ subsets: ["latin"], preload: false });
const sacramento = Sacramento({ weight: "400", subsets: ["latin"], preload: false });
const caveat = Caveat({ subsets: ["latin"], preload: false });

export const HANDWRITING_FONTS = [
  { id: "great-vibes", label: "Elegant", fontFamily: greatVibes.style.fontFamily, className: greatVibes.className },
  { id: "dancing-script", label: "Flowing", fontFamily: dancingScript.style.fontFamily, className: dancingScript.className },
  { id: "sacramento", label: "Thin", fontFamily: sacramento.style.fontFamily, className: sacramento.className },
  { id: "caveat", label: "Casual", fontFamily: caveat.style.fontFamily, className: caveat.className },
] as const;

export type HandwritingFontId = (typeof HANDWRITING_FONTS)[number]["id"];
