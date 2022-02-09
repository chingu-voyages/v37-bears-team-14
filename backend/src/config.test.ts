import { getConfigValue } from "./config";

test("gets config", () => {
  const env = { HELLO: "WORLD" };
  expect(getConfigValue(env, "HELLO")).toEqual("WORLD");
});
