export interface Blurb {
  summary: string | null;
  hasMore: boolean;
}

const getBlurb = (content: string | null, maxLength?: number): Blurb => {
  if (!content) return { summary: null, hasMore: false };

  maxLength = maxLength || 50;

  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    if (/[a-z0-9]/i.test(lines[i])) {
      const firstLine = lines[i].replace(/[#*_~]*/g, "").trim();
      const summary = firstLine.slice(0, maxLength);
      return {
        summary,
        hasMore: summary.length < firstLine.length || i < lines.length - 1,
      };
    }
  }

  const summary = content.slice(0, maxLength).replace("\n", " ");
  return {
    summary,
    hasMore: summary.length < content.length,
  };
};

export default getBlurb;
