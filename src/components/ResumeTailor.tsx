"use client";

import { useCallback, useRef, useState } from "react";

export default function ResumeTailor() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptResume = useCallback((file: File | null) => {
    if (!file) return;
    setResumeFile(file);
    setHasGenerated(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files[0];
      if (file) acceptResume(file);
    },
    [acceptResume],
  );

  const handleGenerate = () => {
    if (!resumeFile || !jobDescription.trim()) return;
    setHasGenerated(true);
  };

  const canGenerate = Boolean(resumeFile && jobDescription.trim());

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <header className="mb-10 text-center lg:mb-14">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          AI-powered resume tailoring
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Tailor your resume to any job
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          Upload your resume, paste the job description, and generate a
          tailored version that highlights the right skills and experience.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <section className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Your resume
            </label>
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`group relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50"
                  : resumeFile
                    ? "border-emerald-300 bg-emerald-50/50"
                    : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(event) =>
                  acceptResume(event.target.files?.[0] ?? null)
                }
              />

              {resumeFile ? (
                <>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <FileIcon />
                  </div>
                  <p className="font-medium text-slate-900">{resumeFile.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {(resumeFile.size / 1024).toFixed(1)} KB · Click to replace
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-200">
                    <UploadIcon />
                  </div>
                  <p className="font-medium text-slate-900">
                    Drop your resume here
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    or click to browse · PDF, DOC, DOCX, TXT
                  </p>
                </>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="job-description"
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              Job description
            </label>
            <textarea
              id="job-description"
              rows={10}
              value={jobDescription}
              onChange={(event) => {
                setJobDescription(event.target.value);
                setHasGenerated(false);
              }}
              placeholder="Paste the full job description here — responsibilities, requirements, and preferred qualifications..."
              className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 sm:text-base"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:text-base"
          >
            <SparkleIcon />
            Generate tailored resume
          </button>

          {!canGenerate && (
            <p className="text-center text-sm text-slate-500">
              Upload a resume and add a job description to continue.
            </p>
          )}
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Generated resume
            </h2>
            {hasGenerated && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                Preview
              </span>
            )}
          </div>

          <div className="min-h-[520px] rounded-2xl border border-slate-200 bg-white shadow-sm">
            {hasGenerated ? (
              <div className="flex h-full flex-col p-6 sm:p-8">
                <div className="mb-6 border-b border-slate-100 pb-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    Tailored for
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {jobDescription.slice(0, 120)}
                    {jobDescription.length > 120 ? "…" : ""}
                  </p>
                </div>

                <div className="space-y-5 text-sm text-slate-700">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 w-1/3 rounded bg-slate-200" />
                    <div className="h-3 w-full rounded bg-slate-100" />
                    <div className="h-3 w-5/6 rounded bg-slate-100" />
                  </div>

                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                    <p className="font-medium text-slate-900">
                      Your tailored resume will appear here
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Backend integration coming soon. This preview confirms
                      your inputs are ready.
                    </p>
                  </div>

                  <div className="space-y-2 opacity-60">
                    <div className="h-3 w-1/4 rounded bg-slate-200" />
                    <div className="h-3 w-full rounded bg-slate-100" />
                    <div className="h-3 w-11/12 rounded bg-slate-100" />
                    <div className="h-3 w-4/5 rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[520px] flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <DocumentIcon />
                </div>
                <p className="font-medium text-slate-900">
                  No resume generated yet
                </p>
                <p className="mt-2 max-w-xs text-sm text-slate-500">
                  Fill in your resume and job description, then click generate
                  to see your tailored result here.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="m12 3 1.9 5.8H20l-4.8 3.5 1.9 5.8L12 14.6l-5.1 3.7 1.9-5.8L4 8.8h6.1L12 3z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}
