import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  let parser: PDFParse | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "No file provided." }, { status: 400 });
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return Response.json(
        { error: "Only PDF files are accepted." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: "File size must be 5 MB or less." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText();

    return Response.json({
      text: result.text.trim(),
      pages: result.total,
    });
  } catch {
    return Response.json(
      { error: "Failed to extract text from the PDF." },
      { status: 500 },
    );
  } finally {
    await parser?.destroy();
  }
}
