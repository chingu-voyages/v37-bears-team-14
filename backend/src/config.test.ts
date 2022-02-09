import { mustGet } from "./config";

test("gets config", () => {
  const env = { HELLO: "WORLD" };
  expect(mustGet(env, "HELLO")).toEqual("WORLD");
});
