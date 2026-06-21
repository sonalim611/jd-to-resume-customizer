import { pdf } from "@react-pdf/renderer";
import { ResumePdfDocument } from "@/components/pdf/ResumePdfDocument";
import { parseResumeMarkdown } from "@/lib/parseResumeMarkdown";

export async function downloadResumePdf(
  markdown: string,
  filename = "resumefit-tailored-resume.pdf",
): Promise<void> {
  const blocks = parseResumeMarkdown(markdown);

  if (!blocks.length) {
    throw new Error("No resume content available for PDF export.");
  }

  const blob = await pdf(<ResumePdfDocument blocks={blocks} />).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
