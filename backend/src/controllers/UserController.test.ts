import UserController from "./UserController";

test("Test that updateDefaultsIfNeeded fills in null fields", async () => {
  let saveCount = 0;

  const fakeUser = {
    username: null,
    avatarUrl: null,
    save: async () => {
      saveCount += 1;
      return Promise.resolve();
    },
  };
  const fakeProfile = {
    username: "hello",
    photos: [{ value: "http://example.com" }],
  };
  const fakeUserModel = {
    findOne: async () => Promise.resolve(null),
  };

  const userController = new UserController(fakeUserModel as any);
  await userController.updateDefaultsIfNeeded(fakeUser as any, fakeProfile);

  expect(fakeUser.username).toBe("hello");
  expect(fakeUser.avatarUrl).toBe("http://example.com");
  expect(saveCount).toBe(1);
});

test("Test that updateDefaultsIfNeeded does not modify non-null fields", async () => {
  let saveCount = 0;

  const fakeUser = {
    username: "existing",
    avatarUrl: "http://alreadyhere.com",
    save: async () => {
      saveCount += 1;
      return Promise.resolve();
    },
  };
  const fakeProfile = {
    username: "hello",
    photos: [{ value: "http://example.com" }],
  };
  const fakeUserModel = {
    findOne: async () => Promise.resolve(null),
  };

  const userController = new UserController(fakeUserModel as any);
  await userController.updateDefaultsIfNeeded(fakeUser as any, fakeProfile);

  expect(fakeUser.username).toBe("existing");
  expect(fakeUser.avatarUrl).toBe("http://alreadyhere.com");
  expect(saveCount).toBe(0);
});
