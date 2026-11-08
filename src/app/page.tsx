import { Suspense } from "react";
import { EditorSkeleton } from "@/components/editor/EditorSkeleton";
import { SignatureEditor } from "@/components/editor/SignatureEditor";
import { InstallGuides } from "@/components/install/InstallGuides";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:py-14">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Free tool</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Email Signature Generator</h1>
        <p className="mt-4 text-base text-slate-600">
          Enter your details, pick a template, and copy a professional signature into Gmail, Outlook, or Apple Mail. No
          sign-up required.
        </p>
      </header>

      <Suspense fallback={<EditorSkeleton />}>
        <SignatureEditor />
      </Suspense>

      <InstallGuides />
    </main>
  );
}
