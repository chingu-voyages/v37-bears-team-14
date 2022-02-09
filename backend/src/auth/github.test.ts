import { parseAvatarUrl } from "./github";

test("test that avatar URL if available", () => {
  const githubProfile = {
    id: "1234567",
    nodeId: "12Q6VXjfsod0MzIwNjE=",
    displayName: "someName",
    username: "some-username",
    profileUrl: "https://github.com/some-username",
    photos: [{ value: "https://avatars.githubusercontent.com/u/1234567?v=4" }],
    provider: "github",
    // _raw
    // _json
  };
  expect(parseAvatarUrl(githubProfile)).toEqual(
    "https://avatars.githubusercontent.com/u/1234567?v=4"
  );
});

test("test that avatar URL is null if no photos", () => {
  const githubProfile = {
    id: "1234567",
    nodeId: "12Q6VXjfsod0MzIwNjE=",
    displayName: "someName",
    username: "some-username",
    profileUrl: "https://github.com/some-username",
    photos: [],
    provider: "github",
    // _raw
    // _json
  };
  expect(parseAvatarUrl(githubProfile)).toBeNull();
});
