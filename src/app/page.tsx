import { Suspense } from "react";
import { EditorSkeleton } from "@/components/editor/EditorSkeleton";
import { SignatureEditor } from "@/components/editor/SignatureEditor";
import { InstallGuides } from "@/components/install/InstallGuides";
import { Hero } from "@/components/layout/Hero";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <div id="studio" className="mx-auto w-full max-w-[1400px] scroll-mt-20 px-3 sm:px-6">
          <Suspense fallback={<EditorSkeleton />}>
            <SignatureEditor />
          </Suspense>
        </div>
        <div className="mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28">
          <InstallGuides id="install" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
