import getBlurb from "./getBlurb";

test("getBlurb returns null for no content", () => {
  const { summary, hasMore } = getBlurb(null);
  expect(summary).toBeNull();
  expect(hasMore).toBe(false);
});

test("getBlurb parses title", () => {
  const md = `
  # title text

  other stuff
`;
  const { summary, hasMore } = getBlurb(md);
  expect(summary).toBe("title text");
  expect(hasMore).toBe(true);
});

test("getBlurb parses formatted title", () => {
  const md = `

  # **title text **

  other stuff
`;
  const { summary, hasMore } = getBlurb(md);
  expect(summary).toBe("title text");
  expect(hasMore).toBe(true);
});

test("getBlurb doesn't think there's more for one-liners", () => {
  const md = ` **message text**`;
  const { summary, hasMore } = getBlurb(md);
  expect(summary).toBe("message text");
  expect(hasMore).toBe(false);
});
