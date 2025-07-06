export default function parseTags(rawTags: any): string[] {
  let tags: string[] = [];

  try {
    const parsedTags = JSON.parse(rawTags || "[]");
    if (Array.isArray(parsedTags)) {
      tags = parsedTags.filter((t) => typeof t === "string");
    } else {
      tags = []
    }
  } catch {
    tags = [];
  }

  return tags
} 