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

function partsFromInlineTokens(tokens: Token[] | undefined): InlinePart[] {
  if (!tokens?.length) {
    return [];
  }

  const parts: InlinePart[] = [];

  for (const token of tokens) {
    if (token.type === "text") {
      parts.push({ text: token.text });
    } else if (token.type === "strong") {
      parts.push({ text: token.text, bold: true });
    } else if (token.type === "em") {
      parts.push({ text: token.text });
    } else if ("text" in token && typeof token.text === "string") {
      parts.push({ text: token.text });
    }
  }

  return parts;
}

export function parseResumeMarkdown(markdown: string): ResumeBlock[] {
  const tokens = marked.lexer(markdown.trim(), { gfm: true });
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
        .map((item: Tokens.ListItem) => partsFromInlineTokens(item.tokens))
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
