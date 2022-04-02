// alphanumeric characters, dashes, apostrophes, and dollar signs to be part of tokens, and everything else to be a token separator
export const tokenize = (content: string) => {
  return content.split(/[^a-zA-Z0-9\-\'\$]/).filter((w) => w !== "");
};
