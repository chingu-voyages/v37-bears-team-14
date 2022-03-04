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

test("getBlurb doesn't think there's more for short one-liners", () => {
  const md = ` **message text**`;
  const { summary, hasMore } = getBlurb(md);
  expect(summary).toBe("message text");
  expect(hasMore).toBe(false);
});

test("getBlurb thinks there's more for long one-liners", () => {
  const md = ` **message text but i'd like to make this a longer **`;
  const { summary, hasMore } = getBlurb(md, 10);
  expect(summary).toBe("message te");
  expect(hasMore).toBe(true);
});

test("getBlurb thinks there's more for longer no words", () => {
  const md = `-*-*-*-*-*-*`;
  const { summary, hasMore } = getBlurb(md, 5);
  expect(summary).toBe("-*-*-");
  expect(hasMore).toBe(true);
});

test("getBlurb doesn't think there's more for no words", () => {
  const md = `-*-*-*-*-`;
  const { summary, hasMore } = getBlurb(md, 10);
  expect(summary).toBe("-*-*-*-*-");
  expect(hasMore).toBe(false);
});
