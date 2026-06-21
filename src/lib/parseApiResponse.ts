type ApiErrorBody = {
  error?: string;
};

export async function parseApiResponse<T extends ApiErrorBody>(
  response: Response,
): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const preview = (await response.text()).trim().slice(0, 120);

    if (preview.startsWith("<!DOCTYPE") || preview.startsWith("<html")) {
      throw new Error(
        response.status >= 500
          ? "The server encountered an error. Restart the dev server and try again."
          : "The resume upload API is unavailable. Check that the app is running and try again.",
      );
    }

    throw new Error(
      preview || "Unexpected server response while processing your request.",
    );
  }

  return (await response.json()) as T;
}
