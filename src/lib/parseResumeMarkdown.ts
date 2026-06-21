import type { Token, Tokens } from "marked";
import { marked } from "marked";

export type InlinePart = {
  text: string;
  bold?: boolean;
};

export type ResumeBlock =
  | { type: "heading"; level: 1 | 2 | 3; parts: InlinePart[] }
  | { type: "paragraph"; parts: InlinePart[] }
  | { type: "list"; ordered: boolean; items: InlinePart[][] };

const RAW_BOLD_PATTERN = /\*\*|__/;

function normalizeResumeMarkdown(markdown: string): string {
  return markdown.replace(/^\s*[•●◦]\s+/gm, "- ").replace(/\n\s*[•●◦]\s+/g, "\n- ");
}

function partsFromBoldFallback(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  const regex = /(\*\*|__)(.+?)\1/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index) });
    }
    parts.push({ text: match[2], bold: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex) });
  }

  return parts.length ? parts : [{ text }];
}

function finalizeParts(parts: InlinePart[]): InlinePart[] {
  return parts.flatMap((part) => {
    if (part.bold || !RAW_BOLD_PATTERN.test(part.text)) {
      return [part];
    }

    const inlineTokens = marked.Lexer.lexInline(part.text, { gfm: true });
    const reparsed = partsFromInlineTokens(inlineTokens);
    const stillRaw = reparsed.some((p) => RAW_BOLD_PATTERN.test(p.text));

    return stillRaw ? partsFromBoldFallback(part.text) : reparsed;
  });
}

function partsFromInlineTokens(tokens: Token[] | undefined): InlinePart[] {
  if (!tokens?.length) {
    return [];
  }

  const parts: InlinePart[] = [];

  for (const token of tokens) {
    if (token.type === "paragraph") {
      parts.push(...partsFromInlineTokens(token.tokens));
    } else if (token.type === "text") {
      const nested =
        "tokens" in token &&
        Array.isArray(token.tokens) &&
        token.tokens.length > 0;

      if (nested) {
        parts.push(...partsFromInlineTokens(token.tokens));
      } else if (RAW_BOLD_PATTERN.test(token.text)) {
        parts.push(
          ...partsFromInlineTokens(
            marked.Lexer.lexInline(token.text, { gfm: true }),
          ),
        );
      } else {
        parts.push({ text: token.text });
      }
    } else if (token.type === "strong") {
      parts.push({ text: token.text, bold: true });
    } else if (token.type === "em") {
      parts.push({ text: token.text });
    } else if (
      "tokens" in token &&
      Array.isArray(token.tokens) &&
      token.tokens.length > 0
    ) {
      parts.push(...partsFromInlineTokens(token.tokens));
    } else if ("text" in token && typeof token.text === "string") {
      parts.push({ text: token.text });
    }
  }

  return finalizeParts(parts);
}

function partsFromListItem(item: Tokens.ListItem): InlinePart[] {
  const fromTokens = partsFromInlineTokens(item.tokens);

  if (!fromTokens.some((part) => RAW_BOLD_PATTERN.test(part.text))) {
    return fromTokens;
  }

  if (item.text) {
    return partsFromInlineTokens(
      marked.Lexer.lexInline(item.text, { gfm: true }),
    );
  }

  return fromTokens;
}

export function parseResumeMarkdown(markdown: string): ResumeBlock[] {
  const tokens = marked.lexer(normalizeResumeMarkdown(markdown.trim()), {
    gfm: true,
  });
  const blocks: ResumeBlock[] = [];

  for (const token of tokens) {
    if (token.type === "heading") {
      const level = token.depth;
      if (level >= 1 && level <= 3) {
        blocks.push({
          type: "heading",
          level: level as 1 | 2 | 3,
          parts: partsFromInlineTokens(token.tokens),
        });
      }
      continue;
    }

    if (token.type === "paragraph") {
      const parts = partsFromInlineTokens(token.tokens);
      if (parts.length) {
        blocks.push({ type: "paragraph", parts });
      }
      continue;
    }

    if (token.type === "list") {
      const items = token.items
        .map((item: Tokens.ListItem) => partsFromListItem(item))
        .filter((item: InlinePart[]) => item.length > 0);

      if (items.length) {
        blocks.push({
          type: "list",
          ordered: token.ordered,
          items,
        });
      }
    }
  }

  return blocks;
}
