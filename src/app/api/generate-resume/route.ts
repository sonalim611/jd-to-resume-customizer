import {
  GoogleGenerativeAI,
  GoogleGenerativeAIResponseError,
} from "@google/generative-ai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are an expert resume writer specializing in ATS-optimized resumes.

Rewrite the candidate's resume to better align with the provided job description while following these rules strictly:

1. Preserve factual accuracy — do not change employers, job titles, dates, degrees, certifications, or any verifiable facts.
2. Do not invent experience — never add skills, roles, projects, achievements, or responsibilities that are not supported by the original resume.
3. Improve ATS keyword alignment — naturally incorporate relevant keywords, tools, and phrases from the job description where they truthfully match the candidate's background.
4. Preserve quantified metrics — keep all numbers, percentages, dollar amounts, team sizes, and measurable outcomes exactly as stated. Do not fabricate new metrics.
5. Paraphrase and restructure content — do not copy the job description or original resume verbatim.

Output only the tailored resume in clean markdown format with clear section headings (e.g., Summary, Experience, Skills, Education). Use bullet points for achievements. Do not include explanations, disclaimers, or commentary outside the resume.`;

type GenerateResumeRequest = {
  resumeText?: string;
  jobDescription?: string;
};

function extractTextFromResponse(
  response: Awaited<
    ReturnType<
      ReturnType<GoogleGenerativeAI["getGenerativeModel"]>["generateContent"]
    >
  >["response"],
): string {
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .map((part) => ("text" in part ? part.text : ""))
    .filter(Boolean)
    .join("")
    .trim();

  if (text) {
    return text;
  }

  try {
    return response.text().trim();
  } catch {
    return "";
  }
}

function getGeminiErrorMessage(error: unknown): string {
  if (error instanceof GoogleGenerativeAIResponseError) {
    return error.message || "Gemini blocked or returned an invalid response.";
  }

  if (error instanceof Error) {
    if (error.message.includes("429")) {
      return "Gemini rate limit reached. Please wait a moment and try again.";
    }

    return error.message;
  }

  return "Failed to generate tailored resume.";
}

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "Gemini API key is not configured." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as GenerateResumeRequest;
    const resumeText = body.resumeText?.trim();
    const jobDescription = body.jobDescription?.trim();

    if (!resumeText) {
      return Response.json(
        { error: "resumeText is required." },
        { status: 400 },
      );
    }

    if (!jobDescription) {
      return Response.json(
        { error: "jobDescription is required." },
        { status: 400 },
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `## Original Resume\n\n${resumeText}\n\n## Target Job Description\n\n${jobDescription}\n\nRewrite the resume in markdown for this job.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 8192,
        // Supported by Gemini API; omitted from older SDK typings.
        thinkingConfig: { thinkingBudget: 0 },
      } as Record<string, unknown>,
    });

    const candidate = result.response.candidates?.[0];
    const finishReason = candidate?.finishReason;

    if (finishReason === "SAFETY") {
      return Response.json(
        {
          error:
            "Gemini blocked the response due to safety filters. Try shortening the inputs or removing sensitive content.",
        },
        { status: 500 },
      );
    }

    if (finishReason === "RECITATION") {
      return Response.json(
        {
          error:
            "Gemini blocked the response to avoid verbatim copying. Please try generating again.",
        },
        { status: 500 },
      );
    }

    const resume = extractTextFromResponse(result.response);

    if (!resume) {
      console.error("generate-resume empty response:", {
        finishReason,
        finishMessage: candidate?.finishMessage,
        promptFeedback: result.response.promptFeedback,
      });

      return Response.json(
        {
          error:
            finishReason === "MAX_TOKENS"
              ? "The generated resume was too long. Try a shorter job description or resume."
              : "Gemini returned an empty response. Please try again.",
        },
        { status: 500 },
      );
    }

    return Response.json({ resume });
  } catch (error) {
    console.error("generate-resume error:", error);

    return Response.json(
      { error: getGeminiErrorMessage(error) },
      { status: 500 },
    );
  }
}
