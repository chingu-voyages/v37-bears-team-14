import { mergeResults } from "./searchHelpers";

test("mergeResults combines matchType", () => {
  const result = mergeResults([
    {
      id: "123",
      matchType: {
        name: true,
      },
    },
    {
      id: "123",
      matchType: {
        description: true,
      },
    },
  ] as any);
  expect(result.length).toBe(1);
  expect(result[0].id).toBe("123");
  expect(result[0].matchType.name).toBe(true);
  expect(result[0].matchType.description).toBe(true);
  expect(result[0].matchType.techs).toBe(false);
});
