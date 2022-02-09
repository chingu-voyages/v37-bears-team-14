<<<<<<< HEAD
import { getConfigValue } from "./config";

test("gets config", () => {
  const env = {"HELLO": "WORLD"};
  expect(getConfigValue(env, "HELLO")).toEqual("WORLD");
});
=======
import { mustGet } from "./config";

test("gets config", () => {
  const env = { HELLO: "WORLD" };
  expect(mustGet(env, "HELLO")).toEqual("WORLD");
});
>>>>>>> c1be7e200b154f8521accb87d10818aeb124d582
