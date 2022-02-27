export interface Blurb {
  summary: string | null;
  hasMore: boolean;
}

const getBlurb = (content: string | null, maxLength?: number): Blurb => {
  if (!content) return { summary: null, hasMore: false };

  maxLength = maxLength || 50;

  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    if (/[a-z]/i.test(lines[i])) {
      return {
        summary: lines[i]
          .replace(/[#*_~]*/g, "")
          .trim()
          .slice(0, maxLength),
        hasMore: i < lines.length - 1,
      };
    }
  }

  return {
    summary: content.slice(0, maxLength).replace("\n", " "),
    hasMore: true,
  };
};

export default getBlurb;
