import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { InlinePart, ResumeBlock } from "@/lib/parseResumeMarkdown";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 46,
    fontFamily: "Times-Roman",
    fontSize: 10.5,
    lineHeight: 1.38,
    color: "#1e293b",
  },
  h1: {
    fontSize: 20,
    fontFamily: "Times-Bold",
    color: "#0f172a",
    marginBottom: 4,
    paddingBottom: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: "#334155",
  },
  h2: {
    fontSize: 10.5,
    fontFamily: "Times-Bold",
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 10,
    marginBottom: 4,
    paddingBottom: 3,
    borderBottomWidth: 0.75,
    borderBottomColor: "#cbd5e1",
  },
  h3: {
    fontSize: 10.5,
    fontFamily: "Times-Bold",
    color: "#0f172a",
    marginTop: 8,
    marginBottom: 3,
  },
  paragraph: {
    marginBottom: 6,
  },
  list: {
    marginBottom: 6,
    paddingLeft: 12,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bullet: {
    width: 10,
    fontSize: 10.5,
  },
  listText: {
    flex: 1,
  },
  bold: {
    fontFamily: "Times-Bold",
    color: "#0f172a",
  },
});

function InlineText({ parts }: { parts: InlinePart[] }) {
  return (
    <Text>
      {parts.map((part, index) => (
        <Text key={index} style={part.bold ? styles.bold : undefined}>
          {part.text}
        </Text>
      ))}
    </Text>
  );
}

function ResumeBlockView({ block }: { block: ResumeBlock }) {
  if (block.type === "heading") {
    const style =
      block.level === 1
        ? styles.h1
        : block.level === 2
          ? styles.h2
          : styles.h3;

    return (
      <View>
        <Text style={style}>
          {block.parts.map((part) => part.text).join("")}
        </Text>
      </View>
    );
  }

  if (block.type === "paragraph") {
    return (
      <View style={styles.paragraph}>
        <InlineText parts={block.parts} />
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {block.items.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>{block.ordered ? `${index + 1}.` : "•"}</Text>
          <View style={styles.listText}>
            <InlineText parts={item} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function ResumePdfDocument({ blocks }: { blocks: ResumeBlock[] }) {
  return (
    <Document>
      <Page size="LETTER" wrap style={styles.page}>
        {blocks.map((block, index) => (
          <ResumeBlockView key={index} block={block} />
        ))}
      </Page>
    </Document>
  );
}
