export type CitationSegment =
  | { type: "text"; value: string }
  | { type: "citation"; value: string; sourceId: number };

const CITATION_REGEX = /\[(\d+)\]/g;

export function parseCitationSegments(answer: string): CitationSegment[] {
  if (!answer) {
    return [];
  }

  const segments: CitationSegment[] = [];
  let lastIndex = 0;

  for (const match of answer.matchAll(CITATION_REGEX)) {
    const fullMatch = match[0];
    const rawId = match[1];
    const start = match.index ?? 0;

    if (start > lastIndex) {
      segments.push({
        type: "text",
        value: answer.slice(lastIndex, start)
      });
    }

    segments.push({
      type: "citation",
      value: fullMatch,
      sourceId: Number(rawId)
    });

    lastIndex = start + fullMatch.length;
  }

  if (lastIndex < answer.length) {
    segments.push({
      type: "text",
      value: answer.slice(lastIndex)
    });
  }

  return segments.length > 0 ? segments : [{ type: "text", value: answer }];
}
