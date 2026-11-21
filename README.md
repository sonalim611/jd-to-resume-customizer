# ResumeFit – AI Resume Customizer

ResumeFit is an AI-powered resume customization tool that helps job seekers tailor their existing resumes to specific job descriptions.

Upload your resume as a PDF, paste the target job description, and generate a tailored resume using Gemini 2.5 Flash. Review the generated content and download it as a formatted PDF.

## Key Features

- **PDF Resume Upload:** Upload a PDF resume (up to 5 MB).
- **Resume Text Extraction:** Extracts text from the uploaded PDF for processing.
- **Job Description Analysis:** Uses the target job description as context for resume customization.
- **AI-Powered Customization:** Uses Gemini 2.5 Flash to reorganize and tailor resume content around relevant skills and experience.
- **Factual Accuracy Guardrails:** Instructs the AI not to invent employers, job titles, dates, qualifications, skills, projects, achievements, or responsibilities.
- **Resume Preview:** Review the generated resume in a Markdown-formatted preview.
- **PDF Export:** Download the customized resume as a formatted PDF.
- **Error Handling:** Handles invalid PDFs, missing inputs, file-size limits, API errors, rate limits, and empty or blocked AI responses.

## How It Works

1. Upload an existing resume in PDF format.
2. Paste the job description for the role you are targeting.
3. ResumeFit extracts the text from your resume.
4. Gemini 2.5 Flash generates a tailored version using the extracted resume and job description.
5. Review the generated resume in the application.
6. Download the customized resume as a PDF.

## AI Accuracy and Responsible Generation

ResumeFit is designed around an important principle: **improve relevance without compromising factual accuracy.**

The AI generation instructions include safeguards to:

- Preserve existing employers, job titles, employment dates, education, and certifications.
- Avoid inventing skills, projects, achievements, or responsibilities.
- Retain quantified achievements and metrics from the original resume.
- Incorporate job-description keywords only when they are supported by the candidate's actual experience.
- Rephrase and reorganize content without misrepresenting the candidate's background.

Users should review the generated resume before using it in an application.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| AI Model | Gemini 2.5 Flash |
| AI Integration | Google Generative AI SDK |
| PDF Text Extraction | pdf-parse |
| Resume Preview | React Markdown |
| PDF Generation | @react-pdf/renderer |

## Application Architecture

```text
PDF Resume + Job Description
           |
           v
    Resume Upload
           |
           v
    PDF Text Extraction
           |
           v
   Extracted Resume Text
           |
           +----------+
           |          |
           v          v
       Resume      Job Description
           |          |
           +----+-----+
                |
                v
       Gemini 2.5 Flash
                |
                v
       Tailored Resume
                |
                v
        Markdown Preview
                |
                v
          PDF Export
```

## Getting Started

### Prerequisites

- Node.js 20.16 or later
- npm
- Google Gemini API key

### Installation

Clone the repository:

```bash
git clone https://github.com/sonalim611/jd-to-resume-customizer.git
```

Navigate to the project directory:

```bash
cd jd-to-resume-customizer
```

Install dependencies:

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholder with your Gemini API key.

### Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

## Project Structure

```text
src/
├── app/
│   └── api/
│       ├── extract-resume/
│       │   └── route.ts
│       └── generate-resume/
│           └── route.ts
├── components/
│   ├── pdf/
│   │   └── ResumePdfDocument.tsx
│   └── ResumeTailor.tsx
└── lib/
    ├── extractPdfText.ts
    ├── downloadResumePdf.tsx
    ├── parseApiResponse.ts
    └── parseResumeMarkdown.ts
```

## Current Scope and Limitations

- Accepts PDF resumes; other file formats are not currently supported.
- Resume customization depends on the quality and completeness of the uploaded resume and job description.
- AI-generated content may require manual review and editing.
- The application does not provide an ATS score or guarantee that a resume will pass an employer's screening system.
- Users are responsible for verifying the accuracy of the final resume before submitting it.

## Future Enhancements

Potential areas for further development:

- Before-and-after resume comparison.
- Highlighting matched, partially matched, and missing job requirements.
- Giving users more control over AI-suggested changes.
- Additional resume quality and factual-consistency checks.

## Repository

[GitHub – ResumeFit](https://github.com/sonalim611/jd-to-resume-customizer)
