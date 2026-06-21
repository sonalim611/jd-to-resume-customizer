import "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

export async function extractPdfText(
  data: Buffer | ArrayBuffer,
): Promise<{ text: string; pages: number }> {
  const parser = new PDFParse({ data });

  try {
    const result = await parser.getText();

    return {
      text: result.text.trim(),
      pages: result.total,
    };
  } finally {
    await parser.destroy();
  }
}
