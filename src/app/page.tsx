import ResumeTailor from "@/components/ResumeTailor";

export default function Home() {
  return (
    <div className="min-h-full flex-1 bg-gradient-to-b from-slate-50 via-white to-indigo-50/30">
      <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              RT
            </div>
            <span className="text-lg font-semibold text-slate-900">
              Resume Tailor
            </span>
          </div>
          <span className="hidden text-sm text-slate-500 sm:inline">
            Match your resume to any role
          </span>
        </div>
      </nav>

      <main>
        <ResumeTailor />
      </main>

      <footer className="border-t border-slate-200/80 py-6 text-center text-sm text-slate-500">
        AI Resume Tailor · Frontend preview only
      </footer>
    </div>
  );
}
