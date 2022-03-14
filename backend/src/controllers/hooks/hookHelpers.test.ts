import { verifySignature } from "./hookHelpers";
import testDataEventPayloadGithubJson from "./testDataEventPayloadGithub.json";

test("verifySignature against GitHub payload", () => {
  const xHubSignature =
    "sha256=7a6005865572a62b533daa2e4ca7c06ceacbc73babce54cbbd88b66a077f3406";
  const verification = verifySignature(
    xHubSignature,
    JSON.stringify(testDataEventPayloadGithubJson),
    "test-secret"
  );
  expect(verification).toBe(true);
});
